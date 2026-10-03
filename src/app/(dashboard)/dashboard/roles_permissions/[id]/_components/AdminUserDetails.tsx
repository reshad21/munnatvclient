import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, SquarePen, User } from "lucide-react";
import Link from "next/link";
import { DashboardWrapper } from "../../../_components/DashboardWrapper";

interface RoleFeature {
  id?: string;
  name: string;
  path?: string;
  index?: number;
}

interface AdminUserDetailsProps {
  user: {
    id: string;
    fullName: string;
    email: string;
    profilePhoto?: string | null;
    status: "ACTIVE" | "INACTIVE";
    createdAt?: string;
    role?: {
      id: string;
      name: string;
      roleFeature?: RoleFeature[];
    };
  };
}

const formatDate = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  return isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
};

const AdminUserDetails = ({ user }: AdminUserDetailsProps) => {
  const features = user.role?.roleFeature ?? [];

  return (
    <DashboardWrapper>
      <div className="flex items-center justify-between mb-6">
        <Link href="/dashboard/roles_permissions">
          <Button
            variant="outline"
            className="flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admin Users
          </Button>
        </Link>
        <Link href={`/dashboard/roles_permissions/${user.id}/edit`}>
          <Button className="flex items-center gap-2 bg-brand hover:bg-brand/80 cursor-pointer">
            <SquarePen className="w-4 h-4" />
            Edit
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm max-w-3xl">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20 bg-[#0f3d3e]">
            <AvatarImage src={user.profilePhoto || undefined} alt={user.fullName} />
            <AvatarFallback className="bg-[#0f3d3e] text-white text-2xl">
              {user.fullName ? (
                user.fullName.charAt(0).toUpperCase()
              ) : (
                <User className="h-8 w-8 text-white" />
              )}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">{user.fullName}</h1>
            <p className="text-sm text-muted-foreground break-all">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{user.role?.name ?? "No role"}</Badge>
              <Badge
                variant="outline"
                className={
                  user.status === "ACTIVE"
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }
              >
                {user.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-sm">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-muted-foreground">Email</p>
            <p className="font-medium break-all">{user.email}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-muted-foreground">Assigned Role</p>
            <p className="font-medium">{user.role?.name ?? "—"}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-muted-foreground">Status</p>
            <p className="font-medium">{user.status}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-muted-foreground">Created</p>
            <p className="font-medium">{formatDate(user.createdAt)}</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Feature Access</h2>
            <Badge variant="outline" className="bg-primary/5 px-3 py-1 text-primary">
              {features.length} granted
            </Badge>
          </div>
          {features.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {features.map((feature, index) => (
                <span
                  key={feature.id || index}
                  className="text-sm border rounded-full px-3 py-1 text-gray-700"
                >
                  {feature.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No features granted.</p>
          )}
        </div>
      </div>
    </DashboardWrapper>
  );
};

export default AdminUserDetails;
