import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = 'screenshots';
if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR);

async function runE2E() {
    console.log('🚀 Starting Visual E2E Test...');

    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    try {
        // 1. Check Homepage
        console.log('1️⃣  Navigating to Homepage...');
        try {
            await page.goto('http://localhost:5175', { waitUntil: 'networkidle0', timeout: 5000 });
        } catch (e) {
            console.log('   ⚠️ Port 5175 failed, trying 5173...');
            await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
        }
        await page.screenshot({ path: `${SCREENSHOT_DIR}/1-home.png` });
        const title = await page.title();
        console.log(`   Page Title: ${title}`);

        // 2. Check Login Page
        console.log('2️⃣  Checking Login Access...');
        // Look for Login button or link. Assuming text "Login"
        const loginLinks = await page.$$("a, button");
        let loginFound = false;

        for (const link of loginLinks) {
            const text = await page.evaluate(el => el.textContent, link);
            if (text && text.toLowerCase().includes('login')) {
                console.log(`   Clicking Login link: "${text}"`);
                await link.click();
                loginFound = true;
                break;
            }
        }

        if (!loginFound) {
            // Try direct navigation
            await page.goto('http://localhost:5175/login', { waitUntil: 'networkidle0' });
        }

        await new Promise(r => setTimeout(r, 2000)); // Wait for valid nav
        await page.screenshot({ path: `${SCREENSHOT_DIR}/2-login.png` });
        console.log('   📸 Captured Login Page');

        // 3. Automated Login (Placeholder - difficult without valid seeded user)
        // We will just verify the Form exists
        const emailInput = await page.$('input[type="email"]');
        if (emailInput) {
            console.log('   ✅ Login Form Detected');
            await emailInput.type('testuser@example.com');
            const passInput = await page.$('input[type="password"]');
            await passInput.type('password123');
            await page.screenshot({ path: `${SCREENSHOT_DIR}/3-login-filled.png` });
        } else {
            console.error('   ❌ Login Form input not found!');
        }

        console.log('\n✨ Visual Test Complete! Screenshots saved in backend/screenshots/');

    } catch (error) {
        console.error('❌ Test Failed:', error);
        await page.screenshot({ path: `${SCREENSHOT_DIR}/error.png` });
    } finally {
        await browser.close();
    }
}

runE2E();
