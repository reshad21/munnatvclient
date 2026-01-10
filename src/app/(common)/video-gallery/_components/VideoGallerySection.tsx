import React from "react";
import VideoGalleryCard, { VideoGalleryCardProps } from "./VideoGalleryCard";


const VideoGallerySection = async ({
  videoGalleryData = [],
}: {
  videoGalleryData: VideoGalleryCardProps[];
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto my-10">
      {videoGalleryData.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No videos available.
        </div>
      ) : (
        videoGalleryData?.map((videoGallery: VideoGalleryCardProps) => (
          <VideoGalleryCard key={videoGallery.id} {...videoGallery} />
        ))
      )}
    </div>
  );
};

export default VideoGallerySection;
