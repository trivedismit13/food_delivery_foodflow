import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:\\Users\\Smit\\.cache\\puppeteer\\chrome\\win64-151.0.7922.47\\chrome-win64\\chrome.exe' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));
  
  try {
    console.log('Navigating to http://localhost:5174 ...');
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle0', timeout: 10000 });
    console.log('Done.');
  } catch (err) {
    console.error('Error navigating:', err.message);
  } finally {
    await browser.close();
  }
})();
