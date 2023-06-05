import express, { urlencoded } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import path from "path";
import uploadRouter from "./routes/upload.js";
import usersRouter from "./routes/usersRouter.js";
import caregiverRouter from "./routes/caregiverRouter.js";
import orderRouter from "./routes/orderRouter.js";
import otpRouter from "./routes/otpRouter.js";
import { register } from "./controllers/auth.js";
import authRoutes from "./routes/auth.js";

// Configurations
dotenv.config();

mongoose
  .connect(process.env.MONGODB_CONNECTION)
  .then(() => console.log("Database is connected successfully"))
  .catch((e) => console.log(e));

const app = express();

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.get("/api/keys/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});
app.use("/api/upload", uploadRouter);
app.use("/api/caregivers", caregiverRouter);
app.use("/api/users", usersRouter);
app.use("/api", orderRouter);
app.use("/api", otpRouter);
app.use("/api/auth", authRoutes);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/frontend/build")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/frontend/build/index.html"))
);

app.use((err, res, req, next) => {
  res.status(500).send({ message: err.message });
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Routes with files
app.post("/auth/register", upload.single("picture"), register);

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
