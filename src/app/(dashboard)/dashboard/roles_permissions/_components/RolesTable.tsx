"use client";

import { User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  password: string;
  profilePhoto: string;
  roleId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface RoleFeature {
  id: string;
  roleId: string;
  featureId: string;
  // Add other properties as needed
}

interface Role {
  id: string;
  name: string;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt?: string;
  adminUser?: AdminUser[];
  roleFeature?: RoleFeature[];
}

interface RolesTableProps {
  rolesData: Role[];
}

const RolesTable = ({ rolesData = [] }: RolesTableProps) => {
  const [roles, setRoles] = useState<Role[]>(rolesData);
  // Removed unused delete modal and related logic
  const toggleStatus = (id: string) => {
    setRoles((prev) =>
      prev.map((role) =>
        role.id === id 
          ? { ...role, status: role.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" } 
          : role
      )
    );
  };

  // Get the first admin user's profile photo if available
  const getProfilePhoto = (role: Role) => {
    if (role.adminUser && role.adminUser.length > 0 && role.adminUser[0].profilePhoto) {
      return role.adminUser[0].profilePhoto;
    }
    return null;
  };

  // Generate description based on number of users and features
  const getDescription = (role: Role) => {
    const userCount = role.adminUser?.length || 0;
    const featureCount = role.roleFeature?.length || 0;
    return `${userCount} user${userCount !== 1 ? 's' : ''}, ${featureCount} permission${featureCount !== 1 ? 's' : ''}`;
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-4 px-6 font-semibold text-gray-700">SN</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Image</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Name</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Description</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
              {/* <th className="text-left py-4 px-6 font-semibold text-gray-700">Action</th> */}
            </tr>
          </thead>
          <tbody className="text-sm">
            {roles.map((role, index) => {
              const profilePhoto = getProfilePhoto(role);
              return (
                <tr key={role.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-4 px-6 text-gray-600">{index + 1}</td>
                  <td className="py-4 px-6">
                    <div className="w-10 h-10 rounded-full bg-[#0f3d3e] flex items-center justify-center overflow-hidden">
                      {profilePhoto ? (
                        <Image 
                          src={profilePhoto} 
                          alt={role.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <User className="w-5 h-5 text-white" />
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-700">{role.name}</td>
                  <td className="py-4 px-6 text-[#0f3d3e]">{getDescription(role)}</td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => toggleStatus(role.id)}
                      className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${
                        role.status === "ACTIVE" ? "bg-[#0f3d3e]" : "bg-gray-300"
                      }`}
                    >
                      <span 
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                          role.status === "ACTIVE" ? "right-1" : "left-1"
                        }`} 
                      />
                    </button>
                  </td>

                  {/* Action Column */}
                  {/* <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/roles_permissions/permissions/${role.id}`}
                        className="w-8 h-8 flex items-center justify-center border border-[#0f3d3e] text-[#0f3d3e] rounded hover:bg-[#0f3d3e] hover:text-white transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/dashboard/roles_permissions/edit/${role.id}`}
                        className="w-8 h-8 flex items-center justify-center border border-[#0f3d3e] text-[#0f3d3e] rounded hover:bg-[#0f3d3e] hover:text-white transition-colors cursor-pointer"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <DeleteAdminUserDialog id={role.id} />
                    </div>
                  </td> */}

                </tr>
              );
            })}
          </tbody>
        </table>

      </div>

    </>
  );
};

export default RolesTable;