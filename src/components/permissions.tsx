"use client";

import { Button } from "@/components/ui/button";
import {
  hasPermission,
  isSuperAdminRole,
  type PermissionAction,
  type PermissionsMap,
} from "@/constant/permissions";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import React, { createContext, useContext } from "react";

interface PermissionContextValue {
  permissions: PermissionsMap;
  roleName: string;
  isSuperAdmin: boolean;
}

const PermissionContext = createContext<PermissionContextValue>({
  permissions: {},
  roleName: "",
  isSuperAdmin: false,
});

export const PermissionProvider = ({
  permissions,
  roleName,
  children,
}: {
  permissions: PermissionsMap;
  roleName: string;
  children: React.ReactNode;
}) => {
  const value: PermissionContextValue = {
    permissions: permissions ?? {},
    roleName: roleName ?? "",
    isSuperAdmin: isSuperAdminRole(roleName),
  };
  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

/** Reusable hook: `const canEdit = usePermission("blogs", "edit")`. */
export const usePermission = (
  feature: string,
  action: PermissionAction
): boolean => {
  const { permissions, isSuperAdmin } = useContext(PermissionContext);
  if (isSuperAdmin) return true;
  return hasPermission(permissions, feature, action);
};

export const usePermissions = (): PermissionContextValue =>
  useContext(PermissionContext);

/**
 * Gate: renders children only with the required permission
 * (Super Admin always passes). Otherwise renders `fallback` or nothing.
 */
export const Can = ({
  feature,
  action,
  fallback = null,
  children,
}: {
  feature: string;
  action: PermissionAction;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) => {
  const allowed = usePermission(feature, action);
  if (!allowed) return <>{fallback}</>;
  return <>{children}</>;
};

/** 403 page shown when a page is opened without permission. */
export const Forbidden = ({ message }: { message?: string }) => (
  <div className="mx-auto max-w-xl rounded-lg border border-slate-200 bg-white p-8 text-center">
    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
      <ShieldAlert className="h-6 w-6 text-red-600" />
    </div>
    <h1 className="text-xl font-semibold">403 — Not authorized</h1>
    <p className="mt-2 text-sm text-muted-foreground">
      {message ?? "You do not have permission to access this page."}
    </p>
    <Link href="/dashboard">
      <Button className="mt-6 bg-brand hover:bg-brand/80 cursor-pointer">
        Back to Dashboard
      </Button>
    </Link>
  </div>
);
