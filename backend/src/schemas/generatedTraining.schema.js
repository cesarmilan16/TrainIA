import { z } from "zod";

export const ExerciseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Exercise name must be at least 3 characters"),

  sets: z
    .number()
    .int()
    .min(1, "Sets must be at least 1"),

  reps: z
    .string()
    .trim()
    .min(1, "Reps must not be empty")
});

export const DaySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Exercise name must be at least 3 characters"),

  sets: z
    .number()
    .int()
    .min(1, "Sets must be at least 1"),

  reps: z
    .string()
    .trim()
    .min(1, "Reps must not be empty")
});