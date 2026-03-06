import express from "express";
import trainingRoutes from "./routes/training.routes.js";

const app = express();

app.use(express.json());

app.use("/api/trainings", trainingRoutes);

app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        error: "Error interno del servidor",
        ...(process.env.NODE_ENV !== "production" && { detalle: err.message })
    });
});

export default app;
