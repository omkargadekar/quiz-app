import { Router } from "express";
import createQuiz, {
  getAllQuizzes,
  getQuiz,
  updateQuiz,
  deleteQuiz,
  incrementImpressionCount,
  submitQuizAnswers,
  qnaAnalysis,
  pollAnalysis,
} from "../controllers/quiz.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/:quizId").get(getQuiz);
router.route("/:quizId/add-impression-count").post(incrementImpressionCount);
router.route("/:quizId/submit-quiz").post(submitQuizAnswers);

// router.use(verifyJWT);
router.route("/:quizId").put(updateQuiz).delete(deleteQuiz);
router.route("/create-quiz").post(createQuiz);
router.route("/:userId/all-quiz").get(getAllQuizzes);
router.route("/:quizId/qna-analysis").get(qnaAnalysis);
router.route("/:quizId/poll-analysis").get(pollAnalysis);

export default router;
