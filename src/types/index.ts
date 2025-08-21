export interface MindMapNode {
  timestamp: [number, number]; // Start and end time as tuple
  text: string; // Full paragraph text
  summary: string[]; // Array of summary points - always an array
  keywords: string[]; // Array of keywords
  named_entities: [string, string][]; // Array of [entity, type] tuples
  emojis: string; // Emoji string
  best_image: string; // Base64 encoded best image for summary
  start_image: string; // Base64 encoded start image for node
  topic: string; // Topic title
  tts: string; // Base64 encoded audio
}

export interface ExpandedNodeData {
  parentIndex: number;
  summaryNode: {
    title: string;
    content: string;
    type: 'summary';
    position: Position;
    sceneImage?: string;
  };
  keyphraseNodes: {
    title: string;
    content: string;
    type: 'keyphrase';
    position: Position;
  }[];
  emojiNode: {
    title: string;
    content: string;
    type: 'emoji';
    position: Position;
  };
}

export interface MindMapData {
  video_url: string;
  root_topic: string; // Changed from 'root' to 'root_topic'
  transcription?: TranscriptionChunk[]; // Optional transcription chunks
  nodes: MindMapNode[]; // Changed from 'children' to 'nodes'
}

export interface TranscriptionChunk {
  timestamp: [number, number]; // Start and end time as tuple
  text: string; // Transcription text for this time segment
}

export interface Position {
  x: number;
  y: number;
}