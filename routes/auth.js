import express from "express";
import { signin, signup, google } from "../controllers/auth.js";

const router = express.Router();

//get a user
router.post("/signup", signup);

//login in a user
router.post("/signin", signin);

//login in a user
router.post("/google", google);

export default router;
