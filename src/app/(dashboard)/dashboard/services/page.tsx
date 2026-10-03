import React from "react";
import { DashboardWrapper } from "../_components/DashboardWrapper";
import ServiceTable from "./_components/ServiceTable";
import ListPageHeader from "@/components/shared/Dashboard/ListPageHeader";
import { getServices } from "@/services/service";
import { TQuery } from "@/types/query.types";
import PaginationWrapper from "@/components/shared/PaginationWrapper";

const ServicePage = async (props: {
  searchParams: Promise<{ search: string; page: string }>;
}) => {
  const searchParams = await props.searchParams;
  const search = searchParams.search || "";
  const page = parseInt(searchParams.page) || 1;
  const query: TQuery[] = [
    { key: "orderBy", value: JSON.stringify({ createdAt: "desc" }) },
    { key: "searchTerm", value: search },
    { key: "page", value: page.toString() },
    { key: "limit", value: "4" },
  ];
  const servicesData = await getServices(query);
  return (
    <DashboardWrapper>
      <ListPageHeader
        title="Services"
        feature="services"
        createHref="/dashboard/services/create"
      />
      <ServiceTable servicesData={servicesData?.data?.data} />
      {servicesData?.data?.meta?.totalPages > 1 && (
        <PaginationWrapper
          active={page}
          totalPages={servicesData?.data?.meta?.totalPages || 1}
          totalItems={servicesData?.data?.meta?.totalItems || 0}
        />
      )}
    </DashboardWrapper>
  );
};

export default ServicePage;
