import db from "./database.js";

const demoTrainings = [
  {
    id: "demo-generating-001",
    goal: "Mejorar resistencia y fuerza general",
    daysPerWeek: 3,
    trainingSplit: "fullbody",
    experienceLevel: "beginner",
    equipment: "gym",
    status: "GENERATING",
    trainingJson: null,
    createdAt: "2026-03-12T10:00:00.000Z",
    retryCount: 0,
  },
  {
    id: "demo-failed-001",
    goal: "Recuperar ritmo de entrenamiento tras un paron",
    daysPerWeek: 4,
    trainingSplit: "upper_lower",
    experienceLevel: "intermediate",
    equipment: "home_dumbbells",
    status: "FAILED",
    trainingJson: null,
    createdAt: "2026-03-12T10:15:00.000Z",
    retryCount: 1,
  },
  {
    id: "demo-completed-001",
    goal: "Ganar masa muscular manteniendo buena tecnica",
    daysPerWeek: 4,
    trainingSplit: "push_pull_legs",
    experienceLevel: "intermediate",
    equipment: "gym",
    status: "COMPLETED",
    trainingJson: JSON.stringify({
      title: "Plan de hipertrofia 4 dias",
      description: "Rutina enfocada en ganancia muscular con enfasis en progresion de cargas.",
      days: [
        {
          dayNumber: 1,
          workout: "Push",
          exercises: [
            { name: "Press banca", sets: 4, reps: "6-8" },
            { name: "Press militar", sets: 3, reps: "8-10" },
            { name: "Fondos", sets: 3, reps: "10-12" },
          ],
        },
        {
          dayNumber: 2,
          workout: "Pull",
          exercises: [
            { name: "Dominadas", sets: 4, reps: "6-8" },
            { name: "Remo con barra", sets: 4, reps: "8-10" },
            { name: "Curl biceps", sets: 3, reps: "10-12" },
          ],
        },
        {
          dayNumber: 3,
          workout: "Pierna",
          exercises: [
            { name: "Sentadilla", sets: 4, reps: "6-8" },
            { name: "Peso muerto rumano", sets: 3, reps: "8-10" },
            { name: "Prensa", sets: 3, reps: "10-12" },
          ],
        },
        {
          dayNumber: 4,
          workout: "Upper",
          exercises: [
            { name: "Press inclinado", sets: 3, reps: "8-10" },
            { name: "Jalon al pecho", sets: 3, reps: "8-10" },
            { name: "Elevaciones laterales", sets: 3, reps: "12-15" },
          ],
        },
      ],
    }),
    createdAt: "2026-03-12T10:30:00.000Z",
    retryCount: 0,
  },
];

const insertTraining = db.prepare(`
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
`);

for (const training of demoTrainings) {
  insertTraining.run(
    training.id,
    training.goal,
    training.daysPerWeek,
    training.trainingSplit,
    training.experienceLevel,
    training.equipment,
    training.status,
    training.trainingJson,
    training.createdAt,
    training.retryCount
  );
}

console.log("Seed demo insertado correctamente.");
