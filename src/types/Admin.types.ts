import type { Role, Status  } from "./User.types.js";

export interface userFilterQuery {
  page?: string;
  limit?: string;
  search?: string;
  role?: Role;
  status?: Status;
}
