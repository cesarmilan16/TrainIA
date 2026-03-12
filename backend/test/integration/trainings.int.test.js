import { describe, it, expect } from "vitest";
import request from "supertest";

import "../../src/db/init.js";
import app from "../../src/app.js";
import db from "../../src/db/database.js";

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
        expect(res.body).toEqual(
            expect.objectContaining({
                retryCount: expect.any(Number),
                remainingRegenerations: expect.any(Number),
                canRegenerate: expect.any(Boolean),
            })
        );
    });

    it("GET /api/trainings/:id -> 404 si el entrenamiento no existe", async () => {
        const res = await request(app).get("/api/trainings/no-existe");

        expect(res.status).toBe(404);
        expect(res.body).toEqual({
            error: "Entrenamiento no encontrado"
        });
    });

    it("GET /api/trainings -> 200 con entrenamientos paginados", async () => {
        const res = await request(app).get("/api/trainings?page=1&limit=10");

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.pagination).toEqual(
            expect.objectContaining({
                page: 1,
                limit: 10,
            })
        );
        expect(typeof res.body.pagination.total).toBe("number");
        expect(typeof res.body.pagination.totalPages).toBe("number");
        expect(res.body.data.length).toBeGreaterThan(0);
        expect(res.body.data[0]).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                goal: expect.any(String),
                daysPerWeek: expect.any(Number),
                trainingSplit: expect.any(String),
                experienceLevel: expect.any(String),
                equipment: expect.any(String),
                status: expect.any(String),
                createdAt: expect.any(String),
            })
        );
    });

    it("GET /api/trainings -> ajusta parametros de paginacion invalidos", async () => {
        const res = await request(app).get("/api/trainings?page=-3&limit=999");

        expect(res.status).toBe(200);
        expect(res.body.pagination).toEqual(
            expect.objectContaining({
                page: 1,
                limit: 50,
            })
        );
    });

    it("DELETE /api/trainings/:id -> 204 si borra correctamente", async () => {
        const idToDelete = "test-delete-completed-001";

        db.prepare(`
            INSERT OR REPLACE INTO trainings (
                id,
                goal,
                days_per_week,
                training_split,
                experience_level,
                equipment,
                status,
                training_json,
                created_at,
                retry_count
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            idToDelete,
            "Entrenamiento de prueba para borrado",
            3,
            "fullbody",
            "beginner",
            "gym",
            "COMPLETED",
            JSON.stringify({
                title: "Demo",
                description: "Demo",
                days: [
                    {
                        dayNumber: 1,
                        workout: "Full body",
                        exercises: [{ name: "Sentadilla", sets: 3, reps: "8-10" }]
                    }
                ]
            }),
            new Date().toISOString(),
            0
        );

        const res = await request(app).delete(`/api/trainings/${idToDelete}`);

        expect(res.status).toBe(204);

        const deletedRow = db.prepare("SELECT id FROM trainings WHERE id = ?").get(idToDelete);
        expect(deletedRow).toBeUndefined();
    });

    it("DELETE /api/trainings/:id -> 204 aunque el entrenamiento este generandose", async () => {
        const idGenerating = "test-delete-generating-001";

        db.prepare(`
            INSERT OR REPLACE INTO trainings (
                id,
                goal,
                days_per_week,
                training_split,
                experience_level,
                equipment,
                status,
                training_json,
                created_at,
                retry_count
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            idGenerating,
            "Entrenamiento en generacion para conflicto",
            4,
            "upper_lower",
            "intermediate",
            "gym",
            "GENERATING",
            null,
            new Date().toISOString(),
            0
        );

        const res = await request(app).delete(`/api/trainings/${idGenerating}`);

        expect(res.status).toBe(204);

        const deletedRow = db.prepare("SELECT id FROM trainings WHERE id = ?").get(idGenerating);
        expect(deletedRow).toBeUndefined();
    });
});
