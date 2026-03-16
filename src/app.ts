import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Application, NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import httpStatus from "http-status";
import morgan from "morgan";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import router from "./app/router/routes";

dotenv.config();

const app: Application = express();

// Security Middlewares
app.use(helmet());

const corsOptions = {
  origin: process.env.NODE_ENV === "production" 
    ? [process.env.CLIENT_URL as string] 
    : ["http://localhost:3000", "http://localhost:3001"],
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});
// Apply rate limiter to all api routes
app.use("/api", limiter);

// Request Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

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
