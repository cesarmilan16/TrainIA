import express from "express";
import trainingRoutes from "./routes/training.routes.js";

const app = express();

app.use(express.json());

app.use("/api/trainings", trainingRoutes);

app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        error: process.env.NODE_ENV === "production"
            ? "Internal server error"
            : err.message
    });
});

export default app;
