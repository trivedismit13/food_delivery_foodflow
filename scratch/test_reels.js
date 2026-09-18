const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.setViewport({ width: 400, height: 800 }); // Mobile viewport for reels
    
    console.log('Navigating to login...');
    await page.goto('http://localhost:5173/auth/login', {waitUntil: 'networkidle0'});
    await page.type('input[type="email"]', 'customer1@test.com');
    await page.type('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({waitUntil: 'networkidle0'});
    
    console.log('Navigating to reels...');
    await page.goto('http://localhost:5173/reels', {waitUntil: 'networkidle0'});
    
    console.log('Waiting for video...');
    await page.waitForSelector('video', {timeout: 10000}).catch(e=>console.log('No video tag found!'));
    
    const vids = await page.evaluate(() => Array.from(document.querySelectorAll('video')).map(v => ({
        src: v.src,
        error: v.error ? v.error.message : 'none',
        ready: v.readyState,
        w: v.videoWidth,
        h: v.videoHeight,
        paused: v.paused,
        currentTime: v.currentTime
    })));
    
    console.log(JSON.stringify(vids, null, 2));
    
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({path: 'reels_after_login.png'});
    await browser.close();
})();
