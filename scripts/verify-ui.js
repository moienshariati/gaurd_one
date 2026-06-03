const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = 'http://localhost:4321';
const OUT = path.join('D:/project/viperone', 'verify-screenshots');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const wait = ms => new Promise(r => setTimeout(r, ms));
let i = 1;
const shot = async (page, label) => {
  const name = `${String(i++).padStart(2,'0')}-${label}`;
  await page.screenshot({ path: path.join(OUT, name + '.png') });
  console.log(`[shot] ${name}.png`);
};

async function freshGuard(browser) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await wait(2500);
  await page.locator('button:has-text("Open ViperOne")').click({ timeout: 8000 });
  await wait(600);
  await page.locator('button:has-text("Sign in")').last().click({ timeout: 5000 });
  await wait(900);
  return page;
}

(async () => {
  const browser = await chromium.launch({ headless: false });

  // 1. Landing
  const ctx0 = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const p0 = await ctx0.newPage();
  await p0.goto(BASE, { waitUntil: 'networkidle' }); await wait(2000);
  await shot(p0, 'landing');

  // 2. Sign In
  await p0.locator('button:has-text("Open ViperOne")').click({ timeout: 8000 }); await wait(600);
  await shot(p0, 'signin');

  // 3. Guard Home
  await p0.locator('button:has-text("Sign in")').last().click({ timeout: 5000 }); await wait(900);
  await shot(p0, 'home');

  // 4. Clock In (tap Clock In button)
  await p0.locator('button:has-text("Clock In")').first().click({ timeout: 5000 }); await wait(3500); // wait for GPS anim
  await shot(p0, 'clockin-gps-outside');
  await wait(3000); // GPS moves inside
  await shot(p0, 'clockin-gps-inside');
  // Tap photo
  await p0.locator('text=Tap to capture verification photo').click({ timeout: 5000 }); await wait(500);
  await shot(p0, 'clockin-photo-captured');
  // Clock In Now
  await p0.locator('button:has-text("Clock In Now")').click({ timeout: 5000 }); await wait(1000);
  await shot(p0, 'active-shift');

  // 5. Patrol + scan
  await p0.locator('button:has-text("Patrol")').first().click({ timeout: 5000 }); await wait(600);
  await shot(p0, 'patrol');
  await p0.locator('button:has-text("Scan QR")').click({ timeout: 5000 }); await wait(1500);
  await shot(p0, 'patrol-scanning');
  await wait(2000);
  await shot(p0, 'patrol-verified');

  // 6. Reports / Incident form
  await p0.goto(BASE, { waitUntil: 'networkidle' }); await wait(2000);
  const page = await freshGuard(browser);
  await page.locator('button:has-text("Incidents")').first().click({ timeout: 5000 });
  await wait(500);
  await page.locator('button[aria-label="New incident"]').click({ timeout: 5000 });
  await wait(600);
  await shot(page, 'incident-form');

  // 7. SOS
  await page.locator('[data-screen="sos"], button:has-text("SOS")').first().click({ timeout: 5000 }).catch(() => {});
  await page.locator('.btn-danger, button').filter({ hasText: 'SOS' }).first().click({ timeout: 3000 }).catch(() => {});
  await wait(600);
  await shot(page, 'sos-arm');

  // 8. Clock Out
  await page.goto(BASE, { waitUntil: 'networkidle' }); await wait(2000);
  const p2 = await freshGuard(browser);
  await p2.locator('button:has-text("Clock In")').first().click({ timeout: 5000 }); await wait(6500);
  await p2.locator('button:has-text("Take Clock-In Photo")').click({ timeout: 5000 }); await wait(500);
  const btn2 = p2.locator('button:has-text("Clock In Now")');
  if (await btn2.isEnabled({ timeout: 2000 }).catch(() => false)) { await btn2.click(); await wait(800); }
  await p2.locator('button:has-text("End Shift & Clock Out")').click({ timeout: 5000 }); await wait(600);
  await shot(p2, 'clockout');

  await browser.close();
  console.log('\nDone. All screens captured.');
})();
