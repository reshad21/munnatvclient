import React from "react";
import mosque from "../../../../../public/siteicon.png";
import Image from "next/image";
const VideoGalleryHeader = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-4 mb-8">
      {/* Icon and label */}
      <div className="flex items-center gap-2 mb-2">
        <Image src={mosque} alt="gallery icon" width={52} height={52} unoptimized/>
        <span className="text-lg font-medium text-gray-700 -ml-5" style={{ fontFamily: 'Noto Sans Bengali, sans-serif' }}>Video Gallery</span>
      </div>
      {/* Main heading */}
      <h2 className="text-2xl md:text-3xl font-bold text-[#0f3d3e] text-center leading-tight">
        Our Memorable Moments Captured in the Video Gallery
      </h2>
    </div>
  );
};

export default VideoGalleryHeader;

