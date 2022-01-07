const fs = require("fs");
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { loadEnvConfig } = require("@next/env");
const { chromium } = require("playwright");

const dev = process.env.NODE_ENV !== "production";

loadEnvConfig("./", dev);

const PUBLIC_URL = process.env.PUBLIC_URL;
const app = next({ dev });
const handle = app.getRequestHandler();

let browserContext = null;

app.prepare().then(() => {
  createServer(async (req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname, search } = parsedUrl;

    if (pathname.startsWith("/og:image")) {
      if (browserContext === null) {
        // There's some overhead to creating a browser instance;
        // we can save that time by reusing browsers between requests.
        const browser = await chromium.launch();
        browserContext = await browser.newContext({
          viewport: {
            width: 1200,
            height: 627,
          },
        });
      }

      // There's some overhead in creating a page as well,
      // but pages seem less safe to re-use.
      const page = await browserContext.newPage();

      const url = `${PUBLIC_URL}/headless?${search.substr(1)}`;

      const [_, response] = await Promise.all([
        page.goto(url),
        page.waitForEvent("response", (response) => {
          return response.request().resourceType() === "document";
        }),
      ]);

      // TODO This fallback logic doesn't work because Next auto-wraps errors in 200 status pages.
      // Figure out how to disable this behavior in the future.
      // As it is, the server ends up waiting for a long time and eventually timing out.

      if (response.status() === 200) {
        const buffer = await page.locator("#ogImageContainer").screenshot();

        res.writeHead(200, { "Content-Type": "image/png" });
        res.write(buffer, "binary");
        res.end(null, "binary");
      } else {
        // If the chart didn't generate correctly for any reason, serve a default fallback og:image.
        res.writeHead(200, { "Content-Type": "image/png" });
        fs.createReadStream("./static/og-image.png").pipe(res);
      }
    } else {
      handle(req, res, parsedUrl);
    }
  }).listen(3000, (error) => {
    if (error) {
      throw error;
    }

    console.log(`> Ready on ${PUBLIC_URL}`);
  });
});
