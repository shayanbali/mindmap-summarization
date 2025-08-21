import React from 'react';
import { FileText, Tag, Image } from 'lucide-react';
import TextToSpeechButton from './TextToSpeechButton';
import { MindMapNode } from '../types';

interface ChildNodeProps {
  title: string;
  content: string;
  type: 'summary' | 'keyphrase' | 'emoji';
  position: { x: number; y: number };
  parentIndex: number;
  sceneImage?: string;
  nodeData?: MindMapNode; // Add node data to access named entities
  onMouseDown?: (e: React.MouseEvent) => void;
  isDragging?: boolean;
}

const ChildNode: React.FC<ChildNodeProps> = ({ 
  title, 
  content, 
  type, 
  position,
  sceneImage,
  nodeData,
  onMouseDown,
  isDragging = false
}) => {
  const [showTooltip, setShowTooltip] = React.useState(false);

  const isSummary = type === 'summary';
  const isEmoji = type === 'emoji';

  // Function to highlight named entities in text
  const highlightNamedEntities = (text: string, entities: [string, string][] = []) => {
    if (!entities.length) return text;
    
    let highlightedText = text;
    
    // Remove duplicates and sort entities by length (longest first) to avoid partial matches
    const uniqueEntities = entities.filter((entity, index, arr) => 
      arr.findIndex(([name]) => name.toLowerCase() === entity[0].toLowerCase()) === index
    );
    const sortedEntities = uniqueEntities.sort(([a], [b]) => b.length - a.length);
    
    sortedEntities.forEach(([entityName, entityType]) => {
      
      // Color coding based on entity type
      const getEntityColor = (type: string) => {
        switch (type) {
          case 'CHARACTER': return 'bg-blue-100 border border-blue-300 text-blue-800 shadow-sm font-semibold px-1.5 py-0.5 rounded';
          case 'LOCATION': return 'bg-green-100 border border-green-300 text-green-800 shadow-sm font-semibold px-1.5 py-0.5 rounded';
          case 'EVENT': return 'bg-red-100 border border-red-300 text-red-800 shadow-sm font-semibold px-1.5 py-0.5 rounded';
          case 'OBJECT': return 'bg-purple-100 border border-purple-300 text-purple-800 shadow-sm font-semibold px-1.5 py-0.5 rounded';
          case 'GROUP': return 'bg-orange-100 border border-orange-300 text-orange-800 shadow-sm font-semibold px-1.5 py-0.5 rounded';
          case 'ANIMAL': return 'bg-yellow-100 border border-yellow-300 text-yellow-800 shadow-sm font-semibold px-1.5 py-0.5 rounded';
          case 'CONCEPT': return 'bg-indigo-100 border border-indigo-300 text-indigo-800 shadow-sm font-semibold px-1.5 py-0.5 rounded';
          default: return 'bg-gray-100 border border-gray-300 text-gray-800 shadow-sm font-semibold px-1.5 py-0.5 rounded';
        }
      };
      
      // Create a case-insensitive regex that matches whole words
      const escapedEntityName = entityName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b(${escapedEntityName})\\b`, 'gi');
      
      // Only replace if the entity hasn't already been highlighted
      const tempText = highlightedText.replace(regex, (match) => {
        // Check if this text is already inside a <strong> tag
        const beforeMatch = highlightedText.substring(0, highlightedText.indexOf(match));
        const openTags = (beforeMatch.match(/<strong/g) || []).length;
        const closeTags = (beforeMatch.match(/<\/strong>/g) || []).length;
        
        // If we're inside a <strong> tag, don't highlight again
        if (openTags > closeTags) {
          return match;
        }
        
        return `<strong class="font-bold px-2 py-1 rounded-md border-2 ${getEntityColor(entityType)} cursor-help relative group hover:scale-105 transition-all duration-200" title="${entityType}">${match}<span class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 text-xs font-bold text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-gray-700">${entityType}</span></strong>`;
        return `<strong class="font-semibold px-1 py-0.5 rounded border ${getEntityColor(entityType)} cursor-help relative group hover:scale-105 transition-all duration-200" title="${entityType}">${match}<span class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs font-semibold text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-md">${entityType}</span></strong>`;
      });
      
      highlightedText = tempText;
    });
    
    return highlightedText;
  };
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMouseDown?.(e);
  };

  // Get highlighted content for summary nodes
  const getDisplayContent = () => {
    if (isSummary && nodeData?.named_entities) {
      return highlightNamedEntities(content, nodeData.named_entities);
    }
    return content;
  };
  return (
    <div 
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-15 transition-all duration-300 animate-fadeInScale ${
        isDragging ? 'cursor-grabbing scale-105' : 'cursor-grab hover:scale-105'
      }`}
      style={{ left: position.x, top: position.y }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onMouseDown={handleMouseDown}
    >
      {/* Glow effect */}
      {isDragging && (
        <div className="absolute inset-0 bg-yellow-400 rounded-lg blur-lg opacity-50 scale-125 animate-pulse"></div>
      )}
      <div className={`absolute inset-0 rounded-lg blur-md opacity-30 scale-110 ${
        isSummary ? 'bg-green-400' : 'bg-blue-400'
      }`}></div>
      
      <div className={`
        relative rounded-lg shadow-lg transition-all duration-300 backdrop-blur-sm border-2
        ${isDragging ? 'shadow-2xl rotate-1 scale-105' : 'hover:shadow-xl'}
        ${isSummary 
          ? 'bg-gradient-to-br from-green-50 to-emerald-100 text-green-900 border-green-400/60 hover:border-green-500/80'
          : isEmoji
          ? 'bg-gradient-to-br from-cyan-50 to-teal-100 text-cyan-900 border-cyan-400/60 hover:border-cyan-500/80'
          : 'bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-900 border-blue-400/60 hover:border-blue-500/80'
        }
        ${isSummary ? 'min-w-96 max-w-[28rem]' : isEmoji ? 'min-w-80 max-w-96' : 'min-w-72 max-w-88'}
        ${isSummary ? 'min-w-[32rem] max-w-[40rem]' : isEmoji ? 'min-w-96 max-w-[28rem]' : 'min-w-80 max-w-96'}
        overflow-hidden
      `}>
        
        {/* Header */}
        <div className={`p-6 ${isSummary ? 'bg-green-50' : isEmoji ? 'bg-cyan-50' : 'bg-blue-50'} border-b border-current/15`}>
          <div className="flex items-center gap-3 pr-8">
            {isSummary ? (
              <FileText className="w-10 h-10 text-green-700" />
            ) : isEmoji ? (
              <span className="text-4xl">😊</span>
            ) : (
              <Tag className="w-10 h-10 text-blue-700" />
            )}
            <h4 className="font-extrabold text-4xl text-gray-900">{title}</h4>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Scene image for summary nodes - prioritize JSON image over sceneImage */}
          {isSummary && (nodeData?.best_image || sceneImage) && (
            <div className="mb-6 rounded-xl overflow-hidden shadow-lg bg-gray-100">
              <img 
                src={nodeData?.best_image ? 
                  (nodeData.best_image.startsWith('data:') ? nodeData.best_image : `data:image/jpeg;base64,${nodeData.best_image}`) : 
                  sceneImage
                } 
                alt={`Scene from: ${title}`}
                className="w-full max-h-80 object-contain transition-transform duration-300 hover:scale-105 bg-white"
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
            </div>
          )}
          
          {isEmoji ? (
            <div className="flex flex-wrap gap-3 justify-center">
              {/* Split by emoji characters using regex to properly handle multi-byte emojis */}
              {content.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]/gu)?.map((emoji, index) => (
                <span key={index} className="text-6xl hover:scale-125 transition-transform cursor-pointer">
                  {emoji}
                </span>
              )) || (
                <div className="text-3xl text-cyan-900 font-medium">
                  {content}
                </div>
              )}
            </div>
          ) : (
            <div className={`text-5xl leading-relaxed font-bold ${
              isSummary ? 'text-green-900' : 'text-blue-900'
            }`}>
              {isSummary ? (
                <div className="space-y-4">
                  <ul className="list-disc list-inside space-y-3">
                    {nodeData?.summary.map((point, index) => {
                      const highlightedPoint = nodeData?.named_entities ? 
                        highlightNamedEntities(point, nodeData.named_entities) : 
                        point;
                      return (
                        <li key={index} className="text-green-900 text-4xl">
                          <span 
                            dangerouslySetInnerHTML={{ 
                              __html: highlightedPoint
                            }} 
                          />
                        </li>
                      );
                    }) || []}
                  </ul>
                </div>
              ) : (
                content
              )}
            </div>
          )}
          
          {/* Text-to-speech button for summary nodes */}
          {isSummary && (
            <div className="mt-8 pt-6 border-t border-current/15">
              <TextToSpeechButton
                text={nodeData?.summary.join('. ') || content}
                title="Listen to full summary"
                variant="minimal"
                size="xl"
                className="w-full justify-center"
              />
            </div>
          )}
        </div>


        {/* Type indicator */}
        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
          isSummary ? 'bg-green-600' : isEmoji ? 'bg-cyan-600' : 'bg-blue-600'
        }`}></div>
        
        {/* Enhanced tooltip for summary nodes */}
        {showTooltip && isSummary && (
          <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-6 bg-gray-900/98 backdrop-blur-sm text-white rounded-lg shadow-2xl max-w-lg border border-gray-700 pointer-events-none">
            <div className="text-3xl font-semibold mb-4 text-green-200 flex items-center gap-2">
              <FileText className="w-8 h-8" />
              Summary Details
            </div>
            <div className="text-2xl text-gray-100 leading-relaxed">Hover to see highlighted keywords and full context</div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900/98"></div>
          </div>
        )}
        
        {/* Tooltip for keyphrase nodes showing all keywords */}
        {showTooltip && !isSummary && !isEmoji && (
          <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-6 bg-gray-900/98 backdrop-blur-sm text-white rounded-lg shadow-2xl max-w-lg border border-gray-700 pointer-events-none">
            <div className="text-3xl font-semibold mb-4 text-blue-200 flex items-center gap-2">
              <Tag className="w-8 h-8" />
              All Keywords
            </div>
            <div className="text-3xl text-gray-100 leading-relaxed">{content}</div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900/98"></div>
          </div>
        )}
        
        {/* Tooltip for emoji nodes */}
        {showTooltip && isEmoji && (
          <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-6 bg-gray-900/98 backdrop-blur-sm text-white rounded-lg shadow-2xl max-w-lg border border-gray-700 pointer-events-none">
            <div className="text-3xl font-semibold mb-4 text-cyan-200 flex items-center gap-2">
              <span className="text-3xl">😊</span>
              Related Emojis
            </div>
            <div className="text-5xl leading-relaxed flex flex-wrap gap-3">
              {content.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]/gu)?.map((emoji, index) => (
                <span key={index}>{emoji}</span>
              )) || (
                <div className="text-3xl text-cyan-200">
                  {content}
                </div>
              )}
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900/98"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChildNode;