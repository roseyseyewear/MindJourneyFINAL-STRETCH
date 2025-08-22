// Mock database for frontend testing
export const pool = null;

// Mock data for the lab experience
const mockExperiment = {
  id: 'delta-lab-experiment',
  title: 'Delta Final Stretch Lab Experience',
  description: 'An immersive 4-page laboratory experience',
  totalLevels: 4,
  isActive: true,
  createdAt: new Date()
};

const mockLevels = [
  {
    id: 'level-1',
    experimentId: 'delta-lab-experiment',
    levelNumber: 1,
    videoUrl: '/videos/hypothesis-intro.mp4',
    backgroundVideoUrl: '/videos/backgrounds/welcome-ambient.mp4',
    questions: [
      {
        id: 'hypothesis',
        type: 'text',
        title: 'Share Your Hypothesis',
        text: 'What do you think this experiment is about?',
        required: true
      }
    ]
  },
  {
    id: 'level-2', 
    experimentId: 'delta-lab-experiment',
    levelNumber: 2,
    videoUrl: '/videos/chat-loop.mp4',
    backgroundVideoUrl: '/videos/backgrounds/chat-loop.mp4',
    questions: [
      {
        id: 'response',
        type: 'text',
        title: 'Your Response',
        text: 'Share your thoughts about the video',
        required: true
      }
    ]
  },
  {
    id: 'level-3',
    experimentId: 'delta-lab-experiment', 
    levelNumber: 3,
    videoUrl: '/videos/transitions/door-opening.mp4',
    questions: [
      {
        id: 'email',
        type: 'email',
        title: 'Enter Lab',
        text: 'Share contact for visitor benefits',
        required: true
      }
    ]
  },
  {
    id: 'level-4',
    experimentId: 'delta-lab-experiment',
    levelNumber: 4, 
    videoUrl: '/videos/lab-phases/lab-hub.mp4',
    questions: [
      {
        id: 'room',
        type: 'multiple_choice',
        title: 'Choose Room',
        text: 'Where to explore?',
        options: ['Materials Room', 'Observatory', 'Archive'],
        required: true
      }
    ]
  }
];

// Mock database with full method chain support
const createMockQuery = (data) => ({
  from: () => ({
    where: () => ({
      limit: () => data,
      orderBy: () => data,
      ...data
    }),
    limit: () => data,
    orderBy: () => data,
    ...data
  }),
  limit: () => data,
  orderBy: () => data,
  ...data
});

export const db = {
  select: (fields) => {
    // Return appropriate mock data based on what's being selected
    if (fields && fields.toString().includes('experiment')) {
      return createMockQuery([mockExperiment]);
    }
    return createMockQuery([]);
  },
  
  insert: (table) => ({
    values: (data) => ({
      returning: () => {
        // Mock session creation
        if (data.experimentId) {
          return [{
            id: 'mock-session-' + Date.now(),
            userId: data.userId || null,
            experimentId: data.experimentId,
            currentLevel: 1,
            visitorNumber: Math.floor(Math.random() * 1000) + 1,
            createdAt: new Date(),
            updatedAt: new Date()
          }];
        }
        return [{ id: 'mock-' + Date.now(), ...data }];
      }
    })
  }),
  
  update: (table) => ({
    set: (data) => ({
      where: () => ({ returning: () => [{ id: 'updated', ...data }] })
    })
  }),
  
  // Direct table access for experiments and levels
  query: {
    experiments: {
      findFirst: () => Promise.resolve(mockExperiment)
    },
    experimentLevels: {
      findMany: () => Promise.resolve(mockLevels)
    }
  }
};