import { UserRole } from "@common/auth/auth";

export interface IPermissionRequest {
  role: UserRole;
  user_id: string;
}

export interface IAuditLog {
  admin_id: string;
  admin_name: string;
  user_id: string;
  user_name: string;
  role: string;
}
