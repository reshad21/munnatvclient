import React from "react";
import VideoGalleryCard, { VideoGalleryCardProps } from "./VideoGalleryCard";
import { getVideoGalleries } from "@/services/video-gallery";

const VideoGallerySection = async () => {
  const videoGalleryRes = await getVideoGalleries([]);
  const videoGalleries = videoGalleryRes?.data?.data || [];
  if (videoGalleries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">No videos available.</div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
      {videoGalleries?.map((videoGallery: VideoGalleryCardProps) => (
        <VideoGalleryCard key={videoGallery.id} {...videoGallery}/>
      ))}
    </div>
  );
};

export default VideoGallerySection;
