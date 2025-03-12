import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { duaControllers } from "./dua.conteoller";
import { duaValidationSchemas } from "./dua.validation";

const router = express.Router();

router.get("/all", duaControllers.getDuas);

router.post(
  "/",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  validateRequest(duaValidationSchemas.createDuaSchema),
  duaControllers.createDua
);

router.get("/:duaId", duaControllers.getDuaById);

router.put(
  "/:duaId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  validateRequest(duaValidationSchemas.updateDuaSchema),
  duaControllers.updateDua
);

router.delete(
  "/:duaId",
  auth(UserRole.SUPERADMIN, UserRole.ADMIN),
  duaControllers.deleteDua
);

export const duaRoutes = router;
