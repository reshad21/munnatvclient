"use client";
import { createPackages } from "@/services/package";
import { showErrorToast, showSuccessToast } from "@/utils/toastMessage";
import { ImageIcon, Save, X } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
const RichTextEditor = dynamic(
  () => import("@/components/shared/RichTextEditor"),
  { ssr: false }
);

interface PackageFormData {
  title: string;
  country: string;
  maxTravelers: string;
  minPax: string;
  duration: string;
  description: string;
  status: boolean;
  images: File[];
  travellPlace: string;
}

export default function CreatePackageForm() {
  const router = useRouter();
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<PackageFormData>({
    defaultValues: {
      title: "",
      country: "",
      maxTravelers: "",
      minPax: "",
      duration: "",
      description: "",
      status: true,
      images: [],
      travellPlace: "",
    },
  });

  const images = watch("images");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      const updatedImages = [...images, ...newFiles];
      setValue("images", updatedImages);

      // Generate previews for new files
      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
    // Reset input value to allow selecting same file again
    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setValue("images", updatedImages);
    setImagePreviews(updatedPreviews);
  };

  const onSubmit = async (data: PackageFormData) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("country", data.country);
    formData.append("maxTravelers", data.maxTravelers);
    formData.append("minPax", data.minPax);
    formData.append("duration", data.duration);
    formData.append("description", data.description);
    formData.append("travellPlace", data.travellPlace);
    formData.append("status", String(data.status));
    if (data.images && data.images.length > 0) {
      data.images.forEach((file) => {
        formData.append("images", file);
      });
    }
    const res = await createPackages(formData);
    if (res.statusCode === 201) {
      showSuccessToast(res.message);
      reset();
      router.push("/dashboard/packages");
    } else {
      showErrorToast(res.message);
    }
  };

  const handleClose = () => {
    router.push("/dashboard/packages");
  };

  return (
    <div className="bg-[#f8f9fa] rounded-2xl p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Title <span className="text-red-500">*</span>
          </label>
          <Controller
            name="title"
            control={control}
            rules={{ required: "Title is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Enter package title"
                className="w-full px-4 py-3 bg-transparent border-b border-gray-200 focus:outline-none focus:border-[#0f3d3e] transition-colors"
              />
            )}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        {/* Country Field */}
        {/* Travell Place Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Travell Place <span className="text-red-500">*</span>
          </label>
          <Controller
            name="travellPlace"
            control={control}
            rules={{ required: "Travell place is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Enter travel place"
                className="w-full px-4 py-3 bg-transparent border-b border-gray-200 focus:outline-none focus:border-[#0f3d3e] transition-colors"
              />
            )}
          />
          {errors.travellPlace && (
            <p className="text-red-500 text-sm">
              {errors.travellPlace.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Country <span className="text-red-500">*</span>
          </label>
          <Controller
            name="country"
            control={control}
            rules={{ required: "Country is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Enter country"
                className="w-full px-4 py-3 bg-transparent border-b border-gray-200 focus:outline-none focus:border-[#0f3d3e] transition-colors"
              />
            )}
          />
          {errors.country && (
            <p className="text-red-500 text-sm">{errors.country.message}</p>
          )}
        </div>

        {/* Max Travelers Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Max Travelers <span className="text-red-500">*</span>
          </label>
          <Controller
            name="maxTravelers"
            control={control}
            rules={{ required: "Max travelers is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Enter maximum number of travelers"
                className="w-full px-4 py-3 bg-transparent border-b border-gray-200 focus:outline-none focus:border-[#0f3d3e] transition-colors"
              />
            )}
          />
          {errors.maxTravelers && (
            <p className="text-red-500 text-sm">
              {errors.maxTravelers.message}
            </p>
          )}
        </div>

        {/* Min Pax Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Min Pax <span className="text-red-500">*</span>
          </label>
          <Controller
            name="minPax"
            control={control}
            rules={{ required: "Min pax is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Enter minimum pax"
                className="w-full px-4 py-3 bg-transparent border-b border-gray-200 focus:outline-none focus:border-[#0f3d3e] transition-colors"
              />
            )}
          />
          {errors.minPax && (
            <p className="text-red-500 text-sm">{errors.minPax.message}</p>
          )}
        </div>

        {/* Duration Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Duration <span className="text-red-500">*</span>
          </label>
          <Controller
            name="duration"
            control={control}
            rules={{ required: "Duration is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Enter package duration (e.g., 15 days)"
                className="w-full px-4 py-3 bg-transparent border-b border-gray-200 focus:outline-none focus:border-[#0f3d3e] transition-colors"
              />
            )}
          />
          {errors.duration && (
            <p className="text-red-500 text-sm">{errors.duration.message}</p>
          )}
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <Controller
            name="description"
            control={control}
            rules={{ required: "Description is required" }}
            render={({ field }) => (
              <div className="border border-gray-200 rounded-lg bg-white">
                <RichTextEditor value={field.value} onChange={field.onChange} />
              </div>
            )}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        {/* Image Upload Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Upload Images <span className="text-red-500">*</span>
          </label>
          <div className="w-full border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#0f3d3e] transition-colors overflow-hidden relative p-6">
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 w-full">
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
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
              style={{ zIndex: 2 }}
            />
            <div className="flex flex-col items-center justify-center z-1 pointer-events-none">
              <ImageIcon className="w-6 h-6 text-gray-400 mb-1" />
              <span className="text-xs text-gray-500 border border-gray-300 rounded px-3 py-1">
                Upload
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
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
