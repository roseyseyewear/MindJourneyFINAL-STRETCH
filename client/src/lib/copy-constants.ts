/**
 * Delta Final Stretch Lab Experience Copy Constants
 * 
 * Comprehensive copy and content for the 4-page immersive lab experience
 * that replaces traditional "About" pages with an interactive journey.
 */

export const DELTA_COPY = {
  // ============================
  // PAGE 1: HYPOTHESIS ENTRY
  // ============================
  welcomeScreen: {
    title: "Share Your Hypothesis",
    subtitle: "Enter The Lab",
    description: "Before we begin this immersive experience, we need to understand your unique perspective.",
    
    // Video introduction concepts
    videoIntroNarration: {
      opening: "Welcome to the Delta Lab Experience. This isn't just another website visit.",
      context: "You're about to participate in a real experiment on perception and reality.",
      instruction: "First, we need to establish your baseline hypothesis.",
      question: "What do you expect to see? What do you think you'll feel?",
      motivation: "Your honest prediction will shape your personalized journey through the lab."
    },
    
    // Call-to-action copy
    primaryCTA: "PRESS PLAY TO BEGIN",
    secondaryCTA: "Unlock Early Access & Worldwide Delivery",
    
    // Loading states
    loadingMessages: [
      "Initializing experiment...",
      "Preparing your unique experience...",
      "Calibrating perception systems..."
    ]
  },

  // ============================
  // PAGE 2: CHAT RESPONSE
  // ============================
  chatInterface: {
    // Initial greeting sequence
    greeting: {
      hello: "Hello Visitor,",
      hypothesis_prompt: "Share your hypothesis to continue. What will you see wearing rose colored glasses? What will you feel?"
    },
    
    // Response acknowledgments
    acknowledgments: {
      text_received: "Thank you for sharing that insight. It helps me understand your experience better.",
      audio_received: "I've received your voice message. Your spoken insights are valuable to the research.",
      photo_received: "I've received your photo. Thank you for sharing this visual perspective.",
      video_received: "I've received your video. Thank you for sharing this visual perspective."
    },
    
    // Follow-up prompts based on hypothesis content
    followUpPrompts: {
      optimistic: "Interesting - you seem to expect positive transformations. Tell me more about what 'better' looks like to you.",
      skeptical: "I sense some hesitation in your response. What past experiences shape this expectation?",
      curious: "Your curiosity is evident. What specific aspects are you most interested in discovering?",
      emotional: "You've touched on feelings. How do you think emotional and visual perception connect?",
      generic: "Thank you for that perspective. Can you be more specific about the sensations you anticipate?"
    },
    
    // Conversation flow management
    transitions: {
      to_contact_collection: "Thank you for sharing your insights. To personalize your results and create your profile, I'd like to collect some basic information.",
      to_name_request: "What name would you like me to use? (This is optional)",
      to_email_request: "Great! Now, what's your email address? This will be used to share your personalized results.",
      completion: "Perfect! Your responses have been recorded and your profile has been created. Thank you for participating in this immersive research experience."
    },
    
    // Input placeholders and helpers
    placeholders: {
      hypothesis: "Describe what you expect to experience...",
      name: "Enter your name (or leave blank)",
      email: "Enter your email address"
    },
    
    // Error messages
    errors: {
      submission_failed: "Failed to save your response. Please try again.",
      upload_failed: "Failed to upload your file. Please try again.",
      camera_access: "Could not access camera. Please check permissions.",
      microphone_access: "Could not access microphone. Please check permissions.",
      file_type_invalid: "Please select an image or video file."
    },
    
    // Recording interface
    recording: {
      voice_start_toast: "🎙️ Recording started - Speak clearly and click stop when finished",
      video_start_toast: "📹 Recording started - Video recording is now active. Click 'Stop Recording' when finished",
      voice_preview_helper: "Listen to your recording and click send to submit",
      video_preview_helper: "Review your video and click send to submit"
    }
  },

  // ============================
  // PAGE 3: LAB ENTRANCE & CONTACT CAPTURE
  // ============================
  labEntrance: {
    // Congratulations messaging
    unlock: {
      title: "Congratulations!",
      subtitle: "You've Unlocked The Lab",
      description: "Your hypothesis has been recorded and validated. You now have access to the full Delta experience."
    },
    
    // Contact form value propositions
    benefits: {
      headline: "Visitor Benefits Include:",
      items: [
        "🚚 Early Access & Worldwide Delivery",
        "🎯 Personalized Experience Results", 
        "🔬 Behind-the-Scenes Lab Access",
        "📊 Your Hypothesis Analysis Report",
        "💎 Exclusive Frame Collection Preview",
        "🎁 Limited Edition Visitor Rewards"
      ]
    },
    
    // Contact form copy
    contactForm: {
      introduction: "Share your contact details to receive your Visitor Benefits:",
      fields: {
        name: {
          label: "Name",
          placeholder: "What should we call you?",
          optional: "(Optional - you can remain anonymous)"
        },
        email: {
          label: "Email Address", 
          placeholder: "your@email.com",
          description: "For your personalized results and early access notifications"
        },
        phone: {
          label: "Phone/SMS",
          placeholder: "+1 (555) 123-4567", 
          description: "For exclusive SMS updates and delivery notifications"
        }
      },
      
      privacy: {
        notice: "We respect your privacy. Your information is used only for the benefits you've unlocked.",
        terms: "By continuing, you agree to receive communications about your lab experience."
      },
      
      success: "Perfect! Your contact information has been saved. Check your email and SMS for early access details."
    },
    
    // Door opening experience
    doorOpening: {
      title: "Enter The Lab",
      subtitle: "Your Portal is Opening...",
      loadingMessages: [
        "Authenticating visitor credentials...",
        "Scanning biometric patterns...",
        "Opening dimensional gateway...",
        "Welcome to the other side..."
      ]
    }
  },

  // ============================
  // PAGE 4: LAB HUB & ROOM SELECTION
  // ============================
  labHub: {
    // Welcome to the hub
    welcome: {
      title: "Welcome to The Lab",
      subtitle: "Choose Your Path",
      description: "Three specialized environments await your exploration. Each offers a different perspective on your hypothesis."
    },
    
    // Room descriptions
    rooms: {
      materials: {
        name: "Materials Lab",
        title: "The Materials Laboratory",
        description: "Explore our collection of experimental frames and lenses. Touch, feel, and experience the craftsmanship behind each piece.",
        features: ["Haptic Frame Selection", "Lens Technology Demo", "Customization Studio"],
        cta: "Enter Materials Lab",
        expectation: "Physical interaction with our frame collection"
      },
      
      observatory: {
        name: "Observatory",
        title: "The Perception Observatory", 
        description: "Dive deep into the science of vision and perception. Understand how different lenses change not just what you see, but how you feel.",
        features: ["Vision Science Demos", "Perception Tests", "Hypothesis Validation"],
        cta: "Enter Observatory",
        expectation: "Scientific exploration of your visual experience"
      },
      
      archive: {
        name: "Archive", 
        title: "The Experience Archive",
        description: "Browse stories and experiences from other visitors. See how your hypothesis compares to thousands of others who've walked this path.",
        features: ["Visitor Story Collection", "Hypothesis Comparisons", "Community Insights"], 
        cta: "Enter Archive",
        expectation: "Community experiences and shared insights"
      }
    },
    
    // Navigation and guidance
    navigation: {
      instructions: "Select any room to continue your experience. You can explore all three areas.",
      backToHub: "Return to Lab Hub",
      continueExploring: "Continue Exploring",
      helpText: "Need guidance? Each room offers a different type of interaction based on your interests."
    },
    
    // Email signup reminders throughout
    emailReminders: {
      persistent: "📧 Don't forget to save your progress and get your results delivered",
      gentle: "Want to continue this experience later? We can email you a direct link.",
      urgent: "⏰ Your session expires in 10 minutes. Save your progress now!"
    }
  },

  // ============================
  // EMAIL SEQUENCES
  // ============================
  emailSequences: {
    // Welcome email after hypothesis submission
    welcome: {
      subject: "Your Lab Experience Has Begun - Visitor #{visitorNumber}",
      preheader: "Your hypothesis is being processed...",
      
      content: {
        greeting: "Welcome to The Lab, Visitor #{visitorNumber}",
        hypothesis_confirmation: "We've recorded your hypothesis: \"{hypothesis}\"",
        next_steps: [
          "Your experience is now personalized based on your prediction",
          "Continue exploring the three lab environments",
          "Your results will be compiled as you complete each section"
        ],
        cta: "Continue Your Experience",
        footer: "This is an automated message from your lab session. Your visitor number is #{visitorNumber}."
      }
    },
    
    // Progress reminder email
    progress: {
      subject: "Your Lab Experience is 60% Complete",
      preheader: "Don't lose your progress...",
      
      content: {
        greeting: "Hello Visitor #{visitorNumber}",
        progress_update: "You've successfully completed the hypothesis phase and unlocked lab access.",
        incomplete_sections: "You still have these areas to explore:",
        encouragement: "Each section adds depth to your final results report.",
        cta: "Complete Your Experience"
      }
    },
    
    // Results delivery email
    results: {
      subject: "Your Personalized Lab Results Are Ready",
      preheader: "Based on your hypothesis: {hypothesis}...",
      
      content: {
        greeting: "Congratulations, Visitor #{visitorNumber}",
        results_intro: "Your lab experience is complete. Based on your hypothesis and interactions, here are your personalized results:",
        sections: [
          "Hypothesis Analysis",
          "Perception Profile", 
          "Recommended Frame Collection",
          "Your Unique Visual Signature"
        ],
        exclusive_offers: "As a verified lab visitor, you have access to:",
        cta: "View Full Results Report"
      }
    },
    
    // Early access notification
    earlyAccess: {
      subject: "🚚 Your Early Access Delivery Window Opens Tomorrow",
      preheader: "Worldwide shipping now available...",
      
      content: {
        greeting: "Exciting news, Visitor #{visitorNumber}",
        announcement: "Your early access period begins tomorrow. You have 48-hour priority access to:",
        benefits: [
          "Complete frame collection with lab-tested customizations",
          "Expedited worldwide shipping",
          "Personal consultation based on your lab results",
          "Limited edition visitor-only accessories"
        ],
        urgency: "Early access is limited to verified lab participants only.",
        cta: "Activate Early Access"
      }
    }
  },

  // ============================
  // ERROR MESSAGES & LOADING STATES
  // ============================
  systemMessages: {
    loading: {
      general: "Processing your request...",
      hypothesis: "Analyzing your hypothesis...",
      video: "Loading immersive content...",
      upload: "Uploading your response...",
      contact: "Saving your information...",
      lab_access: "Authenticating lab access..."
    },
    
    errors: {
      network: "Connection lost. Please check your internet and try again.",
      upload: "Upload failed. Please try a smaller file or different format.",
      session: "Your session has expired. Please start over.",
      permissions: "Permission denied. Please allow access and try again.",
      generic: "Something went wrong. Please refresh the page and try again."
    },
    
    success: {
      hypothesis_saved: "✅ Your hypothesis has been recorded",
      contact_saved: "✅ Your information has been saved securely", 
      upload_complete: "✅ Your file has been uploaded successfully",
      lab_unlocked: "🔓 Lab access granted - Welcome inside"
    }
  },

  // ============================
  // MOBILE-SPECIFIC VARIATIONS
  // ============================
  mobile: {
    // Shorter headlines for mobile
    welcomeScreen: {
      title: "Share Your\nHypothesis",
      primaryCTA: "TAP TO BEGIN"
    },
    
    // Simplified chat interface
    chat: {
      typing_placeholder: "Type here...",
      voice_button_label: "Voice",
      camera_button_label: "Camera",
      upload_button_label: "Upload"
    },
    
    // Mobile-optimized lab hub
    labHub: {
      title: "Choose Your Path",
      room_cards: {
        materials: "Touch & Feel",
        observatory: "Science & Tests", 
        archive: "Stories & Community"
      }
    }
  },

  // ============================
  // ACCESSIBILITY DESCRIPTIONS
  // ============================
  accessibility: {
    // Screen reader descriptions
    images: {
      lab_logo: "The Delta Lab circular logo with triangular elements",
      visitor_badge: "Futuristic visitor identification badge with number {visitorNumber}",
      progress_indicator: "Circular progress indicator showing {progress}% complete"
    },
    
    // Video descriptions for screen readers
    videos: {
      hypothesis_intro: "Abstract visual patterns and geometric shapes introducing the lab experience",
      chat_background: "Ambient looping video of digital interface elements and subtle particle effects",
      door_opening: "Cinematic sequence of a futuristic laboratory door sliding open to reveal bright light",
      lab_hub_ambient: "Atmospheric video showing the main laboratory environment with ambient lighting"
    },
    
    // Button and interaction descriptions
    interactions: {
      play_button: "Start the lab experience video introduction",
      record_voice: "Begin voice recording for hypothesis submission", 
      record_video: "Start video recording for visual hypothesis submission",
      upload_file: "Upload image or video file for hypothesis submission",
      enter_lab: "Proceed to main laboratory environments",
      select_room: "Enter the {roomName} for specialized experience"
    },
    
    // Form labels and helpers
    forms: {
      hypothesis_input: "Text area for entering your hypothesis about the lab experience",
      name_input: "Optional name field for personalization",
      email_input: "Email address field for receiving results and updates",
      phone_input: "Optional phone number field for SMS notifications"
    }
  }
};

