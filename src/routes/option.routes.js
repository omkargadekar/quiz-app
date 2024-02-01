import {
  createOption,
  getOptions,
  getSingleOption,
  updateOption,
  deleteOption,
} from "../controllers/option.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// router.use(verifyJWT);

router.route("/create-option").post(createOption);
router.route("/get-options").get(getOptions);
router
  .route("/:optionId")
  .get(getSingleOption)
  .put(updateOption)
  .delete(deleteOption);

export default router;
