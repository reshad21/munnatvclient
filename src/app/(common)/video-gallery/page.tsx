import React from 'react'
import HeroSection from '../_components/HeroSection'
import VideoGalleryHeader from './_components/VideoGalleryHeader'
import VideoGallerySection from './_components/VideoGallerySection'

const VideoGalleryPage = () => {
  return (
    <div>
      <HeroSection title="Video Gallery" subtitle="Video Gallery" />
      <VideoGalleryHeader/>
      <VideoGallerySection/>
    </div>
  )
}

export default VideoGalleryPage
