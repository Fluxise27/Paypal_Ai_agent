import puppeteer from "puppeteer";
import { PDFDocument } from "pdf-lib";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";

const htmlPath = "/root/Desktop/docs/pamphlet.html";
const outPath = "/root/Desktop/docs/AgentCart-Pamphlet.pdf";
const shotDir = "/tmp/opencode/pamphlet-pages";

await mkdir(shotDir, { recursive: true });

const browser = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1400, height: 1200, deviceScaleFactor: 1 });
await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0" });
await page.emulateMediaType("print");

const sections = await page.$$("section.page");
console.log("sections:", sections.length);

await page.pdf({
  path: outPath,
  format: "A4",
  printBackground: true,
  preferCSSPageSize: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
});

for (const index of [0, 2, 8, 10, 13, 18, 22, 29]) {
  const element = sections[index];
  if (!element) continue;
  await element.screenshot({
    path: path.join(shotDir, `page-${String(index + 1).padStart(2, "0")}.png`),
  });
}

await browser.close();

const pdf = await PDFDocument.load(await readFile(outPath));
console.log("pdf pages:", pdf.getPageCount());
