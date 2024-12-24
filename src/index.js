import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import cookieParser from "cookie-parser";
import userRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import postRouter from "./routes/posts.js";
import commentRouter from "./routes/comments.js";
import likesRouter from "./routes/likes.js";
import relationshipsRouter from "./routes/relationships.js";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

// Multer storage configurationf
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "src/uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Static files middleware
app.use("/uploads", express.static(path.join(process.cwd(), "src/uploads")));

// Routes
app.use("/api/auth", authRouter);
app.use("/api", userRouter);
app.use("/api", postRouter);
app.use("/api", commentRouter);
app.use("/api", likesRouter);
app.use("/api", relationshipsRouter);

// Upload route
app.post("/api/uploads", upload.single("img"), (req, res) => {
  console.log("Uploading", req);
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Full URL for uploaded file
  const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  res.status(200).json(fileUrl);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const BASE_DIR = path.resolve(__dirname, "uploads"); // Restrict deletions to the "uploads" directory

app.delete("/api/deleteFile", (req, res) => {
  const filePath = req.body.filePath;

  if (!filePath) {
    return res.status(400).json({ error: "File path is required" });
  }

  const fullPath = path.join(BASE_DIR, filePath);
  if (!fullPath.startsWith(BASE_DIR)) {
    return res.status(400).json({ error: "Invalid file path" });
  }

  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error("Failed to delete file:", err.message);
      return res.status(500).json({ error: "Failed to delete file" });
    }

    res.status(200).json({ message: "File deleted successfully" });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
