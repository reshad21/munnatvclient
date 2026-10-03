import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAdminUserDetails } from "@/services/auth";
import { DashboardWrapper } from "../../_components/DashboardWrapper";
import { requirePageAccess } from "@/lib/pageGuard";
import AdminUserDetails from "./_components/AdminUserDetails";

const AdminUserViewPage = async (props: {
  params: Promise<{ id: string }>;
}) => {
  const params = await props.params;
  const id = params.id;

  const forbidden = await requirePageAccess(
    "roles_permissions",
    "view",
    "You do not have permission to view admin users."
  );
  if (forbidden) return <DashboardWrapper>{forbidden}</DashboardWrapper>;

  const result = await getAdminUserDetails(id);

  if (!result?.data) {
    const message =
      result?.message || "The requested admin user could not be found.";
    return (
      <DashboardWrapper>
        <Link href="/dashboard/roles_permissions">
          <Button
            variant="outline"
            className="mb-6 flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin Users
          </Button>
        </Link>
        <div className="mx-auto max-w-xl rounded-lg border border-slate-200 bg-white p-8 text-center">
          <h1 className="text-xl font-semibold">Admin user not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">{message}</p>
          <Link href="/dashboard/roles_permissions">
            <Button className="mt-6 bg-brand hover:bg-brand/80 cursor-pointer">
              Back to Admin Users
            </Button>
          </Link>
        </div>
      </DashboardWrapper>
    );
  }

  return <AdminUserDetails user={result.data} />;
};

export default AdminUserViewPage;
