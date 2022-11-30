import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

//routes
import userRoutes from "./routes/users.js";
import videoRoutes from "./routes/videos.js";
import commentRoutes from "./routes/comments.js";
import authRoutes from "./routes/auth.js";

// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

const connect = () => {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
      console.log("connected to MongoDB");
    })
    .catch((err) => {
      throw err;
    });
};

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);
app.use((err, req, res, next) => {
  const status = err.status || 501;
  const message = err.message || "something went wrong!";
  return res.status(status).json({ success: false, status, message });
});

// app.use(express.static(path.join(__dirname, "/app")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "/app/build", "index.html"));
// });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`listening to port ${port}...`);
  connect();
});
