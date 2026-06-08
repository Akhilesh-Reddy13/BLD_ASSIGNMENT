const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const {
  startBrowser,
  captureScreenshot,
  click,
  startStreaming
} = require("./browserManager");


const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

startStreaming(io);

app.get("/start", async (_req, res) => {
  try {
    await startBrowser();
    res.status(200).json({ message: "Browser started" });
  } catch (error) {
    console.error("Failed to start browser:", error);
    res.status(500).json({ error: "Failed to start browser" });
  }
});

app.get("/screenshot", async (_req, res) => {
  try {
    const image = await captureScreenshot();

    if (!image) {
      return res.status(503).json({ error: "Browser is not ready" });
    }

    res.setHeader("Content-Type", "image/png");
    res.send(Buffer.from(image, "base64"));
  } catch (error) {
    console.error("Failed to capture screenshot:", error);
    res.status(500).json({ error: "Failed to capture screenshot" });
  }
});

io.on("connection", (socket) => {

  console.log("Client connected");

  socket.on("start-browser", async () => {

    await startBrowser();

    socket.emit("browser-started");

  });

  socket.on("click", async ({ x, y }) => {

    await click(x, y);

  });

});

server.listen(3000, () => {
  console.log("Running on port 3000");
});