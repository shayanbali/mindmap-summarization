import React, { useState, useCallback } from 'react';
import { Upload, Video, Brain, AlertCircle, CheckCircle, X, Loader2, Download } from 'lucide-react';
import { MindMapData } from '../types';
import { mockMindMapData } from '../data/mockData';

interface VideoMindMapGeneratorProps {
  onDataLoaded: (data: MindMapData, videoUrl?: string) => void;
  onClose: () => void;
}

const VideoMindMapGenerator: React.FC<VideoMindMapGeneratorProps> = ({ onDataLoaded, onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [processingTime, setProcessingTime] = useState(0);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [downloadableData, setDownloadableData] = useState<MindMapData | null>(null);

  const processVideoFile = useCallback((file: File) => {
    // Validate file type
    if (!file.type.startsWith('video/')) {
      setUploadStatus('error');
      setErrorMessage('Please select a valid video file');
      return;
    }

    const videoUrl = URL.createObjectURL(file);
    setVideoFile(file);
    setVideoPreview(videoUrl);
    setUploadStatus('idle');
    setErrorMessage('');
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processVideoFile(file);
    }
  }, [processVideoFile]);

  const handleVideoInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processVideoFile(file);
    }
  }, [processVideoFile]);

  const handleGenerateMindMap = useCallback(async () => {
    if (!videoFile) return;

    let timer: NodeJS.Timeout | null = null;

    setUploadStatus('uploading');
    setProgress(0);
    setProcessingTime(0);
    setErrorMessage('');
    setVideoId(null);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('video', videoFile);

      // Start processing timer
      const startTime = Date.now();
      timer = setInterval(() => {
        setProcessingTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      // Make API request with upload progress tracking
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/generate-mindmap/`;
      
      let response;
      try {
        // Use XMLHttpRequest for upload progress tracking
        response = await new Promise<Response>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          
          // Track upload progress
          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              const percentComplete = Math.round((event.loaded / event.total) * 100);
              setProgress(percentComplete);
            }
          });
          
          xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              // Create a Response-like object
              const response = new Response(xhr.responseText, {
                status: xhr.status,
                statusText: xhr.statusText,
                headers: new Headers({
                  'Content-Type': xhr.getResponseHeader('Content-Type') || 'application/json'
                })
              });
              resolve(response);
            } else {
              reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
            }
          });
          
          xhr.addEventListener('error', () => {
            reject(new Error('Network error occurred during upload'));
          });
          
          xhr.addEventListener('timeout', () => {
            reject(new Error('Upload timed out'));
          });
          
          xhr.open('POST', apiUrl);
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.timeout = 300000; // 5 minute timeout
          xhr.send(formData);
        });
      } catch (fetchError) {
        throw new Error(`Unable to connect to the API server: ${fetchError.message}\n\nPlease ensure:\n• The ngrok tunnel is running\n• The API server is accessible at: ${apiUrl}\n• Your internet connection is stable\n\nTry demo mode to test the interface without API connection.`);
      }
      

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${response.statusText}. ${errorText}`);
      }

      // Parse initial response to get video ID
      const initialResponse = await response.json();
      console.log('Initial API response:', initialResponse);
      
      if (initialResponse.status !== 'processing' || !initialResponse.id) {
        throw new Error('Invalid response from server: expected processing status with ID');
      }
      
      const videoId = initialResponse.id;
      setVideoId(videoId);
      setUploadStatus('processing');
      setProgress(0); // Reset progress for processing phase
      
      // Start polling for results
      const pollForResult = async () => {
        try {
          const pollResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/mindmap-result/${videoId}`, {
            method: 'GET',
            mode: 'cors',
            credentials: 'omit',
            headers: {
              'Accept': 'application/json',
            },
          });
          
          if (!pollResponse.ok) {
            throw new Error(`Polling failed: ${pollResponse.status} ${pollResponse.statusText}`);
          }
          
          const pollResult = await pollResponse.json();
          console.log('Poll result:', pollResult);
          
          if (pollResult.status === 'processing') {
            // Still processing, continue polling (interval will handle the next call)
            return;
          }
          
          // Processing complete or failed - stop polling immediately
          if (pollingInterval) {
            clearInterval(pollingInterval);
            setPollingInterval(null);
          }
          if (timer) {
            clearInterval(timer);
          }
          
          // Check if response contains an error
          if (pollResult.error) {
            setUploadStatus('error');
            setErrorMessage(`Processing failed: ${pollResult.error}`);
            return;
          }
          
          // Processing complete successfully - the entire pollResult IS the mindmap data
          const mindMapData = pollResult;
          
          // Store the API response for display
          setApiResponse(pollResult);

          // Validate the response structure
          if (!mindMapData) {
            throw new Error('Empty response from API');
          }
          
          // Assign default root_topic if missing
          if (!mindMapData.root_topic) {
            mindMapData.root_topic = 'AI Generated Mind Map';
          }
          
          // Handle transcription field (optional)
          if (mindMapData.transcription && !Array.isArray(mindMapData.transcription)) {
            console.warn('Invalid transcription format, removing field');
            delete mindMapData.transcription;
          } else if (mindMapData.transcription) {
            // Validate transcription chunks
            mindMapData.transcription = mindMapData.transcription.filter((chunk: any) => {
              return chunk && 
                     Array.isArray(chunk.timestamp) && 
                     chunk.timestamp.length === 2 &&
                     typeof chunk.timestamp[0] === 'number' &&
                     typeof chunk.timestamp[1] === 'number' &&
                     typeof chunk.text === 'string';
            });
          }
          
          if (!Array.isArray(mindMapData.nodes)) {
            // Try to handle case where nodes might be empty or initialize with default
            if (!mindMapData.nodes) {
              mindMapData.nodes = [];
            } else {
              throw new Error('Missing or invalid nodes array in API response');
            }
          }
          
          if (mindMapData.nodes.length === 0) {
            console.warn('API returned empty nodes array, creating default node');
            mindMapData.nodes = [{
              timestamp: [0, 10],
              text: 'No content extracted from video',
              summary: ['The video processing did not extract any meaningful content.'],
              topic: 'Empty Result',
              keywords: [],
              named_entities: [],
              emojis: '❓',
              best_image: '',
              start_image: '',
              tts: ''
            }];
          }

          // Validate each node has required fields and add defaults if missing
          for (let i = 0; i < mindMapData.nodes.length; i++) {
            const node = mindMapData.nodes[i];
            if (!node.timestamp || !Array.isArray(node.timestamp) || node.timestamp.length !== 2) {
              console.warn(`Node ${i} has invalid timestamp, using default`);
              node.timestamp = [i * 10, (i + 1) * 10];
            }
            if (!node.text) node.text = 'No text available';
            // Ensure summary is always an array
            if (!node.summary) {
              node.summary = ['No summary available'];
            } else if (!Array.isArray(node.summary)) {
              // Convert string to array if needed
              node.summary = [String(node.summary)];
            } else if (node.summary.length === 0) {
              node.summary = ['No summary available'];
            }
            // Ensure all summary items are strings
            node.summary = node.summary.map(item => String(item));
            
            if (!node.topic) node.topic = `Topic ${i + 1}`;
            
            // Ensure keywords is always an array
            if (!node.keywords) {
              node.keywords = [];
            } else if (!Array.isArray(node.keywords)) {
              node.keywords = [];
            } else {
              // Ensure all keywords are strings
              node.keywords = node.keywords.map(item => String(item));
            }
            
            // Ensure named_entities is always an array of tuples
            if (!node.named_entities) {
              node.named_entities = [];
            } else if (!Array.isArray(node.named_entities)) {
              node.named_entities = [];
            } else {
              // Validate each named entity is a proper tuple
              node.named_entities = node.named_entities.filter(entity => 
                Array.isArray(entity) && entity.length === 2
              ).map(entity => [String(entity[0]), String(entity[1])]);
            }
            
            if (!node.emojis) node.emojis = '📝';
            if (!node.best_image) node.best_image = '';
            if (!node.start_image) node.start_image = '';
            if (!node.tts) node.tts = '';
          }

          console.log('Successfully parsed mind map data:', mindMapData);
          setUploadStatus('success');
          
          // Store the data for download
          setDownloadableData(mindMapData);
          
          // Don't automatically call onDataLoaded - let user download first if they want
          // The "View Mind Map" button will call onDataLoaded when clicked
          
        } catch (pollError) {
          console.error('Polling error:', pollError);
          // Stop polling on any error
          if (pollingInterval) {
            clearInterval(pollingInterval);
            setPollingInterval(null);
          }
          if (timer) {
            clearInterval(timer);
          }
          setUploadStatus('error');
          
          // Enhanced error handling for polling failures
          if (pollError instanceof Error) {
            if (pollError.name === 'TypeError' && pollError.message.includes('Failed to fetch')) {
              setErrorMessage(`Unable to check processing status: Failed to connect to API server.\n\nPlease ensure:\n• The ngrok tunnel is still running\n• The API server is accessible at: ${import.meta.env.VITE_API_BASE_URL}\n• Your internet connection is stable\n• The server hasn't gone offline during processing\n\nTry refreshing the page or restarting the process.`);
            } else if (pollError.message.includes('CORS') || pollError.message.includes('Access-Control')) {
              setErrorMessage('CORS error during status check: The API server needs to allow requests from this domain. Please check CORS configuration.');
            } else if (pollError.message.includes('JSON') || pollError.message.includes('Unexpected token')) {
              setErrorMessage('Response parsing error during status check: The API returned invalid JSON format.');
            } else {
              setErrorMessage(`Polling error: ${pollError.message}\n\nThe connection to the API server was lost while checking processing status. Please ensure the server is still running and try again.`);
            }
          } else {
            setErrorMessage('An unexpected error occurred while checking processing status. Please ensure the API server is running and try again.');
          }
        }
      };
      
      // Start polling every 3 seconds as per API specification
      const interval = setInterval(pollForResult, 3000);
      setPollingInterval(interval);
      
      // Also poll immediately
      pollForResult();

    } catch (error) {
      console.error('API Error:', error); // Debug log
      
      // Clean up timers and polling
      if (timer) {
        clearInterval(timer);
      }
      if (pollingInterval) {
        clearInterval(pollingInterval);
        setPollingInterval(null);
      }
      
      setApiResponse(null);
      
      // Enhanced error handling with specific messages
      if (error instanceof Error) {
        if (error.message.includes('CORS') || error.message.includes('Access-Control')) {
          setUploadStatus('error');
          setErrorMessage('CORS error: The API server needs to allow requests from this domain. Please check CORS configuration.');
        } else if (error.message.includes('JSON') || error.message.includes('Unexpected token')) {
          setUploadStatus('error');
          setErrorMessage('Response parsing error: The API returned invalid JSON format.');
        } else if (error.message.includes('API request failed')) {
          setUploadStatus('error');
          setErrorMessage(`API Error: ${error.message}`);
        } else if (error.message.includes('Processing failed')) {
          setUploadStatus('error');
          setErrorMessage(`${error.message}\n\nThe server encountered an error while processing your video. Please try again or use demo mode.`);
        } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
          // Generic fetch error - likely server unavailable
          setUploadStatus('error');
          setErrorMessage('Unable to connect to API server. The server may be down or unreachable.\n\nTroubleshooting steps:\n• Verify the ngrok tunnel is active\n• Check internet connectivity\n• Try demo mode to test the interface');
        } else {
          setUploadStatus('error');
          setErrorMessage(`Processing error: ${error.message}`);
        }
      } else {
        setUploadStatus('error');
        setErrorMessage('An unexpected error occurred while processing your video. Would you like to try demo mode instead?');
      }
    }
  }, [videoFile, onDataLoaded]);

  const handleReset = () => {
    // Clean up polling and timers immediately
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
    
    setUploadStatus('idle');
    setErrorMessage('');
    setApiResponse(null);
    setVideoFile(null);
    setProgress(0);
    setProcessingTime(0);
    setVideoId(null);
    setDownloadableData(null);
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
      setVideoPreview('');
    }
  };

  const handleDemoMode = useCallback(() => {
    if (!videoFile) return;

    // Stop any existing polling first
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }

    setUploadStatus('processing');
    setProgress(0);
    setProcessingTime(0);
    setErrorMessage('');

    // Simulate processing time for demo
    const startTime = Date.now();
    const timer = setInterval(() => {
      setProcessingTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    // Simulate processing delay
    setTimeout(() => {
      clearInterval(timer);
      setUploadStatus('success');
      
      // Add delay before calling onDataLoaded for demo mode too
      setTimeout(() => {
        // Create demo data with user's video
        const demoData = {
          ...mockMindMapData,
          root_topic: `Demo Analysis: ${videoFile.name}`,
          nodes: mockMindMapData.nodes.map(node => ({
            ...node,
            text: `[DEMO] ${node.text}`,
            summary: node.summary.map(point => `[DEMO] ${point}`)
          }))
        };
        
        // Store demo data for download and viewing
        setDownloadableData(demoData);
        setUploadStatus('success');
      }, 1000);
    }, 3000); // 3 second demo processing time
  }, [videoFile, onDataLoaded]);

  const handleDownloadJson = useCallback(() => {
    if (!downloadableData || !videoFile) return;

    // Create filename based on video file name
    const videoName = videoFile.name.replace(/\.[^/.]+$/, ""); // Remove extension
    const filename = `${videoName}_mindmap.json`;

    // Create downloadable JSON
    const jsonString = JSON.stringify(downloadableData, null, 2);
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
  }, [downloadableData, videoFile]);

  const handleViewMindMap = useCallback(() => {
    if (!downloadableData || !videoFile) return;
    
    // Pass the generated data and video URL to parent
    const videoUrl = URL.createObjectURL(videoFile);
    onDataLoaded(downloadableData, videoUrl);
  }, [downloadableData, videoFile, onDataLoaded]);

  // Cleanup polling when component unmounts or when processing completes
  React.useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">AI Mind Map Generator</h2>
                <p className="text-purple-100">Upload a video to generate an AI-powered mind map</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              disabled={uploadStatus === 'uploading' || uploadStatus === 'processing'}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Upload Area */}
          <div
            className={`
              relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
              ${dragActive 
                ? 'border-purple-500 bg-purple-50' 
                : uploadStatus === 'success'
                ? 'border-green-500 bg-green-50'
                : uploadStatus === 'error'
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'
              }
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {uploadStatus === 'uploading' && (
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-purple-600">{progress}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-xl font-bold text-purple-800">Uploading Video...</p>
                  <p className="text-purple-600">Please wait while we upload your video</p>
                </div>
              </div>
            )}

            {uploadStatus === 'processing' && (
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Loader2 className="w-16 h-16 text-purple-600 animate-spin" />
                  <Brain className="w-8 h-8 text-purple-800 absolute inset-0 m-auto animate-pulse" />
                </div>
                <div>
                  <p className="text-xl font-bold text-purple-800">AI Processing Video...</p>
                  <p className="text-purple-600">Generating mind map from your video content</p>
                  {videoId && (
                    <p className="text-sm text-purple-500 mt-1">
                      Processing ID: {videoId.substring(0, 8)}...
                    </p>
                  )}
                  <p className="text-sm text-purple-500 mt-2">
                    Processing time: {formatTime(processingTime)}
                  </p>
                  <p className="text-xs text-purple-400 mt-1">
                    Checking status every 3 seconds...
                  </p>
                  
                  {/* Processing Time Estimates */}
                  <div className="mt-4 bg-purple-100 rounded-lg p-3 border border-purple-300 max-w-md">
                    <p className="text-sm font-semibold text-purple-800 mb-2">⏰ Expected Processing Times:</p>
                    <div className="text-xs text-purple-700 space-y-1">
                      <div>• Up to 10 min video → ~6 min processing</div>
                      <div>• 10 to 20 min video → ~8 min processing</div>
                      <div>• 20 to 30 min video → ~10 min processing</div>
                      <div>• More than 30 min video → ~15 min processing</div>
                    </div>
                  </div>
                </div>
                <div className="w-full max-w-md bg-purple-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full animate-pulse w-full"></div>
                </div>
              </div>
            )}

            {uploadStatus === 'success' && (
              <div className="flex flex-col items-center space-y-4">
                <CheckCircle className="w-16 h-16 text-green-600" />
                <div>
                  <p className="text-xl font-bold text-green-800">Mind Map Generated!</p>
                  <p className="text-green-600">Your AI-powered mind map is ready</p>
                  <p className="text-sm text-green-700 mt-1">
                    Processing completed in {formatTime(processingTime)}
                  </p>
                </div>
                
                {/* Reuse Information */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 max-w-md">
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-white text-xs font-bold">💡</span>
                    </div>
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">💾 Save for Later!</p>
                      <p>Download the JSON file to reuse this mind map later. You can upload both the JSON file and your video using the <strong>"Upload JSON"</strong> option to recreate this exact mind map anytime.</p>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleDownloadJson}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg"
                    disabled={!downloadableData}
                  >
                    <Download className="w-5 h-5" />
                    Download JSON
                  </button>
                  <button
                    onClick={handleViewMindMap}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md hover:shadow-lg"
                    disabled={!downloadableData}
                  >
                    <Brain className="w-5 h-5" />
                    View Mind Map
                  </button>
                </div>
              </div>
            )}

            {uploadStatus === 'error' && (
              <div className="flex flex-col items-center space-y-4">
                <AlertCircle className="w-16 h-16 text-red-600" />
                <div>
                  <p className="text-xl font-bold text-red-800">Processing Failed</p>
                  <p className="text-red-600 mt-2 max-w-md">{errorMessage}</p>
                </div>
                <div className="flex gap-3">
                  {(errorMessage.includes('Try demo mode') || errorMessage.includes('demo mode instead')) && (
                    <button
                      onClick={handleDemoMode}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Try Demo Mode
                    </button>
                  )}
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {uploadStatus === 'idle' && (
              <div className="flex flex-col items-center space-y-4">
                <Video className="w-16 h-16 text-gray-400" />
                <div>
                  <p className="text-xl font-bold text-gray-700">Drop your video here</p>
                  <p className="text-gray-500">Or click to browse files</p>
                </div>
                <div className="text-sm text-gray-400">
                  Supports MP4, WebM, AVI, MOV (any size)
                </div>
              </div>
            )}
          </div>

          {/* API Response Display */}
          {apiResponse && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                API Response
              </h3>
              <div className="bg-gray-100 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* File Upload Button */}
          {uploadStatus === 'idle' && (
            <div className="mt-6">
              <div className="relative">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploadStatus === 'uploading' || uploadStatus === 'processing'}
                />
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-700">
                    Click to upload video file
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Video Preview */}
          {videoPreview && uploadStatus === 'idle' && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <Video className="w-5 h-5 mr-2" />
                Video Preview
              </h3>
              <div className="bg-black rounded-lg overflow-hidden">
                <video
                  src={videoPreview}
                  controls
                  className="w-full max-h-60 object-contain"
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              
              {/* Generate Button */}
              <div className="mt-4 flex justify-center">
                <button
                  onClick={handleGenerateMindMap}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-3"
                  disabled={!videoFile}
                >
                  <Brain className="w-6 h-6" />
                  🚀 Generate AI Mind Map
                </button>
              </div>
            </div>
          )}

          {/* API Information */}
          <div className="mt-6 bg-purple-50 rounded-lg p-4 border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-800 mb-3">How it works</h3>
            
            {/* AI Disclaimer */}
            <div className="mb-4 bg-amber-50 rounded-lg p-3 border border-amber-200">
              <div className="flex items-start gap-2">
                <span className="text-amber-600 text-lg">⚠️</span>
                <div className="text-sm text-amber-800">
                  <p className="font-semibold mb-1">Important Notice:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>The output from this tool is <strong>AI-generated content</strong></li>
                    <li>AI-generated summaries are <strong>supplementary aids</strong> designed to help you understand and navigate video content more efficiently</li>
                    <li>They are <strong>not replacements</strong> for watching the actual video - always refer to the original content for complete accuracy and context</li>
                    <li><strong>Any bias in outputs</strong> comes from the underlying AI models' training data, not from our development team's design</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-purple-700">
              <div className="flex items-start gap-2">
                <span className="font-bold text-purple-800">🌐</span>
                <span><strong>API Endpoint:</strong> Using {import.meta.env.VITE_API_BASE_URL || 'API_BASE_URL'} for processing. Ensure the ngrok tunnel is active.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-purple-800">⏱️</span>
                <span><strong>Async Processing:</strong> Videos are processed asynchronously. We poll for results every 3 seconds until complete.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-purple-800">1.</span>
                <span>Upload your video file of any size (MP4, WebM, AVI, MOV)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-purple-800">2.</span>
                <span>Server returns a processing ID and begins AI analysis</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-purple-800">3.</span>
                <span>We poll the server every 3 seconds to check processing status</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-purple-800">4.</span>
                <span>Once complete, the mind map is generated with timestamps, summaries, and keywords</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default VideoMindMapGenerator;