// Utility functions for dynamic content
export const COPY_UTILS = {
  formatVisitorNumber: (num: number | null): string => {
    if (!num) return "0000";
    return num.toString().padStart(4, "0");
  },
  
  interpolate: (template: string, variables: Record<string, any>): string => {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return variables[key]?.toString() || match;
    });
  },
  
  getRandomLoadingMessage: (category: 'general' | 'hypothesis' | 'video' | 'upload' | 'contact' | 'lab_access'): string => {
    const messages = DELTA_COPY.systemMessages.loading;
    return messages[category] || messages.general;
  },
  
  selectFollowUpPrompt: (hypothesisText: string): string => {
    const text = hypothesisText.toLowerCase();
    const prompts = DELTA_COPY.chatInterface.followUpPrompts;
    
    if (text.includes('good') || text.includes('better') || text.includes('amazing') || text.includes('wonderful')) {
      return prompts.optimistic;
    }
    if (text.includes('doubt') || text.includes('maybe') || text.includes('not sure') || text.includes('skeptical')) {
      return prompts.skeptical;
    }
    if (text.includes('curious') || text.includes('wonder') || text.includes('interested') || text.includes('explore')) {
      return prompts.curious;
    }
    if (text.includes('feel') || text.includes('emotion') || text.includes('happy') || text.includes('sad') || text.includes('excited')) {
      return prompts.emotional;
    }
    
    return prompts.generic;
  }
};

export default DELTA_COPY;