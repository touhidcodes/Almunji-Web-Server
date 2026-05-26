import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Application, NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import httpStatus from "http-status";
import globalErrorHandler from "@/errors/globalErrorHandler";
import router from "@/router/routes";
import logger from "@/utils/logger";

dotenv.config();

const app: Application = express();

// Security Middlewares
app.use(helmet());

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? [process.env.CLIENT_URL as string]
      : ["http://localhost:3000", "http://localhost:3001"],
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use("/api", limiter);

// Winston HTTP request logging (replaces Morgan)
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const level =
      res.statusCode >= 500
        ? "error"
        : res.statusCode >= 400
          ? "warn"
          : "info";
    logger[level](
      `[HTTP] ${req.method} ${req.originalUrl} ${res.statusCode} — ${duration}ms`,
      {
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      }
    );
  });
  next();
});

// Parser
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Application Routes
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Almunji Server is running... !");
});

// Error Handlers
app.use(globalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  });
});

export default app;
