import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { duaControllers } from "./dua.conteoller";
import { duaValidationSchemas } from "./dua.validation";

const router = express.Router();

// Route to create dua
router.post(
  "/",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR),
  validateRequest(duaValidationSchemas.createDuaSchema),
  duaControllers.createDua
);

// Route to get all dua
router.get("/all", duaControllers.getAllDua);

// Route to get all dua
router.get(
  "/admin/all",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR),
  duaControllers.getAllDuaByAdmin
);

// Route to get dua by id
router.get("/:duaId", duaControllers.getDuaById);

// Route to update dua
router.put(
  "/:duaId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR),
  validateRequest(duaValidationSchemas.updateDuaSchema),
  duaControllers.updateDua
);

// Route to delete (soft) a tafsir by id
router.delete(
  "/:duaId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.MODERATOR),
  duaControllers.deleteDua
);

// Route to delete (hard) a tafsir by id only by admins
router.delete(
  "/admin/:duaId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  duaControllers.deleteDuaByAdmin
);

export const duaRoutes = router;
