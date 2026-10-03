import DashboardHeading from "@/components/shared/Dashboard/DashboardHeading";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { hasPermission } from "@/constant/permissions";
import { getMyPermissions, loggedUser } from "@/services/auth";
import { TRole } from "@/types/auth.types";
import { SquarePen } from "lucide-react";
import Link from "next/link";
import DeleteRole from "./DeleteRole";
import GroupAvatar from "./GroupAvatar";
import RolePermissionSummary from "./RolePermissionSummary";

 const roleTableHeaders: string[] = [
  "No",
  "Role Name",
  "Feature Access",
  "Assign Admins",
  "Actions",
];

const RoleTable = async ({ roles }: { roles: TRole[] }) => {
    const currentUser = await loggedUser();
    const { permissions, isSuperAdmin } = await getMyPermissions();
    const canEdit =
        isSuperAdmin || hasPermission(permissions, "roles_permissions", "edit");
    const canDelete =
        isSuperAdmin || hasPermission(permissions, "roles_permissions", "delete");
    return (
        <div className="p-5 border shadow-sm rounded-md my-10">
            <div className="mb-5">
                <DashboardHeading
                    heading="All Role"
                    slogan={`You have received ${roles.length} roles`}
                />
            </div>
            <div>
                <Table>
                    <TableCaption>
                        {roles.length === 0 ? (
                            <p className="text-gray-500">No roles found.</p>
                        ) : (
                            <p className="text-gray-500">A list of all roles received.</p>
                        )}
                    </TableCaption>
                    <TableHeader className="bg-gray-100">
                        <TableRow>
                            {roleTableHeaders.map((header) => (
                                <TableHead
                                    key={header}
                                    className={`${header === "Actions" ? "text-right" : ""
                                        } font-medium`}
                                >
                                    {header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {roles.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>
                                    <RolePermissionSummary role={item} />
                                </TableCell>
                                <TableCell>
                                    <GroupAvatar users={item.adminUser} />
                                </TableCell>
                                <TableCell className="flex justify-end space-x-2">
                                    <div className="flex space-x-2">
                                        {canEdit && (
                                            <Link
                                                href={`/dashboard/role/${item.id}`}
                                                aria-label={`Edit ${item.name}`}
                                                className="text-green-600 hover:text-green-800"
                                            >
                                                <SquarePen size={18} />
                                            </Link>
                                        )}
                                        {canDelete && (
                                            <DeleteRole
                                                id={item.id}
                                                role={item.name}
                                                userRole={currentUser?.role}
                                            />
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default RoleTable;
