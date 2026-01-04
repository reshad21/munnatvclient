"use server";

import { apiRequest } from "@/lib/apiRequest";
import { TQuery } from "@/types/query.types";
import { revalidatePath } from "next/cache";

export const createFivePillars = async (payload: FormData) => {
  const response = await apiRequest("fivepillars", {
    method: "POST",
    body: payload,
    authRequired: true,
  });

  revalidatePath("/dashboard/fivepillar");

  return await response;
};

export const getFivePillars = async (query: TQuery[]) => {
  const params = new URLSearchParams();

  if (query.length > 1) {
    query.forEach((q) => {
      params.append(q.key, q.value);
    });
  }

  const response = await apiRequest(`fivepillars?${params.toString()}`, {
    method: "GET",
    authRequired: true,
  });

  return await response;
};

export const getFivePillarsById = async (id: string) => {
  const response = await apiRequest(`fivepillars/${id}`, {
    method: "GET",
    authRequired: true,
  });

  return await response;
};

export const updateFivePillars = async (id: string, payload: FormData) => {
  const response = await apiRequest(`fivepillars/${id}`, {
    method: "PUT",
    body: payload,
    authRequired: true,
  });

  revalidatePath("/dashboard/fivepillar");

  return await response;
};

export const deleteFivePillars = async (id: string | undefined) => {
  const response = await apiRequest(`fivepillars/${id}`, {
    method: "DELETE",
    authRequired: true,
  });

  revalidatePath("/dashboard/fivepillar");

  return await response;
};

export const updateFivePillarStatus = async (id: string, status: boolean) => {
  const response = await apiRequest(`fivepillars/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
    authRequired: true,
  });

  revalidatePath("/dashboard/fivepillar");

  return await response;
};