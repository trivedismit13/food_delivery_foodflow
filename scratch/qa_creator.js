const puppeteer = require('puppeteer');
const fs = require('fs');

async function runTest() {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    const errors = [];
    const consoleLogs = [];
    const networkErrors = [];
    
    page.on('console', msg => {
        if (msg.type() === 'error') {
            consoleLogs.push(msg.text());
        }
    });
    
    page.on('pageerror', err => {
        errors.push(err.message);
    });
    
    page.on('response', response => {
        if (!response.ok() && response.request().resourceType() === 'fetch') {
            networkErrors.push(`${response.status()} ${response.url()}`);
        }
    });

    const defects = [];
    
    try {
        console.log('1. Logging in as Creator');
        await page.goto('http://localhost:5173/auth/login/seller', {waitUntil: 'domcontentloaded'});
        await page.type('input[type="email"]', 'qacreator2@test.com');
        await page.type('input[type="password"]', 'password');
        await page.click('button[type="submit"]');
        await page.waitForNavigation({waitUntil: 'domcontentloaded'});
        
        console.log('2. Testing Creator Dashboard');
        await page.goto('http://localhost:5173/creator/dashboard', {waitUntil: 'domcontentloaded'});
        await page.screenshot({path: './qa_creator_dash.png'});
        
        const dashText = await page.evaluate(() => document.body.innerText);
        if (dashText.includes('Unauthorized') || dashText.includes('Not Found')) {
            defects.push({sev: 'P1', desc: 'Creator dashboard failed to load', route: '/creator/dashboard'});
        }

        console.log('3. Testing Creator Profile Edit');
        await page.goto('http://localhost:5173/creator/profile', {waitUntil: 'domcontentloaded'});
        await page.screenshot({path: './qa_creator_profile_edit.png'});

        console.log('4. Testing Creator Drops Management');
        await page.goto('http://localhost:5173/creator/drops', {waitUntil: 'domcontentloaded'});
        await page.screenshot({path: './qa_creator_manage_drops.png'});
        
        console.log('5. Testing Creator Orders Management');
        await page.goto('http://localhost:5173/creator/orders', {waitUntil: 'domcontentloaded'});
        await page.screenshot({path: './qa_creator_manage_orders.png'});

        console.log('6. Authorization Check (Creator -> Admin Dashboard)');
        await page.goto('http://localhost:5173/admin/dashboard', {waitUntil: 'domcontentloaded'});
        const adminDashText = await page.evaluate(() => document.body.innerText);
        if (adminDashText.includes('Admin Dashboard') && !adminDashText.includes('Unauthorized')) {
            defects.push({sev: 'P1', desc: 'Creator can access admin dashboard', route: '/admin/dashboard'});
        }

    } catch (e) {
        console.error('Script error:', e);
        defects.push({sev: 'P0', desc: `QA Script aborted: ${e.message}`, route: page.url()});
    }
    
    await browser.close();
    
    fs.writeFileSync('./qa_results_creator.json', JSON.stringify({
        errors, consoleLogs, networkErrors, defects
    }, null, 2));
    
    console.log('Done.');
}

runTest();
