import express from "express";
import { deleteTrainingController, generateTrainingController, getTrainingByIdController, getTrainingController, healthController, regenerateTrainingController } from "../controllers/training.controller.js";

const router = express.Router();

router.get("/health", healthController);
router.post("/generate", generateTrainingController);
router.get("/:id", getTrainingByIdController);
router.get("/", getTrainingController);
router.put("/:id", regenerateTrainingController);
router.delete("/:id", deleteTrainingController);

export default router;
