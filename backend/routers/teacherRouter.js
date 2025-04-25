import express from "express";
import {
  createTeacher,
  getAllTeachers,
  updateTeacherById,
  getTeacherByEmail,
} from "../controllers/teacherController.js";
const router = express.Router();
router.get("/getall", getAllTeachers);
router.post("/", createTeacher);
router.put("/:id", updateTeacherById);
router.get("/:email", getTeacherByEmail);
export default router;
