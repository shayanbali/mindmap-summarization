import React from 'react';
import { MindMapNode as MindMapNodeType } from '../types';
import { Clock, Tag, Play, Move, Info, ChevronDown, ChevronUp, Image } from 'lucide-react';
import TextToSpeechButton from './TextToSpeechButton';
import AIContentWarning from './AIContentWarning';

interface MindMapNodeProps {
  node: MindMapNodeType;
  position: { x: number; y: number };
  onNodeClick: () => void; // For expansion/collapse
  onPlayClick?: (timestamp: number) => void; // For video playback
  onMouseDown?: (e: React.MouseEvent) => void;
  onReportIssue?: (context: any) => void;
  isActive?: boolean;
  isDragging?: boolean;
  isExpanded?: boolean;
  forceImageCollapsed?: boolean;
}

const MindMapNode: React.FC<MindMapNodeProps> = ({ 
  node, 
  position, 
  onNodeClick,
  onPlayClick,
  onMouseDown,
  onReportIssue,
  isActive = false,
  isDragging = false,
  isExpanded = false,
  forceImageCollapsed = false
}) => {
  const [showTooltip, setShowTooltip] = React.useState(false);
  const [imageCollapsed, setImageCollapsed] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  // Determine if image should be collapsed (either by individual state or global force)
  const shouldCollapseImage = imageCollapsed || forceImageCollapsed;
  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDragging) {
      onNodeClick();
    }
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDragging && onPlayClick) {
      onPlayClick(node.timestamp[0]); // Use start time from timestamp tuple
    }
  };
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMouseDown?.(e);
  };

  const handleImageToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageCollapsed(!imageCollapsed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onNodeClick();
    }
  };

  const handlePlayKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (onPlayClick) {
        onPlayClick(node.timestamp[0]);
      }
    }
  };
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-300 ${
        isDragging ? 'cursor-grabbing scale-105' : 'cursor-pointer hover:scale-105'
      } ${isFocused ? 'ring-4 ring-blue-500 ring-opacity-75' : ''}`}
      style={{ left: position.x, top: position.y }}
      onMouseEnter={() => !isDragging && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onMouseDown={handleMouseDown}
      tabIndex={0}
      role="button"
      aria-label={`Mind map node: ${node.topic}. Click to ${isExpanded ? 'collapse' : 'expand'} details. Contains ${node.summary.length} summary points and ${node.keywords.length} keywords.`}
      aria-expanded={isExpanded}
      onKeyDown={handleKeyDown}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      {/* Enhanced glow effect for active node */}
      {isActive && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl blur-xl opacity-40 scale-125 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl blur-lg opacity-30 scale-115"></div>
        </>
      )}
      
      {/* Dragging indicator */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-400 rounded-xl blur-lg opacity-50 scale-125 animate-pulse"></div>
      )}
      
      <div className={`
        relative rounded-xl shadow-xl transition-all duration-300 backdrop-blur-sm border-2
        ${isDragging 
          ? 'shadow-2xl rotate-1 scale-105' 
          : 'hover:shadow-2xl'
        }
        ${isActive 
          ? 'bg-gradient-to-br from-blue-700 via-teal-700 to-teal-800 text-white border-blue-400/50' 
          : 'bg-white hover:bg-white text-gray-900 border-blue-300/50 hover:border-teal-400/50'
        }
        ${isExpanded ? 'ring-2 ring-teal-500/50 shadow-teal-300/50' : ''}
        ${isFocused ? 'ring-4 ring-blue-500 ring-opacity-75' : ''}
        min-w-[32rem] max-w-[40rem] overflow-hidden
      `}>
        
        {/* Header section with better organization */}
        <div className={`p-8 ${isActive ? 'bg-white/15' : 'bg-blue-50/90'} border-b border-current/15`}>
          {/* Play button at top right */}
          <div className="flex justify-end mb-8">
            <div className="flex items-center gap-2">
              {/* Expansion indicator */}
              {isExpanded && (
                <div className={`
                  p-2 rounded-lg shadow-sm border
                  ${isActive 
                    ? 'bg-white/25 text-white border-white/40' 
                    : 'bg-green-100 text-green-900 border-green-300'
                  }
                `}>
                  <div className="w-3 h-3 bg-current rounded-full animate-pulse"></div>
                </div>
              )}
              
              {/* Time badge */}
              <button
                onClick={handlePlayClick}
                onKeyDown={handlePlayKeyDown}
                tabIndex={0}
                role="button"
                aria-label={`Play video at ${formatTime(node.timestamp[0])}`}
                className={`text-2xl
                  transition-all duration-200 hover:scale-105 active:scale-95
                  focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-75
                  cursor-pointer
                  flex items-center gap-3 px-8 py-5 rounded-lg font-bold shadow-sm border
                ${isActive 
                  ? 'bg-white/25 text-white border-white/40' 
                  : 'bg-blue-100 text-gray-900 border-blue-300'
                }
              `}>
                <Clock className="w-8 h-8" />
                <span>{formatTime(node.timestamp[0])}</span>
                <Play className="w-8 h-8 ml-1" />
              </button>
            </div>
          </div>
          
          {/* Topic section below play button */}
          <div 
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleNodeClick}
            role="heading"
            aria-level={3}
          >
            <h3 className="font-extrabold text-4xl leading-snug mb-6">
              {node.topic.split(' > ').map((part, index, array) => (
                <span key={index}>
                  <span className={`
                    ${index === 0 ? (isActive ? 'text-white' : 'text-blue-900') + ' font-black text-5xl' : (isActive ? 'text-white' : 'text-gray-900') + ' font-bold text-4xl'}
                    ${isActive ? 'text-white' : ''}
                  `}>
                    {part.trim()}
                  </span>
                  {index < array.length - 1 && (
                    <span className={`mx-4 text-2xl ${isActive ? 'text-white/90' : 'text-gray-700'}`}>
                      →
                    </span>
                  )}
                </span>
              ))}
            </h3>
            {/* Subtitle for better organization */}
            <div className={`text-2xl font-medium ${isActive ? 'text-white/95' : 'text-gray-800'}`}>
              {node.topic.includes(' > ') ? 'Multi-topic segment' : 'Single topic'}
            </div>
          </div>
        </div>

        {/* Content section with better spacing */}
        <div className="p-8">
          {/* Start image from JSON */}
          {node.start_image && (
            <div className="mb-10 rounded-xl overflow-hidden shadow-lg relative bg-gray-100">
              {/* Image toggle button */}
              <button
                onClick={handleImageToggle}
                tabIndex={0}
                role="button"
                aria-label={shouldCollapseImage ? "Show image" : "Hide image"}
                className={`
                  absolute top-3 right-3 z-10 p-2 rounded-full shadow-md transition-all duration-200 hover:scale-110
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75
                  ${isActive 
                    ? 'bg-white/35 text-white hover:bg-white/45' 
                    : 'bg-white/90 text-gray-800 hover:bg-white'
                  }
                  ${forceImageCollapsed ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                title={forceImageCollapsed ? "Global image toggle active" : (imageCollapsed ? "Show image" : "Hide image")}
                disabled={forceImageCollapsed}
              >
                {shouldCollapseImage ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                )}
              </button>
              
              {!shouldCollapseImage && (
                <>
                  <img 
                    src={node.start_image.startsWith('data:') ? node.start_image : `data:image/jpeg;base64,${node.start_image}`}
                    alt={`Scene from: ${node.topic}`}
                    role="img"
                    className="w-full max-h-96 object-contain transition-transform duration-300 hover:scale-105 bg-white"
                    onError={(e) => {
                      // Hide image if it fails to load and show placeholder
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const placeholder = target.nextElementSibling as HTMLElement;
                      if (placeholder) placeholder.style.display = 'flex';
                    }}
                  />
                  <div 
                    className="hidden w-full h-48 bg-gray-100 items-center justify-center rounded-lg"
                    style={{ display: 'none' }}
                  >
                    <div className="text-center text-gray-500">
                      <Image className="w-16 h-16 mx-auto mb-4" />
                      <span className="text-xl font-medium">Image unavailable</span>
                    </div>
                  </div>
                </>
              )}
              
              {shouldCollapseImage && (
                <div className="w-full h-24 bg-gray-100 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-center text-gray-500 flex items-center gap-2">
                    <Image className="w-8 h-8" />
                    <span className="text-xl font-medium">
                      {forceImageCollapsed ? "Images hidden globally" : "Image hidden"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Key phrases with improved layout */}
          <div onClick={handleNodeClick} className="cursor-pointer">
          <div className="flex flex-wrap gap-4 mb-10">
            {node.keywords.slice(0, 3).map((phrase, index) => (
              <span
                key={index}
                role="text"
                aria-label={`Keyword: ${phrase}`}
                className={`
                  px-8 py-5 rounded-lg text-4xl font-bold transition-all duration-200 shadow-sm border
                  ${isActive 
                    ? 'bg-white/30 text-white border-white/50' 
                    : 'bg-blue-50 text-gray-900 border-blue-400 hover:bg-blue-100'
                  }
                `}
              >
                {phrase}
              </span>
            ))}
            {node.keywords.length > 3 && (
              <span className={`
                px-8 py-5 rounded-lg text-4xl font-bold shadow-sm border
                ${isActive 
                  ? 'bg-white/30 text-white border-white/50' 
                  : 'bg-blue-50 text-gray-900 border-blue-400'
                }
              `}>
                +{node.keywords.length - 3}
              </span>
            )}
          </div>
          </div>

          {/* Click to play indicator at bottom */}
          <div 
            onClick={handleNodeClick}
            role="button"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            aria-label={isExpanded ? "Click to collapse node details" : "Click to expand node details"}
            className={`
            cursor-pointer hover:opacity-80 transition-opacity font-bold text-3xl
            mt-10 pt-10 border-t border-current/10 flex items-center justify-center gap-6
            ${isActive ? 'text-white' : isExpanded ? 'text-teal-900' : 'text-gray-900'}
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 rounded-lg
          `}>
            {isExpanded ? (
              <>
                <ChevronUp className="w-12 h-12" />
                <span>Click to collapse</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-12 h-12" />
                <span>Click to expand</span>
              </>
            )}
          </div>
          
          {/* Text-to-speech button */}
          <div className="mt-12 pt-12 border-t-4 border-current/25 bg-gradient-to-r from-blue-50/90 to-teal-50/90 rounded-lg p-6">
            <TextToSpeechButton
              text={node.summary.join('. ')}
              title={`Listen to summary: ${node.title}`}
              variant={isActive ? "secondary" : "minimal"}
              size="xxxl"
              className="w-full justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            />
          </div>
        </div>

        {/* Active indicator - repositioned */}
        {isActive && (
          <div className="absolute -top-5 -right-5 w-16 h-16 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center animate-bounce shadow-lg border-2 border-white">
            <div className="w-7 h-7 bg-white rounded-full"></div>
          </div>
        )}

        {/* Drag handle - repositioned to top left */}
        <div className={`
          absolute top-4 left-4 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 border-2 shadow-lg z-10
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75
          ${isActive 
            ? 'bg-white/35 border-white/60 hover:bg-white/45' 
            : 'bg-blue-200 hover:bg-blue-300 border-blue-500 hover:border-blue-600'
          }
        `}
        role="button"
        tabIndex={0}
        aria-label="Drag to move this node"
        >
          <Move className={`w-8 h-8 ${isActive ? 'text-white' : 'text-blue-800'}`} />
        </div>
        
        {/* Enhanced tooltip */}
        {showTooltip && !isDragging && !isExpanded && (
          <div 
            className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-6 p-8 bg-gray-900/98 backdrop-blur-sm text-white rounded-xl shadow-2xl max-w-2xl border border-gray-700 pointer-events-none"
            role="tooltip"
            aria-hidden="true"
          >
            <div className="text-2xl font-semibold mb-4 text-blue-300 flex items-center gap-3">
              <ChevronDown className="w-6 h-6" />
              {node.topic}
            </div>
            <div className="text-lg text-gray-300 mb-6">
              <div className="font-medium text-blue-200 mb-3">Summary:</div>
              <ul className="list-disc list-inside space-y-1">
                {node.summary.slice(0, 2).map((point, index) => (
                  <li key={index} className="text-gray-300">
                    {point}
                  </li>
                ))}
                {node.summary.length > 2 && (
                  <li className="text-gray-400 italic">...and more</li>
                )}
              </ul>
            </div>
            <div className="text-lg text-blue-300 font-medium mb-4">
              Click node to {isExpanded ? 'collapse' : 'expand'}
            </div>
            <div className="text-lg text-green-300 font-medium flex items-center gap-3">
              <Play className="w-5 h-5" />
              Click time badge to play at {formatTime(node.timestamp[0])}
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900/98"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MindMapNode;