"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginWithPlaywright = void 0;
const playwright_1 = require("playwright");
const loginWithPlaywright = async (req, res) => {
    const { username, password, platform } = req.body;
    if (!username || !password || !platform) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const browser = await playwright_1.chromium.launch({ headless: true });
    const page = await browser.newPage();
    try {
        let loginUrl = '';
        // Determine platform-specific login URL
        if (platform === 'Instagram') {
            loginUrl = 'https://www.instagram.com/accounts/login/';
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
        // Navigate and perform login
        await page.goto(loginUrl);
        if (platform === 'Instagram') {
            await page.fill('input[name="username"]', username);
            await page.fill('input[name="password"]', password);
            await page.click('button[type="submit"]');
        }
        else if (platform === 'Facebook') {
            await page.fill('input[name="email"]', username);
            await page.fill('input[name="pass"]', password);
            await page.click('button[name="login"]');
        }
        else if (platform === 'Twitter') {
            await page.fill('input[name="session[username_or_email]"]', username);
            await page.fill('input[name="session[password]"]', password);
            await page.click('div[data-testid="LoginForm_Login_Button"]');
        }
        // Wait for login confirmation (adjust selector as needed)
        await page.waitForSelector('input[type="search"]');
        console.log(`${platform} login successful`);
        // Respond back to the frontend
        res.status(200).json({ message: 'Login successful', platform });
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
