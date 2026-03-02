import express from "express";
import { generateTrainingController } from "../controllers/training.controller.js";

const router = express.Router();

router.post("/generate", generateTrainingController);

export default router;