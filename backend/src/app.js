import express from "express";
import trainingRoutes from "./routes/training.routes.js";

const app = express();

// Middleware
app.use(express.json());

app.use("/api/trainings", trainingRoutes);

export default app;
