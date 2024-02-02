const express = require("express");
const ExpressError = require("./expressError");
const app = express();
const itemsRoutes = require("./itemsRoutes");

// app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} on ${req.path}`);
    return next();
});

app.use("/items", itemsRoutes);

app.use((req, res, next) => {
    const e = new ExpressError("Page Not Found", 404);
    next(e);
});

app.use(function (err, req, res, next) {
    let status = err.status || 500;
    let message = err.msg;

    return res.status(status).send(`${status} error: ${message}`);
});

module.exports = app;