/**
 * Video Assets Configuration for 4-Page Lab Experience
 * Maps video files to specific lab experience phases and transitions
 */

export interface VideoAssetConfig {
  path: string;
  preload?: boolean;
  muted?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  fallback?: string;
}

export interface LabPhaseVideos {
  intro?: VideoAssetConfig;
  background?: VideoAssetConfig;
  transition?: VideoAssetConfig;
  completion?: VideoAssetConfig;
}

/**
 * 4-Page Lab Experience Video Mapping
 */
export const LAB_EXPERIENCE_VIDEOS = {
  // Page 1: Hypothesis Entry
  hypothesis: {
    intro: {
      path: "/videos/lab-phases/hypothesis-intro.mp4",
      preload: true,
      autoplay: true,
      fallback: "/videos/level1.mp4"
    },
    background: {
      path: "/videos/backgrounds/welcome-ambient.mp4",
      muted: true,
      loop: true,
      preload: true
    }
  },

  // Page 2: Chat Loop Interface  
  chat: {
    background: {
      path: "/videos/backgrounds/chat-loop.mp4",
      muted: true,
      loop: true,
      autoplay: true,
      preload: true,
      fallback: "/videos/chat-loop.mp4"
    },
    interface: {
      path: "/videos/backgrounds/futuristic-interface-1.mp4",
      muted: true,
      loop: true,
      preload: true
    }
  },

  // Page 3: Lab Entrance/Door Opening
  labEntrance: {
    transition: {
      path: "/videos/transitions/door-opening.mp4",
      autoplay: true,
      preload: true
    },
    background: {
      path: "/videos/backgrounds/scanning-field.mp4",
      muted: true,
      loop: true
    }
  },

  // Page 4: Lab Hub Environment
  labHub: {
    intro: {
      path: "/videos/lab-phases/lab-hub.mp4",
      autoplay: true,
      preload: true,
      fallback: "/videos/level1-forest.mp4"
    },
    background: {
      path: "/videos/backgrounds/futuristic-interface-2.mp4",
      muted: true,
      loop: true,
      preload: true
    }
  }
} as const;

/**
 * General purpose video assets for various components
 */
export const GENERAL_VIDEO_ASSETS = {
  loading: {
    path: "/videos/backgrounds/scanning-field.mp4",
    muted: true,
    loop: true
  },
  error: {
    path: "/videos/backgrounds/welcome-ambient.mp4",
    muted: true,
    loop: true
  },
  fallback: {
    path: "/videos/level1.mp4",
    muted: false
  }
} as const;

/**
 * Video preloading priority order for optimal performance
 */
export const PRELOAD_PRIORITY = [
  "/videos/lab-phases/hypothesis-intro.mp4",
  "/videos/backgrounds/chat-loop.mp4", 
  "/videos/transitions/door-opening.mp4",
  "/videos/lab-phases/lab-hub.mp4",
  "/videos/backgrounds/welcome-ambient.mp4",
  "/videos/backgrounds/futuristic-interface-1.mp4"
] as const;

/**
 * Mobile-optimized video configurations
 */
export const MOBILE_VIDEO_CONFIG = {
  maxWidth: 480,
  quality: 'low',
  preloadLimit: 2, // Only preload 2 videos on mobile
  autoplayRestricted: true
} as const;

/**
 * Utility function to get video config for current lab phase
 */
export function getLabPhaseVideo(phase: keyof typeof LAB_EXPERIENCE_VIDEOS, type: keyof LabPhaseVideos): VideoAssetConfig | null {
  const phaseConfig = LAB_EXPERIENCE_VIDEOS[phase];
  if (!phaseConfig || !phaseConfig[type]) {
    return null;
  }
  return phaseConfig[type];
}

/**
 * Utility function to check if video should be preloaded based on device/connection
 */
export function shouldPreloadVideo(videoPath: string, isMobile: boolean = false): boolean {
  if (isMobile) {
    const priorityIndex = PRELOAD_PRIORITY.indexOf(videoPath as any);
    return priorityIndex !== -1 && priorityIndex < MOBILE_VIDEO_CONFIG.preloadLimit;
  }
  return PRELOAD_PRIORITY.includes(videoPath as any);
}

/**
 * Get appropriate video quality/fallback based on device capabilities
 */
export function getOptimalVideoConfig(originalConfig: VideoAssetConfig, isMobile: boolean = false): VideoAssetConfig {
  if (!isMobile) {
    return originalConfig;
  }

  return {
    ...originalConfig,
    autoplay: MOBILE_VIDEO_CONFIG.autoplayRestricted ? false : originalConfig.autoplay,
    preload: shouldPreloadVideo(originalConfig.path, true)
  };
}