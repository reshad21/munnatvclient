"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Eye, EyeOff, Save, X, Upload } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface RoleFormData {
  name: string;
  description: string;
  email: string;
  password: string;
  confirmPassword: string;
  image: File | null;
}

interface EditRoleFormProps {
  initialData: {
    id: number;
    name: string;
    description: string;
    email: string;
    image: string | null;
  };
}

const EditRoleForm = ({ initialData }: EditRoleFormProps) => {
  const [existingImage, setExistingImage] = useState<string | null>(initialData.image);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<RoleFormData>({
    defaultValues: {
      name: initialData.name,
      description: initialData.description,
      email: initialData.email,
      password: "",
      confirmPassword: "",
      image: null,
    },
  });

  const password = watch("password");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreview(reader.result as string);
        setExistingImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeExistingImage = () => {
    setExistingImage(null);
  };

  const removeNewImage = () => {
    setValue("image", null);
    setNewImagePreview(null);
  };

  const onSubmit = (data: RoleFormData) => {
    console.log("Updated role data:", data);
    console.log("Existing image:", existingImage);
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block text-gray-700 mb-2">Name</label>
          <Controller
            name="name"
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
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 mb-2">Description</label>
          <Controller
            name="description"
            control={control}
            rules={{ required: "Description is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Enter description"
                className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#0f3d3e]"
              />
            )}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
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

        {/* Password */}
        <div>
          <label className="block text-gray-700 mb-2">Password (Leave blank to keep current)</label>
          <div className="relative">
            <Controller
              name="password"
              control={control}
              rules={{
                minLength: { value: 6, message: "Password must be at least 6 characters" },
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
                validate: (value) => !password || value === password || "Passwords do not match",
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
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
        </div>
      </div>

      {/* Upload Image */}
      <div className="mt-6">
        <label className="block text-gray-700 mb-2">Upload Image (Optional)</label>
        <div className="flex items-start gap-4 flex-wrap">
          <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#0f3d3e] transition-colors">
            <Upload className="w-8 h-8 text-gray-400" />
            <span className="text-sm text-gray-500 mt-2">Upload</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {existingImage && (
            <div className="relative w-32 h-32">
              <Image
                src={existingImage}
                alt="Existing"
                fill
                className="object-cover rounded-lg"
                unoptimized
              />
              <button
                type="button"
                onClick={removeExistingImage}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {newImagePreview && (
            <div className="relative w-32 h-32">
              <Image
                src={newImagePreview}
                alt="New Preview"
                fill
                className="object-cover rounded-lg"
                unoptimized
              />
              <button
                type="button"
                onClick={removeNewImage}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
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

export default EditRoleForm;
