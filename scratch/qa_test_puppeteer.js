const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    let findings = [];
    let networkErrors = [];
    let consoleErrors = [];

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    page.setDefaultTimeout(5000);

    page.on('console', msg => {
        if (msg.type() === 'error' || msg.type() === 'warning') {
            consoleErrors.push({ type: msg.type(), text: msg.text() });
        }
    });

    page.on('response', response => {
        if (response.status() >= 400 && response.request().resourceType() === 'fetch') {
            networkErrors.push({
                url: response.url(),
                status: response.status(),
                method: response.request().method()
            });
        }
    });

    const addFinding = (step, result, details, status) => {
        findings.push({ step, result, details, status });
        console.log(`[${status}] ${step}: ${result}`);
    };

    const runStep = async (name, fn) => {
        try {
            await fn();
        } catch(e) {
            addFinding(name, 'Failed', e.message, 'FAIL');
        }
    }

    await runStep('STEP 2 - Login', async () => {
        await page.goto('http://localhost:5173/auth/login', { waitUntil: 'networkidle0' });
        await page.type('input[type="email"]', 'arjun.mehta@example.com');
        await page.type('input[type="password"]', 'FoodFlow@2024');
        
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            page.click('button[type="submit"]')
        ]);

        addFinding('STEP 2 - Login', 'Success', 'Logged in as Arjun Mehta', 'PASS');
    });

    await runStep('STEP 2 - Auth Persistence', async () => {
        await page.reload({ waitUntil: 'networkidle0' });
        const isStillAuthed = page.url().includes('dashboard');
        addFinding('STEP 2 - Auth Persistence', isStillAuthed ? 'Success' : 'Failed', 'Refresh preserved auth', isStillAuthed ? 'PASS' : 'FAIL');
    });

    await runStep('STEP 3 - Home Page', async () => {
        await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
        const hasCreators = await page.evaluate(() => document.body.innerText.includes('Top Creators'));
        const hasDrops = await page.evaluate(() => document.body.innerText.includes('Featured Drops'));
        addFinding('STEP 3 - Home Page', hasCreators && hasDrops ? 'Success' : 'Failed', 'Home page loaded with creators and drops', (hasCreators && hasDrops) ? 'PASS' : 'FAIL');
    });

    await runStep('STEP 4 - Discover Drops', async () => {
        await page.goto('http://localhost:5173/drops', { waitUntil: 'networkidle0' });
        const hasDiscoverDrops = await page.evaluate(() => document.body.innerText.includes('Discover'));
        addFinding('STEP 4 - Discover Drops', hasDiscoverDrops ? 'Success' : 'Failed', 'Drops page loaded', hasDiscoverDrops ? 'PASS' : 'FAIL');
    });

    await runStep('STEP 7 - Following Tab', async () => {
        await page.goto('http://localhost:5173/dashboard/customer?tab=following', { waitUntil: 'networkidle0' });
        const hasFollowingTab = await page.evaluate(() => document.body.innerText.includes('Following'));
        addFinding('STEP 7 - Following Tab', hasFollowingTab ? 'Success' : 'Failed', 'Following tab loaded', hasFollowingTab ? 'PASS' : 'FAIL');
    });

    await runStep('STEP 8 - Reels', async () => {
        await page.goto('http://localhost:5173/reels', { waitUntil: 'networkidle0' });
        const hasReels = await page.evaluate(() => document.querySelectorAll('video').length > 0);
        addFinding('STEP 8 - Reels', hasReels ? 'Success' : 'Failed', 'Reels page loaded videos', hasReels ? 'PASS' : 'FAIL');
    });

    await runStep('STEP 11 - Customer Orders', async () => {
        await page.goto('http://localhost:5173/dashboard/customer?tab=orders', { waitUntil: 'networkidle0' });
        const hasOrders = await page.evaluate(() => document.body.innerText.includes('Order'));
        addFinding('STEP 11 - Customer Orders', hasOrders ? 'Success' : 'Failed', 'Orders tab loaded', hasOrders ? 'PASS' : 'FAIL');
    });

    await runStep('STEP 13 - Notifications', async () => {
        await page.goto('http://localhost:5173/dashboard/customer?tab=notifications', { waitUntil: 'networkidle0' });
        const hasNotifs = await page.evaluate(() => document.body.innerText.includes('Notification'));
        addFinding('STEP 13 - Notifications', hasNotifs ? 'Success' : 'Failed', 'Notifications loaded', hasNotifs ? 'PASS' : 'FAIL');
    });

    await runStep('STEP 15 - Customer Profile', async () => {
        await page.goto('http://localhost:5173/dashboard/customer?tab=profile', { waitUntil: 'networkidle0' });
        const hasProfile = await page.evaluate(() => document.body.innerText.includes('Arjun Mehta'));
        addFinding('STEP 15 - Profile', hasProfile ? 'Success' : 'Failed', 'Profile shows correct name', hasProfile ? 'PASS' : 'FAIL');
    });

    fs.writeFileSync('qa_results.json', JSON.stringify({ findings, networkErrors, consoleErrors }, null, 2));
    await browser.close();
})();
