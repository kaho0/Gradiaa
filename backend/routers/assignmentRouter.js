// routes/assignmentRouter.js
import express from "express";
import multer from "multer";
import {
  createAssignment,
  getAssignments,
  getAssignmentById,
  submitAssignment,
} from "../controllers/assignmentController.js";

// Configure multer

const router = express.Router();



router.post("/create", createAssignment);
router.get("/getall", getAssignments);
router.get("/:id", getAssignmentById);
router.post("/:id/submit", submitAssignment);  // Added logging middleware

export default router;
