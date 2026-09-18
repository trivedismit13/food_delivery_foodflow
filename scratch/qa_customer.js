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
        console.log('1. Testing Home Page & Reels Regression');
        await page.goto('http://localhost:5173/', {waitUntil: 'domcontentloaded'});
        
        // Reels Regression (Home Page)
        await new Promise(r => setTimeout(r, 1000));
        const homeVideos = await page.$$eval('video', els => els.map(v => ({
            src: v.src,
            ready: v.readyState,
            w: v.videoWidth,
            h: v.videoHeight,
            paused: v.paused,
            autoplay: v.autoplay
        })));
        
        if (homeVideos.length === 0) {
            defects.push({sev: 'P1', desc: 'No videos found on Home page What\'s coming up section', route: '/'});
        } else {
            for (let v of homeVideos) {
                if (!v.autoplay) defects.push({sev: 'P1', desc: 'Video missing autoplay on Home page', route: '/'});
                if (v.ready === 0) defects.push({sev: 'P2', desc: 'Video readyState is 0 on Home page', route: '/'});
            }
        }
        await page.screenshot({path: './qa_home.png'});

        console.log('2. Testing Creator Profile & Drops Regression');
        await page.goto('http://localhost:5173/creators/1002', {waitUntil: 'domcontentloaded'});
        await page.screenshot({path: './qa_creator_1002.png'});
        
        // Creator Profile Active Drops incomplete API mapping regression
        const dropCards = await page.$$eval('.bg-white.rounded-2xl', cards => {
            return cards.map(c => c.innerText);
        });
        
        const dropsText = dropCards.join('\n');
        if (dropsText.includes('Sold Out') && !dropsText.includes('left')) {
            // Need to be careful here, maybe they are actually sold out in seed data? 
            // But if it says ₹0, that's definitely the regression.
            if (dropsText.includes('₹0')) {
                defects.push({sev: 'P1', desc: 'Creator Profile Drops showing ₹0 (Regression)', route: '/creators/1002'});
            }
        }
        
        if (!dropsText.includes('Pickup:')) {
            defects.push({sev: 'P2', desc: 'Creator Profile Drops missing Pickup location (Regression)', route: '/creators/1002'});
        }

        console.log('3. Logging in as Customer');
        await page.goto('http://localhost:5173/auth/login', {waitUntil: 'domcontentloaded'});
        await page.type('input[type="email"]', 'qacustomer@test.com');
        await page.type('input[type="password"]', 'password');
        await page.click('button[type="submit"]');
        await page.waitForFunction('window.location.pathname !== "/drops" && window.location.pathname !== "/auth/login"', {timeout: 5000});
        
        console.log('4. Testing /reels Regression');
        await page.goto('http://localhost:5173/reels', {waitUntil: 'domcontentloaded'});
        await new Promise(r => setTimeout(r, 1000)); // Wait for intersection observer
        const reelVideos = await page.$$eval('video', els => els.map(v => ({
            src: v.src,
            ready: v.readyState,
            w: v.videoWidth,
            h: v.videoHeight,
            paused: v.paused,
            autoplay: v.autoplay
        })));
        
        if (reelVideos.length === 0) {
            defects.push({sev: 'P1', desc: 'No videos found on /reels', route: '/reels'});
        } else {
            const visibleVideo = reelVideos.find(v => !v.paused);
            if (!visibleVideo && !reelVideos[0].autoplay) {
                defects.push({sev: 'P1', desc: 'No video is playing on /reels (Regression)', route: '/reels'});
            }
        }
        await page.screenshot({path: './qa_reels.png'});

        console.log('5. Testing Order Flow & Order Tracking Regression');
        await page.goto('http://localhost:5173/drops', {waitUntil: 'domcontentloaded'});
        // Click first drop
        await page.waitForSelector('div.cursor-pointer');
        await page.evaluate(() => { const cards = Array.from(document.querySelectorAll("div.cursor-pointer")); const card = cards.find(c => c.innerText.includes("Accepting Orders") || c.innerText.includes("Coming Soon") || c.innerText.includes("Cooking Now")); if (card) { card.click(); } else { cards[0].click(); } });
        await page.waitForFunction('window.location.pathname !== "/drops" && window.location.pathname !== "/auth/login"', {timeout: 5000});
        const dropUrl = page.url();
        await page.screenshot({path: './qa_drop_detail.png'});
        
        // Add to cart
        const addButtons = await page.$$('button');
        let added = false;
        for (const btn of addButtons) {
            const text = await page.evaluate(el => el.innerText, btn);
            if (text && (text.includes('Add') || text.includes('ADD'))) {
                await btn.click();
                added = true;
                break;
            }
        }
        
        if (added) {
            await new Promise(r => setTimeout(r, 500)); // wait for cart update
            
            // Place order directly on drop detail page
            const placeOrderBtns = await page.$$('button');
            for (const btn of placeOrderBtns) {
                const text = await page.evaluate(el => el.innerText, btn);
                if (text && (text.includes('Place Order') || text.includes('Confirm Pre-order'))) {
                    await btn.click();
                    break;
                }
            }
            await page.waitForNavigation({waitUntil: 'domcontentloaded'}).catch(()=>console.log('No navigation after Place Order'));
            await page.screenshot({path: './qa_order_success.png'});
            
            const currentUrl = page.url();
            
            // Wait for success message
            await new Promise(r => setTimeout(r, 1000));
            const pageText = await page.evaluate(() => document.body.innerText);
            
            if (pageText.includes('Order Confirmed')) {
                console.log('Checking order tracking...');
                
                // Need to go to /orders (which might actually be /dashboard/customer where orders are)
                await page.goto('http://localhost:5173/dashboard/customer', {waitUntil: 'domcontentloaded'});
                await new Promise(r => setTimeout(r, 500));
                
                const trackBtns = await page.$$('a');
                let foundTrack = false;
                for (const btn of trackBtns) {
                    const href = await page.evaluate(el => el.href, btn);
                    if (href && href.includes('/track')) {
                        foundTrack = true;
                        await page.goto(href, {waitUntil: 'domcontentloaded'});
                        await page.screenshot({path: './qa_track_order.png'});
                        const trackText = await page.evaluate(() => document.body.innerText);
                        if (trackText.includes('Order ID mismatch') || trackText.includes('Not Found') || trackText.includes('Failed to load')) {
                            defects.push({sev: 'P1', desc: 'Order tracking failed (Regression)', route: href});
                        }
                        break;
                    }
                }
                if (!foundTrack) {
                    defects.push({sev: 'P2', desc: 'Could not find tracking link on dashboard', route: '/dashboard/customer'});
                }
            } else {
                defects.push({sev: 'P1', desc: 'Failed to complete checkout flow (No success message)', route: currentUrl});
            }
        } else {
            defects.push({sev: 'P2', desc: 'Could not find Add to Cart button on drop detail', route: dropUrl});
        }
        
        // Settings page check
        console.log('6. Checking Settings');
        await page.goto('http://localhost:5173/settings', {waitUntil: 'domcontentloaded'});
        await page.screenshot({path: './qa_customer_settings.png'});
        
        // Authorization check: Customer accessing Creator route
        console.log('7. Authorization Check (Customer -> Creator Dashboard)');
        await page.goto('http://localhost:5173/creator/dashboard', {waitUntil: 'domcontentloaded'});
        const dashText = await page.evaluate(() => document.body.innerText);
        if (dashText.includes('Creator Dashboard') && !dashText.includes('Unauthorized')) {
            defects.push({sev: 'P1', desc: 'Customer can access creator dashboard', route: '/creator/dashboard'});
        }

    } catch (e) {
        console.error('Script error:', e);
        defects.push({sev: 'P0', desc: `QA Script aborted: ${e.message}`, route: page.url()});
    }
    
    await browser.close();
    
    fs.writeFileSync('./qa_results_customer.json', JSON.stringify({
        errors, consoleLogs, networkErrors, defects
    }, null, 2));
    
    console.log('Done.');
}

runTest();
