"use server";

import { apiRequest } from "@/lib/apiRequest";
import { TQuery } from "@/types/query.types";
import { revalidatePath } from "next/cache";

export const createHeroSection = async (payload: FormData) => {
  const response = await apiRequest("hero-section", {
    method: "POST",
    body: payload,
    authRequired: true,
  });

  ["/", "/dashboard/page-setting/hero-area"].forEach((path) => {
    revalidatePath(path);
  });

  return await response;
};

export const getHeroSection = async (query: TQuery[]) => {
  const params = new URLSearchParams();

  if (query.length > 1) {
    query.forEach((q) => {
      params.append(q.key, q.value);
    });
  }

  const response = await apiRequest(`hero-section?${params.toString()}`, {
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

export const updateHeroSection = async (id: string, payload: FormData) => {
  const response = await apiRequest(`hero-section/${id}`, {
    method: "PUT",
    body: payload,
    authRequired: true,
  });

  ["/", "/about-us", "/dashboard/page-setting/about-us"].forEach((path) => {
    revalidatePath(path);
  });

  return await response;
};


