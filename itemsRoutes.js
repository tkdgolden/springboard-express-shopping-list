const express = require("express");
const router = new express.Router();
const ExpressError = require("./expressError");
const items = require("./fakeDb");

router.get("/", (req, res) => {
    return res.json(items);
});

router.post("/", (req, res, next) => {
    try {
        if (!req.body.name) throw new ExpressError("Name is required", 400);
        if (!req.body.price) throw new ExpressError("Price is required", 400);
        const newItem = { name: req.body.name, price: req.body.price };
        items.push(newItem);
        return res.status(201).json({ "added" : newItem });
    } catch (e) {
        return next(e);
    }
});

router.get("/:name", (req, res, next) => {
    try {
        const foundItem = items.find(item => item.name === req.params.name);
        if (foundItem === undefined) {
            throw new ExpressError("Item not found", 404);
        }
        res.json(foundItem);
    } catch (e) {
        return next(e);
    }
});

router.patch("/:name", (req, res, next) => {
    try {
        const foundItem = items.find(item => item.name === req.params.name);
        if (foundItem === undefined) {
            throw new ExpressError("Item not found", 404);
        }
        if (!req.body.name) throw new ExpressError("Name is required", 400);
        if (!req.body.price) throw new ExpressError("Price is required", 400);
        foundItem.name = req.body.name;
        foundItem.price = req.body.price;
        res.json({"updated" : foundItem});
    } catch (e) {
        return next(e);
    }
});

router.delete("/:name", (req, res, next) => {
    try {
        const foundItemIndex = items.findIndex(item => item.name === req.params.name);
        if (foundItemIndex === -1) {
            throw new ExpressError("Item not found", 404);
        }
        items.splice(foundItemIndex, 1)
        res.json({message : "deleted"});
    } catch (e) {
        return next(e);
    }
});

module.exports = router;
