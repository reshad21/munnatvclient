import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditRoleForm from "./_components/EditRoleForm";
import { getRoleDetails } from "@/services/role";
import { DashboardWrapper } from "../../_components/DashboardWrapper";

const EditRole = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  const id = params.id;
  const roleData = await getRoleDetails(id);

  // Backend returns { statusCode, message, ... } without `data` on 404/500.
  // Render an inline error state instead of Next.js notFound() so the
  // dashboard layout stays visible and the user can navigate back.
  if (!roleData?.data) {
    const message =
      roleData?.message || "The requested role could not be found.";
    return (
      <DashboardWrapper>
        <Link href="/dashboard/role">
          <Button variant="outline" className="mb-6 flex items-center gap-2 cursor-pointer">
            <ArrowLeft className="h-4 w-4" />
            Back to Roles &amp; Permissions
          </Button>
        </Link>
        <div className="mx-auto max-w-xl rounded-lg border border-slate-200 bg-white p-8 text-center">
          <h1 className="text-xl font-semibold">Role not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">{message}</p>
          <p className="mt-1 text-xs text-muted-foreground">ID: {id}</p>
          <Link href="/dashboard/role">
            <Button className="mt-6 bg-brand hover:bg-brand/80 cursor-pointer">
              Back to Roles
            </Button>
          </Link>
        </div>
      </DashboardWrapper>
    );
  }

  return <EditRoleForm roleData={roleData.data} id={id} />;
};

export default EditRole;
