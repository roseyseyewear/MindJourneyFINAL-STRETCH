/**
 * Mobile-Specific Copy Variations and Accessibility Enhancements
 * 
 * Optimized content for mobile devices and comprehensive accessibility
 * features for the Delta Final Stretch lab experience.
 */

import { DELTA_COPY } from './copy-constants';

// Mobile-specific copy variations
export const MOBILE_COPY = {
  // ============================
  // MOBILE WELCOME SCREEN
  // ============================
  welcomeScreen: {
    // Shorter, punchier headlines for mobile
    title: "Share Your\nHypothesis",
    subtitle: "Enter The Lab",
    description: "Before we begin, we need your unique perspective.",
    
    // Mobile-optimized CTAs
    primaryCTA: "TAP TO BEGIN",
    secondaryCTA: "Unlock Early Access",
    
    // Shorter loading messages for mobile
    loadingMessages: [
      "Starting experiment...",
      "Preparing experience...",
      "Almost ready..."
    ],
    
    // Mobile-specific instructions
    instructions: {
      orientation: "For the best experience, please rotate your device to landscape mode.",
      fullscreen: "Tap to enter fullscreen mode for immersive experience.",
      audio: "Enable audio for the complete experience."
    }
  },

  // ============================
  // MOBILE CHAT INTERFACE
  // ============================
  chatInterface: {
    // Simplified greeting for mobile
    greeting: {
      hello: "Hello Visitor,",
      hypothesis_prompt: "Share your hypothesis. What will you see and feel?"
    },
    
    // Shorter acknowledgments
    acknowledgments: {
      text_received: "Got it. That insight helps shape your experience.",
      audio_received: "Voice message received. Thank you for sharing.",
      photo_received: "Photo received. Visual perspective recorded.", 
      video_received: "Video received. Visual data recorded."
    },
    
    // Mobile input helpers
    input: {
      typing_placeholder: "Type here...",
      voice_button_label: "Voice",
      camera_button_label: "Camera", 
      upload_button_label: "Upload",
      send_button_label: "Send"
    },
    
    // Mobile recording interface
    recording: {
      voice_instructions: "Tap and hold to record. Release to stop.",
      video_instructions: "Tap to start recording. Tap again to stop.",
      preview_helper: "Preview your recording below",
      send_helper: "Tap send to submit your response"
    },
    
    // Mobile error messages (shorter)
    errors: {
      upload_failed: "Upload failed. Try a smaller file.",
      camera_access: "Camera access needed. Check permissions.",
      microphone_access: "Microphone access needed.",
      file_too_large: "File too large. Max 10MB on mobile."
    }
  },

  // ============================
  // MOBILE LAB ENTRANCE
  // ============================
  labEntrance: {
    // Condensed unlock messaging
    unlock: {
      title: "Lab Unlocked!",
      subtitle: "Access Granted",
      description: "Your hypothesis validated. Lab access active."
    },
    
    // Simplified benefits for mobile
    benefits: {
      headline: "Your Benefits:",
      items: [
        "🚚 Early Access Delivery",
        "🎯 Personal Results", 
        "🔬 Behind-Scenes Access",
        "📊 Analysis Report",
        "🎁 Exclusive Rewards"
      ]
    },
    
    // Mobile contact form
    contactForm: {
      introduction: "Get your benefits:",
      fields: {
        name: {
          label: "Name",
          placeholder: "Your name",
          optional: "(optional)"
        },
        email: {
          label: "Email",
          placeholder: "your@email.com",
          description: "For results & updates"
        },
        phone: {
          label: "Phone",
          placeholder: "(555) 123-4567",
          description: "SMS notifications"
        }
      }
    }
  },

  // ============================
  // MOBILE LAB HUB
  // ============================
  labHub: {
    // Simplified welcome
    welcome: {
      title: "The Lab",
      subtitle: "Choose Your Path",
      description: "Three paths await. Each reveals different insights."
    },
    
    // Condensed room descriptions for mobile cards
    rooms: {
      materials: {
        name: "Materials",
        title: "Materials Lab",
        description: "Touch and explore our frame collection.",
        mobile_description: "Hands-on frame experience",
        cta: "Enter Materials"
      },
      observatory: {
        name: "Observatory", 
        title: "Observatory",
        description: "Discover the science of vision.",
        mobile_description: "Vision science & tests",
        cta: "Enter Observatory"
      },
      archive: {
        name: "Archive",
        title: "Archive", 
        description: "Browse visitor stories and insights.",
        mobile_description: "Community stories",
        cta: "Enter Archive"
      }
    },
    
    // Mobile navigation
    navigation: {
      instructions: "Select any room to continue.",
      back_button: "← Back",
      menu_button: "☰ Menu",
      help_button: "? Help"
    }
  }
};

