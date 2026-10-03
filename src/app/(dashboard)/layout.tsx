export const dynamic = "force-dynamic";

import { getLoggedAdminDetails } from "@/services/auth";
import { Navbar } from "./_components/DashboardNavbar";
import { Sidebar } from "./_components/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Load the LOGGED-IN admin (role + feature list) so the sidebar
  // permission filter reflects the current user, not an arbitrary role.
  let me: any = null;
  try {
    const res = await getLoggedAdminDetails();
    me = res?.data ?? null;
  } catch {
    me = null;
  }

  // Construct adminData from the authenticated user.
  // Note: password hash is intentionally omitted - never send it to the client.
  const adminData = me
    ? {
        id: me.id,
        fullName: me.fullName,
        email: me.email,
        profilePhoto: me.profilePhoto,
        status: me.status,
        roleId: me.roleId,
        createdAt: me.createdAt,
        updatedAt: me.updatedAt,
        role: {
          id: me.role?.id,
          name: me.role?.name,
          status: me.role?.status,
          roleFeature: me.role?.roleFeature || [],
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

  return (
    <section className="flex min-h-screen flex-col">
      <Navbar adminData={adminData} />
      <div className="flex flex-1">
        <Sidebar adminData={adminData} />
        <main className="flex-1 overflow-auto ml-0 md:ml-56 pt-0 mt-0">
          {children}
        </main>
      </div>
    </section>
  );
}
