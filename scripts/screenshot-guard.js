const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'https://esmfamilonline.ir/guard/';
const OUT_DIR = path.join(__dirname, '..', 'guard-screenshots');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const wait = ms => new Promise(r => setTimeout(r, ms));
let idx = 1;
const shot = async (page, label) => {
  const name = `${String(idx++).padStart(2,'0')}-${label.replace(/[^a-z0-9]/gi,'_').toLowerCase()}`;
  await page.screenshot({ path: path.join(OUT_DIR, name + '.png') });
  console.log(`  [shot] ${name}.png`);
};

// Touch-based drag scroll (Flutter responds to pointer events)
async function touchScroll(page, x, fromY, toY, steps = 40) {
  await page.touchscreen.tap(x, fromY);
  await wait(100);
  // Use pointer events directly
  await page.mouse.move(x, fromY);
  await page.mouse.down();
  const dy = (toY - fromY) / steps;
  for (let i = 1; i <= steps; i++) {
    await page.mouse.move(x, fromY + dy * i);
    await wait(10);
  }
  await page.mouse.up();
  await wait(800);
}

async function openApp(browser, height = 844) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height },
    deviceScaleFactor: 2,
    hasTouch: true,
    isMobile: true,
  });
  const page = await ctx.newPage();
  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await wait(6000);
  return page;
}

(async () => {
  const browser = await chromium.launch({ headless: false });

  // === 1. Wide viewport to see if button appears ===
  console.log('\n=== Tall viewport (1200px) ===');
  let page = await openApp(browser, 1200);
  await shot(page, 'tall-viewport');

  // === 2. Touch scroll on normal viewport ===
  console.log('\n=== Touch scroll ===');
  page = await openApp(browser, 844);
  await shot(page, 'start');

  // Scroll down via touch
  await touchScroll(page, 195, 700, 200);
  await shot(page, 'touch-scroll-1');

  await touchScroll(page, 195, 700, 200);
  await shot(page, 'touch-scroll-2');

  await touchScroll(page, 195, 700, 200);
  await shot(page, 'touch-scroll-3');

  // === 3. Click on visible areas after scroll ===
  for (const y of [100, 200, 300, 400, 500, 600, 700, 750, 800]) {
    await page.touchscreen.tap(195, y);
    await wait(1500);
    const prev = await page.screenshot();
    await wait(200);
    const curr = await page.screenshot();
    if (!prev.equals(curr)) {
      await shot(page, `tap-y${y}-changed`);
      await wait(2000);
      await shot(page, `tap-y${y}-settled`);
    }
  }
  await shot(page, 'after-taps');

  // === 4. Tall viewport - check sign in form visibility ===
  console.log('\n=== Tall viewport with touch scroll ===');
  page = await openApp(browser, 1400);
  await shot(page, 'tall-1400');
  await touchScroll(page, 195, 900, 200);
  await shot(page, 'tall-1400-scrolled');

  // === 5. Even bigger - Desktop size to see full content ===
  console.log('\n=== Desktop viewport ===');
  const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
  const desk = await ctx2.newPage();
  await desk.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await wait(6000);
  await shot(desk, 'desktop');

  // === 6. Tap the sign-in card on tall mobile ===
  console.log('\n=== Sign In navigation ===');
  page = await openApp(browser, 1200);
  await shot(page, 'signin-tall-start');
  // Look for "Open" or sign-in button in the bottom part
  await page.touchscreen.tap(195, 900);
  await wait(2000);
  await shot(page, 'signin-tap-900');
  await page.touchscreen.tap(195, 1000);
  await wait(2000);
  await shot(page, 'signin-tap-1000');
  await page.touchscreen.tap(195, 1100);
  await wait(2000);
  await shot(page, 'signin-tap-1100');

  // Scroll in tall viewport
  await touchScroll(page, 195, 1000, 400);
  await shot(page, 'signin-tall-scrolled');
  await page.touchscreen.tap(195, 800);
  await wait(2000);
  await shot(page, 'signin-after-scroll-tap');

  await browser.close();
  console.log(`\nDone. ${idx - 1} screenshots in: ${OUT_DIR}`);
})();
