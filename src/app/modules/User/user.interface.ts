import { UserRole } from "@prisma/client";

// Type for user data
export type TUserData = {
  username: string;
  email: string;
  role: UserRole;
  password: string;
};
