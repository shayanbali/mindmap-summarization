import React, { useState } from 'react';
import { AlertTriangle, Send, X, MessageSquare } from 'lucide-react';

interface BiasReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  contextData?: {
    videoTitle?: string;
    nodeContent?: string;
    timestamp?: number;
  };
}

const BiasReportModal: React.FC<BiasReportModalProps> = ({ isOpen, onClose, contextData }) => {
  const [reportType, setReportType] = useState<'bias' | 'inaccuracy' | 'inappropriate' | 'other'>('bias');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission (replace with actual reporting mechanism)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Store report locally for now (in production, send to server)
    const report = {
      type: reportType,
      description,
      context: contextData,
      timestamp: new Date().toISOString(),
      id: Math.random().toString(36).substr(2, 9)
    };

    const existingReports = JSON.parse(localStorage.getItem('bias_reports') || '[]');
    existingReports.push(report);
    localStorage.setItem('bias_reports', JSON.stringify(existingReports));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Auto-close after 2 seconds
    setTimeout(() => {
      onClose();
      setIsSubmitted(false);
      setDescription('');
      setReportType('bias');
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-bold">Report Issue</h2>
                <p className="text-red-100">Help us improve AI fairness</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">Report Submitted</h3>
              <p className="text-green-600">Thank you for helping us improve our AI system.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Context Information */}
              {contextData && (
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-2">Context Information:</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    {contextData.videoTitle && (
                      <p><strong>Video:</strong> {contextData.videoTitle}</p>
                    )}
                    {contextData.timestamp && (
                      <p><strong>Timestamp:</strong> {Math.floor(contextData.timestamp / 60)}:{(Math.floor(contextData.timestamp % 60)).toString().padStart(2, '0')}</p>
                    )}
                    {contextData.nodeContent && (
                      <p><strong>Content:</strong> {contextData.nodeContent.substring(0, 100)}...</p>
                    )}
                  </div>
                </div>
              )}

              {/* Report Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issue Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value as any)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="bias">Bias or Discrimination</option>
                  <option value="inaccuracy">Factual Inaccuracy</option>
                  <option value="inappropriate">Inappropriate Content</option>
                  <option value="other">Other Issue</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please describe the issue in detail. What specific bias, inaccuracy, or problem did you notice?"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 h-32 resize-none"
                  required
                />
              </div>

              {/* Guidelines */}
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Helpful reporting tips:</p>
                    <ul className="list-disc list-inside space-y-0.5 text-xs">
                      <li>Be specific about what content seemed biased or incorrect</li>
                      <li>Explain why you think it's problematic</li>
                      <li>Suggest what would be more appropriate if possible</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !description.trim()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Report
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BiasReportModal;