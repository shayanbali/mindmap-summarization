import { MindMapData } from '../types';

export const mockMindMapData: MindMapData = {
  video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  root_topic: "Big Buck Bunny: A Story of Friendship and Adventure",
  transcription: [
    { timestamp: [0, 15], text: "In a peaceful forest, the morning sun filters through the trees, creating a serene atmosphere." },
    { timestamp: [15, 30], text: "We meet Big Buck Bunny, a large and gentle rabbit who enjoys the simple pleasures of forest life." },
    { timestamp: [30, 45], text: "His kind nature and peaceful demeanor make him a beloved figure in the woodland community." },
    { timestamp: [45, 60], text: "The tranquil morning is about to be disrupted by unexpected visitors." },
    { timestamp: [60, 90], text: "Three mischievous rodents arrive in the forest, looking for trouble and causing chaos." },
    { timestamp: [90, 120], text: "They begin to harass and bully the smaller woodland creatures, disrupting the peace." },
    { timestamp: [120, 150], text: "Big Buck Bunny witnesses this bullying and feels compelled to take action." },
    { timestamp: [150, 180], text: "This moment marks the turning point where our gentle protagonist becomes a protector." },
    { timestamp: [180, 210], text: "An epic chase sequence begins as Big Buck Bunny pursues the troublemakers through the forest." },
    { timestamp: [210, 240], text: "The action intensifies as our hero demonstrates his determination and surprising agility." },
    { timestamp: [240, 270], text: "Bunny uses his intelligence and the forest environment to outsmart the bullies." },
    { timestamp: [270, 300], text: "Creative traps and clever solutions turn the forest itself into his ally." },
    { timestamp: [300, 330], text: "The bullies face the consequences of their actions through Bunny's ingenious plans." },
    { timestamp: [330, 360], text: "Justice is served in a satisfying and humorous way that teaches valuable lessons." },
    { timestamp: [360, 390], text: "The forest returns to its peaceful state with all creatures living harmoniously once again." },
    { timestamp: [390, 400], text: "The story concludes with a restored sense of community and friendship among all forest dwellers." }
  ],
  nodes: [
    {
      timestamp: [15, 45],
      text: "The peaceful forest where Big Buck Bunny lives, establishing the serene environment before the adventure begins. This opening sequence introduces us to the tranquil world that will soon be disrupted.",
      summary: [
        "The peaceful forest where Big Buck Bunny lives",
        "Establishing the serene environment before the adventure begins",
        "Opening sequence introduces the tranquil world"
      ],
      keywords: ["forest", "peaceful", "bunny", "nature"],
      named_entities: [["Big Buck Bunny", "CHARACTER"], ["forest", "LOCATION"], ["adventure", "EVENT"]],
      emojis: "🌲 🌿 🐰 🌳 🍃 ☀️",
      best_image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGFkNjZkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Gb3Jlc3QgU2NlbmU8L3RleHQ+PC9zdmc+",
      start_image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMmVjYzQwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TdGFydCBTY2VuZTwvdGV4dD48L3N2Zz4=",
      topic: "Introduction & Setting",
      tts: "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAE..."
    },
    {
      timestamp: [45, 90],
      text: "Meet Big Buck Bunny, a large, gentle rabbit who enjoys the simple pleasures of forest life. He is characterized by his kind nature and peaceful demeanor, making him a beloved figure in the woodland community.",
      summary: [
        "Meet Big Buck Bunny, a large, gentle rabbit",
        "Enjoys the simple pleasures of forest life",
        "Characterized by his kind nature and peaceful demeanor"
      ],
      keywords: ["big bunny", "gentle", "forest life", "character"],
      named_entities: [["Big Buck Bunny", "CHARACTER"], ["rabbit", "ANIMAL"], ["woodland community", "GROUP"]],
      emojis: "🐰 💚 🌱 😊 🏡 🌼",
      best_image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjU5ZTBiIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5CdW5ueSBJbnRybzwvdGV4dD48L3N2Zz4=",
      start_image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmY2MzQ3Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5DaGFyYWN0ZXI8L3RleHQ+PC9zdmc+",
      topic: "Character Introduction",
      tts: "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAE..."
    },
    {
      timestamp: [90, 120],
      text: "Three rodents begin to harass and bully smaller woodland creatures, disrupting the peace. Their aggressive behavior creates tension and conflict in what was once a harmonious environment.",
      summary: [
        "Three rodents begin to harass smaller woodland creatures",
        "Disrupting the peace with aggressive behavior",
        "Creates tension and conflict in the harmonious environment"
      ],
      keywords: ["bullying", "rodents", "harassment", "conflict"],
      named_entities: [["rodents", "ANIMAL"], ["woodland creatures", "GROUP"], ["conflict", "EVENT"]],
      emojis: "😠 🐭 💢 ⚡ 😢 🚫",
      best_image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGM0NjI2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Db25mbGljdDwvdGV4dD48L3N2Zz4=",
      start_image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmY0NDQ0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5CdWxseWluZzwvdGV4dD48L3N2Zz4=",
      topic: "The Bullying Incident",
      tts: "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAE..."
    },
    {
      timestamp: [120, 180],
      text: "Big Buck Bunny witnesses the bullying and decides he must take action to protect his friends. This moment marks the turning point where our gentle protagonist becomes a protector.",
      summary: [
        "Big Buck Bunny witnesses the bullying incident",
        "Decides he must take action to protect his friends",
        "Turning point where gentle protagonist becomes a protector"
      ],
      keywords: ["witness", "protection", "decision", "friendship"],
      named_entities: [["Big Buck Bunny", "CHARACTER"], ["bullying", "EVENT"], ["friends", "GROUP"], ["protagonist", "CHARACTER"]],
      emojis: "👀 🛡️ 💪 🤝 ❤️ ⚖️",
      best_image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5EZWNpc2lvbjwvdGV4dD48L3N2Zz4=",
      start_image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNjY2NjY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5XaXRuZXNzPC90ZXh0Pjwvc3ZnPg==",
      topic: "Bunny's Reaction",
      tts: "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAE..."
    },
    {
      timestamp: [180, 240],
      text: "An epic chase sequence begins as Big Buck Bunny pursues the bullies through the forest. The action intensifies as our hero demonstrates his determination and agility.",
      summary: [
        "Epic chase sequence begins through the forest",
        "Big Buck Bunny pursues the bullies",
        "Action intensifies showing hero's determination and agility"
      ],
      keywords: ["chase", "pursuit", "action", "forest"],
      named_entities: [["Big Buck Bunny", "CHARACTER"], ["chase sequence", "EVENT"], ["bullies", "GROUP"], ["forest", "LOCATION"], ["hero", "CHARACTER"]],
      emojis: "🏃 💨 🌪️ 🎬 🔥 ⚡",
      best_image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjU5ZTBiIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5DaGFzZSBTZXF1ZW5jZTwvdGV4dD48L3N2Zz4=",
      start_image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmY5NTAwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QdXJzdWl0PC90ZXh0Pjwvc3ZnPg==",
      topic: "The Chase Begins",
      tts: "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAE..."
    },
    {
      timestamp: [240, 300],
      text: "Bunny uses clever traps and the environment to outsmart the bullies in creative ways. His intelligence and resourcefulness shine as he turns the forest itself into his ally.",
      summary: [
        "Bunny uses clever traps to outsmart the bullies",
        "Uses the environment in creative ways",
        "Intelligence and resourcefulness shine as forest becomes ally"
      ],
      keywords: ["traps", "cleverness", "environment", "strategy"],
      named_entities: [["Bunny", "CHARACTER"], ["traps", "OBJECT"], ["bullies", "GROUP"], ["forest", "LOCATION"], ["environment", "LOCATION"]],
      emojis: "🧠 🪤 💡 🎯 🔧 ✨",
      best_image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDU5NjY5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5DbGV2ZXIgVHJhcHM8L3RleHQ+PC9zdmc+",
      start_image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDA3Yjg4Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TdHJhdGVneTwvdGV4dD48L3N2Zz4=",
      topic: "Creative Solutions",
      tts: "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAE..."
    },
    {
      timestamp: [300, 360],
      text: "The bullies get their comeuppance through Bunny's ingenious plans and natural consequences. Justice is served in a satisfying and humorous way that teaches valuable lessons.",
      summary: [
        "Bullies get their comeuppance through ingenious plans",
        "Natural consequences serve justice",
        "Satisfying and humorous resolution teaches valuable lessons"
      ],
      keywords: ["justice", "comeuppance", "consequences", "resolution"],
      named_entities: [["bullies", "GROUP"], ["Bunny", "CHARACTER"], ["comeuppance", "EVENT"], ["justice", "CONCEPT"], ["consequences", "CONCEPT"]],
      emojis: "⚖️ 💥 🎊 ✅ 🏆 😤",
      best_image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTY1MzNmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5KdXN0aWNlPC90ZXh0Pjwvc3ZnPg==",
      start_image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5SZXNvbHV0aW9uPC90ZXh0Pjwvc3ZnPg==",
      topic: "Justice Served",
      tts: "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAE..."
    },
    {
      timestamp: [360, 400],
      text: "The forest returns to its peaceful state, with all creatures living harmoniously once again. The story concludes with a restored sense of community and friendship.",
      summary: [
        "Forest returns to its peaceful state",
        "All creatures living harmoniously once again",
        "Story concludes with restored community and friendship"
      ],
      keywords: ["peace", "harmony", "restoration", "conclusion"],
      named_entities: [["forest", "LOCATION"], ["creatures", "GROUP"], ["community", "GROUP"], ["friendship", "CONCEPT"]],
      emojis: "☮️ 🌈 🕊️ 🤗 🌸 😌",
      best_image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGFkNjZkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QZWFjZSBSZXN0b3JlZDwvdGV4dD48L3N2Zz4=",
      start_image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNjZjYzY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5IYXJtb255PC90ZXh0Pjwvc3ZnPg==",
      topic: "Peace Restored",
      tts: "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAE..."
    }
  ]
};

