"use client";

import { Button } from "@/components/ui/button";
import { updateAdminUser } from "@/services/auth";
import { showErrorToast, showSuccessToast } from "@/utils/toastMessage";
import { ArrowLeft, Eye, EyeOff, ImageIcon, Save, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { PulseLoader } from "react-spinners";
import { DashboardWrapper } from "../../../../_components/DashboardWrapper";

interface RoleOption {
  id: string;
  name: string;
}

interface AdminUserEditData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  profilePhoto: File | null;
  status: "ACTIVE" | "INACTIVE";
  roleId: string;
}

const EditAdminUserForm = ({
  user,
  id,
  roles = [],
  isCurrentUserSuperAdmin,
}: {
  user: {
    fullName: string;
    email: string;
    profilePhoto?: string | null;
    status: "ACTIVE" | "INACTIVE";
    roleId: string;
    role?: { id: string; name: string };
  };
  id: string;
  roles: RoleOption[];
  isCurrentUserSuperAdmin: boolean;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [imagePreview, setImagePreview] = useState<string | null>(
    user.profilePhoto ?? null
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AdminUserEditData>({
    defaultValues: {
      fullName: user.fullName ?? "",
      email: user.email ?? "",
      password: "",
      confirmPassword: "",
      profilePhoto: null,
      status: user.status ?? "ACTIVE",
      roleId: user.roleId ?? "",
    },
  });

  const password = watch("password");
  const isTargetSuperAdmin =
    (user.role?.name ?? "").toLowerCase() === "super admin";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("profilePhoto", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Clears the preview so a new file can be chosen. Submitting without
  // choosing a file keeps the existing avatar on the server.
  const handleRemoveImage = () => {
    setImagePreview(null);
    setValue("profilePhoto", null);
  };

  const onSubmit = async (data: AdminUserEditData) => {
    // Optional password: only sent when filled (same min-length rule as Create).
    if (data.password && data.password !== data.confirmPassword) {
      showErrorToast("Passwords do not match");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("status", data.status);
    formData.append("roleId", data.roleId);
    if (data.password) {
      formData.append("password", data.password);
    }
    if (data.profilePhoto) {
      formData.append("profilePhoto", data.profilePhoto);
    }

    startTransition(async () => {
      const result = await updateAdminUser(id, formData);
      if (result?.statusCode === 200) {
        showSuccessToast(result.message || "Admin user updated");
        router.push("/dashboard/roles_permissions");
        router.refresh();
      } else {
        showErrorToast(result?.message || "Failed to update admin user");
      }
    });
  };

  return (
    <DashboardWrapper>
      <Link href="/dashboard/roles_permissions">
        <div className="mb-6">
          <Button
            variant="outline"
            className="flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admin Users
          </Button>
        </div>
      </Link>

      <h1 className="text-2xl font-semibold text-[#0f3d3e] mb-6">Edit Admin User</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl p-6 shadow-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2">Name</label>
            <Controller
              name="fullName"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="Enter name"
                  className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#0f3d3e]"
                />
              )}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
              render={({ field }) => (
                <input
                  {...field}
                  type="email"
                  placeholder="Enter email"
                  className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#0f3d3e]"
                />
              )}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Role</label>
            <Controller
              name="roleId"
              control={control}
              rules={{ required: "Role is required" }}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#0f3d3e]"
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => {
                    const isSuperAdminOption =
                      role.name.toLowerCase() === "super admin";
                    return (
                      <option
                        key={role.id}
                        value={role.id}
                        disabled={isSuperAdminOption && !isCurrentUserSuperAdmin}
                      >
                        {role.name}
                      </option>
                    );
                  })}
                </select>
              )}
            />
            {errors.roleId && (
              <p className="text-red-500 text-sm mt-1">{errors.roleId.message}</p>
            )}
            {isTargetSuperAdmin && (
              <p className="text-sm text-muted-foreground mt-1">
                This is a Super Admin account. Only a Super Admin can edit it.
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Status</label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#0f3d3e]"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              )}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">
              New Password (leave blank to keep current)
            </label>
            <div className="relative">
              <Controller
                name="password"
                control={control}
                rules={{
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className="w-full border-b border-gray-200 py-2 pr-10 focus:outline-none focus:border-[#0f3d3e]"
                  />
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Confirm New Password</label>
            <div className="relative">
              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  validate: (value) =>
                    !password || value === password || "Passwords do not match",
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    className="w-full border-b border-gray-200 py-2 pr-10 focus:outline-none focus:border-[#0f3d3e]"
                  />
                )}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2 mt-6">
          <label className="block text-sm font-medium text-gray-700">
            Avatar (optional — replaces current)
          </label>
          <div className="w-28 h-28 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#0f3d3e] transition-colors overflow-hidden relative">
            {imagePreview ? (
              <>
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  aria-label="Reset avatar"
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                >
                  <X className="w-3 h-3" />
                </button>
              </>
            ) : (
              <>
                <ImageIcon className="w-6 h-6 text-gray-400 mb-1" />
                <span className="text-xs text-gray-500 border border-gray-300 rounded px-3 py-1">
                  Upload
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </>
            )}
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 bg-[#0f3d3e] text-white px-6 py-2 rounded-lg hover:bg-[#0f3d3e]/90 transition-colors cursor-pointer disabled:opacity-60"
          >
            {isPending ? (
              <PulseLoader color="#ffffff" size={8} />
            ) : (
              <>
                <Save className="w-4 h-4" />
                Update
              </>
            )}
          </button>
          <Link
            href="/dashboard/roles_permissions"
            className="flex items-center gap-2 bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
            Cancel
          </Link>
        </div>
      </form>
    </DashboardWrapper>
  );
};

export default EditAdminUserForm;
