const express = require("express");

const {
    startBrowser,
    captureScreenshot
} = require("./browserManager");

const app = express();

app.get("/start", async (req, res) => {
    try {
        await startBrowser();

        res.json({
            success: true,
            message: "Browser started"
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false
        });
    }
});

app.get("/screenshot", async (req, res) => {

    const image = await captureScreenshot();

    if (!image) {
        return res.status(400).send("Browser not started");
    }

    res.send(`
        <img src="data:image/png;base64,${image}" />
    `);
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});