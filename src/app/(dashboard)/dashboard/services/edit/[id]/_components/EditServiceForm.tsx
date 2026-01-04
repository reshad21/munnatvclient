"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ImageIcon, Save, X } from "lucide-react";
import Image from "next/image";

interface ServiceFormData {
  title: string;
  shortDescription: string;
  description: string;
  image: File | null;
}

interface EditServiceFormProps {
  serviceId: string;
}

import { getServiceById, updateService } from "@/services/service";
import { showErrorToast, showSuccessToast } from "@/utils/toastMessage";
import RichTextEditor from "@/components/shared/RichTextEditor";
import HtmlConverter from "@/utils/htmlConverter";

export default function EditServiceForm({ serviceId }: EditServiceFormProps) {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { control, handleSubmit, setValue, reset, watch } =
    useForm<ServiceFormData>({
      defaultValues: {
        title: "",
        shortDescription: "",
        description: "",
        image: null,
      },
    });

  useEffect(() => {
    const fetchService = async () => {
      const res = await getServiceById(serviceId);
      if (res?.data) {
        reset({
          title: res.data.title || "",
          shortDescription: res.data.shortDescription || "",
          description: res.data.description || "",
          image: null,
        });
        setImagePreview(res.data.image || null);
      }
    };
    fetchService();
  }, [serviceId, reset]);

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

  const onSubmit = async (data: ServiceFormData) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("shortDescription", data.shortDescription);
    formData.append("description", data.description);
    if (data.image) {
      formData.append("image", data.image);
    }
    const res = await updateService(serviceId, formData);
    console.log("see update info==>",res)
    if (res.statusCode === 200) {
      showSuccessToast(res.message);
      reset();
      router.push("/dashboard/services");
    } else {
      showErrorToast(res.message || "Update failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Title</label>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              placeholder="write here..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f3d3e]/20 focus:border-[#0f3d3e] transition-colors"
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Short Description
        </label>
        <Controller
          name="shortDescription"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              placeholder="write here..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f3d3e]/20 focus:border-[#0f3d3e] transition-colors"
            />
          )}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Preview Description
        </label>
        <span className="">
          <HtmlConverter html={watch("description") || ""} />
        </span>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <RichTextEditor value={field.value} onChange={field.onChange} />
          )}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Upload Image
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

      <div className="flex items-center justify-end gap-3 pt-4">
        <button
          type="submit"
          className="flex items-center gap-2 bg-[#0f3d3e] text-white px-6 py-2.5 rounded-full hover:bg-[#0a2e2f] transition-colors cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Update</span>
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 bg-red-500 text-white px-6 py-2.5 rounded-full hover:bg-red-600 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
          <span>Close</span>
        </button>
      </div>
    </form>
  );
}
