import { Action, Resource, UserRole } from "@prisma/client";

export interface TAuthOptions {
  roles?: UserRole[];
  resource?: Resource;
  action?: Action;
}
