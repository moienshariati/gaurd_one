const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = 'http://localhost:4321';
const OUT = path.join('D:/project/viperone', 'verify-screenshots');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const wait = ms => new Promise(r => setTimeout(r, ms));
let i = 30;
const shot = async (page, label) => {
  const name = `${String(i++).padStart(2,'0')}-${label}`;
  await page.screenshot({ path: path.join(OUT, name + '.png') });
  console.log(`[shot] ${name}.png`);
};

async function signIn(browser, role = 'guard') {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  page.on('pageerror', e => console.log('ERR:', e.message.slice(0, 80)));
  await page.goto(BASE, { waitUntil: 'networkidle' }); await wait(2000);
  await page.locator('button:has-text("Open ViperOne")').click({ timeout: 8000 }); await wait(500);
  if (role !== 'guard') {
    const label = role === 'supervisor' ? 'Supervisor' : 'Client';
    await page.locator(`button:has-text("${label}")`).click({ timeout: 5000 }); await wait(300);
  }
  await page.locator('button:has-text("Sign in")').last().click({ timeout: 5000 }); await wait(900);
  return page;
}

async function goToShift(browser) {
  const page = await signIn(browser);
  await page.locator('button:has-text("Clock In")').first().click({ timeout: 5000 }); await wait(3500);
  await page.mouse.click(195, 640); await wait(600);
  await wait(1500);
  const btn = page.locator('button:has-text("Clock In Now")');
  if (await btn.isEnabled({ timeout: 3000 }).catch(() => false)) { await btn.click(); await wait(800); }
  return page;
}

(async () => {
  const browser = await chromium.launch({ headless: false });

  // Active Shift — expanded quick actions
  console.log('\n=== Active Shift (6 actions) ===');
  const p1 = await goToShift(browser);
  await shot(p1, 'active-shift-6actions');

  // Visitor Log
  console.log('\n=== Visitor Log ===');
  await p1.locator('text=Visitor').first().click({ timeout: 5000 }); await wait(700);
  await shot(p1, 'visitor-log-list');
  await p1.locator('button[aria-label="Add entry"]').click({ timeout: 5000 }); await wait(500);
  await shot(p1, 'visitor-log-form');
  // fill in
  await p1.locator('input').nth(0).fill('David Chen'); await wait(200);
  await p1.locator('input').nth(1).fill('BuildCo Ltd'); await wait(200);
  await p1.locator('input').nth(2).fill('C-099'); await wait(200);
  await shot(p1, 'visitor-log-form-filled');

  // DAR
  console.log('\n=== Daily Activity Report ===');
  const p2 = await goToShift(browser);
  await p2.locator('text=DAR').click({ timeout: 5000 }); await wait(700);
  await shot(p2, 'dar-form');
  await p2.locator('text=Parking lot checked').click({ timeout: 5000 }); await wait(300);
  await p2.locator('text=Lighting inspected').click({ timeout: 5000 }); await wait(300);
  await shot(p2, 'dar-form-checked');

  // Supervisor Schedule
  console.log('\n=== Supervisor Schedule ===');
  const p3 = await signIn(browser, 'supervisor');
  await shot(p3, 'supervisor-home');
  await p3.locator('text=Schedule').click({ timeout: 5000 }); await wait(700);
  await shot(p3, 'supervisor-schedule');

  await browser.close();
  console.log('\nDone.');
})();
