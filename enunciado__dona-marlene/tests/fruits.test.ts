import { app } from "../src/app";
import supertest from "supertest";
import httpStatus from "http-status";
import { createFruit } from "./factory/fruits.factory";
import { Fruit } from "repositories/fruits-repository";

const api = supertest(app);

describe("Fruits API", () => {
    beforeEach(() => {
        fruits.length = 0;
    });

    describe("POST /fruits", () => {
        it("should return 201 when inserting a fruit", async () => {
            const body = createFruit();
            const response = await api.post("/fruits").send(body);
            expect(response.status).toBe(httpStatus.CREATED);
        });

        it("should return 409 when inserting a repeated fruit", async () => {
            const fruit1 = createFruit();
            const fruit2 = createFruit(fruit1.name);
            await api.post("/fruits").send(fruit1);
            const response = await api.post("/fruits").send(fruit2);
            expect(response.status).toBe(httpStatus.CONFLICT);
        });

        it("should return 422 when inserting an invalid body", async () => {
            const response = await api.post("/fruits").send({});
            expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
        });
    });

    describe("GET /fruits", () => {
        it("should return 404 when inserting a valid but inexistent id", async () => {
            const response = await api.get("/fruits/99999999");
            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });

        const invalidIds = ["batata", "-1", "0"];

        invalidIds.forEach((invalidId) => {
            it(`should return 400 when inserting an invalid id param: ${invalidId}`, async () => {
                const response = await api.get(`/fruits/${invalidId}`);
                expect(response.status).toBe(httpStatus.BAD_REQUEST);
            });
        });

        it("should return a fruit and status 200 when searching for an existing fruit", async () => {
            const fruit = createFruit();
            await api.post("/fruits").send(fruit);

            const response = await api.get(`/fruits/1`);
            const fruitBody = response.body as Fruit;
            expect(response.status).toBe(httpStatus.OK);
            expect(fruitBody).toMatchObject(fruit);  // Verifica todas as propriedades
        });

        it("should return an array of fruits and status 200", async () => {
            await api.post("/fruits").send(createFruit());
            await api.post("/fruits").send(createFruit());

            const response = await api.get(`/fruits`);
            expect(response.status).toBe(httpStatus.OK);
            expect(response.body).toHaveLength(2);
            expect(response.body).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    price: expect.any(Number)
                })
            ]));
        });
    });
});
