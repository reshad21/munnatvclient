import { hasPermission } from "@/constant/permissions";
import { getMyPermissions } from "@/services/auth";
import { Plus } from "lucide-react";
import Link from "next/link";

/** List header with an Add button hidden without "create" permission. */
const ListPageHeader = async ({
  title,
  feature,
  createHref,
  createLabel = "Create New",
}: {
  title: string;
  feature: string;
  createHref: string;
  createLabel?: string;
}) => {
  const { permissions, isSuperAdmin } = await getMyPermissions();
  const canCreate =
    isSuperAdmin || hasPermission(permissions, feature, "create");

  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      {canCreate ? (
        <Link
          href={createHref}
          className="flex items-center gap-2 bg-[#0f3d3e] text-white px-5 py-2.5 rounded-full hover:bg-[#0a2e2f] transition-colors cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">{createLabel}</span>
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
};

export default ListPageHeader;
