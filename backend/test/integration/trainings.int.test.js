import { describe, it, expect } from "vitest";
import request from "supertest";

import "../../src/db/init.js";
import app from "../../src/app.js";

describe("Trainings API", () => {
    let createdId;

    it("GET /api/trainings/health -> 200", async () => {
        const res = await request(app).get("/api/trainings/health");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ status: "ok" })
    });

    it("POST /api/trainings/generate -> 202", async () => {
        const payload = {
            goal: "Quiero mejorar fuerza y masa muscular en 12 semanas",
            daysPerWeek: 3,
            trainingSplit: "push_pull_legs",
            experienceLevel: "beginner",
            equipment: "gym"
        };

        const res = await request(app).post("/api/trainings/generate").send(payload);
        expect(res.status).toBe(202);
        expect(res.body.status).toBe("GENERATING");
        expect(typeof res.body.id).toBe("string");
        createdId = res.body.id;
    });

    it("POST /api/trainings/generate -> 400", async () => {
        const payload = {
            goal: "Quiero mejorar fuerza y masa muscular en 12 semanas",
            daysPerWeek: 1,
            trainingSplit: "push_pull_legs",
            experienceLevel: "beginner",
            equipment: "gym"
        };

        const res = await request(app).post("/api/trainings/generate").send(payload);
        expect(res.status).toBe(400);
        expect(Array.isArray(res.body.errors)).toBe(true);
        expect(res.body.errors.length).toBeGreaterThan(0);
        expect(res.body.errors[0]).toHaveProperty("field");
        expect(res.body.errors[0]).toHaveProperty("message");
    });

    it("GET /api/trainings/:id -> 200", async () => {
        const res = await request(app).get(`/api/trainings/${createdId}`);
        expect(res.status).toBe(200);
    });
})
