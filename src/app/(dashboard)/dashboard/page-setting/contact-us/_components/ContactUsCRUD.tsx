"use client";

import React, { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { Save, Upload, X } from "lucide-react";
import Image from "next/image";
import { createContactUs, updateContactUs } from "@/services/contactus";
import { showErrorToast, showSuccessToast } from "@/utils/toastMessage";
import { useRouter } from "next/navigation";
import { ContactUsData, ContactUsFormData } from "@/types/contactu.interface";


const ContactUsCRUD = ({ contactUsData }: { contactUsData: ContactUsData }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEditing = !!contactUsData?.id;
  
  const [imagePreview, setImagePreview] = useState<string | null>(
    contactUsData?.image || null
  );

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ContactUsFormData>({
    defaultValues: {
      subTitle: contactUsData?.subTitle || "",
      title: contactUsData?.title || "",
      companyNumber: contactUsData?.companyNumber || "",
      companyEmail: contactUsData?.companyEmail || "",
      companyLocation: contactUsData?.companyLocation || "",
      facebookLink: contactUsData?.facebookUrl || "",
      instagramLink: contactUsData?.instagramUrl || "",
      youtubeLink: contactUsData?.youtubeUrl || "",
      image: null,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setValue("image", file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const removeImage = () => {
    setValue("image", null);
    setImagePreview(contactUsData?.image || null);
  };

  const onSubmit = async (data: ContactUsFormData) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("subTitle", data.subTitle);
      formData.append("title", data.title);
      formData.append("companyNumber", data.companyNumber);
      formData.append("companyEmail", data.companyEmail);
      formData.append("companyLocation", data.companyLocation);
      formData.append("facebookUrl", data.facebookLink);
      formData.append("instagramUrl", data.instagramLink);
      formData.append("youtubeUrl", data.youtubeLink);

      // Only append image if a new file was selected
      if (data.image) {
        formData.append("image", data.image);
      }

      const res = isEditing
        ? await updateContactUs(contactUsData.id, formData)
        : await createContactUs(formData);

      if (res.statusCode === (isEditing ? 200 : 201)) {
        showSuccessToast(res.message);
        router.refresh();
      } else {
        showErrorToast(res.message);
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
            {isEditing ? "Edit Contact Us" : "Create Contact Us"}
          </h2>
        </div>

        <div className="space-y-4">
          <div>
              <label className="block text-gray-700 mb-2">Footer Message <span className="text-red-500">*</span></label>
            <Controller
              name="subTitle"
              control={control}
              rules={{ required: "Sub Title is required" }}
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
            {errors.subTitle && (
              <p className="text-red-500 text-sm mt-1">
                {errors.subTitle.message}
              </p>
            )}
          </div>

          <div>
              <label className="block text-gray-700 mb-2">Copyright text <span className="text-red-500">*</span></label>
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

          <div>
              <label className="block text-gray-700 mb-2">Company Phone <span className="text-red-500">*</span></label>
            <Controller
              name="companyNumber"
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
              <label className="block text-gray-700 mb-2">Company Email <span className="text-red-500">*</span></label>
            <Controller
              name="companyEmail"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="email"
                  placeholder="write here..."
                  className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-[#0f3d3e]"
                  value={field.value ?? ""}
                />
              )}
            />
          </div>

          <div>
              <label className="block text-gray-700 mb-2">Company Location <span className="text-red-500">*</span></label>
            <Controller
              name="companyLocation"
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
              <label className="block text-gray-700 mb-2">Facebook Link <span className="text-red-500">*</span></label>
            <Controller
              name="facebookLink"
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
              <label className="block text-gray-700 mb-2">Instagram Link <span className="text-red-500">*</span></label>
            <Controller
              name="instagramLink"
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
              <label className="block text-gray-700 mb-2">YouTube Link <span className="text-red-500">*</span></label>
            <Controller
              name="youtubeLink"
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

          <div className="flex flex-col items-center">
            <label className="block text-gray-700 mb-2">Upload Logo<span className="text-red-500">*</span></label>
            <div className="relative flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#0f3d3e] transition-colors">
              <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover rounded-lg"
                      unoptimized
                    />
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-500 mt-2">Upload</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            {imagePreview && (
              <button
                type="button"
                onClick={removeImage}
                className="mt-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
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
              ? "Update Contact Us"
              : "Create Contact Us"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactUsCRUD;