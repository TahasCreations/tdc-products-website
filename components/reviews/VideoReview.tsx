'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, ThumbsUp, MessageSquare } from 'lucide-react';

interface VideoReviewProps {
  review: {
    id: string;
    videoUrl: string;
    thumbnail: string;
    author: {
      name: string;
      avatar: string;
      verified: boolean;
    };
    rating: number;
    title: string;
    likes: number;
    comments: number;
    views: number;
    duration: string;
  };
  onLike?: () => void;
  onComment?: () => void;
}

export default function VideoReview({ review, onLike, onComment }: VideoReviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl overflow-hidden shadow-lg border-2 border-gray-200 hover:border-indigo-300 transition-all"
    >
      {/* Video Player */}
      <div
        className="relative aspect-[9/16] bg-black cursor-pointer"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        onClick={handlePlayPause}
      >
        <video
          ref={videoRef}
          src={review.videoUrl}
          poster={review.thumbnail}
          className="w-full h-full object-cover"
          loop
          playsInline
          muted={isMuted}
        />

        {/* Play/Pause Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center"
            >
              <Play className="w-10 h-10 text-indigo-600 ml-1" />
            </motion.div>
          </div>
        )}

        {/* Controls */}
        {showControls && isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
          >
            <div className="flex items-center justify-between">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayPause();
                }}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMute();
                  }}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                >
                  {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFullscreen();
                  }}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                >
                  <Maximize className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Duration Badge */}
        <div className="absolute top-4 right-4 px-2 py-1 bg-black/70 text-white rounded text-xs font-bold">
          {review.duration}
        </div>

        {/* Rating */}
        <div className="absolute top-4 left-4 px-3 py-1 bg-yellow-500 text-white rounded-full text-sm font-bold flex items-center space-x-1">
          <span>⭐</span>
          <span>{review.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Author */}
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
            {review.author.avatar || review.author.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-900">{review.author.name}</span>
              {review.author.verified && (
                <span className="text-blue-500" title="Doğrulanmış Alıcı">✓</span>
              )}
            </div>
            <div className="text-xs text-gray-600">{review.views} görüntülenme</div>
          </div>
        </div>

        {/* Title */}
        <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">{review.title}</h4>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onLike}
            className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
          >
            <ThumbsUp className="w-4 h-4" />
            <span className="text-sm font-medium">{review.likes}</span>
          </button>

          <button
            onClick={onComment}
            className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm font-medium">{review.comments}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

