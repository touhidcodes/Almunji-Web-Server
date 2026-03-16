import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

const generateToken = (
  payload: any,
  secret: Secret,
  expiresIn: string | number
) => {
  return jwt.sign(payload, secret, {
    expiresIn,
  } as SignOptions);
};

const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelpers = {
  generateToken,
  verifyToken,
};
