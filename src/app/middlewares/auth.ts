import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../config/config";
import APIError from "../errors/APIError";
import catchAsync from "../utils/catchAsync";
import { jwtHelpers } from "../utils/jwtHelpers";
import prisma from "../utils/prisma";

const auth = (...roles: string[]) => {
  return catchAsync(async (req, res, next) => {
    try {
      const token = req.headers.authorization as string;

      if (!token) {
        throw new APIError(httpStatus.UNAUTHORIZED, "Unauthorized Access!");
      }

      const decodedUser = jwtHelpers.verifyToken(
        token,
        config.jwt.access_token_secret as Secret
      );

      console.log(decodedUser);

      // Check if the user exists in the database
      const user = await prisma.user.findUnique({
        where: { id: decodedUser.userId, email: decodedUser.email },
      });

      if (!user) {
        throw new APIError(httpStatus.UNAUTHORIZED, "Unauthorized Access!");
      }
      // Check if the token is expired
      const tokenExpirationDate = new Date((decodedUser.exp as number) * 1000);
      if (tokenExpirationDate < new Date()) {
        throw new APIError(httpStatus.UNAUTHORIZED, "Unauthorized Access!!");
      }

      req.user = decodedUser;

      //  role based operations
      if (roles.length && !roles.includes(decodedUser.role)) {
        throw new APIError(httpStatus.FORBIDDEN, "Forbidden!");
      }

      next();
    } catch (err) {
      next(err);
    }
  });
};

export default auth;
