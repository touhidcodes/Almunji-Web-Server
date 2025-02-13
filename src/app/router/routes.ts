import express from "express";
import { userRoutes } from "../modules/User/user.routes";
import { authRoutes } from "../modules/Auth/auth.routes";
import { categoryRoutes } from "../modules/Category/category.routes";
import { bookRoutes } from "../modules/Book/book.routes";
import { dictionaryRoutes } from "../modules/Dictionary/dictionary.routes";
import { uploadRoutes } from "../modules/Upload/upload.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/",
    route: userRoutes,
  },
  {
    path: "/",
    route: authRoutes,
  },
  {
    path: "/category",
    route: categoryRoutes,
  },
  {
    path: "/book",
    route: bookRoutes,
  },
  {
    path: "/dictionary",
    route: dictionaryRoutes,
  },
  {
    path: "/upload",
    route: uploadRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
