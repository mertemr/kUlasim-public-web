const { Router } = require("express");
require("dotenv").config();

const app = require("./src/app");

const apiRouter      = require("./src/routes/apiRouter");
const redirectRouter = require("./src/routes/redirectRouter");
const defaultRouter  = Router();

const PORT = process.env.WEBSERVER_PORT || 8000;
const ticketPrices = require("./static/ticketPrices.json");

app.get("/js/:file", (req, res) => {
  res.sendFile(__dirname + "/public/js/" + req.params.file);
});

app.get("/css/:file", (req, res) => {
  res.sendFile(__dirname + "/public/css/" + req.params.file);
});

app.get("/images/:file", (req, res) => {
  res.sendFile(__dirname + "/public/images/" + req.params.file);
});

defaultRouter.get("/", (req, res) => {
  res.render("index.html", {
    title: "kUlasim Ana Sayfa",
    ticketPrices: ticketPrices,
  });
});

defaultRouter.get("/search", (req, res) => {
  res.render("search.html", { title: "kUlasim Genel Arama" });
});

// TODO .../:direction?
defaultRouter.get("/busses/:busNumber?", (req, res) => {
  const busNumber = req.params.busNumber;
  if (busNumber === undefined) {
    res.render("busses.html", { title: "kUlasim Otobüsler" });
  } else {
    res.render("busses.html", { title: `kUlasim Otobüsler :: ${busNumber}`, busNumber: busNumber });
  }
});

defaultRouter.get("/tramstops/:stopName?", (req, res) => {
  const stopName = req.params.stopName;
  if (stopName === undefined) {
    res.render("tramstops.html", { title: "kUlasim Tramvay Durakları" });
  } else {
    res.render("tramstops.html", { title: `kUlasim Tramvay Durakları :: ${stopName}`, stopName: stopName });
  }
});

defaultRouter.get("/buslines/:lineNumber?", (req, res) => {
  const lineNumber = req.params.lineNumber;
  if (lineNumber === undefined) {
    res.render("buslines.html", { title: "kUlasim Otobüs Hatları" });
  } else {
    res.render("buslines.html", { title: `kUlasim Otobüs Hatları :: ${lineNumber}`, lineNumber: lineNumber });
  }
});

defaultRouter.get("/tramlines/:lineNumber?", (req, res) => {
  const lineNumber = req.params.lineNumber;
  if (lineNumber === undefined) {
    res.render("tramlines.html", { title: "kUlasim Tramvay Hatları" });
  } else {
    res.render("tramlines.html", { title: `kUlasim Tramvay Hatları :: ${lineNumber}`, lineNumber: lineNumber });
  }
});

defaultRouter.get("/saved", (req, res) => {
  res.render("saved.html", { title: "kUlasim Favoriler" });
});

app.use("/",    defaultRouter);
app.use("/api", apiRouter);

defaultRouter.use(redirectRouter);

app.use((req, res) => {
  res.status(404).send("404 Not Found");
});

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});

