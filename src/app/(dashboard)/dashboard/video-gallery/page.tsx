import React from "react";
import { DashboardWrapper } from "../_components/DashboardWrapper";
import ListPageHeader from "@/components/shared/Dashboard/ListPageHeader";
import { TQuery } from "@/types/query.types";
import PaginationWrapper from "@/components/shared/PaginationWrapper";
import VideoGalleryTable from "./_components/VideoGalleryTable";
import { getVideoGalleries } from "@/services/video-gallery";

const VideoGalleryPage = async (props: {
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
  const videoGalleriesData = await getVideoGalleries(query);
  return (
    <DashboardWrapper>
      <ListPageHeader
        title="Video Gallery Services"
        feature="video-gallery"
        createHref="/dashboard/video-gallery/create"
      />
      <VideoGalleryTable videoGalleriesData={videoGalleriesData?.data?.data} />
      {videoGalleriesData?.data?.meta?.totalPages > 1 && (
        <PaginationWrapper
          active={page}
          totalPages={videoGalleriesData?.data?.meta?.totalPages || 1}
          totalItems={videoGalleriesData?.data?.meta?.totalItems || 0}
        />
      )}
    </DashboardWrapper>
  );
};

export default VideoGalleryPage;

