const { Router } = require("express");

const redirectRouter = Router();

redirectRouter.get("/otobus/:id?", (req, res) => {
    const id = req.params.id;
    if (id === undefined) {
        res.redirect("/buslines");
    } else {
        res.redirect(`/buslines/${id}`);
    }
});

redirectRouter.get("/tramvay/:id?", (req, res) => {
    const id = req.params.id;
    if (id === undefined) {
        res.redirect("/tramlines");
    } else {
        res.redirect(`/tramlines/${id}`);
    }
});

redirectRouter.get("/otobus_durak/:id?", (req, res) => {
    const id = req.params.id;
    if (id === undefined) {
        res.redirect("/busses");
    } else {
        res.redirect(`/busses/${id}`);
    }
});

redirectRouter.get("/tramvay_durak/:id?", (req, res) => {
    const id = req.params.id;
    if (id === undefined) {
        res.redirect("/tramstops");
    } else {
        res.redirect(`/tramstops/${id}`);
    }
});

module.exports = redirectRouter;