"use client";

import { Button } from "@/components/ui/button";
import { getBlogsById, updateBlogs } from "@/services/blog";
import { sanitizeHtml } from '@/utils/sanitizeHtml';
import { showErrorToast, showSuccessToast } from "@/utils/toastMessage";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface BlogFormData {
  author: string;
  title: string;
  shortDescription: string;
  description: string;
  image: File | null;
}

interface EditBlogFormProps {
  blogId: string;
}

export default function EditBlogForm({ blogId }: EditBlogFormProps) {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BlogFormData>({
    defaultValues: {
      author: "",
      title: "",
      shortDescription: "",
      description: "",
      image: null,
    },
  });

  useEffect(() => {
    const fetchBlog = async () => {
      const res = await getBlogsById(blogId);
      if (res?.data) {
        reset({
          author: res.data.author || "",
          title: res.data.title || "",
          shortDescription: res.data.shortDescription || "",
          description: res.data.description || "",
          image: null,
        });
        setImagePreview(res.data.image || null);
      }
    };
    fetchBlog();
  }, [blogId, reset]);

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

  const onSubmit = async (data: BlogFormData) => {
    const formData = new FormData();
    formData.append("author", data.author);
    formData.append("title", data.title);
    formData.append("shortDescription", data.shortDescription);
    formData.append("description", data.description);
    formData.append("status", "true");
    if (data.image) {
      formData.append("image", data.image);
    }
    const res = await updateBlogs(blogId, formData);
    if (res.statusCode === 200) {
      showSuccessToast(res.message);
      reset();
      router.push("/dashboard/blogs");
    } else {
      showErrorToast(res.message);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Author Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Author <span className="text-red-500">*</span>
          </label>
          <Controller
            name="author"
            control={control}
            rules={{ required: "Author is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Enter author name"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f3d3e] focus:border-transparent"
              />
            )}
          />
          {errors.author && (
            <p className="text-red-500 text-sm">{errors.author.message}</p>
          )}
        </div>

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
                placeholder="Enter blog title"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f3d3e] focus:border-transparent"
              />
            )}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        {/* Short Description Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Short Description <span className="text-red-500">*</span>
          </label>
          <Controller
            name="shortDescription"
            control={control}
            rules={{ required: "Short description is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Enter short description"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f3d3e] focus:border-transparent"
              />
            )}
          />
          {errors.shortDescription && (
            <p className="text-red-500 text-sm">{errors.shortDescription.message}</p>
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
              <textarea
                {...field}
                rows={5}
                placeholder="Enter blog description"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f3d3e] focus:border-transparent resize-none"
              />
            )}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
          {/* Preview rendered HTML for description */}
          <div className="prose max-w-none bg-gray-50 rounded p-2 mt-2">
            <label className="block text-xs text-gray-400 mb-1">Preview:</label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(field.value || '') }} />
              )}
            />
          </div>
        </div>

        {/* Image Upload Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Image <span className="text-red-500">*</span>
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
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-[#0f3d3e] hover:bg-[#0f3d3e]/90 text-white px-8 py-3 rounded-full"
          >
            Update Blog
          </Button>
        </div>
      </form>
    </div>
  );
}