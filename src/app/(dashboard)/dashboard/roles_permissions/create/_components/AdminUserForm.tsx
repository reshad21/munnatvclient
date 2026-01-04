"use client";

import { register } from "@/services/auth";
import { showErrorToast, showSuccessToast } from "@/utils/toastMessage";
import { Eye, EyeOff, ImageIcon, Save, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";


interface AdminUserData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  profilePhoto: File | null;
  status: boolean;
  roleId: string;
}

interface RoleData {
  id: string;
  name: string;
  status: string;
  isDeleted: boolean;
  createdAt: string;
}

const AdminUserForm = ({ roleData = [] }: { roleData: RoleData[] }) => {
  // const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { control, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<AdminUserData>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      profilePhoto: null,
      status: true,
      roleId: "",
    },
  });

  // const password = watch("password");
  // const confirmPassword = watch("confirmPassword");

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

  const handleRemoveImage = () => {
    setImagePreview(null);
    setValue("profilePhoto", null);
  };

  const onSubmit = async (data: AdminUserData) => {
    // Double-check passwords match before submitting
    if (data.password !== data.confirmPassword) {
      showErrorToast("Passwords do not match");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("status", data.status ? "ACTIVE" : "INACTIVE");
    formData.append("roleId", data.roleId);
    if (data.profilePhoto) {
      formData.append("profilePhoto", data.profilePhoto);
    }
    const res = await register(formData);
    if (res.statusCode === 201) {
      showSuccessToast(res.message);
      reset();
      setImagePreview(null);
      // router.push("/dashboard/roles_permissions");
    } else {
      showErrorToast(res.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
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
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
        </div>

        {/* Email */}
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
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        {/* Role Select */}
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
                {roleData.map((role: { id: string; name: string }) => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
            )}
          />
          {errors.roleId && <p className="text-red-500 text-sm mt-1">{errors.roleId.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-gray-700 mb-2">Password</label>
          <div className="relative">
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              }}
              render={({ field }) => (
                <input
                  {...field}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  className="w-full border-b border-gray-200 py-2 pr-10 focus:outline-none focus:border-[#0f3d3e]"
                />
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-gray-700 mb-2">Confirm Password</label>
          <div className="relative">
            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: "Please confirm your password",
                validate: (value) => {
                  const currentPassword = watch("password");
                  return value === currentPassword || "Passwords do not match";
                },
              }}
              render={({ field }) => (
                <input
                  {...field}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  className="w-full border-b border-gray-200 py-2 pr-10 focus:outline-none focus:border-[#0f3d3e]"
                />
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
        </div>
      </div>

      {/* Image Upload Field */}
      <div className="space-y-2 mt-6">
        <label className="block text-sm font-medium text-gray-700">Upload Image</label>
        <div className="w-28 h-28 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#0f3d3e] transition-colors overflow-hidden relative">
          {imagePreview ? (
            <>
              <Image src={imagePreview} alt="Preview" fill className="object-cover" unoptimized/>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10"
              >
                <X className="w-3 h-3" />
              </button>
            </>
          ) : (
            <>
              <ImageIcon className="w-6 h-6 text-gray-400 mb-1" />
              <span className="text-xs text-gray-500 border border-gray-300 rounded px-3 py-1">Upload</span>
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

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8">
        <button
          type="submit"
          className="flex items-center gap-2 bg-[#0f3d3e] text-white px-6 py-2 rounded-lg hover:bg-[#0f3d3e]/90 transition-colors cursor-pointer"
        >
          <Save className="w-4 h-4" />
          Save
        </button>
        <Link
          href="/dashboard/roles_permissions"
          className="flex items-center gap-2 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          <X className="w-4 h-4" />
          Close
        </Link>
      </div>
    </form>
  );
};

export default AdminUserForm;