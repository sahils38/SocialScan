import express, { Request, Response } from 'express';
import cors from 'cors';
import { chromium } from 'playwright';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// In-memory storage for case results
const caseResults: Record<string, any> = {};

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; font-src 'self' http://localhost:5000;"
  );
  next();
});

// Middleware to parse JSON
app.use(bodyParser.json());

// Helper function to get PDF path
const getPdfPath = (caseNumber: string): string => {
  const outputDir = path.join(__dirname, 'output', caseNumber);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  return path.join(outputDir, 'profile_analysis.pdf');
};

// Helper function to generate PDF
const generatePDF = async (screenshots: string[], outputPath: string) => {
  const doc = await PDFDocument.create();

  for (const screenshotPath of screenshots) {
    const imgBytes = fs.readFileSync(screenshotPath);
    const img = await doc.embedPng(imgBytes);
    const page = doc.addPage([img.width, img.height]);
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
  }

  const pdfBytes = await doc.save();
  fs.writeFileSync(outputPath, pdfBytes);
};

// Login function
export const loginWithPlaywright = async (req: Request, res: Response) => {
  const { username, password, platform, locations, caseNumber } = req.body;

  if (!username || !password || !platform || !caseNumber) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const browser = await chromium.launch({ headless: true, slowMo: 100 });
  const context = await browser.newContext({ userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" });
  const page = await context.newPage();
  const screenshots: string[] = [];
  const tempDir = path.join(__dirname, 'screenshots');
  const pdfPath = getPdfPath(caseNumber);

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  try {
    let loginUrl = '';
    if (platform === 'Instagram') {
      loginUrl = 'https://www.instagram.com/';
    } else if (platform === 'Facebook') {
      loginUrl = 'https://www.facebook.com/login/';
    } else if (platform === 'Twitter') {
      loginUrl = 'https://twitter.com/login';
    } else {
      throw new Error('Unsupported platform');
    }

    // Login logic
    await page.goto(loginUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000 + Math.random() * 3000);
    
    console.log("username input");
    await page.fill('input[name="username"]', username);
    await page.waitForTimeout(1000 + Math.random() * 2000);
    await page.fill('input[name="password"]', password);
    await page.waitForTimeout(1000 + Math.random() * 2000);
    await page.click('button[type="submit"]');
    console.log("login button clicked");
    await page.waitForTimeout(5000);

    const currentUrl = page.url();
    if (currentUrl.includes('challenge')) {
      throw new Error('Instagram triggered verification page.');
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

    await generatePDF(screenshots, pdfPath);

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
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  } finally {
    await browser.close();
  }
};

app.post('/login', loginWithPlaywright);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
