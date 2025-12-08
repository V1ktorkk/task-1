const express = require("express");
const path = require("path");

const app = express();

const LOGIN = "viktorkk1";
const MOSCOW_TZ_OFFSET = 3;

app.use(express.static(path.join(__dirname, "public")));

app.get("/login", (req, res) => {
  res.send(LOGIN);
});

app.get("/hour", (req, res) => {
  const now = new Date();
  const utcHours = now.getUTCHours();
  const moscowHours = (utcHours + MOSCOW_TZ_OFFSET) % 24;
  const hour = String(moscowHours).padStart(2, "0");
  res.send(hour);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`Маршруты:`);
  console.log(`  http://localhost:${PORT}`);
});
