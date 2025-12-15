const express = require("express");
const multer = require("multer");
const sharp = require("sharp");

const app = express();
const upload = multer();

const LOGIN = "viktorkk1";
const CUSTOM_ID = "7cd977ad-9064-437b-a4db-b9b8b2b669d0";

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("X-Author", CUSTOM_ID);
  next();
});

app.get("/", (req, res) => {
  res.type("text/plain").send(CUSTOM_ID);
});

app.get("/login", (req, res) => {
  res.type("text/plain").send(LOGIN);
});

app.post("/size2json", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Не передано поле image" });
    }

    const metadata = await sharp(req.file.buffer).metadata();

    res.json({
      width: metadata.width,
      height: metadata.height,
    });
  } catch (err) {
    res.status(500).json({ error: "Ошибка обработки изображения" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`HTTP сервер запущен на порту ${PORT}`);
});
