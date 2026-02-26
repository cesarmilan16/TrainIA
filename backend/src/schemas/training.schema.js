import { z } from "zod";

export const trainingSchema = z.object({
    goal: z
        .string()
        .trim()
        .min(10, "Goal must be at least 10 characters long")
        .max(200, "Goal must be at most 200 characters long"),

    daysPerWeek: z
        .number()
        .int()
        .min(2, "Days per week must be at least 2 days")
        .max(6, "Days per week must be at most 6 days"),

    trainingSplit: z
        .enum(["fullbody", "upper_lower", "push_pull_legs", "weider"]),

    experienceLevel: z
        .enum(["beginner", "intermediate", "advanced"]),

    equipment: z
        .enum(["gym", "home_dumbbells", "calisthenics"])
});
