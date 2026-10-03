import React from "react";
import { DashboardWrapper } from "../_components/DashboardWrapper";
import FivePillarsTable from "./_components/FivePillarsTable";
import ListPageHeader from "@/components/shared/Dashboard/ListPageHeader";
import { getFivePillars } from "@/services/fivePillar";
import { TQuery } from "@/types/query.types";
import PaginationWrapper from "@/components/shared/PaginationWrapper";

const FivePillarsOfIslamPage = async (props: {
  searchParams: Promise<{ search: string; page: string }>;
}) => {
  const searchParams = await props.searchParams;
  const search = searchParams.search || "";
  const page = parseInt(searchParams.page) || 1;
  const query: TQuery[] = [
    {
      key: "orderBy",
      value: JSON.stringify({
        createdAt: "desc",
      }),
    },
    {
      key: "searchTerm",
      value: search,
    },
    {
      key: "page",
      value: page.toString(),
    },
    {
      key: "limit",
      value: "10",
    },
  ];
  const fivePillarsData = await getFivePillars(query);
  return (
    <DashboardWrapper>
      <ListPageHeader
        title="Five Pillars of Islam"
        feature="fivePillarsOfIslam"
        createHref="/dashboard/fivePillarsOfIslam/create"
      />
      <FivePillarsTable fivePillarsData={fivePillarsData?.data?.data} />
      {fivePillarsData?.meta?.totalPages > 1 && (
        <PaginationWrapper
          active={page}
          totalPages={fivePillarsData?.meta?.totalPages || 1}
          totalItems={fivePillarsData?.meta?.totalItems || 0}
        />
      )}
    </DashboardWrapper>
  );
};

export default FivePillarsOfIslamPage;
