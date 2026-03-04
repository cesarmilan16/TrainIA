import { trainingSchema } from "../schemas/training.schema.js";
import { validateSplitCoherence } from "../utils/validateSplitCoherence.js";
import { generateTraining } from "../services/ai.service.js";
import { v4 as uuidv4 } from "uuid";
import db from "../db/database.js";

export const generateTrainingController = async (req, res) => {

    const result = trainingSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            errors: result.error.errors.map(err => ({
                field: err.path[0],
                message: err.message
            }))
        });
    }

    const validatedData = result.data;

    try {
        validateSplitCoherence(
            validatedData.trainingSplit,
            validatedData.daysPerWeek
        );
    } catch (error) {
        return res.status(400).json({
            errors: [
                {
                    field: error.field,
                    message: error.message
                }
            ]
        });
    }

    try {
        const training = await generateTraining(validatedData);

        const id = uuidv4();

        db.prepare(`
        INSERT INTO trainings (
            id,
            goal,
            days_per_week,
            training_split,
            experience_level,
            equipment,
            status,
            training_json,
            created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            id,
            validatedData.goal,
            validatedData.daysPerWeek,
            validatedData.trainingSplit,
            validatedData.experienceLevel,
            validatedData.equipment,
            "COMPLETED",
            JSON.stringify(training),
            new Date().toISOString()
        );

        return res.status(200).json({
            id,
            ...training
        });

    } catch (error) {
        console.error("ERROR REAL:", error);
        return res.status(500).json({
            error: "Failed to generate training"
        });
    }
};

export const getTrainingByIdController = (req, res) => {
    const idParams = req.params.id

    const result = db.prepare("SELECT * FROM trainings WHERE id = ?").get(idParams);

    if (!result) {
        return res.status(404).json({
            error: "Not found"
        })
    }

    const { id, goal, days_per_week, training_split, experience_level, equipment, status, created_at } = result;

    const training_json = JSON.parse(result.training_json);

    res.status(200).json({
        id: id,
        status: status,
        createdAt: created_at,
        input: {
            goal: goal,
            daysPerWeek: days_per_week,
            trainingSplit: training_split,
            experienceLevel: experience_level,
            equipment: equipment
        },
        training: training_json
    });
};

export const getTrainingController = (req, res) => {
    const { page, limit } = req.query;

    const pageNumber = Math.max(1, Number(page) || 1);
    const limitNumber = Math.min(50, Math.max(1, Number(limit) || 10));

    const offset = (pageNumber - 1) * limitNumber;

    const result = db.prepare(`
        SELECT id, goal, days_per_week, training_split, experience_level, equipment, status, created_at 
        FROM trainings 
        ORDER BY created_at DESC
        LIMIT ?
        OFFSET ?
        `).all(limitNumber, offset);

    const formated = result.map(row => {
        return {
            id: row.id,
            goal: row.goal,
            daysPerWeek: row.days_per_week,
            trainingSplit: row.training_split,
            experienceLevel: row.experience_level,
            equipment: row.equipment,
            status: row.status,
            createdAt: row.created_at
        }
    });

    const resultTotal = db.prepare(`
        SELECT COUNT(*) as total FROM trainings
        `).get();

    console.log(resultTotal);
    
    
    const total = resultTotal.total;
    

    const totalPages = Math.ceil(total / limitNumber);

    res.status(200).json({
        data: formated,
        pagination: {
            page: pageNumber,
            limit: limitNumber,
            total: total,
            totalPages: totalPages
        }
    });
};
