import { Forbidden } from "@/components/permissions";
import { hasPermission } from "@/constant/permissions";
import { getMyPermissions } from "@/services/auth";
import { DashboardWrapper } from "../../_components/DashboardWrapper";
import CreateRoleForm from "./_components/CreateRoleForm";

const CreateRolePage = async () => {
  const { permissions, isSuperAdmin } = await getMyPermissions();
  const allowed =
    isSuperAdmin || hasPermission(permissions, "roles_permissions", "create");

  if (!allowed) {
    return (
      <DashboardWrapper>
        <Forbidden message="You do not have permission to create roles." />
      </DashboardWrapper>
    );
  }

  return <CreateRoleForm />;
};

export default CreateRolePage;
