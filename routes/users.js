import express from "express";
import {
  getUser,
  updateUser,
  subUser,
  unSubUser,
  deleteUser,
  likeVideo,
  dislikeVideo,
} from "../controllers/user.js";

import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

//update user
router.put("/:id", verifyToken, updateUser);

//delete user
router.delete("/:id", verifyToken, deleteUser);

//get a user
router.get("/find/:id", getUser);

//subscribe a user
router.put("/sub/:id", verifyToken, subUser);

//unsubscribe a user
router.put("/unsub/:id", verifyToken, unSubUser);

//like a video
router.post("/like/:videoId", verifyToken, likeVideo);

//dislike a video
router.post("/dislike/:videoId", verifyToken, dislikeVideo);

export default router;
