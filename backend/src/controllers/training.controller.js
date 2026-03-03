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

export const getTrainingByIdController = async (req, res) => {
    const id = req.params.id

    const result = db.prepare("SELECT * FROM trainings WHERE id = ?").get(id);

    res.json(result);
};