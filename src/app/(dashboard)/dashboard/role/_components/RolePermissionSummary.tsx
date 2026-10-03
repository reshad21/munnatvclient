import { TRole } from "@/types/auth.types";
import React from "react";

/** Readable summary like "13 features, 31 permissions". */
const RolePermissionSummary: React.FC<{ role: TRole | undefined }> = ({
  role,
}) => {
  const granular = (role as any)?.rolePermission as
    | { feature: string; action: string }[]
    | undefined;

  if (granular && granular.length > 0) {
    const features = new Set(granular.map((p) => p.feature)).size;
    return (
      <span className="text-sm text-gray-700">
        {features} feature{features !== 1 ? "s" : ""},{" "}
        {granular.length} permission{granular.length !== 1 ? "s" : ""}
      </span>
    );
  }

  const legacy = role?.roleFeature || [];
  if (legacy.length === 0) {
    return <span className="text-sm text-muted-foreground">No features</span>;
  }
  return (
    <span className="text-sm text-gray-700">
      {legacy.length} feature{legacy.length !== 1 ? "s" : ""}
    </span>
  );
};

export default RolePermissionSummary;
