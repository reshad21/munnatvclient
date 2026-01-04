"use server";

import { apiRequest } from "@/lib/apiRequest";
import { TQuery } from "@/types/query.types";
import { revalidatePath } from "next/cache";

export const createReview = async (payload: FormData) => {
    const response = await apiRequest("reviews", {
        method: "POST",
        body: payload,
        authRequired: true,
    });
    revalidatePath("/dashboard/reviews");
    return await response;
};



export const getReviews = async (query: TQuery[]) => {
    const params = new URLSearchParams();
    if (query.length > 1) {
        query.forEach((q) => {
            params.append(q.key, q.value);
        });
    }
    const response = await apiRequest(`reviews?${params.toString()}`, {
        method: "GET",
        authRequired: true,
    });
    return await response;
};

export const getReviewById = async (id: string) => {
    const response = await apiRequest(`reviews/${id}`, {
        method: "GET",
        authRequired: true,
    });
    return await response;
};

export const updateReview = async (id: string, payload: FormData) => {
    const response = await apiRequest(`reviews/${id}`, {
        method: "PUT",
        body: payload,
        authRequired: true,
    });
    revalidatePath("/dashboard/reviews");
    return await response;
};

export const deleteReview = async (id: string | undefined) => {
    const response = await apiRequest(`reviews/${id}`, {
        method: "DELETE",
        authRequired: true,
    });
    revalidatePath("/dashboard/reviews");
    return await response;
};

export const updateReviewStatus = async (id: string, status: boolean) => {
    const response = await apiRequest(`reviews/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
        authRequired: true,
    });
    revalidatePath("/dashboard/reviews");
    return await response;
};
