"use client";

import { createGallery } from "@/services/gallery";
import { showErrorToast, showSuccessToast } from "@/utils/toastMessage";
import { ImageIcon, Save, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {  useForm } from "react-hook-form";

interface GalleryFormData {
  image: File | null;
  status?: boolean;
}

export default function CreateGalleryForm() {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<GalleryFormData>({
    defaultValues: {
      image: null,
      status: true,
    },
  });


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

 
  const handleRemoveImage = () => {
    setImagePreview(null);
    setValue("image", null);
  };

  const onSubmit = async (data: GalleryFormData) => {
    const formData = new FormData();
    // Ensure status is a boolean string, default to true if undefined
    formData.append("status", String(data.status === undefined ? true : data.status));
    if (data.image) {
      formData.append("image", data.image);
    }

    const res = await createGallery(formData);
    if (res.statusCode === 201) {
      showSuccessToast(res.message);
      reset();
      router.push("/dashboard/gallery");
    } else {
      showErrorToast(res.message);
    }
  };

  const handleClose = () => {
    router.push("/dashboard/gallery");
  };

  return (
    <div className="bg-[#f8f9fa] rounded-2xl p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Upload Image <span className="text-red-500">*</span>
          </label>
          <div className="w-32 h-28 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#0f3d3e] transition-colors overflow-hidden relative">
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
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                >
                  <X className="w-3 h-3" />
                </button>
              </>
            ) : (
              <>
                <ImageIcon className="w-8 h-8 text-gray-400 mb-1" />
                <span className="text-sm text-gray-500 border border-gray-300 rounded px-3 py-1">
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
          {/* Status toggle (optional) */}
          {/*
          <div className="mt-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={!!watch("status")}
                onChange={e => setValue("status", e.target.checked)}
                className="form-checkbox"
              />
              <span className="ml-2 text-sm">Active</span>
            </label>
          </div>
          */}
          {/* Show error if image is required and not provided */}
          {errors.image && (
            <p className="text-red-500 text-xs mt-1">{errors.image?.message || "Image is required."}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            className="flex items-center gap-2 bg-[#0f3d3e] text-white px-5 py-2.5 rounded-full hover:bg-[#0a2e2f] transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span className="font-medium">Save</span>
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="flex items-center gap-2 bg-red-500 text-white px-5 py-2.5 rounded-full hover:bg-red-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span className="font-medium">Close</span>
          </button>
        </div>
      </form>
    </div>
  );
}
