import express from "express";
import {
  getUser,
  getSuggestions,
  updateUserDetails,
  updateUserDetailAvatorCover,
} from "../controller/users.js";

const router = express.Router();

router.get("/find/:userId", getUser);
router.get("/suggestions", getSuggestions);
router.put("/updateUserDetails", updateUserDetails);
router.patch(
  "/updateUserDetailAvatorCover/:userId",
  updateUserDetailAvatorCover
);

export default router;
