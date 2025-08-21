import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Lightbulb, Map, Brain, Upload, Subtitles } from 'lucide-react';

type ViewMode = 'split' | 'video' | 'mindmap';

interface TourStep {
  id: string;
  title: string;
  content: string;
  target?: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  icon: React.ReactNode;
}

interface QuickTourProps {
  isOpen: boolean;
  onClose: () => void;
  viewMode: ViewMode;
}

const splitViewSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to VideoMind! 🎉',
    content: 'VideoMind is an AI-powered tool that creates interactive mind maps from videos. Let\'s take a quick tour to show you how it works!',
    position: 'center',
    icon: <Brain className="w-6 h-6" />
  },
  {
    id: 'video-player',
    title: 'Video Player',
    content: 'Watch your video here. The player syncs with the mind map - when you click on mind map nodes, the video jumps to that timestamp!',
    target: '[data-tour="video-player"]',
    position: 'bottom',
    icon: <Play className="w-6 h-6" />
  },
  {
    id: 'subtitles',
    title: 'Smart Subtitles',
    content: 'Enable subtitles to see synchronized transcriptions while watching! The subtitles are perfectly timed with the video content and you can adjust their size. Look for the CC button in the video player.',
    target: '[data-tour="video-player"]',
    position: 'bottom',
    icon: <Subtitles className="w-6 h-6" />
  },
  {
    id: 'mind-map',
    title: 'Interactive Mind Map',
    content: 'This is where the magic happens! Each node represents a key moment in your video. Click nodes to expand them and see detailed summaries, keywords, and related content.',
    target: '[data-tour="mind-map"]',
    position: 'top',
    icon: <Map className="w-6 h-6" />
  },
  {
    id: 'view-controls',
    title: 'View Controls',
    content: 'Switch between Split View (video + mind map), Video Only, or Mind Map Only. Choose what works best for your workflow!',
    target: '[data-tour="view-controls"]',
    position: 'bottom',
    icon: <Lightbulb className="w-6 h-6" />
  },
  {
    id: 'generate-options',
    title: 'Generate Mind Maps',
    content: 'Create your own mind maps! Upload a JSON file with your data, or use our AI generator to analyze your videos automatically.',
    target: '[data-tour="generate-button"]',
    position: 'bottom',
    icon: <Upload className="w-6 h-6" />
  },
  {
    id: 'summary-panel',
    title: 'Dynamic Summary',
    content: 'This panel shows context-aware summaries that change based on what\'s currently playing in the video. It also includes text-to-speech functionality!',
    target: '[data-tour="summary-panel"]',
    position: 'top',
    icon: <Brain className="w-6 h-6" />
  },
  {
    id: 'final',
    title: 'You\'re Ready! 🚀',
    content: 'That\'s it! Start by exploring the default mind map, or create your own by uploading content. Click on mind map nodes to see them expand with detailed information. Enjoy exploring!',
    position: 'center',
    icon: <Brain className="w-6 h-6" />
  }
];

const videoViewSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Video View Tour 🎬',
    content: 'Welcome to the Video-focused view! This mode gives you the full video experience with synchronized summaries and transcriptions.',
    position: 'center',
    icon: <Play className="w-6 h-6" />
  },
  {
    id: 'video-player',
    title: 'Full-Screen Video Experience',
    content: 'In Video View, the video player takes center stage. You get a larger viewing area perfect for focusing on the video content.',
    target: '[data-tour="video-player"]',
    position: 'bottom',
    icon: <Play className="w-6 h-6" />
  },
  {
    id: 'subtitles',
    title: 'Enhanced Subtitles',
    content: 'Enable subtitles for synchronized transcriptions! You can adjust subtitle size and see exactly what\'s being said at each moment. Perfect for accessibility and comprehension.',
    target: '[data-tour="video-player"]',
    position: 'bottom',
    icon: <Subtitles className="w-6 h-6" />
  },
  {
    id: 'dynamic-summary',
    title: 'Time-Synchronized Summaries',
    content: 'Watch how the summary below changes as the video plays! It shows relevant information for the current timestamp, making it easy to understand what\'s happening.',
    position: 'center',
    icon: <Brain className="w-6 h-6" />
  },
  {
    id: 'transcription-panel',
    title: 'Live Transcription Panel',
    content: 'When available, the transcription panel shows the current spoken text with context from previous and upcoming segments.',
    position: 'center',
    icon: <Subtitles className="w-6 h-6" />
  },
  {
    id: 'view-controls',
    title: 'Switch Views Anytime',
    content: 'Use these controls to switch to Split View (video + mind map) or Mind Map Only view whenever you want to see the visual representation.',
    target: '[data-tour="view-controls"]',
    position: 'bottom',
    icon: <Lightbulb className="w-6 h-6" />
  },
  {
    id: 'final',
    title: 'Enjoy Video Mode! 🎥',
    content: 'Video View is perfect for when you want to focus on the content while still getting AI-powered insights. Try switching to other views to see the mind map visualization!',
    position: 'center',
    icon: <Play className="w-6 h-6" />
  }
];

const mindMapViewSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Mind Map View Tour 🧠',
    content: 'Welcome to the Mind Map-focused view! This mode gives you the full interactive mind map experience with maximum space for exploration.',
    position: 'center',
    icon: <Map className="w-6 h-6" />
  },
  {
    id: 'mind-map-full',
    title: 'Full-Screen Mind Map',
    content: 'In Mind Map View, you get maximum screen real estate for exploring the visual representation of your video content. Perfect for understanding the big picture!',
    target: '[data-tour="mind-map"]',
    position: 'top',
    icon: <Map className="w-6 h-6" />
  },
  {
    id: 'node-interaction',
    title: 'Interactive Nodes',
    content: 'Click on any node to expand it and see detailed summaries, keywords, and related content. Each node represents a key moment or topic from your video.',
    target: '[data-tour="mind-map"]',
    position: 'top',
    icon: <Brain className="w-6 h-6" />
  },
  {
    id: 'mind-map-controls',
    title: 'Mind Map Controls',
    content: 'Use the controls in the top-right to zoom, reorganize, hide/show images, and reset the view. You can also drag nodes to reposition them!',
    target: '[data-tour="mind-map"]',
    position: 'top',
    icon: <Lightbulb className="w-6 h-6" />
  },
  {
    id: 'timeline-progress',
    title: 'Timeline Integration',
    content: 'The timeline at the bottom shows your progress through the video content. Active nodes are highlighted as you would progress through the video.',
    position: 'center',
    icon: <Play className="w-6 h-6" />
  },
  {
    id: 'view-controls',
    title: 'Switch to Video Mode',
    content: 'Use these controls to switch to Video View or Split View when you want to see the actual video content alongside the mind map.',
    target: '[data-tour="view-controls"]',
    position: 'bottom',
    icon: <Lightbulb className="w-6 h-6" />
  },
  {
    id: 'generate-options',
    title: 'Create Your Own',
    content: 'Ready to create your own mind maps? Use the Generate Mind-Map button to upload your own content or use AI to analyze new videos.',
    target: '[data-tour="generate-button"]',
    position: 'bottom',
    icon: <Upload className="w-6 h-6" />
  },
  {
    id: 'final',
    title: 'Master the Mind Map! 🗺️',
    content: 'Mind Map View is perfect for visual learners and getting a comprehensive overview of video content. Try expanding nodes and exploring the connections!',
    position: 'center',
    icon: <Map className="w-6 h-6" />
  }
];

const getTourSteps = (viewMode: ViewMode): TourStep[] => {
  switch (viewMode) {
    case 'video':
      return videoViewSteps;
    case 'mindmap':
      return mindMapViewSteps;
    default:
      return splitViewSteps;
  }
};

