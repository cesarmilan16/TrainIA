import express from "express";
import { generateTrainingController, getTrainingByIdController } from "../controllers/training.controller.js";

const router = express.Router();

router.post("/generate", generateTrainingController);
router.get("/:id", getTrainingByIdController)

export default router;