"use client";

import { Can } from "@/components/permissions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { updateAdminUser } from "@/services/auth";
import { showErrorToast, showSuccessToast } from "@/utils/toastMessage";
import { Eye, SquarePen, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import DeleteAdminUserDialog from "./DeleteAdminUserDialog";

interface AdminUserRow {
  id: string;
  fullName: string;
  email: string;
  profilePhoto?: string | null;
  roleId: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt?: string;
  role?: { id: string; name: string };
}

const AdminUsersTable = ({
  users = [],
  currentUserEmail,
}: {
  users: AdminUserRow[];
  currentUserEmail?: string;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggleStatus = (user: AdminUserRow) => {
    const nextStatus = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    setTogglingId(user.id);
    startTransition(async () => {
      const result = await updateAdminUser(user.id, { status: nextStatus });
      setTogglingId(null);
      if (result?.statusCode === 200) {
        showSuccessToast(result.message || "Status updated");
        router.refresh();
      } else {
        showErrorToast(result?.message || "Failed to update status");
      }
    });
  };

  return (
    <TooltipProvider>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-4 px-6 font-semibold text-gray-700">SN</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Image</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Role</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
              <th className="text-right py-4 px-6 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {users.map((user, index) => {
              const isSelf = currentUserEmail === user.email;
              return (
                <tr
                  key={user.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50"
                >
                  <td className="py-4 px-6 text-gray-600">{index + 1}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="h-10 w-10 shrink-0 bg-[#0f3d3e]">
                        <AvatarImage
                          src={user.profilePhoto || undefined}
                          alt={user.fullName}
                        />
                        <AvatarFallback className="bg-[#0f3d3e] text-white">
                          {user.fullName ? (
                            user.fullName.charAt(0).toUpperCase()
                          ) : (
                            <User className="h-5 w-5 text-white" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 truncate max-w-44">
                          {user.fullName}
                        </p>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <p className="text-xs text-muted-foreground truncate max-w-44 cursor-default">
                              {user.email}
                            </p>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{user.email}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm border rounded-full px-2 py-0.5 text-gray-700">
                      {user.role?.name ?? "—"}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <Can feature="roles_permissions" action="status">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          aria-label={`Set ${user.fullName} ${user.status === "ACTIVE" ? "inactive" : "active"}`}
                          disabled={isPending && togglingId === user.id}
                          onClick={() => handleToggleStatus(user)}
                          className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${
                            user.status === "ACTIVE" ? "bg-[#0f3d3e]" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                              user.status === "ACTIVE" ? "right-1" : "left-1"
                            }`}
                          />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{user.status === "ACTIVE" ? "Active — click to deactivate" : "Inactive — click to activate"}</p>
                      </TooltipContent>
                    </Tooltip>
                    </Can>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <Can feature="roles_permissions" action="view">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href={`/dashboard/roles_permissions/${user.id}`}
                            aria-label={`View ${user.fullName}`}
                            className="w-8 h-8 flex items-center justify-center border border-[#0f3d3e] text-[#0f3d3e] rounded hover:bg-[#0f3d3e] hover:text-white transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View</p>
                        </TooltipContent>
                      </Tooltip>
                      </Can>
                      <Can feature="roles_permissions" action="edit">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href={`/dashboard/roles_permissions/${user.id}/edit`}
                            aria-label={`Edit ${user.fullName}`}
                            className="w-8 h-8 flex items-center justify-center border border-green-600 text-green-600 rounded hover:bg-green-600 hover:text-white transition-colors cursor-pointer"
                          >
                            <SquarePen className="w-4 h-4" />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit</p>
                        </TooltipContent>
                      </Tooltip>
                      </Can>
                      <Can feature="roles_permissions" action="delete">
                      <DeleteAdminUserDialog
                        id={user.id}
                        name={user.fullName}
                        disabled={isSelf}
                        disabledReason={
                          isSelf ? "You cannot delete your own account" : undefined
                        }
                      />
                      </Can>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="text-center text-gray-500 py-8">No admin users found.</p>
        )}
      </div>
    </TooltipProvider>
  );
};

export default AdminUsersTable;
