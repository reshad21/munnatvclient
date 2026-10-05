export const dynamic = "force-dynamic";

import { PermissionProvider } from "@/components/permissions";
import { getLoggedAdminDetails } from "@/services/auth";
import type { TDashboardAdminData, TLoggedAdminMe } from "@/types/auth.types";
import { Navbar } from "./_components/DashboardNavbar";
import { Sidebar } from "./_components/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Load the LOGGED-IN admin (role + feature list) so the sidebar
  // permission filter reflects the current user, not an arbitrary role.
  let me: TLoggedAdminMe | null = null;
  try {
    const res = await getLoggedAdminDetails();
    me = res?.data ?? null;
  } catch {
    me = null;
  }

  // Construct adminData from the authenticated user.
  // Note: password hash is intentionally omitted - never send it to the client.
  const adminData: TDashboardAdminData = me
    ? {
        id: me.id,
        fullName: me.fullName,
        email: me.email,
        profilePhoto: me.profilePhoto ?? null,
        status: me.status ?? "INACTIVE",
        roleId: me.roleId,
        createdAt: me.createdAt ?? null,
        updatedAt: me.updatedAt ?? null,
        role: {
          id: me.role?.id ?? null,
          name: me.role?.name ?? "",
          status: me.role?.status ?? "INACTIVE",
          roleFeature: me.role?.roleFeature ?? [],
        },
      }
    : {
        // Fallback when unauthenticated/API fails: sidebar shows
        // only Dashboard + Log Out via the permission filter.
        id: null,
        fullName: "",
        email: "",
        profilePhoto: null,
        status: "INACTIVE",
        roleId: null,
        createdAt: null,
        updatedAt: null,
        role: {
          id: null,
          name: "",
          status: "INACTIVE",
          roleFeature: [],
        },
      };

  const permissions = me?.permissions ?? {};
  const roleName = me?.role?.name ?? "";

  return (
    <section className="flex min-h-screen flex-col">
      <PermissionProvider permissions={permissions} roleName={roleName}>
        <Navbar adminData={adminData} />
        <div className="flex flex-1">
          <Sidebar adminData={adminData} />
          <main className="flex-1 overflow-auto ml-0 md:ml-56 pt-0 mt-0">
            {children}
          </main>
        </div>
      </PermissionProvider>
    </section>
  );
}
