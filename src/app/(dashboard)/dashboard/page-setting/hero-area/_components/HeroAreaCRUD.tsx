/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { Save, X, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { createHeroSection, updateHeroSection } from "@/services/Hero-section";
import { showErrorToast, showSuccessToast } from "@/utils/toastMessage";

export interface HeroSectionFormData {
  id?: string;
  subtitle: string;
  title: string;
  youtubeUrl: string;
  heroImages: File[];
  packageTitle?: string;
  serviceTitle?: string;
}

interface HeroAreaCRUDProps {
  heroData?: Partial<HeroSectionFormData>;
}

const HeroAreaCRUD: React.FC<HeroAreaCRUDProps> = ({ heroData }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEditing = !!heroData?.id;

  // Combine backend images and new uploads for preview
  const [imagePreviews, setImagePreviews] = useState<string[]>(() => {
    if (heroData && Array.isArray((heroData as any).images)) {
      return (heroData as any).images.map((img: any) => img.image);
    }
    if (heroData?.heroImages && Array.isArray(heroData.heroImages)) {
      return heroData.heroImages.map((img: any) => img.image);
    }
    return [];
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<HeroSectionFormData>({
    defaultValues: {
      subtitle: heroData?.subtitle || "",
      title: heroData?.title || "",
      youtubeUrl: heroData?.youtubeUrl || "",
      heroImages: [],
      packageTitle: heroData?.packageTitle || "",
      serviceTitle: heroData?.serviceTitle || "",
    },
  });

  const heroImages = watch("heroImages");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      const updatedImages = [...(heroImages || []), ...newFiles];
      setValue("heroImages", updatedImages);

      // Generate previews for new files
      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    // Remove from previews
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(updatedPreviews);
    // Remove from heroImages only if it's a new upload (not backend image)
    let backendCount = 0;
    if (heroData && Array.isArray((heroData as any).images)) {
      backendCount = (heroData as any).images.length;
    }
    if (index >= backendCount) {
      const updatedImages = (heroImages || []).filter((_: any, i: number) => i !== (index - backendCount));
      setValue("heroImages", updatedImages);
    }
  };

  const onSubmit = async (data: HeroSectionFormData) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("subtitle", data.subtitle);
      formData.append("title", data.title);
      formData.append("youtubeUrl", data.youtubeUrl);
      
      // Append new fields if they have values
      if (data.packageTitle) {
        formData.append("packageTitle", data.packageTitle);
      }
      if (data.serviceTitle) {
        formData.append("serviceTitle", data.serviceTitle);
      }

      // Only append images if new files were selected
      if (data.heroImages && data.heroImages.length > 0) {
        data.heroImages.forEach((file) => {
          if (file) formData.append("images", file);
        });
      }
      
      let res;
      if (isEditing && heroData?.id) {
        formData.append("id", heroData.id);
        res = await updateHeroSection(heroData.id, formData);
      } else {
        res = await createHeroSection(formData);
      }
      
      if (res.statusCode === (isEditing ? 200 : 201)) {
        showSuccessToast(res.message);
        router.refresh();
      } else {
        showErrorToast(res.message || "Something went wrong");
      }

    });
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl p-6 shadow-sm"
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditing ? "Edit Hero Section" : "Create Hero Section"}
          </h2>
        </div>

        <div className="space-y-4">
          {/* Package Title */}
          <div>
            <label className="block text-gray-700 mb-2">
              Package Title <span className="text-red-500">*</span>
            </label>
            <Controller
              name="packageTitle"
              control={control}
              rules={{ required: "Package Title is required" }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="Enter package title..."
                  className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#0f3d3e]"
                />
              )}
            />
            {errors.packageTitle && (
              <p className="text-red-500 text-sm mt-1">{errors.packageTitle.message}</p>
            )}
          </div>

          {/* Service Title */}
          <div>
            <label className="block text-gray-700 mb-2">
              Service Title <span className="text-red-500">*</span>
            </label>
            <Controller
              name="serviceTitle"
              control={control}
              rules={{ required: "Service Title is required" }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="Enter service title..."
                  className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#0f3d3e]"
                />
              )}
            />
            {errors.serviceTitle && (
              <p className="text-red-500 text-sm mt-1">{errors.serviceTitle.message}</p>
            )}
          </div>
          
          {/* Title */}
          <div>
            <label className="block text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <Controller
              name="title"
              control={control}
              rules={{ 
                required: "Title is required",
                minLength: {
                  value: 3,
                  message: "Title must be at least 3 characters"
                }
              }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="write here..."
                  className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#0f3d3e]"
                />
              )}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-gray-700 mb-2">
              Subtitle <span className="text-red-500">*</span>
            </label>
            <Controller
              name="subtitle"
              control={control}
              rules={{ 
                required: "Subtitle is required",
                minLength: {
                  value: 3,
                  message: "Subtitle must be at least 3 characters"
                }
              }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="write here..."
                  className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#0f3d3e]"
                />
              )}
            />
            {errors.subtitle && (
              <p className="text-red-500 text-sm mt-1">{errors.subtitle.message}</p>
            )}
          </div>

          {/* YouTube URL */}
          <div>
            <label className="block text-gray-700 mb-2">
              YouTube URL <span className="text-red-500">*</span>
            </label>
            <Controller
              name="youtubeUrl"
              control={control}
              rules={{ 
                required: "YouTube URL is required",
                pattern: {
                  value: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
                  message: "Please enter a valid YouTube URL"
                }
              }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#0f3d3e]"
                />
              )}
            />
            {errors.youtubeUrl && (
              <p className="text-red-500 text-sm mt-1">{errors.youtubeUrl.message}</p>
            )}
          </div>

          {/* Images */}
          <div>
            <label className="block text-gray-700 mb-2">Upload Multiple Images <span className="text-red-500">*</span></label>
            <div className="w-full border border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-[#0f3d3e] transition-colors">
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square">
                      <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <label className="flex flex-col items-center justify-center cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-500 mt-2">Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            type="submit"
            disabled={isPending}
            className="cursor-pointer flex items-center gap-2 bg-[#0f3d3e] text-white px-6 py-2 rounded-lg hover:bg-[#0f3d3e]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isPending
              ? isEditing
                ? "Updating..."
                : "Creating..."
              : isEditing
              ? "Update Hero Section"
              : "Create Hero Section"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HeroAreaCRUD;