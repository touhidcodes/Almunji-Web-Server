import { Action, Resource, UserRole } from "@/generated/prisma/enums";

export interface TAuthOptions {
  roles?: UserRole[];
  resource?: Resource;
  action?: Action;
}
