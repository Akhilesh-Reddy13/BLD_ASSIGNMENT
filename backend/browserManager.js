const puppeteer = require("puppeteer");

let browser;
let page;

async function startBrowser() {
    if (browser) {
        console.log("Browser already running");
        return;
    }

    browser = await puppeteer.launch({
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox"
        ]
    });

    page = await browser.newPage();

    await page.setViewport({
        width: 1280,
        height: 720
    });

    await page.goto("https://www.google.com/");

    console.log("Chromium launched successfully");
}

async function captureScreenshot() {
    if (!page) return null;

    return await page.screenshot({
        encoding: "base64",
        type: "png"
    });
}

async function click(x, y) {
    if (!page) return;

    await page.mouse.click(x, y);
}

async function type(text) {
    if (!page) return;

    await page.keyboard.type(text);
}

async function scroll(deltaY) {
    if (!page) return;

    await page.mouse.wheel({
        deltaY
    });
}

async function stopBrowser() {
    if (browser) {
        await browser.close();
        browser = null;
        page = null;
    }
}

function startStreaming(io) {

  setInterval(async () => {

    if (!page) return;

    const image = await page.screenshot({
      encoding: "base64",
      type: "png"
    });

    io.emit("frame", image);

  }, 200);

}

module.exports = {
    startBrowser,
    captureScreenshot,
    click,
    type,
    scroll,
    stopBrowser,
    startStreaming
};