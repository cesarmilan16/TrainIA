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
  dayNumber: z
    .number()
    .int()
    .min(1, "Day must be at least 1"),

  workout: z
    .string()
    .trim()
    .min(1, "Workouts must not be empty"),

  exercises: z
    .array(ExerciseSchema)
    .min(1, "Exercises must not be empty")
});

export const generatedTrainingSchema = z.object({
    title: z
        .string()
        .trim()
        .min(3, "Title must not be empty"),
    
    description: z
        .string()
        .trim()
        .min(3, "Description must not be empty"),
    
    days: z
        .array(DaySchema)
        .min(1, "Days must not be empty")
});