const QuickTour: React.FC<QuickTourProps> = ({ isOpen, onClose, viewMode }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [tourPosition, setTourPosition] = useState({ x: 0, y: 0 });

  const tourSteps = getTourSteps(viewMode);

  // Reset to first step when tour opens or view mode changes
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen, viewMode]);

  useEffect(() => {
    if (!isOpen) return;

    const updatePosition = () => {
      const step = tourSteps[currentStep];
      if (step.target && step.position !== 'center') {
        const element = document.querySelector(step.target);
        if (element) {
          const rect = element.getBoundingClientRect();
          
          // Get viewport dimensions and zoom factor
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;
          
          let x = 0, y = 0;
          
          switch (step.position) {
            case 'top':
              x = Math.max(20, Math.min(rect.left + rect.width / 2, viewportWidth - 400));
              y = Math.max(20, rect.top - 20);
              break;
            case 'bottom':
              // Special handling for view controls to position correctly
              if (step.target === '[data-tour="view-controls"]') {
                x = Math.max(20, Math.min(rect.right - 100, viewportWidth - 400));
                y = Math.min(rect.bottom + 20, viewportHeight - 300);
              } else {
                x = Math.max(20, Math.min(rect.left + rect.width / 2, viewportWidth - 400));
                y = Math.min(rect.bottom + 20, viewportHeight - 300);
              }
              break;
            case 'left':
              x = Math.max(20, rect.left - 20);
              y = Math.max(20, Math.min(rect.top + rect.height / 2, viewportHeight - 150));
              break;
            case 'right':
              x = Math.min(rect.right + 20, viewportWidth - 400);
              y = Math.max(20, Math.min(rect.top + rect.height / 2, viewportHeight - 150));
              break;
          }
          
          setTourPosition({ x, y });
        } else {
          // If element not found, reset to center
          setTourPosition({ x: 0, y: 0 });
        }
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);
    window.addEventListener('orientationchange', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('orientationchange', updatePosition);
    };
  }, [currentStep, isOpen]);

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = () => {
    onClose();
  };

  if (!isOpen) return null;

  const step = tourSteps[currentStep];
  const isCenter = step.position === 'center';

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/15 backdrop-blur-[1px] z-50" />
      
      {/* Spotlight effect for targeted elements */}
      {step.target && !isCenter && step.id !== 'mind-map' && (
        <div className="fixed inset-0 z-[55] pointer-events-none">
          <style>
            {`
              .tour-spotlight {
                box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.15);
                border-radius: 8px;
                transition: all 0.3s ease-in-out;
              }
            `}
          </style>
          {(() => {
            const element = step.target ? document.querySelector(step.target) : null;
            if (!element) return null;
            
            const rect = element.getBoundingClientRect();
            return (
              <div
                className="tour-spotlight absolute"
                style={{
                  left: `${rect.left - 10}px`,
                  top: `${rect.top - 10}px`,
                  width: `${rect.width + 20}px`,
                  height: `${rect.height + 20}px`,
                }}
              />
            );
          })()}
        </div>
      )}

      {/* Tour Modal */}
      <div
        className={`fixed z-[60] ${
          isCenter 
            ? 'inset-0 flex items-center justify-center pt-48' 
            : ''
        }`}
        style={
          !isCenter && tourPosition.x > 0 && tourPosition.y > 0
            ? { 
                left: `${Math.max(20, Math.min(tourPosition.x, window.innerWidth - 400))}px`, 
                top: `${Math.max(200, Math.min(tourPosition.y + 100, window.innerHeight - 300))}px`,
                transform: 'translate(-50%, -50%)'
              }
            : {}
        }
      >
        <div className={`bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden ${
          isCenter ? 'max-w-md w-full mx-4' : 'max-w-md w-96'
        }`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  {step.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{step.title}</h3>
                  <p className="text-blue-100 text-sm">
                    Step {currentStep + 1} of {tourSteps.length}
                  </p>
                </div>
              </div>
              <button
                onClick={skipTour}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Skip tour"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-700 leading-relaxed text-base">
              {step.content}
            </p>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
            {/* Progress dots */}
            <div className="flex space-x-2">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep 
                      ? 'bg-blue-600' 
                      : index < currentStep 
                      ? 'bg-green-500' 
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center space-x-3">
              {currentStep > 0 && (
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              )}
              
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {currentStep === tourSteps.length - 1 ? (
                  <>
                    Get Started
                    <Brain className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Arrow pointer for non-center positions */}
        {!isCenter && tourPosition.x > 0 && tourPosition.y > 0 && (
          <div
            className={`absolute w-0 h-0 ${
              step.position === 'top' 
                ? 'top-full left-1/2 transform -translate-x-1/2 border-l-[12px] border-r-[12px] border-t-[12px] border-transparent border-t-white'
                : step.position === 'bottom'
                ? 'bottom-full left-1/2 transform -translate-x-1/2 border-l-[12px] border-r-[12px] border-b-[12px] border-transparent border-b-white'
                : step.position === 'left'
                ? 'left-full top-1/2 transform -translate-y-1/2 border-t-[12px] border-b-[12px] border-l-[12px] border-transparent border-l-white'
                : 'right-full top-1/2 transform -translate-y-1/2 border-t-[12px] border-b-[12px] border-r-[12px] border-transparent border-r-white'
            }`}
          />
        )}
      </div>
    </>
  );
};

export default QuickTour;