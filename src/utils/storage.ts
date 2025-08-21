import { MindMapData } from '../types';

export interface StoredMindMap {
  id: string;
  title: string;
  timestamp: number;
  data: MindMapData;
  videoUrl?: string;
}

export class MindMapStorage {
  private static readonly STORAGE_KEY = 'mindmap_history';
  private static readonly MAX_ENTRIES = 10;

  static async saveMindMap(data: MindMapData, videoUrl?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const id = Date.now().toString();
        const title = data.root_topic || 'Untitled Mind Map';
        
        // Create a copy of the data without large binary fields to prevent quota exceeded
        const lightweightData: MindMapData = {
          ...data,
          nodes: data.nodes.map(node => ({
            ...node,
            // Remove large base64 encoded fields to save storage space
            best_image: '',
            start_image: '',
            tts: ''
          }))
        };
        
        const storedMindMap: StoredMindMap = {
          id,
          title,
          timestamp: Date.now(),
          data: lightweightData,
          videoUrl
        };

        const existing = this.getAllMindMaps();
        const updated = [storedMindMap, ...existing].slice(0, this.MAX_ENTRIES);
        
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
        resolve(id);
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllMindMaps(): StoredMindMap[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load mind maps from storage:', error);
      return [];
    }
  }

  static getMindMap(id: string): StoredMindMap | null {
    const all = this.getAllMindMaps();
    return all.find(item => item.id === id) || null;
  }

  static deleteMindMap(id: string): boolean {
    try {
      const existing = this.getAllMindMaps();
      const filtered = existing.filter(item => item.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Failed to delete mind map:', error);
      return false;
    }
  }

  static clearAll(): boolean {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Failed to clear mind maps:', error);
      return false;
    }
  }
}