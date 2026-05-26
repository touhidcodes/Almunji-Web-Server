import { UserRole } from "@/generated/prisma/enums";

// Type for user data
export type TUserData = {
  username: string;
  email: string;
  role: UserRole;
  password: string;
};
