/**
 * Content Configuration for Delta Final Stretch Lab Experience
 * 
 * Defines the complete 4-page experience flow, content structure,
 * and all necessary data for the immersive lab experience.
 */

import { DELTA_COPY } from './copy-constants';

// Experience phases and flow configuration
export const EXPERIENCE_CONFIG = {
  // Total experience phases
  phases: ['hypothesis', 'chat', 'unlock', 'lab-hub'] as const,
  
  // Video assets for each phase
  videoAssets: {
    hypothesis: {
      intro: '/videos/lab-phases/hypothesis-intro.mp4',
      background: '/videos/backgrounds/welcome-ambient.mp4'
    },
    chat: {
      background: '/videos/chat-loop.mp4', 
      postSubmission: '/videos/hypothesis-post-submission.mp4'
    },
    unlock: {
      doorOpening: '/videos/transitions/door-opening.mp4',
      background: '/videos/level1-forest.mp4'
    },
    labHub: {
      ambient: '/videos/lab-phases/lab-hub.mp4',
      background: '/videos/backgrounds/futuristic-interface-1.mp4'
    }
  },
  
  // Timing configurations for each phase
  timing: {
    hypothesis: {
      videoIntro: 15000, // 15 seconds
      transitionDelay: 2000
    },
    chat: {
      typingDelay: 1000,
      responseAckDelay: 1500,
      nextQuestionDelay: 2000
    },
    unlock: {
      welcomeDelay: 1000,
      formShowDelay: 3000,
      doorOpeningDuration: 4000
    },
    labHub: {
      welcomeDelay: 2000,
      roomSelectionTimeout: 600000 // 10 minutes
    }
  }
};

