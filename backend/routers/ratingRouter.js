import express from "express";
import { createRating, getRatings } from "../controllers/ratingController.js";

const router = express.Router();

router.post("/", createRating);
router.get("/getall", getRatings);

export default router;
