const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    const results = [];
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('requestfailed', request => {
        if (request.url().includes('.mp4') || request.url().includes('video')) {
            console.log(`REQUEST FAILED: ${request.url()} - ${request.failure().errorText}`);
        }
    });

    try {
        console.log('Navigating to /...');
        await page.goto('http://localhost:5173/reels', { waitUntil: 'networkidle0' });

        // Wait for video elements
        await page.waitForSelector('video', { timeout: 10000 });

        const videos = await page.$$eval('video', (elements) => {
            return elements.map(video => {
                return {
                    src: video.src,
                    currentSrc: video.currentSrc,
                    readyState: video.readyState,
                    networkState: video.networkState,
                    videoWidth: video.videoWidth,
                    videoHeight: video.videoHeight,
                    error: video.error ? video.error.message : null,
                    paused: video.paused,
                    muted: video.muted,
                    autoplay: video.autoplay,
                    playsInline: video.playsInline,
                    hasControls: video.hasAttribute('controls')
                };
            });
        });

        console.log('VIDEO DIAGNOSTICS:');
        console.log(JSON.stringify(videos, null, 2));

        console.log('Taking screenshot of reels page...');
        await page.screenshot({ path: 'scratch/snap_15_reels.png', fullPage: true });

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await browser.close();
    }
})();
