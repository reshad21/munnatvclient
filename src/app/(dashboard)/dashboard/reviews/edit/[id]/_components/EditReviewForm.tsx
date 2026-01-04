"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { ImageIcon, Save, Star, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getReviewById, updateReview } from "@/services/review";
import { showErrorToast, showSuccessToast } from "@/utils/toastMessage";

interface ReviewFormData {
  name: string;
  designation: string;
  rating: number;
  description: string;
  image: File | null;
}

interface EditReviewFormProps {
  reviewId: string;
}

export default function EditReviewForm({ reviewId }: EditReviewFormProps) {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [hoverRating, setHoverRating] = useState(0);

  const { control, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ReviewFormData>({
    defaultValues: {
      name: "",
      designation: "",
      rating: 4,
      description: "",
      image: null,
    },
  });

  const currentRating = watch("rating");

  // Load review data on component mount
  useEffect(() => {
    const fetchReview = async () => {
      const res = await getReviewById(reviewId);
      if (res?.data) {
        reset({
          name: res.data.name || "",
          designation: res.data.designation || "",
          rating: res.data.rating || 4,
          description: res.data.description || "",
          image: null,
        });
        setImagePreview(res.data.image || null);
      }
    };
    fetchReview();
  }, [reviewId, reset]);

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

  const handleRatingClick = (rating: number) => {
    setValue("rating", rating);
  };

  const handleClose = () => {
    router.push("/dashboard/reviews");
  };

  const onSubmit = async (data: ReviewFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("designation", data.designation);
    formData.append("rating", String(data.rating));
    formData.append("description", data.description);
    if (data.image) {
      formData.append("image", data.image);
    }
    const res = await updateReview(reviewId, formData);
    if (res.statusCode === 200) {
      showSuccessToast(res.message);
      router.push("/dashboard/reviews");
    } else {
      showErrorToast(res.message || "Update failed");
    }
  };

  return (
    <div className="bg-[#f8f9fa] rounded-2xl p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Name is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="write here..."
                className="w-full px-4 py-3 bg-transparent border-b border-gray-200 focus:outline-none focus:border-[#0f3d3e] transition-colors"
              />
            )}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Designation Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Designation</label>
          <Controller
            name="designation"
            control={control}
            rules={{ required: "Designation is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="write here..."
                className="w-full px-4 py-3 bg-transparent border-b border-gray-200 focus:outline-none focus:border-[#0f3d3e] transition-colors"
              />
            )}
          />
          {errors.designation && (
            <p className="text-red-500 text-sm">{errors.designation.message}</p>
          )}
        </div>

        {/* Rating Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Add Rating</label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="cursor-pointer"
              >
                <Star
                  className={`w-6 h-6 transition-colors ${
                    star <= (hoverRating || currentRating)
                      ? "fill-orange-400 text-orange-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <Controller
            name="description"
            control={control}
            rules={{ required: "Description is required" }}
            render={({ field }) => (
              <textarea
                {...field}
                rows={4}
                placeholder="write here..."
                className="w-full px-4 py-3 bg-transparent border border-gray-200 rounded-lg focus:outline-none focus:border-[#0f3d3e] transition-colors resize-none"
              />
            )}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        {/* Image Upload Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Upload Image</label>
          <div className="w-24 h-24 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#0f3d3e] transition-colors overflow-hidden relative">
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
                <span className="text-xs text-gray-500 border border-gray-300 rounded px-2 py-0.5">Upload</span>
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