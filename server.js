const express = require("express");
const path = require("path");
const https = require("https");

const app = express();

const LOGIN = "viktorkk1";

app.use(express.static(path.join(__dirname, "public")));

app.get("/login", (req, res) => {
  res.send(LOGIN);
});

app.get("/id/:N", (req, res) => {
  const userID = req.params.N;
  const apiUrl = `https://nd.kodaktor.ru/users/${userID}`;

  const options = {
    method: "GET",
    headers: {},
  };

  https
    .get(apiUrl, options, (apiRes) => {
      let data = "";

      apiRes.on("data", (chunk) => {
        data += chunk;
      });

      apiRes.on("end", () => {
        try {
          const jsonData = JSON.parse(data);

          if (jsonData && jsonData.login) {
            res.send(jsonData.login);
          } else {
            res.status(400).send("Поле login не найдено");
          }
        } catch (err) {
          res.status(400).send("Ошибка парсинга JSON: " + err.message);
        }
      });
    })
    .on("error", (err) => {
      res
        .status(500)
        .send("Ошибка при запросе к nd.kodaktor.ru: " + err.message);
    });
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
  console.log(`  http://localhost:${PORT}`);
});
