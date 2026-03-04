import express from "express";
import { generateTrainingController, getTrainingByIdController, getTrainingController } from "../controllers/training.controller.js";

const router = express.Router();

router.post("/generate", generateTrainingController);
router.get("/:id", getTrainingByIdController);
router.get("/", getTrainingController);

export default router;