// ============================
// ACCESSIBILITY ENHANCEMENTS
// ============================
export const ACCESSIBILITY_CONFIG = {
  // Screen reader descriptions
  screenReaderLabels: {
    // Navigation elements
    navigation: {
      main_logo: "The Delta Lab main logo and homepage link",
      progress_tracker: "Experience progress indicator, currently {progress} percent complete",
      visitor_badge: "Your visitor identification: number {visitorNumber}",
      level_indicator: "Current experience level: {level} of {totalLevels}"
    },
    
    // Interactive elements
    buttons: {
      play_video: "Start the laboratory experience introduction video",
      pause_video: "Pause the current video",
      replay_video: "Replay the video from the beginning",
      skip_video: "Skip to the end of the video",
      close_lightbox: "Close the video lightbox and return to previous screen",
      
      // Recording buttons
      start_voice_recording: "Begin voice recording for your hypothesis",
      stop_voice_recording: "Stop voice recording",
      start_video_recording: "Begin video recording for your hypothesis", 
      stop_video_recording: "Stop video recording",
      play_recorded_audio: "Play back your recorded voice message",
      send_voice_message: "Send your voice message as response",
      delete_recording: "Delete the current recording and start over",
      
      // File upload
      upload_file: "Upload an image or video file for your response",
      remove_uploaded_file: "Remove the uploaded file",
      
      // Form submission
      submit_hypothesis: "Submit your hypothesis and continue to next phase",
      submit_contact_info: "Submit your contact information",
      enter_lab: "Enter the main laboratory experience",
      select_lab_room: "Select the {roomName} laboratory environment"
    },
    
    // Form elements
    forms: {
      hypothesis_input: "Text area for entering your hypothesis about what you expect to see and feel during the experience",
      name_input: "Optional name field for personalizing your experience",
      email_input: "Email address field, required for receiving your personalized results",
      phone_input: "Optional phone number field for SMS notifications and updates"
    },
    
    // Video elements
    videos: {
      hypothesis_intro: {
        title: "Laboratory experience introduction video",
        description: "Abstract visual patterns and geometric shapes introducing the immersive lab experience with ambient electronic music"
      },
      chat_background: {
        title: "Ambient chat background video",
        description: "Subtle looping animation of digital interface elements and particle effects creating an atmospheric laboratory environment"
      },
      door_opening: {
        title: "Laboratory door opening sequence",
        description: "Cinematic video showing a futuristic laboratory door sliding open to reveal bright light, signifying access granted to the lab"
      },
      lab_hub: {
        title: "Main laboratory environment video",
        description: "Atmospheric video showing the central laboratory space with ambient lighting and subtle technological elements"
      }
    },
    
    // State descriptions
    states: {
      loading: "Content is loading, please wait",
      typing: "The lab assistant is typing a response",
      recording: "Recording in progress",
      uploading: "File upload in progress, {progress} percent complete",
      processing: "Processing your response",
      error: "An error occurred: {errorMessage}",
      success: "Action completed successfully"
    }
  },

  // Keyboard navigation
  keyboardSupport: {
    // Global shortcuts
    shortcuts: {
      'Escape': 'Close current modal or return to previous screen',
      'Enter': 'Activate focused button or submit current form',
      'Space': 'Play or pause video when video player is focused',
      'Tab': 'Move to next interactive element',
      'Shift+Tab': 'Move to previous interactive element',
      'Arrow Keys': 'Navigate between options in multiple choice questions'
    },
    
    // Focus management
    focusTrapping: {
      video_lightbox: 'Focus is trapped within the video lightbox when open',
      contact_form: 'Focus is trapped within the contact form modal',
      chat_interface: 'Focus cycles through chat input area and action buttons'
    }
  },

  // High contrast and visual accessibility
  visualAccessibility: {
    // Color alternatives for colorblind users
    colorAlternatives: {
      success: 'Green success states also include checkmark icons',
      error: 'Red error states also include warning icons', 
      progress: 'Progress bars include percentage text',
      recording: 'Recording states include pulsing animation and text indicator'
    },
    
    // Text size and contrast
    textAccessibility: {
      minimum_contrast: '4.5:1 contrast ratio maintained for all text',
      font_scaling: 'Text scales appropriately up to 200% zoom',
      focus_indicators: 'All interactive elements have visible focus indicators'
    }
  },

  // Voice commands and speech recognition
  voiceAccessibility: {
    commands: {
      'start experience': 'Begin the lab experience',
      'record voice': 'Start voice recording',
      'stop recording': 'End current recording',
      'submit response': 'Send current response',
      'next question': 'Move to next question',
      'enter lab': 'Access the laboratory environments'
    }
  },

  // Reduced motion preferences
  reducedMotion: {
    alternatives: {
      video_backgrounds: 'Static images replace video backgrounds when reduce motion is enabled',
      animations: 'CSS animations are disabled and replaced with instant state changes',
      parallax: 'Parallax effects are disabled',
      auto_play: 'Videos do not auto-play and require user interaction'
    }
  }
};

