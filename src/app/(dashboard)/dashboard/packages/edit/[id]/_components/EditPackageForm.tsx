/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {  getPackagesById, updatePackages } from "@/services/package";
import { showErrorToast, showSuccessToast } from "@/utils/toastMessage";
import { ImageIcon, Save, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import { EditPackageFormProps, PackageFormData } from "@/types/package.interface";

const RichTextEditor = dynamic(() => import("@/components/shared/RichTextEditor"), { ssr: false });


export default function EditPackageForm({ packageId }: EditPackageFormProps) {
  const router = useRouter();
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // Fetch package data on component mount
  useEffect(() => {
    const fetchPackageData = async () => {
      try {
        setIsLoading(true);
        const response = await getPackagesById(packageId);
        
        if (response && response.data) {
          const packageData = response.data;
          
          // Reset form with fetched data
          reset({
            title: packageData.title || "",
            country: packageData.country || "",
            maxTravelers: String(packageData.maxTravelers || ""),
            minPax: String(packageData.minPax || ""),
            duration: packageData.duration || "",
            description: packageData.description || "",
            status: packageData.status ?? true,
            images: [],
            travellPlace: packageData.travellPlace || "",
          });
          
          // FIXED: Check for packageImages instead of images
          const imageArray = packageData.packageImages || packageData.images;
          
          if (imageArray && Array.isArray(imageArray) && imageArray.length > 0) {
            // Handle different image data formats
            const imageUrls = imageArray.map((img: any) => {
              // If it's already a string URL
              if (typeof img === 'string') {
                return img;
              }
              // If it's an object with image property (YOUR API FORMAT)
              if (img && typeof img === 'object' && img.image) {
                return img.image;
              }
              // If it's an object with url property
              if (img && typeof img === 'object' && img.url) {
                return img.url;
              }
              // If it's an object with path property
              if (img && typeof img === 'object' && img.path) {
                return img.path;
              }
              // If it's an object with imageUrl property
              if (img && typeof img === 'object' && img.imageUrl) {
                return img.imageUrl;
              }
              return null;
            }).filter(Boolean); // Remove any null/undefined values
            
            console.log("Processed image URLs:", imageUrls);
            setExistingImageUrls(imageUrls);
          } else {
            console.log("No images found in package data");
          }
          
          setImagePreviews([]);
        } else {
          showErrorToast("Failed to load package data");
        }
      } catch (error) {
        console.error("Error fetching package:", error);
        showErrorToast("Error loading package data");
      } finally {
        setIsLoading(false);
      }
    };

    if (packageId) {
      fetchPackageData();
    }
  }, [packageId, reset]);

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

  const handleRemoveExistingImage = (index: number) => {
    setExistingImageUrls((prev) => prev.filter((_, i) => i !== index));
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
    
    // Append existing image URLs that weren't removed
    if (existingImageUrls.length > 0) {
      existingImageUrls.forEach((url) => {
        formData.append("existingImages", url);
      });
    }
    
    // Append new images
    if (data.images && data.images.length > 0) {
      data.images.forEach((file) => {
        formData.append("images", file);
      });
    }


    try {
      const res = await updatePackages(packageId, formData);
      
      if (res.statusCode === 200 || res.statusCode === 201) {
        showSuccessToast(res.message || "Package updated successfully");
        reset();
        router.push("/dashboard/packages");
      } else {
        showErrorToast(res.message || "Failed to update package");
      }
    } catch (error) {
      console.error("Error updating package:", error);
      showErrorToast("An error occurred while updating the package");
    }
  };

  const handleClose = () => {
    router.push("/dashboard/packages");
  };

  if (isLoading) {
    return (
      <div className="bg-[#f8f9fa] rounded-2xl p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading package data...</div>
        </div>
      </div>
    );
  }

  // Calculate total images for better UI feedback
  const totalImages = existingImageUrls.length + imagePreviews.length;

  return (
    <div className="bg-[#f8f9fa] rounded-2xl p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Title</label>
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
                  <label className="block text-sm font-medium text-gray-700">Travell Place</label>
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
                    <p className="text-red-500 text-sm">{errors.travellPlace.message}</p>
                  )}
                </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Country</label>
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
          <label className="block text-sm font-medium text-gray-700">Max Travelers</label>
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
            <p className="text-red-500 text-sm">{errors.maxTravelers.message}</p>
          )}
        </div>

        {/* Min Pax Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Min Pax</label>
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
          <label className="block text-sm font-medium text-gray-700">Duration</label>
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
          <label className="block text-sm font-medium text-gray-700">Description <span className="text-red-500">*</span></label>
          
          <Controller
            name="description"
            control={control}
            rules={{ required: "Description is required" }}
            render={({ field }) => (
              <div className="border border-gray-200 rounded-lg bg-white">
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                />
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
            Upload Images {totalImages > 0 && <span className="text-gray-500">({totalImages} image{totalImages !== 1 ? 's' : ''})</span>}
          </label>
          <div className="w-full border border-dashed border-gray-300 rounded-lg p-6 hover:border-[#0f3d3e] transition-colors">
            {/* Image Grid - Always visible when there are images */}
            {totalImages > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {/* Existing Images from Server */}
                {existingImageUrls.map((url, index) => (
                  <div key={`existing-${index}`} className="relative aspect-square group">
                    <Image
                      src={url}
                      alt={`Existing ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                      unoptimized
                    />
                    <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      Existing
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(index)}
                      className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {/* New Images (Previews) */}
                {imagePreviews.map((preview, index) => (
                  <div key={`new-${index}`} className="relative aspect-square group">
                    <Image
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                      unoptimized
                    />
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      New
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Upload Area */}
            <div className="relative flex flex-col items-center justify-center cursor-pointer">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center pointer-events-none py-4">
                <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600 mb-1">Click to upload more images</span>
                <span className="text-xs text-gray-500">or drag and drop</span>
                <span className="text-xs text-gray-500 mt-2 border border-gray-300 rounded px-3 py-1">Choose Files</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            💡 You can remove existing images by clicking the X button when hovering over them
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="submit"
            className="flex items-center gap-2 bg-[#0f3d3e] text-white px-5 py-2.5 rounded-full hover:bg-[#0a2e2f] transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span className="font-medium">Update</span>
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