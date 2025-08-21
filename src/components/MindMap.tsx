import React, { useRef, useEffect, useState, useCallback } from 'react';
import { MindMapData, Position, ExpandedNodeData } from '../types';
import MindMapNode from './MindMapNode';
import ChildNode from './ChildNode';
import { ZoomIn, ZoomOut, RotateCcw, Move, Shuffle, Eye, EyeOff } from 'lucide-react';

interface MindMapProps {
  data: MindMapData;
  onNodeClick: (timestamp: number) => void;
  currentTime?: number;
  isFullscreen?: boolean;
}

const MindMap: React.FC<MindMapProps> = ({ data, onNodeClick, currentTime = 0, isFullscreen = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.8);
  const [viewPosition, setViewPosition] = useState({ x: 0, y: 0 });
  const [isDraggingView, setIsDraggingView] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [nodePositions, setNodePositions] = useState<Position[]>([]);
  const [draggingNodeIndex, setDraggingNodeIndex] = useState<number | null>(null);
  const [nodeDragOffset, setNodeDragOffset] = useState({ x: 0, y: 0 });
  const [expandedNodes, setExpandedNodes] = useState<ExpandedNodeData[]>([]);
  const [draggingChildNode, setDraggingChildNode] = useState<{
    expandedIndex: number;
    nodeType: 'summary' | 'keyphrase' | 'emoji';
    nodeIndex?: number;
  } | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [allImagesCollapsed, setAllImagesCollapsed] = useState(false);

  // Debounce state updates to prevent excessive re-renders
  const [lastUpdateTime, setLastUpdateTime] = useState(0);

  // Calculate clean, organized positions for main nodes
  const calculateGridRadialLayout = useCallback(() => {
    const centerX = 2000;
    const centerY = 1500;
    const nodeCount = data.nodes.length;
    
    if (nodeCount === 0) return [];
    
    const positions: Position[] = [];
    
    // For better organization, use more sectors per ring for larger datasets
    let sectorsPerRing = Math.min(8, nodeCount);
    
    // For high node counts, increase sectors per ring
    if (nodeCount > 12) {
      sectorsPerRing = Math.min(12, nodeCount);
    }
    
    const ringsNeeded = Math.ceil(nodeCount / sectorsPerRing);
    
    let nodeIndex = 0;
    
    for (let ring = 0; ring < ringsNeeded && nodeIndex < nodeCount; ring++) {
      // Base radius and spacing for good visual separation
      let baseRadius = 1600;
      let ringSpacing = 800;
      
      // Scale up for high node counts to prevent crowding
      if (nodeCount > 8) {
        baseRadius = 1800;
        ringSpacing = 900;
      }
      if (nodeCount > 12) {
        baseRadius = 2000;
        ringSpacing = 1000;
      }
      if (nodeCount > 20) {
        baseRadius = 2200;
        ringSpacing = 1100;
      }
      
      const radius = baseRadius + (ring * ringSpacing);
      const nodesInThisRing = Math.min(sectorsPerRing, nodeCount - nodeIndex);
      
      // Calculate angle spacing with padding to prevent overlap
      const totalAngle = 2 * Math.PI; 
      const paddingAngle = nodeCount > 8 ? (nodeCount > 12 ? 0.4 : 0.3) : 0.25;
      const usableAngle = totalAngle - (nodesInThisRing * paddingAngle);
      const angleStep = usableAngle / nodesInThisRing;
      
      for (let i = 0; i < nodesInThisRing; i++) {
        const angle = (i * (angleStep + paddingAngle)) - (Math.PI / 2); // Start from top
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        positions.push({ x, y });
        nodeIndex++;
      }
    }
    
    return positions;
  }, [data.nodes.length]);

  // Calculate positions for child nodes (summary and keyphrases)
  const calculateChildNodePositions = useCallback((parentIndex: number, parentPosition: Position): ExpandedNodeData => {
    const node = data.nodes[parentIndex];
    
    // Scene images for each summary based on the content
    const sceneImages = [
      'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400', // Forest scene
      'https://images.pexels.com/photos/326012/pexels-photo-326012.jpeg?auto=compress&cs=tinysrgb&w=400', // Cute rabbit
      'https://images.pexels.com/photos/4666748/pexels-photo-4666748.jpeg?auto=compress&cs=tinysrgb&w=400', // Conflict/tension
      'https://images.pexels.com/photos/3844788/pexels-photo-3844788.jpeg?auto=compress&cs=tinysrgb&w=400', // Protective stance
      'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=400', // Action/chase
      'https://images.pexels.com/photos/355952/pexels-photo-355952.jpeg?auto=compress&cs=tinysrgb&w=400', // Creative solutions
      'https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=400', // Justice/victory
      'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400', // Peace restored
    ];
    
    const childRadius = 800;
    const angleOffset = Math.PI / 4; // 45 degrees for better spacing
    
    // Calculate angle from center to parent
    const centerX = 2000;
    const centerY = 1500;
    const parentAngle = Math.atan2(parentPosition.y - centerY, parentPosition.x - centerX);
    
    // Summary node position (further out, perpendicular to parent-center line)
    const summaryAngle = parentAngle + angleOffset;
    const summaryDistance = childRadius * 1.5;
    const summaryX = parentPosition.x + summaryDistance * Math.cos(summaryAngle);
    const summaryY = parentPosition.y + summaryDistance * Math.sin(summaryAngle);
    
    // Keyphrase node position
    const keyphraseAngle = parentAngle - angleOffset;
    const keyphraseDistance = childRadius * 1.5;
    const keyphraseX = parentPosition.x + keyphraseDistance * Math.cos(keyphraseAngle);
    const keyphraseY = parentPosition.y + keyphraseDistance * Math.sin(keyphraseAngle);
    
    // Emoji node position (in the same angular range but farther out)
    const emojiAngle = parentAngle; // Same direction as parent-center line
    const emojiDistance = childRadius * 2.2;
    const emojiX = parentPosition.x + emojiDistance * Math.cos(emojiAngle);
    const emojiY = parentPosition.y + emojiDistance * Math.sin(emojiAngle);
    
    const keyphraseNodes = [{
      title: 'Keywords',
      content: node.keywords.join(', '), // Combine all keywords
      type: 'keyphrase' as const,
      position: { x: keyphraseX, y: keyphraseY }
    }];
    
    return {
      parentIndex,
      summaryNode: {
        title: 'Summary and Key Frame',
        content: node.summary,
        type: 'summary',
        position: { x: summaryX, y: summaryY },
        sceneImage: sceneImages[parentIndex] || sceneImages[0]
      },
      keyphraseNodes,
      emojiNode: {
        title: 'Related Emojis',
        content: node.emojis,
        type: 'emoji',
        position: { x: emojiX, y: emojiY }
      }
    };
  }, [data.nodes]);

  useEffect(() => {
    const positions = calculateGridRadialLayout();
    setNodePositions(positions);
    
    // Set initial view position and scale based on node count
    const nodeCount = data.nodes.length;
    let initialX = -500;
    let initialY = -400;
    let initialScale = 0.4;
    
    if (nodeCount > 8) {
      initialX = -700;
      initialY = -500;
      initialScale = 0.3;
    }
    if (nodeCount > 12) {
      initialX = -900;
      initialY = -600;
      initialScale = 0.25;
    }
    if (nodeCount > 20) {
      initialX = -1100;
      initialY = -700;
      initialScale = 0.2;
    }
    
    setViewPosition({ x: initialX, y: initialY });
    setScale(initialScale);
  }, [calculateGridRadialLayout]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 2.0)); // Allow more zoom in
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.2, 0.1)); // Allow much more zoom out
  };

  const handleReset = () => {
    // Reset view to initial position and scale
    const nodeCount = data.nodes.length;
    let resetX = -500;
    let resetY = -400;
    let resetScale = 0.4;
    
    if (nodeCount > 8) {
      resetX = -700;
      resetY = -500;
      resetScale = 0.3;
    }
    if (nodeCount > 12) {
      resetX = -900;
      resetY = -600;
      resetScale = 0.25;
    }
    if (nodeCount > 20) {
      resetX = -1100;
      resetY = -700;
      resetScale = 0.2;
    }
    
    setScale(resetScale);
    setViewPosition({ x: resetX, y: resetY });
    setExpandedNodes([]);
  };

  const handleReorganize = () => {
    const positions = calculateGridRadialLayout();
    setNodePositions(positions);
    
    // Reset view after reorganizing
    const nodeCount = data.nodes.length;
    let resetX = -500;
    let resetY = -400;
    let resetScale = 0.4;
    
    if (nodeCount > 8) {
      resetX = -700;
      resetY = -500;
      resetScale = 0.3;
    }
    if (nodeCount > 12) {
      resetX = -900;
      resetY = -600;
      resetScale = 0.25;
    }
    if (nodeCount > 20) {
      resetX = -1100;
      resetY = -700;
      resetScale = 0.2;
    }
    
    setViewPosition({ x: resetX, y: resetY });
    setScale(resetScale);
    setExpandedNodes([]);
  };

  const handleToggleAllImages = () => {
    setAllImagesCollapsed(prev => !prev);
  };

  const handleViewMouseDown = (e: React.MouseEvent) => {
    // Allow panning if we're not dragging a node and not clicking on a node/child node
    const isClickingOnNode = (e.target as HTMLElement).closest('[data-node-type]');
    if (!isClickingOnNode && draggingNodeIndex === null && draggingChildNode === null) {
      setIsDraggingView(true);
      setDragStart({ 
        x: e.clientX - viewPosition.x, 
        y: e.clientY - viewPosition.y 
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingView) {
      // When dragging the view, don't scale the movement
      setViewPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    } else if (draggingNodeIndex !== null) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        // For node dragging, account for scale and view position
        const newX = (e.clientX - rect.left - viewPosition.x - nodeDragOffset.x) / scale;
        const newY = (e.clientY - rect.top - viewPosition.y - nodeDragOffset.y) / scale;
        
        setNodePositions(prev => {
          const newPositions = [...prev];
          newPositions[draggingNodeIndex] = { x: newX, y: newY };
          return newPositions;
        });
      }
    } else if (draggingChildNode !== null) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        // For child node dragging, account for scale and view position
        const newX = (e.clientX - rect.left - viewPosition.x - nodeDragOffset.x) / scale;
        const newY = (e.clientY - rect.top - viewPosition.y - nodeDragOffset.y) / scale;
        
        setExpandedNodes(prev => {
          const newExpanded = [...prev];
          const targetExpanded = newExpanded[draggingChildNode.expandedIndex];
          
          if (draggingChildNode.nodeType === 'summary') {
            targetExpanded.summaryNode.position = { x: newX, y: newY };
          } else if (draggingChildNode.nodeType === 'emoji') {
            targetExpanded.emojiNode.position = { x: newX, y: newY };
          } else if (draggingChildNode.nodeType === 'keyphrase' && draggingChildNode.nodeIndex !== undefined) {
            targetExpanded.keyphraseNodes[draggingChildNode.nodeIndex].position = { x: newX, y: newY };
          }
          
          return newExpanded;
        });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDraggingView(false);
    setDraggingNodeIndex(null);
    setDraggingChildNode(null);
  };

  const handleNodeMouseDown = (e: React.MouseEvent, nodeIndex: number) => {
    e.stopPropagation();
    setDraggingNodeIndex(nodeIndex);
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const nodePos = nodePositions[nodeIndex];
      const nodeScreenX = rect.left + viewPosition.x + nodePos.x * scale;
      const nodeScreenY = rect.top + viewPosition.y + nodePos.y * scale;
      
      setNodeDragOffset({
        x: e.clientX - nodeScreenX,
        y: e.clientY - nodeScreenY,
      });
    }
  };

  const handleChildNodeMouseDown = (
    e: React.MouseEvent, 
    expandedIndex: number, 
    nodeType: 'summary' | 'keyphrase' | 'emoji', 
    nodeIndex?: number
  ) => {
    e.stopPropagation();
    setDraggingChildNode({ expandedIndex, nodeType, nodeIndex });
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const expandedNode = expandedNodes[expandedIndex];
      let nodePos: Position;
      
      if (nodeType === 'summary') {
        nodePos = expandedNode.summaryNode.position;
      } else if (nodeType === 'emoji') {
        nodePos = expandedNode.emojiNode.position;
      } else {
        nodePos = expandedNode.keyphraseNodes[nodeIndex || 0].position;
      }
      
      const nodeScreenX = rect.left + viewPosition.x + nodePos.x * scale;
      const nodeScreenY = rect.top + viewPosition.y + nodePos.y * scale;
      
      setNodeDragOffset({
        x: e.clientX - nodeScreenX,
        y: e.clientY - nodeScreenY,
      });
    }
  };

  const handleNodeClick = (nodeIndex: number) => {
    const isExpanded = expandedNodes.some(expanded => expanded.parentIndex === nodeIndex);
    
    if (isExpanded) {
      // Collapse - remove this node's children
      setExpandedNodes(prev => prev.filter(expanded => expanded.parentIndex !== nodeIndex));
    } else {
      // Expand - add child nodes
      const parentPosition = nodePositions[nodeIndex];
      if (parentPosition) {
        const childData = calculateChildNodePositions(nodeIndex, parentPosition);
        setExpandedNodes(prev => [...prev, childData]);
      }
    }
  };

  const handlePlayClick = (timestamp: number) => {
    // Only handle video playback
    onNodeClick(timestamp);
  };

  const [activeNodeIndex, setActiveNodeIndex] = useState(-1);
  
  // Update active node index with debouncing
  React.useEffect(() => {
    const updateActiveNode = () => {
      const newActiveIndex = data.nodes.findIndex(node => 
        currentTime >= node.timestamp[0] && 
        (data.nodes[data.nodes.indexOf(node) + 1]?.timestamp[0] > currentTime || 
         data.nodes.indexOf(node) === data.nodes.length - 1)
      );
      
      if (newActiveIndex !== activeNodeIndex) {
        setActiveNodeIndex(newActiveIndex);
      }
    };
    
    // Debounce the update
    const timeoutId = setTimeout(updateActiveNode, 200);
    return () => clearTimeout(timeoutId);
  }, [currentTime, data.nodes, activeNodeIndex]);


  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 rounded-xl shadow-inner overflow-hidden border border-blue-200">
      {/* Enhanced Controls */}
      <div className="absolute top-4 right-4 z-30 flex flex-wrap gap-2">
        <button
          onClick={handleZoomIn}
          tabIndex={0}
          role="button"
          aria-label="Zoom in mind map"
          className="p-2 bg-white/95 hover:bg-white rounded-lg shadow-md transition-all duration-200 hover:scale-105 border border-blue-200"
        >
          <ZoomIn className="w-5 h-5 text-gray-800" />
        </button>
        <button
          onClick={handleZoomOut}
          tabIndex={0}
          role="button"
          aria-label="Zoom out mind map"
          className="p-2 bg-white/95 hover:bg-white rounded-lg shadow-md transition-all duration-200 hover:scale-105 border border-blue-200"
        >
          <ZoomOut className="w-5 h-5 text-gray-800" />
        </button>
        <button
          onClick={handleToggleAllImages}
          tabIndex={0}
          role="button"
          aria-label={allImagesCollapsed ? "Show all images" : "Hide all images"}
          aria-pressed={!allImagesCollapsed}
          className="p-2 bg-white/95 hover:bg-white rounded-lg shadow-md transition-all duration-200 hover:scale-105 border border-blue-200"
        >
          {allImagesCollapsed ? (
            <Eye className="w-5 h-5 text-gray-800" />
          ) : (
            <EyeOff className="w-5 h-5 text-gray-800" />
          )}
        </button>
        <button
          onClick={handleReorganize}
          tabIndex={0}
          role="button"
          aria-label="Reorganize mind map layout"
          className="p-2 bg-white/95 hover:bg-white rounded-lg shadow-md transition-all duration-200 hover:scale-105 border border-blue-200"
        >
          <Shuffle className="w-5 h-5 text-gray-800" />
        </button>
        <button
          onClick={handleReset}
          tabIndex={0}
          role="button"
          aria-label="Reset mind map view"
          className="p-2 bg-white/95 hover:bg-white rounded-lg shadow-md transition-all duration-200 hover:scale-105 border border-blue-200"
        >
          <RotateCcw className="w-5 h-5 text-gray-800" />
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute top-4 left-4 z-30 max-w-xs">
        <div className="bg-white/98 backdrop-blur-sm rounded-lg shadow-md overflow-hidden border border-blue-200">
          {/* Collapsible header */}
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            tabIndex={0}
            role="button"
            aria-label={showInstructions ? "Hide controls instructions" : "Show controls instructions"}
            aria-expanded={showInstructions}
            className="w-full p-2.5 flex items-center justify-between text-xs text-gray-800 hover:bg-blue-50/50 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Move className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-medium">Controls</span>
            </div>
            <div className={`transform transition-transform duration-200 ${showInstructions ? 'rotate-180' : ''}`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          
          {/* Collapsible content */}
          {showInstructions && (
            <div className="p-2.5 pt-0 border-t border-blue-200/50">
              <div className="text-xs text-gray-900 space-y-1 leading-tight font-medium">
                <div className="font-bold text-blue-800 mb-1">Node Actions:</div>
                <div>• <span className="font-semibold">Click nodes</span> to expand/collapse</div>
                <div>• <span className="font-semibold">Click time badge</span> to jump to video</div>
                <div>• <span className="font-semibold">Drag nodes</span> to reposition</div>
                <div>• <span className="font-semibold">Listen button</span> for audio summary</div>
                
                <div className="font-bold text-blue-800 mb-1 mt-2">Navigation:</div>
                <div>• <span className="font-semibold">Drag background</span> to pan view</div>
                <div>• <span className="font-semibold">Zoom buttons</span> to scale in/out</div>
                <div>• <span className="font-semibold">Reset button</span> to center view</div>
                
                <div className="font-bold text-blue-800 mb-1 mt-2">View Options:</div>
                <div>• <span className="font-semibold">Eye button</span> to hide/show images</div>
                <div>• <span className="font-semibold">Shuffle button</span> to reorganize</div>
                <div>• <span className="font-semibold">Expanded nodes</span> show details</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        ref={containerRef}
        role="application"
        aria-label="Interactive mind map visualization"
        tabIndex={0}
        className={`w-full ${
          isFullscreen 
            ? 'h-screen' 
            : 'h-[500px] md:h-[700px] lg:h-[800px]'
        } select-none overflow-hidden ${
          isDraggingView ? 'cursor-grabbing' : draggingNodeIndex !== null || draggingChildNode !== null ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onMouseDown={handleViewMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ position: 'relative' }}
      >
        <div
          className="relative transition-transform duration-200 ease-out overflow-visible"
          style={{
            transform: `translate(${viewPosition.x}px, ${viewPosition.y}px) scale(${scale})`,
            transformOrigin: '0 0',
            width: data.nodes.length > 8 ? (data.nodes.length > 12 ? '3500px' : '3000px') : '2500px',
            height: data.nodes.length > 8 ? (data.nodes.length > 12 ? '3500px' : '3000px') : '2500px',
            minWidth: data.nodes.length > 8 ? (data.nodes.length > 12 ? '4000px' : '3500px') : '3000px',
            minHeight: data.nodes.length > 8 ? (data.nodes.length > 12 ? '3500px' : '3000px') : '2500px',
          }}
        >
          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" style={{ zIndex: 0 }}>
            <defs>
              <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="1.0" />
                <stop offset="50%" stopColor="#1d4ed8" stopOpacity="1.0" />
                <stop offset="100%" stopColor="#1e40af" stopOpacity="1.0" />
              </linearGradient>
              <linearGradient id="inactiveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6b7280" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#4b5563" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="childGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#059669" stopOpacity="1.0" />
              </linearGradient>
              <linearGradient id="summaryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#34d399" stopOpacity="1.0" />
                <stop offset="100%" stopColor="#059669" stopOpacity="1.0" />
              </linearGradient>
              <linearGradient id="keyphraseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="1.0" />
                <stop offset="100%" stopColor="#0e7490" stopOpacity="1.0" />
              </linearGradient>
              <linearGradient id="emojiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="1.0" />
                <stop offset="100%" stopColor="#0891b2" stopOpacity="1.0" />
              </linearGradient>
              <filter id="linkGlow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Main node connections */}
            {nodePositions.map((pos, index) => (
              <g key={`main-${index}`}>
                {/* Shadow line */}
                <line
                  x1="2002"
                  y1="1502"
                  x2={pos.x + 2}
                  y2={pos.y + 2}
                  stroke="rgba(0,0,0,0.4)"
                  strokeWidth={index === activeNodeIndex ? 8 : 5}
                  className="transition-all duration-500 ease-in-out"
                />
                {/* Main line */}
                <line
                  x1="2000"
                  y1="1500"
                  x2={pos.x}
                  y2={pos.y}
                  stroke={index === activeNodeIndex ? "url(#activeGradient)" : "url(#inactiveGradient)"}
                  strokeWidth={index === activeNodeIndex ? 7 : 4}
                  className="transition-all duration-500 ease-in-out"
                  filter={index === activeNodeIndex ? "url(#linkGlow)" : "none"}
                  strokeDasharray={index === activeNodeIndex ? "none" : "12,6"}
                  opacity="1.0"
                />
              </g>
            ))}
            
            {/* Child node connections */}
            {expandedNodes.map((expandedNode) => {
              const parentPos = nodePositions[expandedNode.parentIndex];
              if (!parentPos) return null;
              
              return (
                <g key={`expanded-${expandedNode.parentIndex}`}>
                  {/* Summary node connection */}
                  {/* Shadow line for summary */}
                  <line
                    x1={parentPos.x + 2}
                    y1={parentPos.y + 2}
                    x2={expandedNode.summaryNode.position.x + 2}
                    y2={expandedNode.summaryNode.position.y + 2}
                    stroke="rgba(0,0,0,0.4)"
                    strokeWidth="6"
                    className="transition-all duration-300"
                  />
                  {/* Main summary line */}
                  <line
                    x1={parentPos.x}
                    y1={parentPos.y}
                    x2={expandedNode.summaryNode.position.x}
                    y2={expandedNode.summaryNode.position.y}
                    stroke="url(#summaryGradient)"
                    strokeWidth="5"
                    className="transition-all duration-300"
                    strokeDasharray="15,8"
                    opacity="1.0"
                    filter="url(#linkGlow)"
                  />
                  
                  {/* Shadow line for emoji */}
                  <line
                    x1={parentPos.x + 2}
                    y1={parentPos.y + 2}
                    x2={expandedNode.emojiNode.position.x + 2}
                    y2={expandedNode.emojiNode.position.y + 2}
                    stroke="rgba(0,0,0,0.4)"
                    strokeWidth="6"
                    className="transition-all duration-300"
                  />
                  {/* Main emoji line */}
                  <line
                    x1={parentPos.x}
                    y1={parentPos.y}
                    x2={expandedNode.emojiNode.position.x}
                    y2={expandedNode.emojiNode.position.y}
                    stroke="url(#emojiGradient)"
                    strokeWidth="5"
                    className="transition-all duration-300"
                    strokeDasharray="18,9"
                    opacity="1.0"
                    filter="url(#linkGlow)"
                  />
                  
                  {/* Keyphrase node connections */}
                  {expandedNode.keyphraseNodes.map((keyphraseNode, index) => (
                    <g key={`keyphrase-${index}`}>
                      {/* Shadow line for keyphrase */}
                      <line
                        x1={parentPos.x + 2}
                        y1={parentPos.y + 2}
                        x2={keyphraseNode.position.x + 2}
                        y2={keyphraseNode.position.y + 2}
                        stroke="rgba(0,0,0,0.4)"
                        strokeWidth="6"
                        className="transition-all duration-300"
                      />
                      {/* Main keyphrase line */}
                      <line
                        x1={parentPos.x}
                        y1={parentPos.y}
                        x2={keyphraseNode.position.x}
                        y2={keyphraseNode.position.y}
                        stroke="url(#keyphraseGradient)"
                        strokeWidth="5"
                        className="transition-all duration-300"
                        strokeDasharray="16,8"
                        opacity="1.0"
                        filter="url(#linkGlow)"
                      />
                    </g>
                  ))}
                </g>
              );
            })}
          </svg>

          {/* Enhanced Root node */}
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: '2000px', top: '1500px', zIndex: 20 }}
            role="heading"
            aria-level={1}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-teal-500 rounded-3xl blur-2xl opacity-40 scale-150 animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-teal-600 rounded-3xl blur-xl opacity-60 scale-125"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-500 rounded-3xl blur-lg opacity-30 scale-110 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-blue-600 via-teal-600 to-teal-700 text-white p-16 rounded-3xl shadow-2xl border-4 border-white/40 backdrop-blur-sm min-w-[600px]">
                <h2 className="text-6xl font-black text-center leading-tight max-w-2xl">
                  {data.root_topic}
                </h2>
                <div className="absolute -top-6 -left-6 w-18 h-18 bg-gradient-to-br from-green-400 to-teal-500 rounded-full animate-pulse flex items-center justify-center shadow-xl border-2 border-white/50">
                  <div className="w-9 h-9 bg-white rounded-full opacity-90"></div>
                </div>
                <div className="absolute -top-4 -right-4 w-9 h-9 bg-white/30 rounded-full shadow-lg"></div>
                <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-white/25 rounded-full shadow-lg"></div>
                <div className="absolute top-1/2 -right-5 w-7 h-7 bg-yellow-400 rounded-full animate-bounce shadow-lg"></div>
                <div className="absolute -bottom-5 right-1/3 w-6 h-6 bg-pink-400 rounded-full animate-pulse shadow-lg"></div>
              </div>
            </div>
          </div>

          {/* Main nodes */}
          {data.nodes.map((node, index) => (
            <div key={`main-node-${index}`} style={{ zIndex: 20 }}>
              <div data-node-type="main">
                <MindMapNode
                  node={node}
                  position={nodePositions[index] || { x: 0, y: 0 }}
                  onNodeClick={() => handleNodeClick(index)}
                  onPlayClick={handlePlayClick}
                  onMouseDown={(e) => handleNodeMouseDown(e, index)}
                  onReportIssue={(context) => {
                    // This would need to be passed down from App component
                    console.log('Report issue:', context);
                  }}
                  isActive={index === activeNodeIndex}
                  isDragging={draggingNodeIndex === index}
                  isExpanded={expandedNodes.some(expanded => expanded.parentIndex === index)}
                  forceImageCollapsed={allImagesCollapsed}
                />
              </div>
            </div>
          ))}
          
          {/* Child nodes (summary and keyphrases) */}
          {expandedNodes.map((expandedNode, expandedIndex) => (
            <div key={`children-${expandedNode.parentIndex}`} style={{ zIndex: 30 }}>
              {/* Summary node */}
              <div data-node-type="child">
                <ChildNode
                  title={expandedNode.summaryNode.title}
                  content={expandedNode.summaryNode.content}
                  type={expandedNode.summaryNode.type}
                  position={expandedNode.summaryNode.position}
                  parentIndex={expandedNode.parentIndex}
                  sceneImage={expandedNode.summaryNode.sceneImage}
                  nodeData={data.nodes[expandedNode.parentIndex]}
                  onMouseDown={(e) => handleChildNodeMouseDown(e, expandedIndex, 'summary')}
                  isDragging={draggingChildNode?.expandedIndex === expandedIndex && draggingChildNode?.nodeType === 'summary'}
                />
              </div>
              
              {/* Emoji node */}
              <div data-node-type="child">
                <ChildNode
                  title={expandedNode.emojiNode.title}
                  content={expandedNode.emojiNode.content}
                  type={expandedNode.emojiNode.type}
                  position={expandedNode.emojiNode.position}
                  parentIndex={expandedNode.parentIndex}
                  onMouseDown={(e) => handleChildNodeMouseDown(e, expandedIndex, 'emoji')}
                  isDragging={draggingChildNode?.expandedIndex === expandedIndex && draggingChildNode?.nodeType === 'emoji'}
                />
              </div>
              
              {/* Keyphrase nodes */}
              {expandedNode.keyphraseNodes.map((keyphraseNode, index) => (
                <div key={`keyphrase-${expandedNode.parentIndex}-${index}`} data-node-type="child">
                  <ChildNode
                    title={keyphraseNode.title}
                    content={keyphraseNode.content}
                    type={keyphraseNode.type}
                    position={keyphraseNode.position}
                    parentIndex={expandedNode.parentIndex}
                    onMouseDown={(e) => handleChildNodeMouseDown(e, expandedIndex, 'keyphrase', index)}
                    isDragging={draggingChildNode?.expandedIndex === expandedIndex && draggingChildNode?.nodeType === 'keyphrase' && draggingChildNode?.nodeIndex === index}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Timeline indicator */}
      <div className="absolute bottom-4 left-4 right-4 z-30">
        <div 
          className="bg-white/98 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-blue-200"
          role="region"
          aria-label="Video timeline progress"
        >
          <div className="flex items-center justify-between text-base text-gray-900 mb-2">
            <span className="font-semibold flex items-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></div>
              Timeline Progress
            </span>
            <span className="font-mono bg-gradient-to-r from-blue-100 to-teal-100 px-3 py-1 rounded-lg text-gray-900 font-bold text-lg border border-blue-300">
              {Math.floor(currentTime / 60)}:{(Math.floor(currentTime % 60)).toString().padStart(2, '0')}
            </span>
          </div>
          <div 
            className="w-full bg-blue-200 rounded-full h-3 overflow-hidden shadow-inner border border-blue-300"
            role="progressbar"
            aria-valuenow={currentTime}
            aria-valuemax={data.nodes[data.nodes.length - 1]?.timestamp[1] || 1}
          >
            <div 
              className="bg-gradient-to-r from-blue-500 via-teal-500 to-teal-600 h-3 rounded-full transition-all duration-500 shadow-sm relative"
              style={{ 
                width: `${Math.min((currentTime / (data.nodes[data.nodes.length - 1]?.timestamp[1] || 1)) * 100, 100)}%` 
              }}
            >
              <div className="absolute right-0 top-0 w-1 h-3 bg-white/50 rounded-full"></div>
            </div>
          </div>
          <div className="flex justify-between text-sm text-gray-700 mt-2 font-medium">
            <span className="font-semibold text-gray-800">0:00</span>
            <span className="font-semibold text-gray-800">
              {Math.floor((data.nodes[data.nodes.length - 1]?.timestamp[1] || 0) / 60)}:
              {(Math.floor((data.nodes[data.nodes.length - 1]?.timestamp[1] || 0) % 60)).toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MindMap;