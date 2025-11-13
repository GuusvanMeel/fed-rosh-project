  import React from 'react'

  export default function VideoPanel({ source }: { source: string }) {
    const isYouTube = source.includes('youtube.com') || source.includes('youtu.be')

    if (isYouTube) {
      // Convert to embeddable YouTube link with autoplay + mute
      const embedUrl = isYouTube
      ? source
          .replace('watch?v=', 'embed/')
          .replace('youtu.be/', 'www.youtube.com/embed/')
      : source

      return (
        <div className="w-full h-full rounded overflow-hidden flex items-center justify-center bg-black">
          <iframe
            src={embedUrl}
            title="YouTube video"
            className="w-full h-full object-contain rounded"
            allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )
    }

    // 🎥 Direct video (like Cloudinary or .mp4)
    return (
      <div className="w-full h-full rounded overflow-hidden pointer-events-none select-none flex items-center justify-center bg-black">
        <video
          src={source}
          className="w-full h-full object-contain rounded"
          muted
          loop
          playsInline
        />
      </div>
    )
  }
