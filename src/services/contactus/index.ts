"use server";

import { apiRequest } from "@/lib/apiRequest";
import { TQuery } from "@/types/query.types";
import { revalidatePath } from "next/cache";

export const createContactUs = async (payload: FormData) => {
  const response = await apiRequest("contactus", {
    method: "POST",
    body: payload,
    authRequired: true,
  });

  revalidatePath("/dashboard/page-setting/contactus");

  return await response;
};

export const getContactUs = async (query: TQuery[]) => {
  const params = new URLSearchParams();

  if (query.length > 1) {
    query.forEach((q) => {
      params.append(q.key, q.value);
    });
  }

  const response = await apiRequest(`contactus?${params.toString()}`, {
    method: "GET",
    authRequired: true,
  });

  return await response;
};

export const getContactUsById = async (id: string) => {
  const response = await apiRequest(`contactus/${id}`, {
    method: "GET",
    authRequired: true,
  });

  return await response;
};

export const updateContactUs = async (id: string, payload: FormData) => {
  const response = await apiRequest(`contactus/${id}`, {
    method: "PUT",
    body: payload,
    authRequired: true,
  });

  revalidatePath("/dashboard/page-setting/contactus");

  return await response;
};

export const deleteContactUs = async (id: string | undefined) => {
  const response = await apiRequest(`contactus/${id}`, {
    method: "DELETE",
    authRequired: true,
  });

  revalidatePath("/dashboard/page-setting/contactus");

  return await response;
};