// Lab experience content structure
export const LAB_EXPERIENCE_CONFIG = {
  // Main experiment definition
  experiment: {
    id: 'delta-final-stretch',
    title: 'The Delta Final Stretch Experience',
    description: 'An immersive laboratory experience exploring perception and hypothesis validation',
    totalLevels: 4, // One for each phase
    isActive: true
  },
  
  // Experience levels corresponding to each phase
  levels: [
    {
      // Level 1: Hypothesis Entry
      levelNumber: 1,
      phase: 'hypothesis',
      videoUrl: EXPERIENCE_CONFIG.videoAssets.hypothesis.intro,
      backgroundVideoUrl: EXPERIENCE_CONFIG.videoAssets.hypothesis.background,
      postSubmissionVideoUrl: EXPERIENCE_CONFIG.videoAssets.chat.postSubmission,
      questions: [
        {
          id: 'hypothesis-response',
          type: 'text',
          title: 'Your Hypothesis',
          text: DELTA_COPY.chatInterface.greeting.hypothesis_prompt,
          required: true,
          allowedMediaTypes: ['photo', 'video', 'audio']
        }
      ]
    },
    {
      // Level 2: Chat Response & Follow-up
      levelNumber: 2, 
      phase: 'chat',
      videoUrl: EXPERIENCE_CONFIG.videoAssets.chat.background,
      backgroundVideoUrl: EXPERIENCE_CONFIG.videoAssets.chat.background,
      questions: [
        {
          id: 'follow-up-1',
          type: 'text',
          title: 'Follow-up Question',
          text: 'Can you elaborate on what specific changes you expect to notice?',
          required: false
        },
        {
          id: 'collect_name',
          type: 'text',
          title: 'Name Collection',
          text: DELTA_COPY.chatInterface.transitions.to_name_request,
          required: false
        },
        {
          id: 'collect_email',
          type: 'text',
          title: 'Email Collection', 
          text: DELTA_COPY.chatInterface.transitions.to_email_request,
          required: true
        }
      ]
    },
    {
      // Level 3: Lab Unlock & Contact Capture
      levelNumber: 3,
      phase: 'unlock',
      videoUrl: EXPERIENCE_CONFIG.videoAssets.unlock.doorOpening,
      backgroundVideoUrl: EXPERIENCE_CONFIG.videoAssets.unlock.background,
      completionVideoUrl: EXPERIENCE_CONFIG.videoAssets.unlock.background,
      questions: [
        {
          id: 'contact_name',
          type: 'text',
          title: 'Name',
          text: DELTA_COPY.labEntrance.contactForm.fields.name.placeholder,
          required: false
        },
        {
          id: 'contact_email',
          type: 'text',
          title: 'Email Address',
          text: DELTA_COPY.labEntrance.contactForm.fields.email.placeholder,
          required: true
        },
        {
          id: 'contact_phone',
          type: 'text',
          title: 'Phone/SMS',
          text: DELTA_COPY.labEntrance.contactForm.fields.phone.placeholder,
          required: false
        }
      ]
    },
    {
      // Level 4: Lab Hub & Room Selection
      levelNumber: 4,
      phase: 'lab-hub',
      videoUrl: EXPERIENCE_CONFIG.videoAssets.labHub.ambient,
      backgroundVideoUrl: EXPERIENCE_CONFIG.videoAssets.labHub.background,
      questions: [
        {
          id: 'room_selection',
          type: 'multiple_choice',
          title: 'Choose Your Lab Environment',
          text: DELTA_COPY.labHub.welcome.description,
          required: true,
          options: [
            DELTA_COPY.labHub.rooms.materials.cta,
            DELTA_COPY.labHub.rooms.observatory.cta,
            DELTA_COPY.labHub.rooms.archive.cta
          ]
        }
      ]
    }
  ],
  
  // Email automation sequences
  emailSequences: [
    {
      trigger: 'hypothesis_submitted',
      delay: 0, // Immediate
      template: 'welcome',
      subject: DELTA_COPY.emailSequences.welcome.subject,
      content: DELTA_COPY.emailSequences.welcome.content
    },
    {
      trigger: 'contact_captured',
      delay: 300000, // 5 minutes after contact capture
      template: 'progress',
      subject: DELTA_COPY.emailSequences.progress.subject,
      content: DELTA_COPY.emailSequences.progress.content
    },
    {
      trigger: 'experience_completed',
      delay: 600000, // 10 minutes after completion
      template: 'results',
      subject: DELTA_COPY.emailSequences.results.subject,
      content: DELTA_COPY.emailSequences.results.content
    },
    {
      trigger: 'early_access_window',
      delay: 86400000, // 24 hours after completion
      template: 'early_access',
      subject: DELTA_COPY.emailSequences.earlyAccess.subject,
      content: DELTA_COPY.emailSequences.earlyAccess.content
    }
  ]
};

