import { Forbidden } from "@/components/permissions";
import {
  hasPermission,
  type PermissionAction,
} from "@/constant/permissions";
import { getMyPermissions } from "@/services/auth";

/**
 * Server-side page guard. In an async server page:
 *   const forbidden = await requirePageAccess("blogs", "edit");
 *   if (forbidden) return <DashboardWrapper>{forbidden}</DashboardWrapper>;
 */
export async function requirePageAccess(
  feature: string,
  action: PermissionAction,
  message?: string
) {
  const { permissions, isSuperAdmin } = await getMyPermissions();
  if (isSuperAdmin || hasPermission(permissions, feature, action)) return null;
  return (
    <Forbidden
      message={message ?? `You do not have permission to access this page.`}
    />
  );
}
