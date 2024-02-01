import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} from "../controllers/question.controller.js";

const router = Router();

// router.use(verifyJWT);

router.route("/create-question").post(createQuestion);
router.route("/getall-question").get(getAllQuestions);
router
  .route("/:questionId")
  .get(getQuestionById)
  .put(updateQuestion)
  .delete(deleteQuestion);

export default router;
