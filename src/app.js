const express = require("express");
const compression = require("compression");
const favicon = require("serve-favicon");
require("dotenv").config();

const app = express();

app.engine(".html", require("ejs").__express);
app.set("view engine", "ejs");
app.set("view cache", true);
app.set("views", "views");


app.use((req, res, next) => {
    if (req.originalUrl.match(/\.(css|ico|png|jpg|jpeg|gif|svg|js|webp)$/)) {
        console.info(`├ ${req.originalUrl}`);
    } else {
        console.info(`[${new Date().toLocaleString()}] ${req.ip} - ${req.method}: ${req.originalUrl}`);
    }
    next();
});

app.use(compression());
app.use(favicon("public/favicon.ico"));
//* for production
// app.use(
//     express.static("public", {
//         maxAge: "1w",
//     }),
// );
app.use(express.urlencoded({ extended: true }));

module.exports = app;
