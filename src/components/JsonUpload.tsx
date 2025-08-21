import React, { useState, useCallback } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, X, Video, Film } from 'lucide-react';
import { MindMapData } from '../types';
import { MindMapStorage } from '../utils/storage';

interface JsonUploadProps {
  onDataLoaded: (data: MindMapData, videoUrl?: string) => void;
  onClose: () => void;
}

const JsonUpload: React.FC<JsonUploadProps> = ({ onDataLoaded, onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [jsonPreview, setJsonPreview] = useState<string>('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [jsonFile, setJsonFile] = useState<File | null>(null);

  const validateJsonStructure = (data: any): data is MindMapData => {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid JSON: Must be an object');
    }

    if (!data.root_topic || typeof data.root_topic !== 'string') {
      throw new Error('Invalid JSON: Missing or invalid "root_topic" field');
    }

    if (!Array.isArray(data.nodes)) {
      throw new Error('Invalid JSON: "nodes" must be an array');
    }

    if (data.nodes.length === 0) {
      throw new Error('Invalid JSON: "nodes" array cannot be empty');
    }

    // Validate each node
    data.nodes.forEach((node: any, index: number) => {
      if (!node || typeof node !== 'object') {
        throw new Error(`Invalid JSON: Node ${index} must be an object`);
      }

      // Check required fields
      const requiredFields = ['timestamp', 'text', 'summary', 'keywords', 'named_entities', 'emojis', 'best_image', 'start_image', 'topic', 'tts'];
      for (const field of requiredFields) {
        if (!(field in node)) {
          throw new Error(`Invalid JSON: Node ${index} missing required field "${field}"`);
        }
      }

      // Validate timestamp format
      if (!Array.isArray(node.timestamp) || node.timestamp.length !== 2) {
        throw new Error(`Invalid JSON: Node ${index} timestamp must be an array of 2 numbers [start, end]`);
      }

      if (typeof node.timestamp[0] !== 'number' || typeof node.timestamp[1] !== 'number') {
        throw new Error(`Invalid JSON: Node ${index} timestamp values must be numbers`);
      }

      // Validate other fields
      if (typeof node.text !== 'string' || typeof node.topic !== 'string') {
        throw new Error(`Invalid JSON: Node ${index} text and topic must be strings`);
      }

      // Validate summary field - can be string or array of strings
      if (!Array.isArray(node.summary)) {
        throw new Error(`Invalid JSON: Node ${index} summary must be an array of strings`);
      }
      

      if (!Array.isArray(node.keywords)) {
        throw new Error(`Invalid JSON: Node ${index} keywords must be an array`);
      }

      // Validate named_entities
      if (!Array.isArray(node.named_entities)) {
        throw new Error(`Invalid JSON: Node ${index} named_entities must be an array`);
      }

      // Validate each named entity is a tuple of [string, string]
      node.named_entities.forEach((entity: any, entityIndex: number) => {
        if (!Array.isArray(entity) || entity.length !== 2) {
          throw new Error(`Invalid JSON: Node ${index} named_entities[${entityIndex}] must be an array of 2 elements [name, type]`);
        }
        if (typeof entity[0] !== 'string' || typeof entity[1] !== 'string') {
          throw new Error(`Invalid JSON: Node ${index} named_entities[${entityIndex}] must contain strings [name, type]`);
        }
      });

      // Validate transcription if present (optional field)
      if (data.transcription !== undefined) {
        if (!Array.isArray(data.transcription)) {
          throw new Error('Invalid JSON: "transcription" must be an array if present');
        }
        
        data.transcription.forEach((chunk: any, index: number) => {
          if (!chunk || typeof chunk !== 'object') {
            throw new Error(`Invalid JSON: Transcription chunk ${index} must be an object`);
          }
          
          if (!Array.isArray(chunk.timestamp) || chunk.timestamp.length !== 2) {
            throw new Error(`Invalid JSON: Transcription chunk ${index} timestamp must be an array of 2 numbers [start, end]`);
          }
          
          if (typeof chunk.timestamp[0] !== 'number' || typeof chunk.timestamp[1] !== 'number') {
            throw new Error(`Invalid JSON: Transcription chunk ${index} timestamp values must be numbers`);
          }
          
          if (typeof chunk.text !== 'string') {
            throw new Error(`Invalid JSON: Transcription chunk ${index} text must be a string`);
          }
        });
      }

      if (typeof node.emojis !== 'string') {
        throw new Error(`Invalid JSON: Node ${index} emojis must be a string`);
      }

      // Validate image fields
      if (typeof node.best_image !== 'string') {
        throw new Error(`Invalid JSON: Node ${index} best_image must be a string`);
      }

      if (typeof node.start_image !== 'string') {
        throw new Error(`Invalid JSON: Node ${index} start_image must be a string`);
      }
    });

    return true;
  };

  const processJsonFile = useCallback(async (file: File) => {
    setUploadStatus('loading');
    setErrorMessage('');

    try {
      const text = await file.text();
      setJsonPreview(text.substring(0, 500) + (text.length > 500 ? '...' : ''));
      
      const jsonData = JSON.parse(text);
      
      if (validateJsonStructure(jsonData)) {
        setJsonFile(file);
        // Don't set success yet - wait for both files if video is also uploaded
        if (!videoFile) {
          setUploadStatus('success');
        }
      }
    } catch (error) {
      setUploadStatus('error');
      if (error instanceof SyntaxError) {
        setErrorMessage('Invalid JSON format: ' + error.message);
      } else {
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
      }
    }
  }, [videoFile]);

  const processVideoFile = useCallback((file: File) => {
    const videoUrl = URL.createObjectURL(file);
    setVideoFile(file);
    setVideoPreview(videoUrl);
  }, []);

  const handleSubmit = useCallback(() => {
    if (jsonFile && videoFile) {
      // Re-parse the JSON file
      jsonFile.text().then(text => {
        const jsonData = JSON.parse(text);
        setUploadStatus('success');
        
        // Save to persistent storage first
        const videoUrl = URL.createObjectURL(videoFile);
        onDataLoaded(jsonData, videoUrl);
      }).catch(error => {
        setUploadStatus('error');
        setErrorMessage('Error processing JSON file: ' + error.message);
      });
    } else {
      setUploadStatus('error');
      setErrorMessage('Both JSON file and video file are required');
    }
  }, [jsonFile, videoFile, onDataLoaded]);

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
      const files = Array.from(e.dataTransfer.files);
      
      files.forEach(file => {
        if (file.type === 'application/json' || file.name.endsWith('.json')) {
          processJsonFile(file);
        } else if (file.type.startsWith('video/')) {
          processVideoFile(file);
        }
      });
      
      const hasJson = files.some(f => f.type === 'application/json' || f.name.endsWith('.json'));
      const hasVideo = files.some(f => f.type.startsWith('video/'));
      
      if (!hasJson) {
        setUploadStatus('error');
        setErrorMessage('JSON file is required');
      } else if (!hasVideo) {
        setUploadStatus('error');
        setErrorMessage('Video file is required');
      }
    }
  }, [processJsonFile, processVideoFile]);

  const handleJsonInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processJsonFile(file);
    }
  }, [processJsonFile]);

  const handleVideoInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processVideoFile(file);
    }
  }, [processVideoFile]);

  const handleReset = () => {
    setUploadStatus('idle');
    setErrorMessage('');
    setJsonPreview('');
    setVideoFile(null);
    setVideoPreview('');
    setJsonFile(null);
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Upload className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Upload JSON File</h2>
                <p className="text-blue-100">Upload JSON data and optional video file</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
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
                ? 'border-blue-500 bg-blue-50' 
                : uploadStatus === 'success'
                ? 'border-green-500 bg-green-50'
                : uploadStatus === 'error'
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
              }
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >

            {uploadStatus === 'loading' && (
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-lg font-medium text-gray-700">Processing JSON file...</p>
              </div>
            )}

            {uploadStatus === 'success' && (
              <div className="flex flex-col items-center space-y-4">
                <CheckCircle className="w-16 h-16 text-green-600" />
                <div>
                  <p className="text-xl font-bold text-green-800">Files uploaded successfully!</p>
                  <p className="text-green-600">Mind map is ready to be generated</p>
                  {jsonFile && (
                    <p className="text-sm text-green-700 mt-1">✓ JSON: {jsonFile.name}</p>
                  )}
                  {videoFile && (
                    <p className="text-sm text-green-700">✓ Video: {videoFile.name}</p>
                  )}
                </div>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Upload Another File
                </button>
              </div>
            )}

            {uploadStatus === 'error' && (
              <div className="flex flex-col items-center space-y-4">
                <AlertCircle className="w-16 h-16 text-red-600" />
                <div>
                  <p className="text-xl font-bold text-red-800">Upload Failed</p>
                  <p className="text-red-600 mt-2 max-w-md">{errorMessage}</p>
                </div>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {uploadStatus === 'idle' && (
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-4">
                  <FileText className="w-12 h-12 text-gray-400" />
                  <span className="text-2xl text-red-500 font-bold">+</span>
                  <Video className="w-12 h-12 text-gray-400" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-700">Drop your files here</p>
                  <p className="text-gray-500">Both JSON and video files are required</p>
                </div>
                <div className="text-sm text-gray-400">
                  Supports .json and video files
                </div>
              </div>
            )}
          </div>

          {/* File Upload Buttons */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* JSON File Upload */}
            <div className="relative">
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleJsonInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploadStatus === 'loading'}
                id="json-upload"
              />
              <label
                htmlFor="json-upload"
                className={`
                  flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                  ${jsonFile 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                  }
                `}
              >
                <FileText className={`w-8 h-8 mb-2 ${jsonFile ? 'text-green-600' : 'text-gray-400'}`} />
                <span className={`text-sm font-medium ${jsonFile ? 'text-green-800' : 'text-gray-700'}`}>
                  {jsonFile ? `✓ ${jsonFile.name}` : 'Upload JSON File'}
                </span>
                <span className="text-xs text-red-600 mt-1 font-medium">Required</span>
              </label>
            </div>

            {/* Video File Upload */}
            <div className="relative">
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploadStatus === 'loading'}
                id="video-upload"
              />
              <label
                htmlFor="video-upload"
                className={`
                  flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                  ${videoFile 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                  }
                `}
              >
                <Film className={`w-8 h-8 mb-2 ${videoFile ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className={`text-sm font-medium ${videoFile ? 'text-blue-800' : 'text-gray-700'}`}>
                  {videoFile ? `✓ ${videoFile.name}` : 'Upload Video File'}
                </span>
                <span className="text-xs text-red-600 mt-1 font-medium">Required</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          {jsonFile && videoFile && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleSubmit}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                disabled={uploadStatus === 'loading'}
              >
                🚀 Generate Mind Map
              </button>
            </div>
          )}

          {/* Video Preview */}
          {videoPreview && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <Film className="w-5 h-5 mr-2" />
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
            </div>
          )}

          {/* JSON Preview */}
          {jsonPreview && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                JSON Preview
              </h3>
              <div className="bg-gray-100 rounded-lg p-4 max-h-40 overflow-y-auto">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                  {jsonPreview}
                </pre>
              </div>
            </div>
          )}

          {/* Format Requirements */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">File Requirements</h3>
            
            <div className="mb-4">
              <h4 className="font-semibold text-blue-700 mb-2">JSON Format (Required):</h4>
            <pre className="text-sm text-blue-700 bg-white rounded p-3 overflow-x-auto">
{`{
  "root_topic": "Your Topic Title",
  "transcription": [
    {"timestamp": [0.0, 5.0], "text": "First transcription segment"},
    {"timestamp": [5.0, 10.0], "text": "Second transcription segment"}
  ],
  "nodes": [
    {
      "timestamp": [0.0, 12.5],
      "text": "Full paragraph text...",
      "summary": ["Summary point 1", "Summary point 2", "Summary point 3"],
      "keywords": ["keyword1", "keyword2"],
      "named_entities": [["Entity Name", "TYPE"], ["Another Entity", "TYPE"]],
      "named_entities": [["Entity Name", "TYPE"], ["Another Entity", "TYPE"]],
      "emojis": "🔬🧲🌍",
      "best_image": "data:image/jpeg;base64,/9j/4AAQ..." or "/9j/4AAQ...",
      "start_image": "data:image/jpeg;base64,/9j/4AAQ..." or "/9j/4AAQ...",
      "start_image": "data:image/jpeg;base64,/9j/4AAQ..." or "/9j/4AAQ...",
      "topic": "Node Title",
      "tts": "base64_encoded_audio..."
    }
  ]
}`}
            </pre>
            </div>
            
            <div className="mb-4">
              <h4 className="font-semibold text-blue-700 mb-2">Video File (Required):</h4>
              <div className="text-sm text-blue-700 bg-white rounded p-3">
                <p><strong>Supported formats:</strong> MP4, WebM, OGV, AVI, MOV (Required)</p>
                <p><strong>Note:</strong> Video file is required to properly sync the mind map with video content</p>
              </div>
            </div>
            
            <div className="mt-3 text-sm text-blue-700">
              <p><strong>Image Format:</strong> Base64 encoded images can include the data URL prefix or just the base64 string.</p>
              <p><strong>Supported formats:</strong> JPEG, PNG, GIF, WebP</p>
              <p><strong>Video & Transcription:</strong> Both video file and JSON are required. Transcription field is optional but recommended for subtitles.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonUpload;