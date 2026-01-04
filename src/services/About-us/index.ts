"use server";

import { apiRequest } from "@/lib/apiRequest";
import { TQuery } from "@/types/query.types";
import { revalidatePath } from "next/cache";

export const createAboutus = async (payload: FormData) => {
  const response = await apiRequest("aboutus", {
    method: "POST",
    body: payload,
    authRequired: true,
  });

  ["/", "/about-us", "/dashboard/page-setting/about-us"].forEach((path) => {
    revalidatePath(path);
  });

  return await response;
};

export const getAboutus = async (query: TQuery[]) => {
  const params = new URLSearchParams();

  if (query.length > 1) {
    query.forEach((q) => {
      params.append(q.key, q.value);
    });
  }

  const response = await apiRequest(`aboutus?${params.toString()}`, {
    method: "GET",
    authRequired: true,
  });

  return await response;
};

export const getAboutusById = async (id: string) => {
  const response = await apiRequest(`aboutus/${id}`, {
    method: "GET",
    authRequired: true,
  });

  return await response;
};

export const updateAboutus = async (id: string, payload: FormData) => {
  const response = await apiRequest(`aboutus/${id}`, {
    method: "PUT",
    body: payload,
    authRequired: true,
  });

  ["/", "/about-us", "/dashboard/page-setting/about-us"].forEach((path) => {
    revalidatePath(path);
  });

  return await response;
};

export const deleteAboutus = async (id: string | undefined) => {
  const response = await apiRequest(`aboutus/${id}`, {
    method: "DELETE",
    authRequired: true,
  });

  ["/", "/about-us", "/dashboard/page-setting/about-us"].forEach((path) => {
    revalidatePath(path);
  });

  return await response;
};

export const addAboutusImage = async (data: FormData) => {
  const response = await apiRequest("aboutus/image", {
    method: "POST",
    body: data as FormData,
    authRequired: true,
  });

  ["/", "/about-us", "/dashboard/page-setting/about-us"].forEach((path) => {
    revalidatePath(path);
  });

  return await response;
};

export const deleteAboutusImage = async (imageId: string) => {
  const response = await apiRequest(`aboutus/image/${imageId}`, {
    method: "DELETE",
    authRequired: true,
  });

  ["/", "/about-us", "/dashboard/page-setting/about-us"].forEach((path) => {
    revalidatePath(path);
  });

  return await response;
};
