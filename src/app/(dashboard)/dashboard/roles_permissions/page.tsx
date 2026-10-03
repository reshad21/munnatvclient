import React, { Suspense } from "react";
import { DashboardWrapper } from "../_components/DashboardWrapper";
import { Plus } from "lucide-react";
import Link from "next/link";
import AdminUsersTable from "./_components/AdminUsersTable";
import { getAdminUsers, loggedUser } from "@/services/auth";
import { requirePageAccess } from "@/lib/pageGuard";

const RolesandPermissionPage = async (props: {
  searchParams: Promise<{ search: string; page: string }>;
}) => {
  const forbidden = await requirePageAccess(
    "roles_permissions",
    "view",
    "You do not have permission to view admin users."
  );
  if (forbidden) return <DashboardWrapper>{forbidden}</DashboardWrapper>;

  const searchParams = await props.searchParams;
  const search = searchParams.search || "";
  const page = parseInt(searchParams.page) || 1;
  const params = new URLSearchParams({
    page: page.toString(),
    limit: "10",
  });
  if (search) params.set("searchTerm", search);

  const [adminUsers, currentUser] = await Promise.all([
    getAdminUsers(`?${params.toString()}`),
    loggedUser(),
  ]);

  return (
    <DashboardWrapper>
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/dashboard/role"
          className="flex items-center gap-2 bg-[#0f3d3e] text-white px-5 py-2.5 rounded-full hover:bg-[#0a2e2f] transition-colors cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Create Role</span>
        </Link>
        <Link
          href="/dashboard/roles_permissions/create"
          className="flex items-center gap-2 bg-[#0f3d3e] text-white px-5 py-2.5 rounded-full hover:bg-[#0a2e2f] transition-colors cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Create Admin User</span>
        </Link>
      </div>
      <Suspense fallback={<div>Loading admin users...</div>}>
        <AdminUsersTable
          users={adminUsers?.data ?? []}
          currentUserEmail={currentUser?.email}
        />
      </Suspense>
    </DashboardWrapper>
  );
};

export default RolesandPermissionPage;
