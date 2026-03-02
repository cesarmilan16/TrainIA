import { trainingSchema } from "../schemas/training.schema.js";
import { validateSplitCoherence } from "../utils/validateSplitCoherence.js";
import { generateTraining } from "../services/ai.service.js";

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
        return res.status(200).json(training);
    } catch (error) {
        return res.status(500).json({
            error: "Failed to generate training"
        });
    }
};