import React from 'react';
import { Volume2, VolumeX, Pause, Play, Square } from 'lucide-react';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

interface TextToSpeechButtonProps {
  text: string;
  title?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'minimal';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';
}

const TextToSpeechButton: React.FC<TextToSpeechButtonProps> = ({
  text,
  title = "Listen to summary",
  className = "",
  variant = 'primary',
  size = 'md'
}) => {
  const { isSupported, isSpeaking, isPaused, speak, pause, resume, stop } = useTextToSpeech();

  if (!isSupported) {
    return (
      <button
        disabled
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-gray-400 bg-gray-100 cursor-not-allowed ${className}`}
        title="Text-to-speech not supported in this browser"
      >
        <VolumeX className="w-3 h-3" />
        <span>Not supported</span>
      </button>
    );
  }

  const handleClick = () => {
    if (!isSpeaking) {
      speak(text, { rate: 0.9, pitch: 1 });
    } else if (isPaused) {
      resume();
    } else {
      pause();
    }
  };

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    stop();
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-blue-50 hover:bg-blue-100 text-gray-900 border border-blue-300';
      case 'minimal':
        return 'bg-transparent hover:bg-blue-50 text-gray-900 border border-transparent hover:border-blue-300';
      default:
        return 'bg-blue-700 hover:bg-blue-800 text-white border border-blue-700';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs font-semibold';
      case 'xxxl':
        return 'px-12 py-6 text-3xl font-black';
      case 'xxl':
        return 'px-10 py-5 text-2xl font-black';
      case 'xl':
        return 'px-5 py-3 text-base font-bold';
      case 'lg':
        return 'px-4 py-2.5 text-sm font-bold';
      default:
        return 'px-3 py-1.5 text-xs font-semibold';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'w-3 h-3';
      case 'xxxl':
        return 'w-10 h-10';
      case 'xxl':
        return 'w-8 h-8';
      case 'xl':
        return 'w-5 h-5';
      case 'lg':
        return 'w-4 h-4';
      default:
        return 'w-3.5 h-3.5';
    }
  };

  return (
    <div className="inline-flex items-center gap-1">
      <button
        onClick={handleClick}
        tabIndex={0}
        role="button"
        aria-label={title}
        aria-pressed={isSpeaking && !isPaused}
        className={`
          inline-flex items-center gap-2 rounded-lg font-medium transition-all duration-200 
          hover:scale-105 active:scale-95 shadow-sm hover:shadow-md
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75
          ${getVariantClasses()} ${getSizeClasses()} ${className}
        `}
      >
        {!isSpeaking ? (
          <Volume2 className={getIconSize()} />
        ) : isPaused ? (
          <Play className={getIconSize()} />
        ) : (
          <Pause className={getIconSize()} />
        )}
        <span>
          {!isSpeaking ? 'Listen' : isPaused ? 'Resume' : 'Pause'}
        </span>
      </button>
      
      {isSpeaking && (
        <button
          onClick={handleStop}
          tabIndex={0}
          role="button"
          aria-label="Stop reading"
          className={`
            p-1.5 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95
            bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md
            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75
          `}
        >
          <Square className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};

export default TextToSpeechButton;