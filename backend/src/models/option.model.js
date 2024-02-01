import mongoose, { Schema } from "mongoose";

const optionSchema = new Schema({
  text: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  isCorrect: {
    type: Boolean,
    default: false,
  },
});

const Option = mongoose.models.Option || mongoose.model("Option", optionSchema);

export default Option;
