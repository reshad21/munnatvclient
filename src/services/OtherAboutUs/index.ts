"use server";

import { apiRequest } from "@/lib/apiRequest";
import { TQuery } from "@/types/query.types";
import { revalidatePath } from "next/cache";

export const createOtherAboutus = async (payload: FormData) => {
  const response = await apiRequest("other-about-us", {
    method: "POST",
    body: payload,
    authRequired: true,
  });

  ["/", "/about-us", "/dashboard/page-setting/other-about-us"].forEach((path) => {
    revalidatePath(path);
  });

  return await response;
};

export const getOtherAboutus = async (query: TQuery[]) => {
  const params = new URLSearchParams();

  if (query.length > 1) {
    query.forEach((q) => {
      params.append(q.key, q.value);
    });
  }

  const response = await apiRequest(`other-about-us?${params.toString()}`, {
    method: "GET",
    authRequired: true,
  });

  return await response;
};

export const getOtherAboutusById = async (id: string) => {
  const response = await apiRequest(`other-about-us/${id}`, {
    method: "GET",
    authRequired: true,
  });

  return await response;
};

export const updateOtherAboutus = async (id: string, payload: FormData) => {
  const response = await apiRequest(`other-about-us/${id}`, {
    method: "PUT",
    body: payload,
    authRequired: true,
  });

  ["/", "/about-us", "/dashboard/page-setting/other-about-us"].forEach((path) => {
    revalidatePath(path);
  });

  return await response;
};


