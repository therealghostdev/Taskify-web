import { User } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY as string;

export const signToken = (user: User): string => {
  return jwt.sign({ userId: user.userId, email: user.email }, SECRET_KEY, {
    expiresIn: "10m",
  });
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, SECRET_KEY) as JwtPayload;
  } catch (err) {
    return null;
  }
};
