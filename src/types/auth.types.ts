import { JwtPayload } from "jwt-decode";
import type { PermissionsMap } from "@/constant/permissions";

export interface TCustomJwtPayload extends JwtPayload {
  id?: string;
  email: string;
  role: string;
  status: string;
  fullName: string;
  profilePhoto?: string;
  iat: number;
  exp: number;
}

export type TRolePermission = {
  id?: string;
  feature: string;
  action: string;
  roleId?: string;
};

export type TRole = {
  id: string;
  name: string;
  isDeleted?: boolean;
  status: "ACTIVE" | "INACTIVE";
  roleFeature?: TRoleFeature[];
  rolePermission?: TRolePermission[];
  adminUser?: TAdminUser[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type TRoleFeature = {
  id?: string;
  name: string;
  isChecked?: boolean;
  path: string;
  index: number;
  roleId?: string;
};

export type TAdminDetails = {
  id?: string;
  fullName: string;
  email: string;
  isChecked?: boolean;
  password?: string;
  profilePhoto?: string | Blob | undefined;
  roleId: string;
  status?: "ACTIVE" | "INACTIVE";
  createdAt?: Date;
  updatedAt?: Date;
  role: TRole;
};

export type TAdminUser = {
  id: string;
  fullName: string;
  email: string;
  profilePhoto?: string | Blob | undefined;
  roleId: string;
  status?: "ACTIVE" | "INACTIVE";
  createdAt?: Date;
  updatedAt?: Date;
  role: TRole;
};

/** Shape of `GET /auth/me` `data` used by the dashboard layout. */
export type TLoggedAdminMe = {
  id: string;
  fullName: string;
  email: string;
  profilePhoto?: string | null;
  status?: "ACTIVE" | "INACTIVE";
  roleId: string;
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
  role?: {
    id: string;
    name: string;
    status?: "ACTIVE" | "INACTIVE";
    roleFeature?: TRoleFeature[];
    rolePermission?: TRolePermission[];
  } | null;
  permissions?: PermissionsMap;
};

/** Sanitized admin passed to Navbar/Sidebar (never includes password). */
export type TDashboardAdminRole = {
  id: string | null;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  roleFeature: TRoleFeature[];
};

export type TDashboardAdminData = {
  id: string | null;
  fullName: string;
  email: string;
  profilePhoto: string | null;
  status: "ACTIVE" | "INACTIVE";
  roleId: string | null;
  createdAt: string | Date | null;
  updatedAt: string | Date | null;
  role: TDashboardAdminRole;
};
