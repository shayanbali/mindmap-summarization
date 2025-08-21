import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, FileText, Clock, Tag, Brain } from 'lucide-react';
import { MindMapData } from '../types';
import TextToSpeechButton from './TextToSpeechButton';

interface VideoPlayerProps {
  videoUrl: string;
  onTimeUpdate?: (currentTime: number) => void;
  transcription?: TranscriptionChunk[];
  showSubtitles?: boolean;
  onToggleSubtitles?: () => void;
  subtitleSize?: 'small' | 'medium' | 'large';
  onSubtitleSizeChange?: (size: 'small' | 'medium' | 'large') => void;
  mindMapData?: MindMapData;
  currentTime?: number;
}

interface TranscriptionChunk {
  timestamp: [number, number];
  text: string;
}

export interface VideoPlayerRef {
  seekTo: (time: number) => void;
  getCurrentTime: () => number;
}

const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
  ({ videoUrl, onTimeUpdate, transcription = [], showSubtitles = false, onToggleSubtitles, subtitleSize = 'medium', onSubtitleSizeChange, mindMapData, currentTime: propCurrentTime = 0 }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [isMuted, setIsMuted] = React.useState(false);
    const [currentTime, setCurrentTime] = React.useState(0);
    const [duration, setDuration] = React.useState(0);
    const [isFullscreen, setIsFullscreen] = React.useState(false);
    const [showSizeControls, setShowSizeControls] = React.useState(false);
    const [fullscreenSidebarTab, setFullscreenSidebarTab] = React.useState<'summary' | 'transcription' | 'nodes'>('summary');

    // Find current transcription chunk
    const getCurrentTranscription = () => {
      return transcription.find(chunk => 
        currentTime >= chunk.timestamp[0] && currentTime < chunk.timestamp[1]
      );
    };

    // Find current active node
    const getCurrentActiveNode = () => {
      if (!mindMapData) return null;
      return mindMapData.nodes.find(node => 
        currentTime >= node.timestamp[0] && currentTime < node.timestamp[1]
      );
    };

    const currentTranscription = getCurrentTranscription();
    const currentActiveNode = getCurrentActiveNode();

    // Get subtitle size classes
    const getSubtitleSizeClasses = () => {
      switch (subtitleSize) {
        case 'small':
          return isFullscreen ? 'text-base' : 'text-[10px] sm:text-xs';
        case 'large':
          return isFullscreen ? 'text-4xl' : 'text-lg sm:text-2xl';
        default: // medium
          return isFullscreen ? 'text-2xl' : 'text-sm sm:text-lg';
      }
    };

    const getSubtitleTimeSizeClasses = () => {
      switch (subtitleSize) {
        case 'small':
          return isFullscreen ? 'text-xs' : 'text-[8px] sm:text-[10px]';
        case 'large':
          return isFullscreen ? 'text-xl' : 'text-xs sm:text-base';
        default: // medium
          return isFullscreen ? 'text-base' : 'text-[10px] sm:text-xs';
      }
    };

    const getSubtitleBoxSizeClasses = () => {
      switch (subtitleSize) {
        case 'small':
          return isFullscreen ? 'px-3 py-1.5 max-w-2xl' : 'px-1.5 py-0.5 max-w-xs sm:px-2 sm:py-1 sm:max-w-xl';
        case 'large':
          return isFullscreen ? 'px-8 py-4 max-w-6xl' : 'px-3 py-1.5 max-w-lg sm:px-6 sm:py-3 sm:max-w-4xl';
        default: // medium
          return isFullscreen ? 'px-6 py-3 max-w-5xl' : 'px-2 py-1 max-w-sm sm:px-4 sm:py-2 sm:max-w-3xl';
      }
    };

    useImperativeHandle(ref, () => ({
      seekTo: (time: number) => {
        if (videoRef.current) {
          videoRef.current.currentTime = time;
        }
      },
      getCurrentTime: () => currentTime,
    }));

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

    const handleTimeUpdate = () => {
      if (videoRef.current) {
        const time = videoRef.current.currentTime;
        setCurrentTime(time);
        onTimeUpdate?.(time);
      }
    };

    const handleLoadedMetadata = () => {
      if (videoRef.current) {
        setDuration(videoRef.current.duration);
      }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
      const time = parseFloat(e.target.value);
      if (videoRef.current) {
        videoRef.current.currentTime = time;
        setCurrentTime(time);
      }
    };

    const handleFullscreen = async () => {
      if (!containerRef.current) return;

      try {
        if (!document.fullscreenElement) {
          await containerRef.current.requestFullscreen();
          setIsFullscreen(true);
        } else {
          await document.exitFullscreen();
          setIsFullscreen(false);
        }
      } catch (error) {
        console.error('Fullscreen error:', error);
      }
    };

    // Listen for fullscreen changes
    React.useEffect(() => {
      const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
      };

      document.addEventListener('fullscreenchange', handleFullscreenChange);
      return () => {
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
      };
    }, []);
    const handleSubtitleSizeChange = (size: 'small' | 'medium' | 'large') => {
      onSubtitleSizeChange?.(size);
      setShowSizeControls(false);
    };

    const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
      <div 
        ref={containerRef}
        className={`relative bg-black overflow-hidden shadow-2xl ${
          isFullscreen ? 'w-screen h-screen fixed inset-0 z-50 m-0 p-0' : 'rounded-xl'
        }`}
      >
        {/* Logo in Fullscreen Mode - Top Left */}
        {isFullscreen && (
          <div className="absolute top-2 left-0 z-20 flex items-center space-x-3 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">VideoMind</h1>
              <p className="text-sm text-blue-200">AI-Powered Video Summarization</p>
            </div>
          </div>
        )}

        {/* Subtitle Toggle Button - Top Right */}
        {transcription && Array.isArray(transcription) && transcription.length > 0 && onToggleSubtitles && onSubtitleSizeChange && (
          <div className={`absolute top-2 right-2 sm:top-4 sm:right-4 z-20 flex items-center gap-1 sm:gap-2 ${isFullscreen ? 'right-0 top-2' : ''}`}>
            {/* Subtitle Toggle Button */}
            <button
              onClick={onToggleSubtitles}
              tabIndex={0}
              role="button"
              aria-label={showSubtitles ? "Hide subtitles" : "Show subtitles"}
              aria-pressed={showSubtitles}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 border backdrop-blur-sm ${
                showSubtitles
                  ? 'bg-blue-700/90 text-white border-blue-700 hover:bg-blue-800/90 focus:ring-2 focus:ring-blue-500'
                  : 'bg-white/90 text-gray-800 border-gray-400 hover:bg-blue-50/90 hover:border-blue-500 focus:ring-2 focus:ring-blue-500'
              }`}
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <text x="12" y="16" textAnchor="middle" fontSize="12" fontWeight="bold" fill="currentColor">CC</text>
              </svg>
              <span className="hidden md:inline">
                Subtitle
              </span>
            </button>

            {/* Subtitle Size Controls */}
            {showSubtitles && (
              <div className="relative">
                <button
                  onClick={() => setShowSizeControls(!showSizeControls)}
                  tabIndex={0}
                  role="button"
                  aria-label="Subtitle size options"
                  aria-expanded={showSizeControls}
                  className="flex items-center gap-1 px-1.5 sm:px-2 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 border backdrop-blur-sm bg-white/90 text-gray-700 border-gray-300 hover:bg-blue-50/90 hover:border-blue-400"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <span className="text-xs font-bold hidden sm:inline">
                    {subtitleSize === 'small' ? 'S' : subtitleSize === 'large' ? 'L' : 'M'}
                  </span>
                </button>

                {/* Size Dropdown */}
                {showSizeControls && (
                  <div 
                    className="absolute top-full right-0 mt-1 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-300 overflow-hidden min-w-[120px]"
                    role="menu"
                    aria-label="Subtitle size options"
                  >
                    <button
                      onClick={() => handleSubtitleSizeChange('small')}
                      role="menuitem"
                      tabIndex={0}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-blue-50 transition-colors ${
                        subtitleSize === 'small' ? 'bg-blue-100 text-blue-900 font-medium' : 'text-gray-800'
                      }`}
                    >
                      Small
                    </button>
                    <button
                      onClick={() => handleSubtitleSizeChange('medium')}
                      role="menuitem"
                      tabIndex={0}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-blue-50 transition-colors ${
                        subtitleSize === 'medium' ? 'bg-blue-100 text-blue-900 font-medium' : 'text-gray-800'
                      }`}
                    >
                      Medium
                    </button>
                    <button
                      onClick={() => handleSubtitleSizeChange('large')}
                      role="menuitem"
                      tabIndex={0}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-blue-50 transition-colors ${
                        subtitleSize === 'large' ? 'bg-blue-100 text-blue-900 font-medium' : 'text-gray-800'
                      }`}
                    >
                      Large
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        <video
          ref={videoRef}
          src={videoUrl}
          role="application"
          aria-label="Video player with synchronized mind map navigation"
          className={`${
            isFullscreen ? 'w-screen h-screen object-cover' : 'w-full h-auto max-h-[500px] rounded-xl object-contain aspect-video'
          }`}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        
        {/* Subtitle Overlay */}
        {showSubtitles && transcription && Array.isArray(transcription) && transcription.length > 0 && currentTranscription && (
          <div 
            className={`absolute flex justify-center pointer-events-none transition-all duration-200 ${
            isFullscreen ? 'left-8 right-8 bottom-24' : 'left-4 right-4 bottom-16'
          }`}
            role="region"
            aria-label="Video subtitles"
            aria-live="polite"
          >
            <div className={`bg-black/90 backdrop-blur-sm text-white rounded-lg transition-all duration-200 ${getSubtitleBoxSizeClasses()}`}>
              <div className="text-center">
                <p className={`font-medium leading-relaxed mb-1 ${getSubtitleSizeClasses()}`}>
                  {currentTranscription.text}
                </p>
                <div className={`text-gray-300 ${getSubtitleTimeSizeClasses()}`}>
                  {formatTime(currentTranscription.timestamp[0])} - {formatTime(currentTranscription.timestamp[1])}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent ${isFullscreen ? 'p-8' : 'p-4 rounded-b-xl'}`}>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={handlePlayPause}
              tabIndex={0}
              role="button"
              aria-label={isPlaying ? "Pause video" : "Play video"}
              className="p-1.5 sm:p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 flex-shrink-0"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              ) : (
                <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              )}
            </button>
            
            <button
              onClick={handleMute}
              tabIndex={0}
              role="button"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
              className="p-1.5 sm:p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 flex-shrink-0"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              ) : (
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              )}
            </button>
            
            <div className="flex-1 flex items-center space-x-1 sm:space-x-3 min-w-0">
              <span className="text-white text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                role="slider"
                aria-label="Video progress"
                aria-valuemin={0}
                aria-valuemax={duration}
                aria-valuenow={currentTime}
                aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
                className={`flex-1 bg-white/20 rounded-full appearance-none cursor-pointer slider transition-all duration-200 min-w-0 ${
                  isFullscreen ? 'h-3' : 'h-2'
                }`}
              />
              <span className="text-white text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0">
                {formatTime(duration)}
              </span>
            </div>
            
            <button 
              onClick={handleFullscreen}
              tabIndex={0}
              role="button"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              className="p-1.5 sm:p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 flex-shrink-0"
            >
              <Maximize className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;