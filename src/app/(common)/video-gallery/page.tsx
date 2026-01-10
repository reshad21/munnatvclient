import React from "react";
import HeroSection from "../_components/HeroSection";
import VideoGalleryHeader from "./_components/VideoGalleryHeader";
import VideoGallerySection from "./_components/VideoGallerySection";
import UiPaginationWrapper from "@/components/shared/UiPaginationWrapper";
import { TQuery } from "@/types/query.types";
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
    { key: "limit", value: "9" },
    { key: "filter", value: JSON.stringify({ status: true }) },
  ];

  const videoGalleryRes = await getVideoGalleries(query);
  const videoGalleries = videoGalleryRes?.data?.data || [];
  return (
    <div>
      <HeroSection title="Video Gallery" subtitle="Video Gallery" />
      <VideoGalleryHeader />
      <VideoGallerySection videoGalleryData={videoGalleries} />
      {videoGalleryRes?.data?.meta?.totalPages > 1 && (
        <UiPaginationWrapper
          active={page}
          totalPages={videoGalleryRes?.data?.meta?.totalPages || 1}
          totalItems={videoGalleryRes?.data?.meta?.totalItems || 0}
        />
      )}
    </div>
  );
};

export default VideoGalleryPage;
