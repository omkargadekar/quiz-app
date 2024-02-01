import Quiz from "../models/quiz.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import Question from "../models/question.model.js";
import Response from "../models/response.model.js";

import mongoose from "mongoose";

const createQuiz = asyncHandler(async (req, res) => {
  try {
    const { quizName, quizType, userId, questions } = req.body;

    // Optionally: Validate the user ID, quizName, quizType, and questions here

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate or process the questions array as needed
    // For simplicity, assuming `questions` is an array of Question document IDs
    const validQuestions = await Promise.all(
      questions.map(async (questionId) => {
        const question = await Question.findById(questionId);
        return question ? question._id : null;
      })
    );

    const filteredQuestions = validQuestions.filter((q) => q !== null);

    // Create the quiz
    const newQuiz = new Quiz({
      quizName,
      quizType,
      user: userId,
      questions: filteredQuestions,
    });

    // Save the quiz to the database
    const savedQuiz = await newQuiz.save();
    res.status(201).json(savedQuiz);
  } catch (err) {
    console.error("Error creating the quiz:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// getAllQuizzes Controller
export const getAllQuizzes = async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from request parameters

    // Check if userId is defined and a valid ObjectId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid or missing user ID" });
    }

    const quizzes = await Quiz.find({ user: userId }) // Filter quizzes by user ID
      .populate({
        path: "questions",
        populate: { path: "options" }, // Populate the options inside each question
      })
      .populate("user");

    res.json(quizzes);
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "Error fetching quizzes", error: error.message });
  }
};

// getQuiz Controller
export const getQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId)
      .populate({
        path: "questions",
        populate: { path: "options" }, // Populate the options inside each question
      })
      .populate("user");
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json(quiz);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching the quiz", error });
  }
};

// updateQuiz Controller
export const updateQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const updateData = req.body;
    const updatedQuiz = await Quiz.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate("questions")
      .populate("user");
    if (!updatedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ message: "Error updating the quiz", error });
  }
};

// deleteQuiz Controller
export const deleteQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const deletedQuiz = await Quiz.findByIdAndDelete(quizId);
    if (!deletedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting the quiz", error });
  }
};

export const incrementImpressionCount = async (req, res) => {
  try {
    const { quizId } = req.params;

    // Find the quiz and increment the impressionCount
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    quiz.impressionCount = quiz.impressionCount + 1;
    await quiz.save();

    res.status(200).json({
      message: "Impression count incremented successfully",
      impressionCount: quiz.impressionCount,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error incrementing impression count", error });
  }
};

export const submitQuizAnswers = asyncHandler(async (req, res) => {
  try {
    const { quizId } = req.params;
    const { userAnswers } = req.body;

    // Find the quiz with the provided ID
    const quiz = await Quiz.findById(quizId).populate({
      path: "questions",
      populate: { path: "options" },
    });

    if (!quiz) {
      throw new ApiError(404, "Quiz not found");
    }

    let score = 0;
    quiz.questions.forEach((question, index) => {
      const userAnswer = userAnswers[index];
      const correctOption = question.options.findIndex(
        (option) => option.isCorrect
      );

      if (userAnswer === correctOption) {
        score += 1; // Increment score for each correct answer
      }
    });

    // Calculate total score (as a percentage)
    const totalScore = (score / quiz.questions.length) * 100;

    res
      .status(200)
      .json(
        new ApiResponse(true, "Quiz evaluated successfully", { totalScore })
      );
  } catch (error) {
    console.error("Error submitting quiz answers:", error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(new ApiResponse(false, error.message));
    } else {
      res.status(500).json(new ApiResponse(false, "Error evaluating quiz"));
    }
  }
});

export const qnaAnalysis = async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId).populate("questions").exec();

    if (!quiz || quiz.quizType !== "Q & A") {
      return res
        .status(404)
        .json({ message: "Quiz not found or not a QnA type" });
    }

    const questionAnalytics = await Promise.all(
      quiz.questions.map(async (question) => {
        const responses = await Response.find({
          quiz: quizId,
          question: question._id,
        });
        const attempted = responses.length;
        const answeredCorrectly = responses.filter((r) => r.isCorrect).length;
        const answeredIncorrectly = attempted - answeredCorrectly;

        return {
          questionText: question.question,
          attempted,
          answeredCorrectly,
          answeredIncorrectly,
        };
      })
    );

    res.json({ quizName: quiz.quizName, questions: questionAnalytics });
  } catch (error) {
    console.error("Error in QnA Analysis:", error);
    res
      .status(500)
      .json({ message: "Error fetching QnA analysis", error: error.message });
  }
};

export const pollAnalysis = async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId)
      .populate({
        path: "questions",
        populate: { path: "options" },
      })
      .exec();

    if (!quiz || quiz.quizType !== "Poll Type") {
      return res
        .status(404)
        .json({ message: "Quiz not found or not a Poll type" });
    }

    const pollAnalytics = await Promise.all(
      quiz.questions.map(async (question) => {
        const optionsCount = await Promise.all(
          question.options.map(async (option) => {
            const count = await Response.countDocuments({
              quiz: quizId,
              question: question._id,
              selectedOption: option._id,
            });
            return { optionText: option.text, count };
          })
        );

        return {
          questionText: question.question,
          optionsCount,
        };
      })
    );

    res.json({ quizName: quiz.quizName, questions: pollAnalytics });
  } catch (error) {
    console.error("Error in Poll Analysis:", error);
    res
      .status(500)
      .json({ message: "Error fetching Poll analysis", error: error.message });
  }
};

export default createQuiz;
