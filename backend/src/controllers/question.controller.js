import Question from "../models/question.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createQuestion = asyncHandler(async (req, res) => {
  try {
    const { question, options, timer } = req.body;
    const newQuestion = new Question({ question, options, timer });
    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating question" });
  }
});

const getAllQuestions = asyncHandler(async (req, res) => {
  try {
    const questions = await Question.find().populate("options");
    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching questions" });
  }
});

const getQuestionById = asyncHandler(async (req, res) => {
  try {
    const { questionId } = req.params;
    const question = await Question.findById(questionId).populate("options");
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching question" });
  }
});

const updateQuestion = asyncHandler(async (req, res) => {
  try {
    const { questionId } = req.params;
    const { question, options, timer } = req.body;
    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      { question, options, timer },
      { new: true }
    );
    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.json(updatedQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating question" });
  }
});

const deleteQuestion = asyncHandler(async (req, res) => {
  try {
    const { questionId } = req.params;
    const question = await Question.findByIdAndDelete(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting question" });
  }
});

export {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
};
