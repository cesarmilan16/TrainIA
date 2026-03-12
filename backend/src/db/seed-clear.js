import db from "./database.js";

const demoIds = [
  "demo-generating-001",
  "demo-failed-001",
  "demo-completed-001",
];

const deleteTraining = db.prepare(`
  DELETE FROM trainings
  WHERE id = ?
`);

for (const id of demoIds) {
  deleteTraining.run(id);
}

console.log("Seeds demo eliminados correctamente.");
