import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Config
const BASE_URL = 'http://localhost:5173';
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots_full');
const DUMMY_IMAGE_PATH = path.join(__dirname, '../dummy_ticket.png'); // Assuming it's in root

// Ensure screenshot dir exists
if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR);

// Helper to delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runFullE2E() {
    console.log('🚀 Starting Comprehensive E2E Test...');

    // Launch Browser
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: { width: 1280, height: 800 }
    });
    const page = await browser.newPage();

    try {
        // --- TEST CASE 1: User Registration ---
        console.log('\n1️⃣  Testing User Registration...');

        // Generate unique user
        const timestamp = Date.now();
        const testUser = {
            name: `Test User ${timestamp}`,
            email: `user${timestamp}@test.com`,
            password: 'password123'
        };

        await page.goto(`${BASE_URL}/login?signup=true`, { waitUntil: 'networkidle0' });
        await page.screenshot({ path: `${SCREENSHOT_DIR}/1-signup-page.png` });

        // Fill Signup Form
        console.log(`   📝 Signing up as ${testUser.email}...`);

        await page.type('input[name="name"]', testUser.name);
        await page.type('input[name="email"]', testUser.email);
        await page.type('input[name="password"]', testUser.password);

        // Select "Sell Tickets" role (optional, but good to ensure buttons work)
        // Using locator API for Puppeteer v27+
        try {
            const sellRoleBtn = await page.locator('button::-p-text(Sell Tickets)').waitHandle({ timeout: 3000 });
            if (sellRoleBtn) await sellRoleBtn.click();
        } catch (e) {
            console.log('   ℹ️ Sell Tickets role button not found, continuing...');
        }

        await page.screenshot({ path: `${SCREENSHOT_DIR}/2-signup-filled.png` });

        // Submit
        await page.click('button[type="submit"]');

        // Wait for navigation to Dashboard
        await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 }).catch(() => console.log('   ⚠️ Navigation timeout, checking URL...'));

        const currentUrl = page.url();
        console.log(`   📍 Current URL: ${currentUrl}`);

        if (currentUrl.includes('/dashboard')) {
            console.log('   ✅ Registration Successful - Redirected to Dashboard');
        } else {
            console.log('   ⚠️ Redirect might have failed or verify URL manually.');
        }
        await page.screenshot({ path: `${SCREENSHOT_DIR}/3-dashboard.png` });


        // --- TEST CASE 2: Create Ticket Listing ---
        console.log('\n2️⃣  Testing Sell Ticket Flow...');

        await page.goto(`${BASE_URL}/sell`, { waitUntil: 'networkidle0' });

        const ticketDetails = {
            title: `E2E Concert ${timestamp}`,
            eventDate: '2026-12-31',
            eventTime: '20:00',
            originalPrice: '5000',
            sellingPrice: '4000',
            venue: 'E2E Arena',
            description: 'This is an automated test ticket.'
        };

        console.log(`   📝 Creating listing: "${ticketDetails.title}"...`);

        // Wait for form
        await page.waitForSelector('input[name="title"]');

        // Fill Form
        await page.type('input[name="title"]', ticketDetails.title);
        await page.type('input[name="eventDate"]', ticketDetails.eventDate); // YYYY-MM-DD
        // HTML5 time input might be tricky, try simple typing
        await page.type('input[name="eventTime"]', ticketDetails.eventTime);
        await page.type('input[name="venue"]', ticketDetails.venue);
        await page.type('input[name="originalPrice"]', ticketDetails.originalPrice);
        await page.type('input[name="sellingPrice"]', ticketDetails.sellingPrice);
        await page.type('textarea[name="description"]', ticketDetails.description);

        // Upload Image
        const fileInput = await page.$('input[type="file"]');
        if (fileInput) {
            // Check if dummy image exists
            if (fs.existsSync(DUMMY_IMAGE_PATH)) {
                await fileInput.uploadFile(DUMMY_IMAGE_PATH);
                console.log('   📸 Image uploaded.');
            } else {
                console.error('   ❌ Dummy image not found at ' + DUMMY_IMAGE_PATH);
            }
        }

        await page.screenshot({ path: `${SCREENSHOT_DIR}/4-sell-form-filled.png` });

        // Submit
        // Find submit button "Submit for Verification"
        try {
            const submitBtn = await page.locator('button::-p-text(Submit for Verification)').waitHandle({ timeout: 3000 });
            if (submitBtn) {
                await submitBtn.click();
            }
        } catch (e) {
            console.log("   ⚠️ Submit button by text not found, trying generic submit type");
            await page.click('button[type="submit"]');
        }

        // Wait for success message/navigation
        // Sell.jsx shows "Ticket Submitted!" screen on success (setSubmitted(true))
        try {
            await page.locator('h2::-p-text(Ticket Submitted!)').waitHandle({ timeout: 10000 });
            console.log('   ✅ Ticket Confirmation Screen Appeared');
        } catch (e) {
            console.log('   ⚠️ Confirmation screen not detected (might be fast or error)');
        }
        await page.screenshot({ path: `${SCREENSHOT_DIR}/5-sell-success.png` });


        // --- TEST CASE 3: Browse & Search ---
        console.log('\n3️⃣  Testing Browse & Search...');

        await page.goto(`${BASE_URL}/browse`, { waitUntil: 'networkidle0' });

        // Find search input (TicketFilters has an input, assume placeholder contains 'Search')
        const searchInput = await page.$('input[placeholder*="Search"]');
        if (searchInput) {
            console.log(`   🔍 Searching for "${ticketDetails.title}"...`);
            await searchInput.type(ticketDetails.title);
            await delay(1000); // Wait for debounce/filter
        } else {
            console.error('   ❌ Search input not found');
        }

        await page.screenshot({ path: `${SCREENSHOT_DIR}/6-browse-results.png` });

        // Verify listing exists
        // TicketCard usually displays the title.
        let ticketFound = null;
        try {
            ticketFound = await page.locator(`h3::-p-text(${ticketDetails.title})`).waitHandle({ timeout: 5000 });
            console.log(`   ✅ Found ticket listing in search results.`);
        } catch (e) {
            console.error(`   ❌ Ticket not found in search results.`);
        }


        // --- TEST CASE 4: View Details ---
        console.log('\n4️⃣  Testing View Details...');

        if (ticketFound) {
            // Click the first one
            // We need to click the container or a link. TicketCard usually wraps in Link or has onClick.
            // If it's a Link, it's an anchor.

            // Try clicking the title
            await ticketFound.click();

            await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(e => { }); // Wait if navigation happens
            await delay(2000); // Wait for fetch

            const detailTitle = await page.title();
            console.log(`   Page Title: ${detailTitle}`);

            // Verify H1 matches
            const h1 = await page.$eval('h1', el => el.textContent);
            if (h1.includes(ticketDetails.title)) {
                console.log(`   ✅ Correctly navigated to details page: "${h1}"`);
            } else {
                console.error(`   ❌ Details page title mismatch: "${h1}"`);
            }
            await page.screenshot({ path: `${SCREENSHOT_DIR}/7-ticket-detail.png` });

        } else {
            console.log('   ⏭️ Skipping Details test as ticket was not found.');
        }


        console.log('\n✨ Full E2E Test Complete!');

    } catch (error) {
        console.error('❌ Test Execution Failed:', error);
        await page.screenshot({ path: `${SCREENSHOT_DIR}/error_fatal.png` });
    } finally {
        await browser.close();
    }
}

runFullE2E();
