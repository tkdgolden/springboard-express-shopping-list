process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("./app");
const items = require("./fakeDb");

var pickles = { name: "Pickles", price: 4 };

beforeEach(() => {
    items.push(pickles);
});

afterEach(() => {
    items.length = 0;
});

describe("GET /items", () => {
    test("Get all items", async () => {
        const res = await request(app).get("/items");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([{ "name": "Pickles", "price": 4 }]);
    });
});

describe("GET /items/:name", () => {
    test("Get item by name", async () => {
        const res = await request(app).get(`/items/${pickles.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ "name": "Pickles", "price": 4 });
    });

    test("Responds with 404 for invalid item", async () => {
        const res = await request(app).get(`/items/unknown`);
        expect(res.statusCode).toBe(404);
    });
});

describe("POST /items", () => {
    test("Creating an item", async () => {
        const res = await request(app).post("/items").send({ name: "popsickle", price: 1.45 });
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ added: { "name": "popsickle", "price": 1.45 } });
    });

    test("Responds with 400 if name is missing", async () => {
        const res = await request(app).post("/items").send({});
        expect(res.statusCode).toBe(400);
    });
});

describe("/PATCH /items/:name", () => {
    test("Updating an items name", async () => {
        const res = await request(app).patch(`/items/${pickles.name}`).send({ name: "popsickle", price: 4 });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ updated: { name: "popsickle", price: 4 } });
    });

    test("Updating an items price", async () => {
        const res = await request(app).patch(`/items/${pickles.name}`).send({ name: "pickles", price: 3 });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ updated: { name: "pickles", price: 3 } });
    });

    test("Responds with 404 for invalid name", async () => {
        const res = await request(app).patch(`/items/unknown`).send({ name: "pickles", price: 3 });
        expect(res.statusCode).toBe(404);
    });
});

describe("/DELETE /items/:name", () => {
    test("Deleting an item", async () => {
        const res = await request(app).delete(`/items/${pickles.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: 'deleted' });
    });

    test("Responds with 404 for deleting invalid item", async () => {
        const res = await request(app).delete(`/items/unknown`);
        expect(res.statusCode).toBe(404);
    });
});