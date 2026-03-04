import express from "express";
import { generateTrainingController, getTrainingByIdController, getTrainingController, regenerateTrainingController } from "../controllers/training.controller.js";

const router = express.Router();

router.post("/generate", generateTrainingController);
router.get("/:id", getTrainingByIdController);
router.get("/", getTrainingController);
router.put("/:id", regenerateTrainingController);

export default router;