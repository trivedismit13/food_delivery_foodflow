const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    page.on('response', response => {
        if (response.url().includes('/api/')) {
            console.log('API Response:', response.url(), response.status());
        }
    });

    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('http://localhost:5173/auth/login');
    await page.type('input[type="email"]', 'arjun.mehta@example.com');
    await page.type('input[type="password"]', 'FoodFlow@2024');
    await Promise.all([ page.waitForNavigation({ waitUntil: 'networkidle0' }), page.click('button[type="submit"]') ]);
    await page.goto('http://localhost:5173/orders/5114/track');
    await new Promise(r => setTimeout(r, 2000));
    await browser.close();
})();
