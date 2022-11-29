import express from "express";

import { verifyToken } from "../utils/verifyToken.js";

import {
  addComment,
  deleteComment,
  getComments,
} from "../controllers/comment.js";

const router = express.Router();

//add a comment
router.post("/", verifyToken, addComment);

//delete a comment
router.delete("/:id", verifyToken, deleteComment);

//get comments
router.get("/:videoId", getComments);

export default router;
