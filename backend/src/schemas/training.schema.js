import { z } from "zod";

export const trainingSchema = z.object({
    goal: z
        .string()
        .trim()
        .min(10, "El objetivo debe tener al menos 10 caracteres")
        .max(200, "El objetivo debe tener como maximo 200 caracteres"),

    daysPerWeek: z
        .number()
        .int()
        .min(2, "Los dias por semana deben ser al menos 2")
        .max(6, "Los dias por semana deben ser como maximo 6"),

    trainingSplit: z
        .enum(["fullbody", "upper_lower", "push_pull_legs", "weider"]),

    experienceLevel: z
        .enum(["beginner", "intermediate", "advanced"]),

    equipment: z
        .enum(["gym", "home_dumbbells", "calisthenics"])
});
