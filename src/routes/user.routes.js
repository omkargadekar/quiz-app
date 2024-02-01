import express from "express";
import {
  getUserDashboardStats,
  getTrendingQuizzes,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// router.use(verifyJWT);

router.route("/:userId/dashboard-stats").get(getUserDashboardStats);
router.route("/:userId/trending-quizzes").get(getTrendingQuizzes);

export default router;
