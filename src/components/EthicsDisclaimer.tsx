import React, { useState } from 'react';
import { AlertTriangle, Info, Shield, Eye, X } from 'lucide-react';

interface EthicsDisclaimerProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const EthicsDisclaimer: React.FC<EthicsDisclaimerProps> = ({ isOpen, onClose, onAccept }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Responsible AI Use</h2>
                <p className="text-amber-100">Important information about AI-generated content</p>
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

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* AI Content Disclaimer */}
          <div className="mb-6 bg-amber-50 rounded-lg p-4 border border-amber-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-amber-800 mb-2">AI-Generated Content Notice</h3>
                <div className="text-amber-800 space-y-2">
                  <p><strong>This tool generates AI-powered summaries and mind maps.</strong> Please understand:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>AI-generated content is <strong>supplementary</strong> and designed to help you navigate video content more efficiently</li>
                    <li>It is <strong>not a replacement</strong> for watching the actual video content</li>
                    <li>Always refer to the original video for complete accuracy and full context</li>
                    <li>AI may miss nuances, context, or make interpretation errors</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Bias Mitigation Statement */}
          <div className="mb-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <Eye className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Bias Awareness & Source Transparency</h3>
                <div className="text-blue-800 space-y-2">
                  <p><strong>Important clarification about potential bias:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Our development team</strong> has carefully designed all prompts to avoid bias toward specific demographic groups</li>
                    <li><strong>Any bias that may appear</strong> originates from the underlying AI language models' training data, not from our design or intentions</li>
                    <li><strong>We do not introduce bias</strong> - our system is designed to be fair and equitable across all user groups</li>
                    <li><strong>Natural language model limitations</strong> may result in biased outputs despite our bias-free prompt design</li>
                    <li>The tool is designed to work equally well across diverse content types and speakers</li>
                    <li>We continuously monitor and work to identify any biased outputs for improvement</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Best Practices */}
          <div className="mb-6 bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">Best Practices for Use</h3>
                <div className="text-green-800 space-y-2">
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Critical thinking:</strong> Always apply your own judgment to AI-generated content</li>
                    <li><strong>Verification:</strong> Cross-reference important information with the original video</li>
                    <li><strong>Context awareness:</strong> Consider the full context that may not be captured in summaries</li>
                    <li><strong>Diverse perspectives:</strong> Be aware that AI may not capture all viewpoints present in content</li>
                    <li><strong>Feedback:</strong> Report any concerning outputs to help us improve the system</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy & Data */}
          <div className="mb-6 bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-purple-800 mb-2">Privacy & Data Handling</h3>
                <div className="text-purple-800 space-y-2">
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Videos are processed temporarily for analysis and are not permanently stored</li>
                    <li>Generated mind maps are stored locally in your browser</li>
                    <li>No personal data is collected beyond what's necessary for functionality</li>
                    <li>You can clear all data at any time using browser settings</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-600">
            By using this tool, you acknowledge understanding these guidelines.
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onAccept}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              I Understand
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EthicsDisclaimer;