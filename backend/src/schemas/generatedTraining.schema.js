import { z } from "zod";

export const ExerciseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "El nombre del ejercicio debe tener al menos 3 caracteres"),

  sets: z
    .number()
    .int()
    .min(1, "Las series deben ser al menos 1"),

  reps: z
    .string()
    .trim()
    .min(1, "Las repeticiones no pueden estar vacias")
});

export const DaySchema = z.object({
  dayNumber: z
    .number()
    .int()
    .min(1, "El dia debe ser al menos 1"),

  workout: z
    .string()
    .trim()
    .min(1, "El entrenamiento no puede estar vacio"),

  exercises: z
    .array(ExerciseSchema)
    .min(1, "Los ejercicios no pueden estar vacios")
});

export const generatedTrainingSchema = z.object({
    title: z
        .string()
        .trim()
        .min(3, "El titulo no puede estar vacio"),
    
    description: z
        .string()
        .trim()
        .min(3, "La descripcion no puede estar vacia"),
    
    days: z
        .array(DaySchema)
        .min(1, "Los dias no pueden estar vacios")
});
