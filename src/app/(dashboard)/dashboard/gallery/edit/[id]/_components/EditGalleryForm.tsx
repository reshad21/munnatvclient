"use client";
import { getGalleryById, updateGallery } from "@/services/gallery";
import { showErrorToast, showSuccessToast } from "@/utils/toastMessage";
import { Save, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface EditGalleryFormProps {
  galleryId: string;
}

interface GalleryFormData {
  image: File | null;
}

export default function EditGalleryForm({ galleryId }: EditGalleryFormProps) {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
  } = useForm<GalleryFormData>({
    defaultValues: {
      image: null,
    },
  });

  // Load gallery image on component mount
  useEffect(() => {
    const fetchGallery = async () => {
      const res = await getGalleryById(galleryId);
      if (res?.data) {
        reset({ image: null });
        setImagePreview(res.data.image || null);
      }
    };
    fetchGallery();
  }, [galleryId, reset]);

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
    if (data.image) {
      formData.append("image", data.image);
    }
    const res = await updateGallery(galleryId, formData);
    if (res.statusCode === 200) {
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
        {/* Upload Image Label */}
        <p className="text-sm text-gray-600 mb-3">Upload Image</p>

        {/* Image Upload Area */}
        <div className="mb-6">
          {imagePreview ? (
            <div className="relative w-32 h-24 rounded-lg overflow-hidden">
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
                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-6 h-6 text-red-500" />
              </button>
            </div>
          ) : (
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <label className="w-32 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#0f3d3e] transition-colors">
                  <span className="text-gray-400 text-2xl">+</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      handleImageChange(e);
                      field.onChange(e);
                    }}
                    className="hidden"
                  />
                </label>
              )}
            />
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
