import React from 'react';
import { TranscriptionChunk } from '../types';
import { Subtitles, Eye, EyeOff, Clock } from 'lucide-react';

interface TranscriptionPanelProps {
  transcription: TranscriptionChunk[];
  currentTime: number;
  isVisible: boolean;
  onToggleVisibility: () => void;
  className?: string;
}

const TranscriptionPanel: React.FC<TranscriptionPanelProps> = ({
  transcription,
  currentTime,
  isVisible,
  onToggleVisibility,
  className = ""
}) => {
  // Find the current transcription chunk based on current time
  const getCurrentTranscription = () => {
    return transcription.find(chunk => 
      currentTime >= chunk.timestamp[0] && currentTime < chunk.timestamp[1]
    );
  };

  const currentChunk = getCurrentTranscription();
  const currentIndex = transcription.findIndex(chunk => 
    currentTime >= chunk.timestamp[0] && currentTime < chunk.timestamp[1]
  );

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isVisible) {
    return (
      <div className={`bg-white rounded-xl shadow-lg border border-gray-200 ${className}`}>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Subtitles className="w-5 h-5 text-gray-400" />
            <span className="text-gray-500 font-medium">Transcription Hidden</span>
          </div>
          <button
            onClick={onToggleVisibility}
            className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all duration-200 hover:scale-105"
            title="Show transcription"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-200 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Subtitles className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Live Transcription</h3>
              <p className="text-sm text-gray-600">
                {transcription.length} segments • Synced with video
              </p>
            </div>
          </div>
          <button
            onClick={onToggleVisibility}
            className="p-2 bg-white hover:bg-gray-50 text-gray-600 rounded-lg transition-all duration-200 hover:scale-105 border border-gray-200"
            title="Hide transcription"
          >
            <EyeOff className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Current Transcription Display */}
      <div className="p-6">
        {currentChunk ? (
          <div className="space-y-4">
            {/* Current Text */}
            <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-blue-800">Currently Playing</span>
                <div className="flex items-center gap-1 text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                  <Clock className="w-3 h-3" />
                  <span>
                    {formatTime(currentChunk.timestamp[0])} - {formatTime(currentChunk.timestamp[1])}
                  </span>
                </div>
              </div>
              <p className="text-lg font-medium text-gray-800 leading-relaxed">
                {currentChunk.text}
              </p>
            </div>

            {/* Context - Previous and Next */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Previous */}
              {currentIndex > 0 && (
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Previous</span>
                    <span className="text-xs text-gray-400">
                      {formatTime(transcription[currentIndex - 1].timestamp[0])}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {transcription[currentIndex - 1].text}
                  </p>
                </div>
              )}

              {/* Next */}
              {currentIndex < transcription.length - 1 && (
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Next</span>
                    <span className="text-xs text-gray-400">
                      {formatTime(transcription[currentIndex + 1].timestamp[0])}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {transcription[currentIndex + 1].text}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Subtitles className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No transcription for current time</p>
            <p className="text-sm text-gray-400 mt-1">
              Current time: {formatTime(currentTime)}
            </p>
          </div>
        )}
      </div>

      {/* Timeline Progress */}
      <div className="px-6 pb-4">
        <div className="bg-gray-100 rounded-lg p-3">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
            <span>Transcription Progress</span>
            <span>
              {currentIndex >= 0 ? currentIndex + 1 : 0} of {transcription.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden relative">
            {transcription.map((chunk, index) => {
              const totalDuration = transcription[transcription.length - 1]?.timestamp[1] || 1;
              const startPercent = (chunk.timestamp[0] / totalDuration) * 100;
              const widthPercent = ((chunk.timestamp[1] - chunk.timestamp[0]) / totalDuration) * 100;
              const isActive = currentTime >= chunk.timestamp[0] && currentTime < chunk.timestamp[1];
              const isPast = currentTime > chunk.timestamp[1];
              
              return (
                <div
                  key={index}
                  className={`absolute h-2 transition-all duration-300 ${
                    isActive 
                      ? 'bg-blue-500' 
                      : isPast 
                      ? 'bg-blue-300' 
                      : 'bg-gray-300'
                  }`}
                  style={{
                    left: `${startPercent}%`,
                    width: `${widthPercent}%`
                  }}
                />
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0:00</span>
            <span>
              {formatTime(transcription[transcription.length - 1]?.timestamp[1] || 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranscriptionPanel;