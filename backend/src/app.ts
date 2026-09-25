import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import { notFoundHandler, errorHandler } from "./middleware/error.middleware";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import serviceRoutes from "./routes/service.routes";
import operationRoutes from "./routes/operation.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import announcementRoutes from "./routes/announcement.routes";
import verificationRoutes from "./routes/verification.routes";
import reportRoutes from "./routes/report.routes";

export const app = express();

// Behind a reverse proxy (Render, etc.) so req.ip reflects the real client IP
app.set("trust proxy", 1);

app.use(helmet());

// Production CORS is locked to the configured frontend origin only — never "*".
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "عدد كبير جدًا من الطلبات، يرجى المحاولة لاحقًا", errors: [] },
});
app.use("/api", limiter);

// Stricter limiter on auth endpoints to slow brute-force login attempts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "محاولات تسجيل دخول كثيرة، يرجى المحاولة لاحقًا", errors: [] },
});
app.use("/api/auth/login", authLimiter);

app.get("/health", (_req, res) => res.json({ success: true, message: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/operations", operationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/reports", reportRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
