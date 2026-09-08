import { mkdirSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";

const url = process.argv[2] || "http://127.0.0.1:8090/";
const outDir = process.argv[3] || "output/web-game";
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  channel: "chrome",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 960 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});

await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
await page.waitForFunction(
  () => {
    const raw = typeof window.render_game_to_text === "function" ? window.render_game_to_text() : null;
    if (!raw) return false;
    try {
      const s = JSON.parse(raw);
      return s.logoAlpha >= 1 && s.pressStart === true && (s.frame30 & 0x1f) <= 12;
    } catch {
      return false;
    }
  },
  { timeout: 8000 },
);

async function shot(name) {
  await page.screenshot({ path: `${outDir}/${name}.png` });
}

async function sample() {
  return page.evaluate(() => {
    const frame = document.querySelector("[data-n64-frame]");
    if (!(frame instanceof HTMLElement)) return { error: "no frame" };
    const canvases = [...frame.querySelectorAll("canvas")];
    const out = document.createElement("canvas");
    out.width = 320;
    out.height = 240;
    const ctx = out.getContext("2d");
    if (!ctx) return { error: "no 2d" };
    for (const c of canvases) ctx.drawImage(c, 0, 0, 320, 240);
    const pts = {
      topleft: [24, 18],
      sky: [160, 18],
      center: [160, 118],
      botleft: [70, 210],
      copyright: [160, 232],
    };
    const colors = {};
    for (const [k, [x, y]] of Object.entries(pts)) {
      const d = ctx.getImageData(x, y, 1, 1).data;
      colors[k] = [d[0], d[1], d[2], d[3]];
    }
    return colors;
  });
}

async function state() {
  return page.evaluate(() =>
    typeof window.render_game_to_text === "function" ? window.render_game_to_text() : null,
  );
}

await shot("shot-idle");
const samples = { idle: await sample(), idleState: await state() };

const box = await page.locator("canvas").first().boundingBox();
const grabs = [
  ["nose", 0.5, 0.5],
  ["cap", 0.5, 0.34],
  ["mouth", 0.5, 0.68],
  ["stacheL", 0.4, 0.56],
  ["stacheR", 0.63, 0.57],
  ["earL", 0.26, 0.48],
  ["earR", 0.74, 0.48],
];

if (box) {
  const [name, nx, ny] = grabs[0];
  await page.mouse.move(box.x + box.width * nx, box.y + box.height * ny);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * (nx + 0.12), box.y + box.height * (ny - 0.14), { steps: 8 });
  await page.waitForTimeout(200);
  await shot("shot-grab");
  samples.grab = await sample();
  samples.grabState = await state();
  await page.keyboard.down("Shift");
  await page.mouse.up();
  await page.waitForTimeout(250);
  await shot("shot-hold");
  samples.holdState = await state();
  await page.keyboard.up("Shift");
  await page.waitForTimeout(400);
  await shot("shot-release");
  samples.releaseState = await state();

  await page.keyboard.press("r");
  await page.waitForTimeout(250);
  await shot("shot-reset");
  samples.resetState = await state();

  for (const [id, gx, gy] of grabs) {
    await page.mouse.move(box.x + box.width * gx, box.y + box.height * gy);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * (gx + 0.08), box.y + box.height * (gy - 0.08), { steps: 4 });
    await page.waitForTimeout(80);
    const st = JSON.parse((await state()) || "{}");
    samples[`pinch-${id}`] = st.pinchId;
    await page.mouse.up();
    await page.waitForTimeout(80);
  }
}

await page.keyboard.press("b");
await page.waitForTimeout(300);
await shot("shot-zoom");
samples.zoomState = await state();

writeFileSync(`${outDir}/state.json`, samples.idleState || "{}");
writeFileSync(`${outDir}/title-actions.json`, JSON.stringify(samples, null, 2));

await browser.close();
console.log(JSON.stringify({ url, outDir, errors, samples }, null, 2));
if (errors.length) process.exit(2);
