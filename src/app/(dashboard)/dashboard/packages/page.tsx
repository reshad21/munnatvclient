import React from "react";
import { DashboardWrapper } from "../_components/DashboardWrapper";
import PackageTable from "./_components/PackageTable";
import ListPageHeader from "@/components/shared/Dashboard/ListPageHeader";
import { TQuery } from "@/types/query.types";
import { getPackages } from "@/services/package";
import PaginationWrapper from "@/components/shared/PaginationWrapper";

const PackagesPage = async (props: {
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
      value: "5",
    },
  ];
  const packageData = await getPackages(query);
  return (
    <DashboardWrapper>
      <ListPageHeader
        title="Packages"
        feature="packages"
        createHref="/dashboard/packages/create"
      />
      <PackageTable packages={packageData?.data?.data} />

      {packageData?.data?.meta?.totalPages > 1 && (
        <PaginationWrapper
          active={page}
          totalPages={packageData?.data?.meta?.totalPages || 1}
          totalItems={packageData?.data?.meta?.totalItems || 0}
        />
      )}
    </DashboardWrapper>
  );
};

export default PackagesPage;
