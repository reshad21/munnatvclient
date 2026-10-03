import React from "react";
import { DashboardWrapper } from "../_components/DashboardWrapper";
import ReviewsTable from "./_components/ReviewsTable";
import ListPageHeader from "@/components/shared/Dashboard/ListPageHeader";
import { getReviews } from "@/services/review";
import { TQuery } from "@/types/query.types";
import PaginationWrapper from "@/components/shared/PaginationWrapper";

const ReviewPage = async (props: { searchParams: Promise<{ search: string; page: string }> }) => {
  const searchParams = await props.searchParams;
  const search = searchParams.search || "";
  const page = parseInt(searchParams.page) || 1;
  const query: TQuery[] = [
    { key: "orderBy", value: JSON.stringify({ createdAt: "desc" }) },
    { key: "searchTerm", value: search },
    { key: "page", value: page.toString() },
    { key: "limit", value: "10" },
  ];
  const reviewsData = await getReviews(query);
  return (
    <DashboardWrapper>
      <ListPageHeader
        title="Reviews"
        feature="reviews"
        createHref="/dashboard/reviews/create"
      />
      <ReviewsTable reviewsData={reviewsData?.data?.data || []} />
      {reviewsData?.meta?.totalPages > 1 && (
        <PaginationWrapper
          active={page}
          totalPages={reviewsData?.meta?.totalPages || 1}
          totalItems={reviewsData?.meta?.totalItems || 0}
        />
      )}
    </DashboardWrapper>
  );
};

export default ReviewPage;
