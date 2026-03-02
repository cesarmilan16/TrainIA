export function buildPrompt({
    goal,
    daysPerWeek,
    trainingSplit,
    experienceLevel,
    equipment
}) {
    const systemMessage = `
Eres un entrenador profesional especializado en fuerza e hipertrofia.

Debes generar exclusivamente un objeto JSON válido.

No incluyas texto fuera del JSON.
No incluyas comentarios.
No incluyas explicaciones.
No añadas campos adicionales.

El formato debe ser exactamente:

{
  "title": string,
  "description": string,
  "days": [
    {
      "dayNumber": number,
      "workout": string,
      "exercises": [
        {
          "name": string,
          "sets": number,
          "reps": string
        }
      ]
    }
  ]
}

- dayNumber debe comenzar en 1.
- El número de elementos en "days" debe coincidir exactamente con el número solicitado.
- Cada día debe contener al menos un ejercicio.
`;

    const userMessage = `
Genera un plan de entrenamiento con los siguientes parámetros:

Goal: ${goal}
Days per week: ${daysPerWeek}
Training split: ${trainingSplit}
Experience level: ${experienceLevel}
Equipment: ${equipment}

Reglas adicionales:
- El número de días en el JSON debe ser exactamente ${daysPerWeek}.
- Adapta la intensidad y el volumen al nivel indicado.
- No incluyas texto fuera del JSON.
`;

    return [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage }
    ];
}