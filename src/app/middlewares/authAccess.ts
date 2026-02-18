import { UserRole } from "@prisma/client";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../config/config";
import APIError from "../errors/APIError";
import { TAuthOptions } from "../interfaces/auth";
import catchAsync from "../utils/catchAsync";
import { jwtHelpers } from "../utils/jwtHelpers";
import prisma from "../utils/prisma";

const authAccess = ({ roles, resource, action }: TAuthOptions = {}) =>
  catchAsync(async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new APIError(httpStatus.UNAUTHORIZED, "Unauthorized access");
    }

    // Verify token
    const decoded = jwtHelpers.verifyToken(
      token,
      config.jwt.access_token_secret as Secret
    );

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
        email: decoded.email,
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!user) {
      throw new APIError(httpStatus.UNAUTHORIZED, "Unauthorized access");
    }

    if (user.status === "BLOCKED") {
      throw new APIError(httpStatus.FORBIDDEN, "User is blocked");
    }

    // Token expiry check
    if (!decoded.exp || new Date(decoded.exp * 1000) < new Date()) {
      throw new APIError(httpStatus.UNAUTHORIZED, "Token expired");
    }

    if (user.role === UserRole.SUPERADMIN) {
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
      };
      return next();
    }

    // Role-based access (coarse)

    if (roles && !roles.includes(user.role)) {
      throw new APIError(httpStatus.FORBIDDEN, "Role forbidden");
    }

    // Permission-based access
    if (resource && action) {
      const hasPermission = user.permissions.some(
        (up) =>
          up.permission.resource === resource && up.permission.action === action
      );

      if (!hasPermission) {
        throw new APIError(httpStatus.FORBIDDEN, "Permission forbidden");
      }
    }

    // Attach trusted user context
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  });

export default authAccess;
