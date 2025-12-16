const express = require("express");
const multer = require("multer");
const sharp = require("sharp");

const app = express();
const upload = multer();

const CUSTOM_ID = "7cd977ad-9064-437b-a4db-b9b8b2b669d0";
const MOSCOW_TZ_OFFSET = 3;
app.use(express.text({ type: "*/*" }));
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "x-test,ngrok-skip-browser-warning,Content-Type,Accept,Access-Control-Allow-Headers"
  );
  res.setHeader("X-Author", CUSTOM_ID);
  next();
});

app.options("*", (req, res) => {
  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.type("text/plain; charset=UTF-8").send(CUSTOM_ID);
});

app.get("/hour", (req, res) => {
  const now = new Date();
  const utcHours = now.getUTCHours();
  const moscowHours = (utcHours + MOSCOW_TZ_OFFSET) % 24;
  const hour = String(moscowHours).padStart(2, "0");
  res.send(hour);
});

app.get("/login/", (req, res) => {
  res.type("text/plain; charset=UTF-8").send(CUSTOM_ID);
});

app.get("/promise/", (req, res) => {
  res.type("text/plain; charset=UTF-8");
  const functionCode =
    "function task(x){ return new Promise(function(resolve, reject){ if(x < 18){ resolve('yes'); } else { reject('no'); } }); }";
  res.send(functionCode);
});

app.get("/fetch/", (req, res) => {
  res.type("text/html; charset=UTF-8");
  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<title>Fetch Task</title>
</head>
<body>
<input id="inp" type="text">
<button id="bt">Go</button>
<script>
  document.getElementById('bt').addEventListener('click', function () {
    const inp = document.getElementById('inp');
    const url = inp.value;
    if (!url) return;
    fetch(url)
      .then(function (resp) { return resp.text(); })
      .then(function (text) { inp.value = text; })
      .catch(function (err) { inp.value = 'ERROR'; });
  });
</script>
</body>
</html>`;
  res.send(html);
});

app.get("/sample/", (req, res) => {
  res.type("text/plain; charset=UTF-8");
  const functionCode = `function task(x) {
  return x * this * this;
}`;
  res.send(functionCode);
});

app.all("/result4/", (req, res) => {
  res.type("application/json; charset=UTF-8");

  const xTestValue = req.headers["x-test"] || "";
  const bodyValue = req.body || "";

  const responseData = {
    message: CUSTOM_ID,
    "x-result": xTestValue,
    "x-body": bodyValue,
  };

  res.json(responseData);
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
