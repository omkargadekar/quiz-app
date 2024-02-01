import mongoose, { Schema } from "mongoose";

const questionSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
    },
    options: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Option",
      },
    ],
    timer: {
      type: String,
    },
  },
  { timestamps: true }
);

const Question =
  mongoose.models.Question || mongoose.model("Question", questionSchema);

export default Question;
