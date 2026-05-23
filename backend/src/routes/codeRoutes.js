import express from "express";
import { submitCodeAnalysis } from "../controllers/codeAnalysisController.js";
import { executeCodeHandler } from "../controllers/codeExecutionController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/execute", protectRoute, executeCodeHandler);
router.post("/analyze", submitCodeAnalysis);

export default router;
