import express from "express";
import { deleteTrainingController, generateTrainingController, getTrainingByIdController, getTrainingController, healthController, regenerateTrainingController } from "../controllers/training.controller.js";

const router = express.Router();

router.post("/generate", generateTrainingController);
router.get("/:id", getTrainingByIdController);
router.get("/", getTrainingController);
router.get("/health", healthController);
router.put("/:id", regenerateTrainingController);
router.delete("/:id", deleteTrainingController);

export default router;