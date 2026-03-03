import OpenAI from "openai";
import { buildPrompt } from "./promptBuilder.js";
import { generatedTrainingSchema } from "../schemas/generatedTraining.schema.js";

export async function generateTraining(data) {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        throw new Error("Missing OPENAI_API_KEY environment variable");
    }

    const client = new OpenAI({ apiKey });

    const messages = buildPrompt(data)

    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        response_format: { type: "json_object" },
        temperature: 0.7
    });

    const content = response?.choices?.[0]?.message?.content;

    if (!content) {
        throw new Error("OpenAI returned an empty response");
    };

    let parsed;

    try {
        parsed = JSON.parse(content);
    } catch {
        throw new Error("OpenAI response is not valid JSON");
    }

    const validation = generatedTrainingSchema.safeParse(parsed);

    if (!validation.success) {
        console.error("AI output validation error:", validation.error);
        throw new Error("AI returned invalid training structure");
    }

    const validatedTraining = validation.data;

    // Ahora sí validaciones adicionales
    if (validatedTraining.days.length !== data.daysPerWeek) {
        throw new Error("AI returned incorrect number of training days");
    }

    const days = validatedTraining.days;
    const dayNumbers = days.map(d => d.dayNumber).sort((a, b) => a - b);

    for (let i = 0; i < data.daysPerWeek; i++) {
        if (dayNumbers[i] !== i + 1) {
            throw new Error("AI returned non-sequential or duplicated day numbers");
        }
    }

    return validatedTraining;

};