// Test data with different node counts
export const smallMindMapData: MindMapData = {
  video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  root_topic: "Small Dataset Test - 3 Nodes",
  transcription: [
    { timestamp: [0, 15], text: "Introduction to the peaceful forest setting where our story begins." },
    { timestamp: [15, 45], text: "Meet Big Buck Bunny, the main character of our tale." },
    { timestamp: [45, 90], text: "The gentle rabbit enjoys his quiet life in the woodland." },
    { timestamp: [90, 120], text: "Conflict arises when troublemakers disturb the peace." }
  ],
  nodes: [
    {
      timestamp: [15, 45],
      text: "Introduction to the peaceful forest setting.",
      summary: ["The peaceful forest where Big Buck Bunny lives"],
      keywords: ["forest", "peaceful", "bunny"],
      named_entities: [["Big Buck Bunny", "CHARACTER"], ["forest", "LOCATION"]],
      emojis: "🌲 🐰 ☀️",
      best_image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNGFkNjZkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Gb3Jlc3QgU2NlbmU8L3RleHQ+PC9zdmc+",
      start_image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMmVjYzQwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TZXR0aW5nPC90ZXh0Pjwvc3ZnPg==",
      topic: "Forest Setting",
      tts: "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAE..."
    },
    {
      timestamp: [45, 90],
      text: "Meet the main character, Big Buck Bunny.",
      summary: ["Introduction to Big Buck Bunny character"],
      keywords: ["bunny", "character", "gentle"],
      named_entities: [["Big Buck Bunny", "CHARACTER"]],
      emojis: "🐰 💚 😊",
      best_image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjU5ZTBiIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5CdW5ueSBJbnRybzwvdGV4dD48L3N2Zz4=",
      start_image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmY2MzQ3Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5DaGFyYWN0ZXI8L3RleHQ+PC9zdmc+",
      topic: "Character Intro",
      tts: "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAE..."
    },
    {
      timestamp: [90, 120],
      text: "Conflict begins with bullying incident.",
      summary: ["Three rodents begin to harass smaller creatures"],
      keywords: ["bullying", "conflict", "rodents"],
      named_entities: [["rodents", "ANIMAL"], ["bullying", "EVENT"]],
      emojis: "😠 🐭 💢",
      best_image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGM0NjI2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Db25mbGljdDwvdGV4dD48L3N2Zz4=",
      start_image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmY0NDQ0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5CdWxseWluZzwvdGV4dD48L3N2Zz4=",
      topic: "Conflict",
      tts: "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAE..."
    }
  ]
};

