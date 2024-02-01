import mongoose, { Schema } from "mongoose";

const quizSchema = new Schema(
  {
    quizName: {
      type: String,
      required: true,
    },
    quizType: {
      type: String,
      enum: ["Q & A", "Poll Type"],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    impressionCount: {
      type: Number,
      default: 0,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
  },
  { timestamps: true }
);

const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);

export default Quiz;
