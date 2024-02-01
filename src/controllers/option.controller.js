import Option from "../models/option.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createOption = asyncHandler(async (req, res) => {
  try {
    const newOption = new Option(req.body);
    const savedOption = await newOption.save();
    res.status(201).json(savedOption);
  } catch (error) {
    res.status(500).json({ message: "Error creating new option", error });
  }
});

const getOptions = asyncHandler(async (req, res) => {
  try {
    const options = await Option.find();
    res.json(options);
  } catch (error) {
    res.status(500).json({ message: "Error fetching options", error });
  }
});

const getSingleOption = asyncHandler(async (req, res) => {
  try {
    const option = await Option.findById(req.params.optionId);
    if (!option) return res.status(404).json({ message: "Option not found" });
    res.json(option);
  } catch (error) {
    res.status(500).json({ message: "Error fetching the option", error });
  }
});

const updateOption = asyncHandler(async (req, res) => {
  try {
    const updatedOption = await Option.findByIdAndUpdate(
      req.params.optionId,
      req.body,
      { new: true }
    );
    if (!updatedOption)
      return res.status(404).json({ message: "Option not found" });
    res.json(updatedOption);
  } catch (error) {
    res.status(500).json({ message: "Error updating the option", error });
  }
});

const deleteOption = asyncHandler(async (req, res) => {
  try {
    const deletedOption = await Option.findByIdAndDelete(req.params.optionId);
    if (!deletedOption)
      return res.status(404).json({ message: "Option not found" });
    res.json({ message: "Option deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting the option", error });
  }
});

export {
  createOption,
  getOptions,
  getSingleOption,
  updateOption,
  deleteOption,
};
