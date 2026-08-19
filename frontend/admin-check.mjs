import { chromium } from "playwright";

const errors = [];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
page.on("pageerror", (err) => errors.push(String(err)));

await page.goto("http://localhost:3000/admin/orders", { waitUntil: "networkidle" });
await page.waitForSelector("text=Orders");
await page.screenshot({ path: "admin-orders-list.png", fullPage: true });

// click first order row
const firstOrderLink = page.locator('table a[href^="/admin/orders/"]').first();
const href = await firstOrderLink.getAttribute("href");
await page.locator("table tbody tr").first().click();
await page.waitForURL(`**${href}`);
await page.waitForSelector("text=Customer");
await page.screenshot({ path: "admin-order-detail.png", fullPage: true });

// read current status text, then change it via select
const statusBadgeBefore = await page.locator("main").locator("span", { hasText: /PENDING|PREPARING|COMPLETED|CANCELLED/ }).first().innerText().catch(() => "n/a");

// open select trigger (aria-label="Update order status")
await page.getByLabel("Update order status").click();
await page.waitForSelector('[role="option"], [data-slot="select-item"]');
// pick PREPARING (or a different one than current)
const options = page.locator('[data-slot="select-item"]');
const count = await options.count();
let picked = null;
for (let i = 0; i < count; i++) {
  const text = (await options.nth(i).innerText()).trim();
  if (text !== statusBadgeBefore) {
    picked = text;
    await options.nth(i).click();
    break;
  }
}
await page.waitForTimeout(800);
await page.screenshot({ path: "admin-order-status-updated.png", fullPage: true });

// reload to confirm persistence
await page.reload({ waitUntil: "networkidle" });
await page.waitForSelector("text=Customer");
const bodyText = await page.locator("main").innerText();

console.log(JSON.stringify({
  href,
  statusBadgeBefore,
  picked,
  persistedIncludesPicked: picked ? bodyText.includes(picked) : null,
  consoleErrors: errors,
}, null, 2));

await browser.close();
