/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import { Play, X } from "lucide-react";
import { getYouTubeThumbnail, getYouTubeVideoId } from "@/utils/youtube-utils";

export interface VideoGalleryCardProps {
  id: string;
  title: string;
  videoUrl: string;
  createdAt?: string;
}

const VideoGalleryCard: React.FC<VideoGalleryCardProps> = ({
  ...videoGallery
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const videoId = getYouTubeVideoId(videoGallery.videoUrl);

  const handlePlayClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Card */}
      <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer">
        {/* Thumbnail Container */}
        <div
          className="relative aspect-video overflow-hidden bg-gray-100"
          onClick={handlePlayClick}
        >
          <img
            src={getYouTubeThumbnail(videoGallery?.videoUrl, "default")}
            alt={videoGallery.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg?height=360&width=480";
            }}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 shadow-lg">
              <Play
                className="w-8 h-8 text-[#0f3d3e] ml-1"
                fill="currentColor"
              />
            </div>
          </div>

          {/* Duration Badge (Optional) */}
          <div className="absolute bottom-3 right-3 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
            YouTube
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-2 group-hover:text-[#0f3d3e] transition-colors">
            {videoGallery.title}
          </h3>
          {videoGallery.createdAt && (
            <p className="text-sm text-gray-500">
              {new Date(videoGallery.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
        </div>
      </div>

      {/* Video Modal */}
      {isModalOpen && videoId && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={handleCloseModal}
        >
          <div
            className="relative w-full max-w-5xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              aria-label="Close video"
            >
              <X className="w-8 h-8" />
            </button>

            {/* YouTube Embed */}
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title={videoGallery.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-in-out;
        }
      `}</style>
    </>
  );
};

export default VideoGalleryCard;
