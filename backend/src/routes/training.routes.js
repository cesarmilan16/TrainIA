import express from "express";
import { deleteTrainingController, generateTrainingController, getTrainingByIdController, getTrainingController, regenerateTrainingController } from "../controllers/training.controller.js";

const router = express.Router();

router.post("/generate", generateTrainingController);
router.get("/:id", getTrainingByIdController);
router.get("/", getTrainingController);
router.put("/:id", regenerateTrainingController);
router.delete("/:id", deleteTrainingController);

export default router;