export const largeMindMapData: MindMapData = {
  video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  root_topic: "Large Dataset Test - 15 Nodes",
  transcription: [
    ...mockMindMapData.transcription || [],
    { timestamp: [400, 430], text: "Extended character development shows deeper relationships forming." },
    { timestamp: [430, 450], text: "The bonds between characters strengthen through shared experiences." },
    { timestamp: [450, 480], text: "New characters are introduced, adding complexity to the story." },
    { timestamp: [480, 500], text: "Subplot complications arise, creating additional challenges." },
    { timestamp: [500, 530], text: "Multiple storylines begin to converge in exciting ways." },
    { timestamp: [530, 550], text: "The climactic sequence features intense action and character interactions." },
    { timestamp: [550, 580], text: "All storylines reach their peak in this dramatic moment." },
    { timestamp: [580, 600], text: "Resolution begins as conflicts are resolved one by one." },
    { timestamp: [600, 630], text: "The epilogue shows the long-term effects of the adventure." },
    { timestamp: [630, 650], text: "A new equilibrium is established in the forest community." },
    { timestamp: [650, 680], text: "Final credits roll with thematic music playing." },
    { timestamp: [680, 700], text: "Acknowledgments and final credits complete the experience." },
    { timestamp: [700, 730], text: "A post-credits scene hints at future adventures to come." },
    { timestamp: [730, 750], text: "The story ends with a promise of more tales from this magical world." }
  ],
  nodes: [
    ...mockMindMapData.nodes,
    {
      timestamp: [400, 450],
      text: "Extended scene showing character development and deeper relationships.",
      summary: [
        "Character development and relationship building",
        "Extended scene showing deeper relationships"
      ],
      keywords: ["development", "relationships", "growth"],
      named_entities: [["character", "CONCEPT"], ["relationships", "CONCEPT"]],
      emojis: "📈 🤝 💪",
      best_image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjOGI1Y2Y2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5EZXZlbG9wbWVudDwvdGV4dD48L3N2Zz4=",
      start_image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjYTg1Y2Y2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Hcm93dGg8L3RleHQ+PC9zdmc+",
      topic: "Character Growth",
      tts: "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAE..."
    },
    {
      timestamp: [450, 500],
      text: "Additional subplot introducing new characters and complications.",
      summary: [
        "New characters introduced",
        "Subplot complications arise"
      ],
      keywords: ["subplot", "new characters", "complications"],
      named_entities: [["characters", "GROUP"], ["subplot", "CONCEPT"]],
      emojis: "🎭 👥 🌪️",
      best_image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWY0NDQ0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TdWJwbG90PC90ZXh0Pjwvc3ZnPg==",
      start_image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmY2NjY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5OZXcgQ2hhcnM8L3RleHQ+PC9zdmc+",
      topic: "Subplot Introduction",
      tts: "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAE..."
    },
    {
      timestamp: [500, 550],
      text: "Climactic sequence with multiple action elements and character interactions.",
      summary: [
        "Climactic action sequence",
        "Multiple action elements and character interactions"
      ],
      keywords: ["climax", "action", "interactions"],
      named_entities: [["climax", "EVENT"], ["action", "CONCEPT"], ["character", "CONCEPT"]],
      emojis: "🎬 💥 🎯",
      best_image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjU5ZTBiIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5DbGltYXg8L3RleHQ+PC9zdmc+",
      start_image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZhNTAwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5BY3Rpb248L3RleHQ+PC9zdmc+",
      topic: "Climactic Action",
      tts: "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAE..."
    },
    {
      timestamp: [550, 600],
      text: "Resolution phase where all storylines converge and conclude.",
      summary: [
        "All storylines converge",
        "Resolution phase concludes"
      ],
      keywords: ["resolution", "convergence", "conclusion"],
      named_entities: [["storylines", "CONCEPT"], ["resolution", "EVENT"]],
      emojis: "🔄 ✅ 🎊",
      best_image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTBiOTgxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5SZXNvbHV0aW9uPC90ZXh0Pjwvc3ZnPg==",
      start_image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjJjNTVlIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Db252ZXJnZTwvdGV4dD48L3N2Zz4=",
      topic: "Final Resolution",
      tts: "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAE..."
    },
    {
      timestamp: [600, 650],
      text: "Epilogue showing the long-term effects and new equilibrium.",
      summary: [
        "Epilogue reveals long-term effects",
        "Shows new balance and equilibrium"
      ],
      keywords: ["epilogue", "long-term", "equilibrium"],
      named_entities: [["epilogue", "CONCEPT"], ["equilibrium", "CONCEPT"]],
      emojis: "📖 ⚖️ 🌅",
      best_image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNjM2NmYxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5FcGlsb2d1ZTwvdGV4dD48L3N2Zz4=",
      start_image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjODA4M2YxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5CYWxhbmNlPC90ZXh0Pjwvc3ZnPg==",
      topic: "Epilogue",
      tts: "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAE..."
    },
    {
      timestamp: [650, 700],
      text: "Final credits and acknowledgments with thematic music.",
      summary: [
        "Credits roll with thematic music",
        "Acknowledgments and final credits"
      ],
      keywords: ["credits", "music", "acknowledgments"],
      named_entities: [["credits", "CONCEPT"], ["music", "CONCEPT"]],
      emojis: "🎵 📜 👏",
      best_image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5DcmVkaXRzPC90ZXh0Pjwvc3ZnPg==",
      start_image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNTU1NTU1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Nb3ZpZSBFbmQ8L3RleHQ+PC9zdmc+",
      topic: "End Credits",
      tts: "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAE..."
    },
    {
      timestamp: [700, 750],
      text: "Post-credits scene hinting at future adventures.",
      summary: [
        "Post-credits scene hints at future adventures",
        "Teases future storylines"
      ],
      keywords: ["post-credits", "future", "teaser"],
      named_entities: [["post-credits", "CONCEPT"], ["adventures", "EVENT"]],
      emojis: "🔮 🚀 ❓",
      best_image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNzMzM2ZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5UZWFzZXI8L3RleHQ+PC9zdmc+",
      start_image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjOTk2NmZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5GdXR1cmU8L3RleHQ+PC9zdmc+",
      topic: "Future Teaser",
      tts: "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAE..."
    }
  ]
};