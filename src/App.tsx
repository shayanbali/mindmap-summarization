import React, { useRef, useState } from 'react';
import VideoPlayer, { VideoPlayerRef } from './components/VideoPlayer';
import MindMap from './components/MindMap';
import TranscriptionPanel from './components/TranscriptionPanel';
import JsonUpload from './components/JsonUpload';
import VideoMindMapGenerator from './components/VideoMindMapGenerator';
import TextToSpeechButton from './components/TextToSpeechButton';
import QuickTour from './components/QuickTour';
import EthicsDisclaimer from './components/EthicsDisclaimer';
import BiasReportModal from './components/BiasReportModal';
import AIContentWarning from './components/AIContentWarning';
import { mockMindMapData, smallMindMapData, largeMindMapData } from './data/mockData';
import { Brain, Video, Map, Database, Upload, Sparkles, ChevronDown, RotateCcw, Download } from 'lucide-react';
import { MindMapData } from './types';

function App() {
  const videoPlayerRef = useRef<VideoPlayerRef>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeView, setActiveView] = useState<'split' | 'video' | 'mindmap'>('split');
  const [currentDataset, setCurrentDataset] = useState<'small' | 'medium' | 'large'>('medium');
  const [showJsonUpload, setShowJsonUpload] = useState(false);
  const [showVideoGenerator, setShowVideoGenerator] = useState(false);
  const [uploadedData, setUploadedData] = useState<MindMapData | null>(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const [showGenerateDropdown, setShowGenerateDropdown] = useState(false);
  const [currentMindMapSource, setCurrentMindMapSource] = useState<'default' | 'uploaded' | 'history'>('default');
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  const [showTranscription, setShowTranscription] = useState(false);
  const [subtitleSize, setSubtitleSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [showTour, setShowTour] = useState(false);
  const [isVideoFullscreen, setIsVideoFullscreen] = useState(false);
  const [showEthicsDisclaimer, setShowEthicsDisclaimer] = useState(false);
  const [showBiasReport, setShowBiasReport] = useState(false);
  const [biasReportContext, setBiasReportContext] = useState<any>(null);
  const [hasAcceptedEthics, setHasAcceptedEthics] = useState<boolean | null>(null);
  const [ethicsChecked, setEthicsChecked] = useState(false);

  // Listen for fullscreen changes
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsVideoFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleDownloadMindMap = () => {
    const currentData = getDataset();
    const filename = `${currentData.root_topic.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_mindmap.json`;
    
    // Create downloadable JSON
    const jsonString = JSON.stringify(currentData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Create temporary download link
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL
    URL.revokeObjectURL(url);
  };

  // Check ethics acceptance on mount
  React.useEffect(() => {
    console.log('Checking ethics acceptance...');
    const ethicsAccepted = localStorage.getItem('videomind-ethics-accepted');
    console.log('Ethics localStorage value:', ethicsAccepted);
    
    // Force show ethics popup for testing - remove this line after testing
    if (false && ethicsAccepted === 'true') {
      console.log('Ethics already accepted');
      setHasAcceptedEthics(true);
      
      // Show tour if first time
      const hasSeenTour = localStorage.getItem('videomind-tour-seen');
      if (!hasSeenTour) {
        setTimeout(() => {
          setShowTour(true);
        }, 1000);
      }
    } else {
      console.log('Ethics not accepted, showing disclaimer');
      setHasAcceptedEthics(false);
    }
    setEthicsChecked(true);
  }, []);

  // Show tour after ethics acceptance
  React.useEffect(() => {
    if (hasAcceptedEthics === true) {
      const hasSeenTour = localStorage.getItem('videomind-tour-seen');
      if (!hasSeenTour) {
        setTimeout(() => {
          setShowTour(true);
        }, 500);
      }
    }
  }, [hasAcceptedEthics]);

  const handleAcceptEthics = () => {
    console.log('Ethics accepted');
    localStorage.setItem('videomind-ethics-accepted', 'true');
    setHasAcceptedEthics(true);
    setShowEthicsDisclaimer(false);
  };

  // Show loading while checking ethics
  if (hasAcceptedEthics === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing VideoMind...</p>
        </div>
      </div>
    );
  }

  const handleReportBias = (context?: any) => {
    setBiasReportContext(context);
    setShowBiasReport(true);
  };

  const handleCloseTour = () => {
    setShowTour(false);
    localStorage.setItem('videomind-tour-seen', 'true');
  };

  const handleShowTour = () => {
    setShowTour(true);
  };

  const getDataset = (): MindMapData => {
    if (uploadedData) return uploadedData;
    switch (currentDataset) {
      case 'small': return smallMindMapData;
      case 'large': return largeMindMapData;
      default: return mockMindMapData;
    }
  };

  const currentData = getDataset();

  const handleNodeClick = (timestamp: number) => {
    if (videoPlayerRef.current) {
      videoPlayerRef.current.seekTo(timestamp);
    }
  };

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
  };

  const handleDataLoaded = (data: MindMapData, videoUrl?: string) => {
    setUploadedData(data);
    if (uploadedVideoUrl && uploadedVideoUrl !== videoUrl) {
      URL.revokeObjectURL(uploadedVideoUrl);
    }
    setUploadedVideoUrl(videoUrl || null);
    setCurrentVideoUrl(videoUrl || null);
    setShowJsonUpload(false);
    setShowVideoGenerator(false);
    setCurrentMindMapSource('uploaded');
    setCurrentDataset('medium'); // Reset dataset selector
  };

  const handleVideoGeneratorDataLoaded = (data: MindMapData, videoUrl?: string) => {
    try {
      console.log('Received data from video generator:', data);
      
      // Validate data before processing
      if (!data || !data.nodes || !Array.isArray(data.nodes)) {
        console.error('Invalid data received from video generator:', data);
        return;
      }
      
    setUploadedData(data);
    if (uploadedVideoUrl && uploadedVideoUrl !== videoUrl) {
      URL.revokeObjectURL(uploadedVideoUrl);
    }
    setUploadedVideoUrl(videoUrl || null);
    setCurrentVideoUrl(videoUrl || null);
    setShowVideoGenerator(false);
    setCurrentMindMapSource('uploaded');
    } catch (error) {
      console.error('Error processing video generator data:', error);
      // Don't close the modal if there's an error
    }
  };


  const handleResetToDefault = () => {
    setUploadedData(null);
    
    // Clean up video URLs
    if (uploadedVideoUrl) {
      URL.revokeObjectURL(uploadedVideoUrl);
      setUploadedVideoUrl(null);
    }
    if (currentVideoUrl) {
      URL.revokeObjectURL(currentVideoUrl);
      setCurrentVideoUrl(null);
    }
    
    setCurrentMindMapSource('default');
  };

  // Get the video URL - prioritize uploaded video, then data video_url, then default
  const getVideoUrl = () => {
    if (currentVideoUrl) return currentVideoUrl;
    if (uploadedVideoUrl) return uploadedVideoUrl;
    if (currentData.video_url) return currentData.video_url;
    return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  };

  return (
    <>
      {/* Ethics Disclaimer - Show first before anything else */}
      {hasAcceptedEthics === false && (
        <EthicsDisclaimer
          isOpen={true}
          onClose={() => setShowEthicsDisclaimer(false)}
          onAccept={handleAcceptEthics}
        />
      )}
      
      {/* Main App - Only show after ethics accepted */}
      {hasAcceptedEthics && (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50" role="main">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-blue-300 sticky top-0 z-50" role="banner">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6 min-h-[96px]">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">VideoMind</h1>
                <p className="text-sm text-gray-800">AI-Powered Video Summarization</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Action Buttons Row - Generate, Nodes, Tour */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Reset button (only show when uploaded data is active) */}
                <div className="min-w-[80px]">
                  {currentMindMapSource !== 'default' && (
                    <button
                      onClick={handleResetToDefault}
                      tabIndex={0}
                      role="button"
                      aria-label="Reset to default data"
                      className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-gray-600 text-white hover:bg-gray-700 shadow-md hover:scale-105 whitespace-nowrap"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
                
                {/* Quick Tour Button */}
                <button
                  onClick={handleShowTour}
                  tabIndex={0}
                  role="button"
                  aria-label={`Take a quick tour of the ${activeView === 'split' ? 'split view' : activeView === 'video' ? 'video view' : 'mind map view'}`}
                  className="flex items-center gap-2 bg-purple-50 rounded-lg px-3 py-2 border border-purple-400 text-sm font-medium transition-all duration-200 text-purple-900 hover:bg-purple-100 shadow-md hover:scale-105 whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Tour</span>
                </button>
                
                {/* Generate Mind-Map Dropdown */}
                <div className="relative">
                  <button
                    data-tour="generate-button"
                    onClick={() => setShowGenerateDropdown(!showGenerateDropdown)}
                    tabIndex={0}
                    role="button"
                    aria-label="Generate mind map options"
                    aria-expanded={showGenerateDropdown}
                    aria-haspopup="menu"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700 shadow-md hover:scale-105 hover:shadow-lg whitespace-nowrap"
                  >
                    <Brain className="w-4 h-4" />
                    <span>Generate Mind-Map</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showGenerateDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {showGenerateDropdown && (
                    <div 
                      className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-300 z-50 overflow-hidden"
                      role="menu"
                      aria-label="Mind map generation options"
                    >
                      <button
                        onClick={() => {
                          setShowVideoGenerator(true);
                          setShowGenerateDropdown(false);
                        }}
                        role="menuitem"
                        tabIndex={0}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-800 hover:bg-purple-50 hover:text-purple-800 transition-colors border-b border-gray-100"
                      >
                        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                          <Sparkles className="w-4 h-4 text-purple-600" />
                        </div>
                        <span>AI Generate</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setShowJsonUpload(true);
                          setShowGenerateDropdown(false);
                        }}
                        role="menuitem"
                        tabIndex={0}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-800 hover:bg-green-50 hover:text-green-800 transition-colors"
                      >
                        <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg">
                          <Upload className="w-4 h-4 text-green-600" />
                        </div>
                        <span>Upload JSON</span>
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Dataset/Status Indicator - Moved next to Tour button */}
                <div className="min-w-[140px]">
                  {currentMindMapSource === 'default' ? (
                    <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2 border border-blue-400">
                      <Database className="w-4 h-4 text-blue-700" />
                      <select
                        value={currentDataset}
                        onChange={(e) => setCurrentDataset(e.target.value as 'small' | 'medium' | 'large')}
                        aria-label="Select dataset size"
                        className="text-sm font-medium bg-transparent text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value="small">3 Nodes</option>
                        <option value="medium">8 Nodes</option>
                        <option value="large">15 Nodes</option>
                      </select>
                    </div>
                  ) : currentMindMapSource === 'uploaded' ? (
                    <div className="flex items-center gap-2 bg-green-50 rounded-lg px-3 py-2 border border-green-400">
                      <Upload className="w-4 h-4 text-green-700" />
                      <span className="text-sm font-medium text-green-900 whitespace-nowrap">
                        Custom Data 
                        ({currentData.nodes.length} nodes)
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-indigo-50 rounded-lg px-3 py-2 border border-indigo-400">
                      <Brain className="w-4 h-4 text-indigo-700" />
                      <span className="text-sm font-medium text-indigo-900 whitespace-nowrap">
                        Generated 
                        ({currentData.nodes.length} nodes)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* View Toggle Buttons */}
              <div 
                data-tour="view-controls" 
                className="flex items-center bg-blue-50 rounded-lg p-1 border border-blue-400 ml-2"
                role="tablist"
                aria-label="View mode selection"
              >
                <button
                  onClick={() => setActiveView('split')}
                  role="tab"
                  tabIndex={0}
                  aria-selected={activeView === 'split'}
                  aria-controls="main-content"
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    activeView === 'split' 
                      ? 'bg-blue-700 text-white shadow-sm' 
                      : 'text-gray-900 hover:bg-blue-100'
                  }`}
                >
                  Split View
                </button>
                <button
                  onClick={() => setActiveView('video')}
                  role="tab"
                  tabIndex={0}
                  aria-selected={activeView === 'video'}
                  aria-controls="main-content"
                  className={`flex items-center justify-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    activeView === 'video' 
                      ? 'bg-blue-700 text-white shadow-sm' 
                      : 'text-gray-900 hover:bg-blue-100'
                  }`}
                >
                  <Video className="w-4 h-4" />
                  <span>Video</span>
                </button>
                <button
                  onClick={() => setActiveView('mindmap')}
                  role="tab"
                  tabIndex={0}
                  aria-selected={activeView === 'mindmap'}
                  aria-controls="main-content"
                  className={`flex items-center justify-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    activeView === 'mindmap' 
                      ? 'bg-blue-700 text-white shadow-sm' 
                      : 'text-gray-900 hover:bg-blue-100'
                  }`}
                >
                  <Map className="w-4 h-4" />
                  <span>Mind Map</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main 
        id="main-content"
        className="w-full px-4 sm:px-6 lg:px-8 py-2 sm:py-4"
        role="main"
        aria-label={`${activeView} view of video mind map application`}
      >
        <>
        {activeView === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
            <div className="space-y-4">
              <section data-tour="video-player" className="bg-white rounded-xl shadow-lg p-2 sm:p-4">
                <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4 flex items-center text-gray-900">
                  <Video className="w-5 h-5 mr-2 text-blue-700" />
                  Video Player
                </h2>
                <VideoPlayer
                  ref={videoPlayerRef}
                  videoUrl={getVideoUrl()}
                  onTimeUpdate={handleTimeUpdate}
                  transcription={currentData.transcription || []}
                  showSubtitles={showTranscription}
                  onToggleSubtitles={() => setShowTranscription(!showTranscription)}
                  subtitleSize={subtitleSize}
                  onSubtitleSizeChange={setSubtitleSize}
                  mindMapData={currentData}
                  currentTime={currentTime}
                />
              </section>
              
              <section data-tour="summary-panel" className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">Video Summary</h3>
                  <TextToSpeechButton
                    text={(() => {
                      const activeNodeIndex = currentData.nodes.findIndex(node => 
                        currentTime >= node.timestamp[0] && 
                        currentTime < node.timestamp[1]
                      );
                      return activeNodeIndex >= 0 ? currentData.nodes[activeNodeIndex].summary.join('. ') : currentData.root_topic;
                    })()}
                    title={(() => {
                      const activeNodeIndex = currentData.nodes.findIndex(node => 
                        currentTime >= node.timestamp[0] && 
                        currentTime < node.timestamp[1]
                      );
                      return activeNodeIndex >= 0 ? "Listen to current segment summary" : "Listen to video summary";
                    })()}
                    variant="primary"
                    size="md"
                  />
                </div>
                
                {/* AI Content Warning */}
                <div className="text-gray-900 leading-relaxed text-lg font-medium space-y-4">
                  {/* Show currently playing node summary if available */}
                  {(() => {
                    const activeNodeIndex = currentData.nodes.findIndex(node => 
                      currentTime >= node.timestamp[0] && 
                      currentTime < node.timestamp[1]
                    );
                    if (activeNodeIndex >= 0) {
                      const activeNode = currentData.nodes[activeNodeIndex];
                      return (
                        <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                            <h4 className="font-bold text-blue-900">Currently Playing:</h4>
                            <span className="text-sm bg-blue-100 text-blue-900 px-2 py-1 rounded-full font-medium">
                              {Math.floor(activeNode.timestamp[0] / 60)}:{(Math.floor(activeNode.timestamp[0] % 60)).toString().padStart(2, '0')} - {Math.floor(activeNode.timestamp[1] / 60)}:{(Math.floor(activeNode.timestamp[1] % 60)).toString().padStart(2, '0')}
                            </span>
                          </div>
                          <h5 className="font-bold text-gray-900 mb-2">{activeNode.topic}</h5>
                          <div className="text-gray-800 leading-relaxed">
                            <ul className="list-disc list-inside space-y-1">
                              {activeNode.summary.map((point, index) => (
                                <li key={index} className="text-gray-800">
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                          {activeNode.keywords.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {activeNode.keywords.slice(0, 4).map((keyword, index) => (
                                <span key={index} className="bg-blue-100 text-blue-900 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold border border-blue-300 shadow-sm hover:bg-blue-200 transition-colors">
                                  {keyword}
                                </span>
                              ))}
                              {activeNode.keywords.length > 4 && (
                                <span className="bg-blue-100 text-blue-900 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold border border-blue-300 shadow-sm">
                                  +{activeNode.keywords.length - 4} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    } else {
                      // Show overall video summary when no specific node is playing
                      return (
                        <div>
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                            Overall Video Summary:
                          </h4>
                          <ul className="list-disc list-inside space-y-2">
                            {currentData.root_topic.split(/[.!?]+/).filter(sentence => sentence.trim()).map((sentence, index) => (
                              <li key={index} className="text-gray-900">
                                {sentence.trim()}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    }
                  })()}
                </div>
              </section>
            </div>
            
            <section data-tour="mind-map" className="bg-white rounded-xl shadow-lg p-2 sm:p-4">
              <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
                <Map className="w-5 h-5 mr-2 text-teal-700" />
                Interactive Mind Map
                <button
                  onClick={handleDownloadMindMap}
                  tabIndex={0}
                  role="button"
                  aria-label="Download mind map as JSON file"
                  className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download JSON</span>
                </button>
              </h2>
              <MindMap
                data={currentData}
                onNodeClick={handleNodeClick}
                currentTime={currentTime}
              />
            </section>
          </div>
        )}

        {activeView === 'video' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                {/* Left Side - Video Player */}
                <section data-tour="video-player" className="bg-white rounded-xl shadow-lg p-2 sm:p-4 h-fit">
                  <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4 flex items-center text-gray-900">
                    <Video className="w-5 h-5 mr-2 text-blue-700" />
                    Video Player
                  </h2>
                  <VideoPlayer
                    ref={videoPlayerRef}
                    videoUrl={getVideoUrl()}
                    onTimeUpdate={handleTimeUpdate}
                    transcription={currentData.transcription}
                    showSubtitles={showTranscription}
                    onToggleSubtitles={() => setShowTranscription(!showTranscription)}
                    subtitleSize={subtitleSize}
                    onSubtitleSizeChange={setSubtitleSize}
                    mindMapData={currentData}
                    currentTime={currentTime}
                  />
                </section>

                {/* Right Side - Summary and Transcription */}
                <div className="space-y-6">
                  {/* Dynamic Summary Panel */}
                  <section className="bg-white rounded-xl shadow-lg p-4 sm:p-6 relative">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold flex items-center text-gray-900">
                        <Brain className="w-5 h-5 mr-2 text-teal-700" />
                        Dynamic Summary
                      </h3>
                      <TextToSpeechButton
                        text={(() => {
                          const activeNodeIndex = currentData.nodes.findIndex(node => 
                            currentTime >= node.timestamp[0] && 
                            currentTime < node.timestamp[1]
                          );
                          return activeNodeIndex >= 0 ? currentData.nodes[activeNodeIndex].summary.join('. ') : currentData.root_topic;
                        })()}
                        title={(() => {
                          const activeNodeIndex = currentData.nodes.findIndex(node => 
                            currentTime >= node.timestamp[0] && 
                            currentTime < node.timestamp[1]
                          );
                          return activeNodeIndex >= 0 ? "Listen to current segment summary" : "Listen to video description";
                        })()}
                        variant="primary"
                        size="md"
                      />
                    </div>
                    <div className="text-gray-900 leading-relaxed text-sm sm:text-base font-medium space-y-4 min-h-0">
                      {/* Show currently playing node summary if available */}
                      {(() => {
                        const activeNodeIndex = currentData.nodes.findIndex(node => 
                          currentTime >= node.timestamp[0] && 
                          currentTime < node.timestamp[1]
                        );
                        if (activeNodeIndex >= 0) {
                          const activeNode = currentData.nodes[activeNodeIndex];
                          return (
                            <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border-l-4 border-blue-500">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                                <h4 className="font-bold text-blue-900">Currently Playing:</h4>
                                <span className="text-xs sm:text-sm bg-blue-100 text-blue-900 px-2 py-1 rounded-full font-medium">
                                  {Math.floor(activeNode.timestamp[0] / 60)}:{(Math.floor(activeNode.timestamp[0] % 60)).toString().padStart(2, '0')} - {Math.floor(activeNode.timestamp[1] / 60)}:{(Math.floor(activeNode.timestamp[1] % 60)).toString().padStart(2, '0')}
                                </span>
                              </div>
                              <h5 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">{activeNode.topic}</h5>
                              <div className="text-gray-800 leading-relaxed">
                                <ul className="list-disc list-inside space-y-1">
                                  {activeNode.summary.map((point, index) => (
                                    <li key={index} className="text-gray-800 text-sm sm:text-base">
                                      {point}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              {activeNode.keywords.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {activeNode.keywords.slice(0, 4).map((keyword, index) => (
                                    <span key={index} className="bg-blue-100 text-blue-900 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold border border-blue-300 shadow-sm hover:bg-blue-200 transition-colors">
                                      {keyword}
                                    </span>
                                  ))}
                                  {activeNode.keywords.length > 4 && (
                                    <span className="bg-blue-100 text-blue-900 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold border border-blue-300 shadow-sm">
                                      +{activeNode.keywords.length - 4} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        } else {
                          // Show overall video summary when no specific node is playing
                          return (
                            <div className="bg-white rounded-lg p-3 sm:p-4 border border-blue-200">
                              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                                Overall Video Summary:
                              </h4>
                              <ul className="list-disc list-inside space-y-2">
                                {currentData.root_topic.split(/[.!?]+/).filter(sentence => sentence.trim()).map((sentence, index) => (
                                  <li key={index} className="text-gray-900 text-sm sm:text-base">
                                    {sentence.trim()}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        }
                      })()}
                    </div>
                    <div className="mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs sm:text-sm text-gray-900 font-bold">
                        <strong>Tip:</strong> The summary above changes based on the current video timestamp!
                      </p>
                      <p className="text-sm text-gray-800 mt-2">
                        <strong>Current time:</strong> {Math.floor(currentTime / 60)}:{(Math.floor(currentTime % 60)).toString().padStart(2, '0')}
                      </p>
                      <p className="text-sm text-gray-800 mt-1">
                        <strong>Dataset:</strong> {currentData.nodes.length} nodes {uploadedData ? '(Custom)' : '(Built-in)'}
                      </p>
                    </div>
                  </section>

                  {/* Transcription Panel */}
                  {currentData.transcription && Array.isArray(currentData.transcription) && currentData.transcription.length > 0 && (
                    <section>
                      <TranscriptionPanel
                        transcription={currentData.transcription}
                        currentTime={currentTime}
                        isVisible={showTranscription}
                        onToggleVisibility={() => setShowTranscription(!showTranscription)}
                      />
                    </section>
                  )}
                </div>
              </div>
        )}

        {activeView === 'mindmap' && (
          <div className="w-full">
            <section data-tour="mind-map" className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
                <Map className="w-5 h-5 mr-2 text-teal-700" />
                Interactive Mind Map
                <button
                  onClick={handleDownloadMindMap}
                  tabIndex={0}
                  role="button"
                  aria-label="Download mind map as JSON file"
                  className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download JSON</span>
                </button>
              </h2>
              <MindMap
                data={currentData}
                onNodeClick={handleNodeClick}
                currentTime={currentTime}
              />
            </section>
          </div>
        )}
        </>
      </main>
      
      {/* JSON Upload Modal */}
      {showJsonUpload && (
        <JsonUpload
          onDataLoaded={handleDataLoaded}
          onClose={() => setShowJsonUpload(false)}
        />
      )}
      
      {/* Video Mind Map Generator Modal */}
      {showVideoGenerator && (
        <VideoMindMapGenerator
          onDataLoaded={handleVideoGeneratorDataLoaded}
          onClose={() => setShowVideoGenerator(false)}
        />
      )}
      
      {/* Quick Tour */}
      {hasAcceptedEthics && (
        <QuickTour
        isOpen={showTour}
        onClose={handleCloseTour}
        viewMode={activeView}
        />
      )}
      
      {hasAcceptedEthics && (
        <BiasReportModal
        isOpen={showBiasReport}
        onClose={() => setShowBiasReport(false)}
        contextData={biasReportContext}
        />
      )}
        </div>
      )}
      
      {/* Show loading screen while ethics not accepted */}
      {ethicsChecked && !hasAcceptedEthics && !showEthicsDisclaimer && (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading VideoMind...</p>
          </div>
        </div>
      )}
      
      {/* Show loading screen while checking ethics status */}
      {!ethicsChecked && (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Initializing VideoMind...</p>
          </div>
        </div>
      )}
    </>
  );
}

export default App;