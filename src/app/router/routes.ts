import express from "express";
import { userRoutes } from "../modules/User/user.routes";
import { authRoutes } from "../modules/Auth/auth.routes";
import { categoryRoutes } from "../modules/Category/category.routes";
import { bookRoutes } from "../modules/Book/book.routes";
import { dictionaryRoutes } from "../modules/Dictionary/dictionary.routes";
import { uploadRoutes } from "../modules/Upload/upload.routes";
import { blogRoutes } from "../modules/Blog/blog.routes";
import { duaRoutes } from "../modules/Dua/dua.routes";
import { surahRoutes } from "../modules/Surah/surah.routes";
import { ayahRoutes } from "../modules/Ayah/ayah.routes";
import { tafsirRoutes } from "../modules/Tafsir/tafsir.routes";

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
    path: "/blog",
    route: blogRoutes,
  },
  {
    path: "/dua",
    route: duaRoutes,
  },
  {
    path: "/surah",
    route: surahRoutes,
  },
  {
    path: "/ayah",
    route: ayahRoutes,
  },
  {
    path: "/tafsir",
    route: tafsirRoutes,
  },
  {
    path: "/upload",
    route: uploadRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