// Component integration configuration
export const COMPONENT_CONFIG = {
  // Welcome screen configuration
  welcomeScreen: {
    title: DELTA_COPY.welcomeScreen.title,
    primaryCTA: DELTA_COPY.welcomeScreen.primaryCTA,
    secondaryCTA: DELTA_COPY.welcomeScreen.secondaryCTA,
    videoAutoplay: true,
    showProgress: false
  },
  
  // Chat interface configuration
  chatInterface: {
    maxMessages: 4, // Show last 4 messages
    typingIndicatorDelay: 800,
    responseTimeout: 300000, // 5 minutes
    allowedResponseTypes: ['text', 'audio', 'photo', 'video'],
    maxFileSize: 50 * 1024 * 1024, // 50MB
    supportedFormats: {
      image: ['jpeg', 'png', 'gif', 'webp'],
      video: ['mp4', 'webm', 'quicktime'],
      audio: ['mpeg', 'wav', 'webm', 'ogg']
    }
  },
  
  // Level complete screen (unlock page) configuration
  levelCompleteScreen: {
    showContactForm: true,
    showBenefits: true,
    benefits: DELTA_COPY.labEntrance.benefits.items,
    requiredFields: ['email'],
    optionalFields: ['name', 'phone'],
    privacyNotice: DELTA_COPY.labEntrance.contactForm.privacy.notice
  },
  
  // Lab hub configuration
  labHub: {
    rooms: [
      {
        id: 'materials',
        name: DELTA_COPY.labHub.rooms.materials.name,
        title: DELTA_COPY.labHub.rooms.materials.title,
        description: DELTA_COPY.labHub.rooms.materials.description,
        features: DELTA_COPY.labHub.rooms.materials.features,
        cta: DELTA_COPY.labHub.rooms.materials.cta,
        expectation: DELTA_COPY.labHub.rooms.materials.expectation,
        videoBackground: '/videos/rooms/materials-ambient.mp4'
      },
      {
        id: 'observatory',
        name: DELTA_COPY.labHub.rooms.observatory.name,
        title: DELTA_COPY.labHub.rooms.observatory.title,
        description: DELTA_COPY.labHub.rooms.observatory.description,
        features: DELTA_COPY.labHub.rooms.observatory.features,
        cta: DELTA_COPY.labHub.rooms.observatory.cta,
        expectation: DELTA_COPY.labHub.rooms.observatory.expectation,
        videoBackground: '/videos/rooms/observatory-ambient.mp4'
      },
      {
        id: 'archive',
        name: DELTA_COPY.labHub.rooms.archive.name,
        title: DELTA_COPY.labHub.rooms.archive.title,
        description: DELTA_COPY.labHub.rooms.archive.description,
        features: DELTA_COPY.labHub.rooms.archive.features,
        cta: DELTA_COPY.labHub.rooms.archive.cta,
        expectation: DELTA_COPY.labHub.rooms.archive.expectation,
        videoBackground: '/videos/rooms/archive-ambient.mp4'
      }
    ],
    sessionTimeout: 600000, // 10 minutes
    reminderInterval: 300000 // 5 minutes
  }
};

// Analytics and tracking configuration
export const TRACKING_CONFIG = {
  events: {
    // Hypothesis phase
    'hypothesis_video_start': 'Video playback initiated on hypothesis page',
    'hypothesis_video_complete': 'Hypothesis introduction video completed',
    'hypothesis_submitted': 'User submitted their hypothesis',
    'hypothesis_media_uploaded': 'User uploaded media with hypothesis',
    
    // Chat phase
    'chat_initiated': 'Chat interface opened',
    'chat_response_sent': 'User sent response in chat',
    'voice_recording_started': 'User began voice recording',
    'video_recording_started': 'User began video recording',
    'media_upload_started': 'User initiated file upload',
    
    // Unlock phase
    'lab_unlocked': 'User reached lab unlock screen',
    'contact_form_shown': 'Contact form displayed to user',
    'contact_submitted': 'User submitted contact information',
    'door_opening_watched': 'User watched door opening sequence',
    
    // Lab hub phase
    'lab_hub_entered': 'User entered the main lab hub',
    'room_selected': 'User selected a specific lab room',
    'room_entered': 'User entered selected lab room',
    'experience_completed': 'User completed full lab experience',
    
    // Email events
    'email_sent': 'Automated email sent to user',
    'email_opened': 'User opened automated email',
    'email_clicked': 'User clicked link in automated email'
  },
  
  // Custom properties to track
  customProperties: {
    visitor_number: 'Unique visitor identification number',
    hypothesis_length: 'Character count of hypothesis text',
    hypothesis_sentiment: 'Analyzed sentiment of hypothesis',
    response_types_used: 'Array of response types used (text, audio, etc)',
    time_to_complete: 'Total time spent in experience',
    rooms_visited: 'Array of lab rooms visited',
    device_type: 'Mobile, tablet, or desktop',
    completion_rate: 'Percentage of experience completed'
  }
};

// Export everything as default config object
export default {
  experience: EXPERIENCE_CONFIG,
  content: LAB_EXPERIENCE_CONFIG,
  components: COMPONENT_CONFIG,
  tracking: TRACKING_CONFIG
};