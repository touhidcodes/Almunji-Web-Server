import { Action, Resource, UserRole } from "@prisma/client";
import express from "express";
import authAccess from "../../middlewares/authAccess";
import validateRequest from "../../middlewares/validateRequest";
import { duaControllers } from "./dua.conteoller";
import { duaValidationSchemas } from "./dua.validation";

const router = express.Router();

// Route to create dua
router.post(
  "/",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.DUA,
    action: Action.CREATE,
  }),
  validateRequest(duaValidationSchemas.createDuaSchema),
  duaControllers.createDua
);

// Route to get all dua
router.get("/all", duaControllers.getAllDua);

// Route to get all dua
router.get(
  "/admin/all",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.DUA,
    action: Action.READ,
  }),
  duaControllers.getAllDuaByAdmin
);

// Route to get dua by id
router.get("/:duaId", duaControllers.getDuaById);

// Route to update dua
router.put(
  "/:duaId",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.DUA,
    action: Action.UPDATE,
  }),
  validateRequest(duaValidationSchemas.updateDuaSchema),
  duaControllers.updateDua
);

// Route to delete (soft) a tafsir by id
router.delete(
  "/:duaId",
  authAccess({
    roles: [UserRole.ADMIN, UserRole.MODERATOR],
    resource: Resource.DUA,
    action: Action.DELETE,
  }),
  duaControllers.deleteDua
);

// Route to delete (hard) a tafsir by id only by admins
router.delete(
  "/admin/:duaId",
  authAccess({
    roles: [UserRole.ADMIN],
    resource: Resource.DUA,
    action: Action.DELETE,
  }),
  duaControllers.deleteDuaByAdmin
);

export const duaRoutes = router;
