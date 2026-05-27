import { UserRole, UserStatus } from "@/generated/prisma/enums";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "@/config/config";
import { TAuthOptions } from "@/interfaces/auth";
import catchAsync from "@/utils/catchAsync";
import { jwtHelpers } from "@/utils/jwtHelpers";
import prisma from "@/utils/prisma";
import AuthorizationError from "@/errors/AuthorizationError";

const authAccess = ({ roles, resource, action }: TAuthOptions = {}) =>
  catchAsync(async (req, res, next) => {
    const token = req.headers.authorization as string;

    if (!token) {
      throw new AuthorizationError(
        httpStatus.UNAUTHORIZED,
        "Unauthorized access"
      );
    }

    // Verify token (throws if expired or invalid)
    const decoded = jwtHelpers.verifyToken(
      token,
      config.jwt.access_token_secret as Secret
    );

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!user || user.email !== decoded.email) {
      throw new AuthorizationError(
        httpStatus.UNAUTHORIZED,
        "Unauthorized access"
      );
    }

    if (user.status === UserStatus.BLOCKED) {
      throw new AuthorizationError(httpStatus.FORBIDDEN, "User is blocked");
    }

    // Attach trusted user context
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    // SUPERADMIN bypasses all role and permission checks
    if (user.role === UserRole.SUPERADMIN) {
      return next();
    }

    // Role-based access (coarse-grained)
    if (roles && roles.length > 0 && !roles.includes(user.role)) {
      throw new AuthorizationError(httpStatus.FORBIDDEN, "Role forbidden");
    }

    // Permission-based access (fine-grained)
    if (resource && action) {
      const hasPermission = user.permissions.some(
        (up) =>
          up.permission.resource === resource && up.permission.action === action
      );

      if (!hasPermission) {
        throw new AuthorizationError(
          httpStatus.FORBIDDEN,
          "Permission forbidden"
        );
      }
    }

    next();
  });

export default authAccess;