// ============================
// RESPONSIVE BREAKPOINTS
// ============================
export const RESPONSIVE_CONFIG = {
  breakpoints: {
    mobile: '320px - 768px',
    tablet: '768px - 1024px', 
    desktop: '1024px+'
  },
  
  // Content adaptations per breakpoint
  adaptations: {
    mobile: {
      maxVideoHeight: '50vh',
      chatMaxMessages: 3,
      cardLayout: 'stacked',
      fontSizeAdjustment: '-2px',
      buttonPadding: '12px 20px',
      formFieldSpacing: '16px'
    },
    tablet: {
      maxVideoHeight: '60vh',
      chatMaxMessages: 4,
      cardLayout: 'grid-2col',
      fontSizeAdjustment: '0px',
      buttonPadding: '14px 24px',
      formFieldSpacing: '20px'
    },
    desktop: {
      maxVideoHeight: '70vh',
      chatMaxMessages: 4,
      cardLayout: 'grid-3col',
      fontSizeAdjustment: '+2px',
      buttonPadding: '16px 32px',
      formFieldSpacing: '24px'
    }
  }
};

// Utility functions for mobile and accessibility
export const MOBILE_UTILS = {
  // Detect device type
  isMobile: (): boolean => {
    return window.innerWidth <= 768;
  },
  
  isTablet: (): boolean => {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
  },
  
  // Get appropriate copy for device
  getCopyForDevice: (desktopCopy: string, mobileCopy?: string): string => {
    if (mobileCopy && MOBILE_UTILS.isMobile()) {
      return mobileCopy;
    }
    return desktopCopy;
  },
  
  // Check for reduced motion preference
  prefersReducedMotion: (): boolean => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },
  
  // Announce to screen readers
  announceToScreenReader: (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },
  
  // Manage focus for accessibility
  trapFocus: (container: HTMLElement): (() => void) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      }
    };
    
    container.addEventListener('keydown', handleTabKey);
    
    // Focus first element
    firstFocusable?.focus();
    
    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }
};

export default {
  mobile: MOBILE_COPY,
  accessibility: ACCESSIBILITY_CONFIG,
  responsive: RESPONSIVE_CONFIG,
  utils: MOBILE_UTILS
};