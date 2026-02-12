import { Action, Resource, UserRole } from "@prisma/client";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../config/config";
import APIError from "../errors/APIError";
import catchAsync from "../utils/catchAsync";
import { jwtHelpers } from "../utils/jwtHelpers";
import prisma from "../utils/prisma";

type AuthOptions = {
  roles?: UserRole[];
  resource?: Resource;
  action?: Action;
};

const accessControl = ({ roles, resource, action }: AuthOptions = {}) =>
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

    // Fetch user with permissions
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

    // Token expiry safety check
    if (!decoded.exp) {
      throw new APIError(httpStatus.UNAUTHORIZED, "Invalid token");
    }

    const tokenExpirationDate = new Date(decoded.exp * 1000);
    if (tokenExpirationDate < new Date()) {
      throw new APIError(httpStatus.UNAUTHORIZED, "Token expired");
    }

    // Role-based gate (coarse)
    if (roles && !roles.includes(user.role)) {
      throw new APIError(httpStatus.FORBIDDEN, "Role forbidden");
    }

    // User-permission gate
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

export default accessControl;
