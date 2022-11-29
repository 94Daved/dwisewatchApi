import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import {
  getVideo,
  getUserVideos,
  addVideo,
  updateVideo,
  deleteVideo,
  addView,
  trend,
  random,
  sub,
  getByTags,
  search,
} from "../controllers/video.js";

const router = express.Router();

//create a video
router.post("/", verifyToken, addVideo);

//update a video
router.put("/:id", verifyToken, updateVideo);

//get a video
router.get("/find/:id", getVideo);

router.get("/all/:id", getUserVideos);

//delete a video
router.delete("/:id", verifyToken, deleteVideo);

//add views to a video
router.post("/view/:id", addView);

//trend video
router.get("/trend", trend);

//trend video
router.get("/random", random);

//subrided to channels's videos
router.get("/sub", verifyToken, sub);

//get video by tags
router.get("/tags", getByTags);

//get video by title
router.get("/search", search);

export default router;
