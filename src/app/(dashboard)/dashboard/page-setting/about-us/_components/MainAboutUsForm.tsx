/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { Save, X, Upload } from "lucide-react";
import { createAboutus, updateAboutus } from "@/services/About-us";
import { showErrorToast, showSuccessToast } from "@/utils/toastMessage";
import { useRouter } from "next/navigation";

export interface AboutUsFormData {
  id: string;
  title: string;
  description: string;
  featureTitle1: string;
  featureShortDesc1: string;
  featureTitle2: string;
  featureShortDesc2: string;
  featureTitle3: string;
  featureShortDesc3: string;
  aboutUsImages: File[];
}

interface MainAboutUsFormProps {
  aboutusData?: Partial<AboutUsFormData>;
}

const MainAboutUsForm: React.FC<MainAboutUsFormProps> = ({ aboutusData }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEditing = !!aboutusData?.id;

  const [imagePreviews, setImagePreviews] = useState<string[]>(
    aboutusData?.aboutUsImages && Array.isArray(aboutusData.aboutUsImages)
      ? aboutusData.aboutUsImages.map((img: any) => img.image)
      : []
  );

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AboutUsFormData>({
    defaultValues: {
      title: aboutusData?.title || "",
      description: aboutusData?.description || "",
      featureTitle1: aboutusData?.featureTitle1 || "",
      featureShortDesc1: aboutusData?.featureShortDesc1 || "",
      featureTitle2: aboutusData?.featureTitle2 || "",
      featureShortDesc2: aboutusData?.featureShortDesc2 || "",
      featureTitle3: aboutusData?.featureTitle3 || "",
      featureShortDesc3: aboutusData?.featureShortDesc3 || "",
      aboutUsImages: [],
    },
  });

  const aboutUsImages = watch("aboutUsImages");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      const updatedImages = [...(aboutUsImages || []), ...newFiles];
      setValue("aboutUsImages", updatedImages);

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
    const updatedImages = (aboutUsImages || []).filter((_: any, i: number) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setValue("aboutUsImages", updatedImages);
    setImagePreviews(updatedPreviews);
  };

  const onSubmit = async (data: AboutUsFormData) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("featureTitle1", data.featureTitle1);
      formData.append("featureShortDesc1", data.featureShortDesc1);
      formData.append("featureTitle2", data.featureTitle2);
      formData.append("featureShortDesc2", data.featureShortDesc2);
      formData.append("featureTitle3", data.featureTitle3);
      formData.append("featureShortDesc3", data.featureShortDesc3);

      // Only append images if new files were selected
      if (data.aboutUsImages && data.aboutUsImages.length > 0) {
        data.aboutUsImages.forEach((file) => {
          if (file) formData.append("images", file);
        });
      }
      let res;
      if (isEditing && aboutusData?.id) {
        formData.append("id", aboutusData.id); // Ensure id is in the body for update
        res = await updateAboutus(aboutusData.id, formData);
      } else {
        res = await createAboutus(formData);
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
            {isEditing ? "Edit About Us" : "Create About Us"}
          </h2>
        </div>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-gray-700 mb-2">
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
                  placeholder="write here..."
                  className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#0f3d3e]"
                  value={field.value ?? ""}
                />
              )}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <Controller
              name="description"
              control={control}
              rules={{ required: "Description is required" }}
              render={({ field }) => (
                <textarea
                  {...field}
                  placeholder="write here..."
                  className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#0f3d3e] min-h-[80px]"
                  value={field.value ?? ""}
                />
              )}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Features */}
          {[
            { title: "featureTitle1", desc: "featureShortDesc1" },
            { title: "featureTitle2", desc: "featureShortDesc2" },
            { title: "featureTitle3", desc: "featureShortDesc3" },
          ].map((field, idx) => (
            <div key={field.title} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">
                  Feature Title {idx + 1}
                </label>
                <Controller
                  name={field.title as "featureTitle1" | "featureTitle2" | "featureTitle3"}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="write here..."
                      className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#0f3d3e]"
                      value={field.value ?? ""}
                    />
                  )}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">
                  Feature Short Description {idx + 1}
                </label>
                <Controller
                  name={field.desc as "featureShortDesc1" | "featureShortDesc2" | "featureShortDesc3"}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="write here..."
                      className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#0f3d3e]"
                      value={field.value ?? ""}
                    />
                  )}
                />
              </div>
            </div>
          ))}

          {/* Images */}
          <div>
            <label className="block text-gray-700 mb-2">Upload Images</label>
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
            className="flex items-center gap-2 bg-[#0f3d3e] text-white px-6 py-2 rounded-lg hover:bg-[#0f3d3e]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isPending
              ? isEditing
                ? "Updating..."
                : "Creating..."
              : isEditing
              ? "Update About Us"
              : "Create About Us"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MainAboutUsForm;