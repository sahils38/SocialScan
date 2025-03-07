"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginWithPlaywright = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const playwright_1 = require("playwright");
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pdf_lib_1 = require("pdf-lib");
const app = (0, express_1.default)();
const PORT = 5000;
// In-memory storage for case results
const caseResults = {};
// Enable CORS
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'; font-src 'self' http://localhost:5000;");
    next();
});
// Middleware to parse JSON
app.use(body_parser_1.default.json());
// Helper function to get PDF path
const getPdfPath = (caseNumber) => {
    const outputDir = path_1.default.join(__dirname, 'output', caseNumber);
    if (!fs_1.default.existsSync(outputDir)) {
        fs_1.default.mkdirSync(outputDir, { recursive: true });
    }
    return path_1.default.join(outputDir, 'profile_analysis.pdf');
};
// Helper function to generate PDF
const generatePDF = async (screenshots, outputPath) => {
    const doc = await pdf_lib_1.PDFDocument.create();
    for (const screenshotPath of screenshots) {
        const imgBytes = fs_1.default.readFileSync(screenshotPath);
        const img = await doc.embedPng(imgBytes);
        const page = doc.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
    }
    const pdfBytes = await doc.save();
    fs_1.default.writeFileSync(outputPath, pdfBytes);
};
// Login function
const loginWithPlaywright = async (req, res) => {
    const { username, password, platform, locations, caseNumber } = req.body;
    if (!username || !password || !platform || !caseNumber) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const browser = await playwright_1.chromium.launch({ headless: true });
    const page = await browser.newPage();
    const screenshots = [];
    const tempDir = path_1.default.join(__dirname, 'screenshots');
    const pdfPath = getPdfPath(caseNumber);
    if (!fs_1.default.existsSync(tempDir)) {
        fs_1.default.mkdirSync(tempDir);
    }
    try {
        let loginUrl = '';
        if (platform === 'Instagram') {
            loginUrl = 'https://www.instagram.com/';
        }
        else if (platform === 'Facebook') {
            loginUrl = 'https://www.facebook.com/login/';
        }
        else if (platform === 'Twitter') {
            loginUrl = 'https://twitter.com/login';
        }
        else {
            throw new Error('Unsupported platform');
        }
        // Login logic
        await page.goto(loginUrl);
        await page.fill('input[name="username"]', username);
        await page.fill('input[name="password"]', password);
        await page.click('button[type="submit"]');
        await page.waitForTimeout(5000);
        const loginErrorSelector = 'div[role="alert"], .error-message';
        const errorMessage = await page.$(loginErrorSelector);
        if (errorMessage) {
            throw new Error('Login failed. Please check credentials.');
        }
        const oneTapUrl = "https://www.instagram.com/accounts/onetap/?next=%2F";
        try {
            await page.waitForURL(oneTapUrl, { timeout: 30000 });
            console.log("Navigated to One Tap page successfully.");
        }
        catch (error) {
            console.error("Failed to navigate to One Tap page:", page.url());
            throw new Error("Could not load One Tap page within timeout.");
        }
        try {
            const notNowButton = await page.locator('text="Not now"').first();
            await notNowButton.click();
            console.log("Bypassed One Tap page.");
        }
        catch (bypassError) {
            console.error("Failed to bypass One Tap page:", bypassError);
            throw new Error("Bypass One Tap failed.");
        }
        const currentUrl = page.url();
        console.log("Current URL after bypass:", currentUrl);
        if (!currentUrl.startsWith('https://www.instagram.com/')) {
            throw new Error("Unexpected URL after bypassing One Tap page.");
        }
        const profileUrl = `https://www.instagram.com/${username}/`;
        await page.goto(profileUrl);
        if (page.url() === profileUrl) {
            console.log('Navigated to profile page. Taking screenshots...');
            const screenshotPath1 = `${tempDir}/profile-before-scroll-${caseNumber}.png`;
            await page.screenshot({ path: screenshotPath1 });
            screenshots.push(screenshotPath1);
            await page.evaluate(() => window.scrollBy(0, window.innerHeight));
            await page.waitForTimeout(3000);
            const screenshotPath2 = `${tempDir}/profile-after-scroll-${caseNumber}.png`;
            await page.screenshot({ path: screenshotPath2 });
            screenshots.push(screenshotPath2);
        }
        if (locations && Array.isArray(locations)) {
            for (const location of locations) {
                console.log(`Navigating to ${location}...`);
                await page.goto(location);
                await page.waitForTimeout(3000);
                const screenshotPath = `${tempDir}/screenshot-${location}-${caseNumber}.png`;
                await page.screenshot({ path: screenshotPath });
                screenshots.push(screenshotPath);
            }
        }
        await generatePDF(screenshots, pdfPath);
        // Store the result dynamically
        caseResults[caseNumber] = {
            caseNumber,
            platformName: platform,
            username,
            pdfUrl: `http://localhost:${PORT}/download/${caseNumber}`,
        };
        res.status(200).json({
            message: 'Login successful, screenshots taken, and PDF generated.',
            downloadLink: `http://localhost:${PORT}/download/${caseNumber}`,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
    finally {
        await browser.close();
    }
};
exports.loginWithPlaywright = loginWithPlaywright;
// Route to download PDF
app.get('/download/:caseNumber', (req, res) => {
    const { caseNumber } = req.params;
    const pdfPath = getPdfPath(caseNumber);
    if (!fs_1.default.existsSync(pdfPath)) {
        return res.status(404).json({ error: 'PDF not found for the specified case number.' });
    }
    res.download(pdfPath, `profile_analysis_${caseNumber}.pdf`, (err) => {
        if (err) {
            res.status(500).json({ error: 'Failed to download PDF.' });
        }
    });
});
// Route to fetch results by case number
app.get('/results/:caseNumber', (req, res) => {
    const { caseNumber } = req.params;
    const resultData = caseResults[caseNumber];
    if (!resultData) {
        return res.status(404).json({ error: 'Case not found.' });
    }
    res.status(200).json(resultData);
});
// POST route for login
app.post('/login', exports.loginWithPlaywright);
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
