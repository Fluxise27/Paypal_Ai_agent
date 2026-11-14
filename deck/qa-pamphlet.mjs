import puppeteer from "puppeteer";

const browser = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1400, height: 1200 });
await page.goto("file:///root/Desktop/docs/pamphlet.html", { waitUntil: "networkidle0" });
await page.emulateMediaType("print");

const report = await page.evaluate(() => {
  const problems = [];
  const pages = [...document.querySelectorAll("section.page")];

  pages.forEach((pageEl, index) => {
    const pageRect = pageEl.getBoundingClientRect();
    const content = pageEl.querySelector(".content");

    if (pageEl.scrollHeight > pageEl.clientHeight + 2) {
      problems.push({
        page: index + 1,
        kind: "page scroll overflow",
        detail: `${pageEl.scrollHeight} > ${pageEl.clientHeight}`,
      });
    }

    if (content && content.scrollHeight > content.clientHeight + 2) {
      problems.push({
        page: index + 1,
        kind: "content overflow",
        detail: `${content.scrollHeight} > ${content.clientHeight}`,
      });
    }

    const candidates = [...pageEl.querySelectorAll("p, h1, h2, h3, td, th, li, pre, .node, .layer, .card, .callout, .stat, .receipt, .tree-q, .tree-a div, .state .s")];
    for (const el of candidates) {
      const rect = el.getBoundingClientRect();
      if (rect.height === 0) continue;
      const bottomOver = rect.bottom - pageRect.bottom;
      const rightOver = rect.right - pageRect.right;
      if (bottomOver > 2 || rightOver > 2) {
        problems.push({
          page: index + 1,
          kind: "element outside page",
          detail: `${el.tagName}.${el.className || ""} bottom+${Math.round(bottomOver)} right+${Math.round(rightOver)} :: ${(el.textContent || "").trim().slice(0, 60)}`,
        });
      }
    }
  });

  return { count: pages.length, problems };
});

console.log(JSON.stringify(report, null, 2));
await browser.close();
