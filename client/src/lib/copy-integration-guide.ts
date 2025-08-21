/**
 * Copy Integration Guide for Delta Final Stretch Lab Experience
 * 
 * This file provides guidance and utilities for integrating the comprehensive
 * copy constants across all components in the lab experience.
 */

import { DELTA_COPY, COPY_UTILS } from './copy-constants';
import { MOBILE_COPY, MOBILE_UTILS } from './mobile-accessibility';
import { EMAIL_SEQUENCES, EMAIL_UTILS } from './email-sequences';
import CONTENT_CONFIG from './content-config';

// ============================
// COMPONENT INTEGRATION EXAMPLES
// ============================

export const INTEGRATION_EXAMPLES = {
  // Example: Welcome Screen Integration
  welcomeScreenIntegration: `
    import { DELTA_COPY } from '@/lib/copy-constants';
    import { MOBILE_UTILS } from '@/lib/mobile-accessibility';
    
    const WelcomeScreen = ({ onStart, isLoading }) => {
      const isMobile = MOBILE_UTILS.isMobile();
      
      return (
        <div>
          <h1>{isMobile ? DELTA_COPY.mobile.welcomeScreen.title : DELTA_COPY.welcomeScreen.title}</h1>
          <button 
            onClick={onStart}
            aria-label={DELTA_COPY.accessibility.interactions.play_button}
          >
            {isMobile ? DELTA_COPY.mobile.welcomeScreen.primaryCTA : DELTA_COPY.welcomeScreen.primaryCTA}
          </button>
          {isLoading && <p>{DELTA_COPY.systemMessages.loading.general}</p>}
        </div>
      );
    };
  `,

  // Example: Chat Interface Integration
  chatInterfaceIntegration: `
    import { DELTA_COPY, COPY_UTILS } from '@/lib/copy-constants';
    
    const ChatInterface = ({ hypothesis }) => {
      const followUpPrompt = COPY_UTILS.selectFollowUpPrompt(hypothesis);
      
      return (
        <div>
          <p>{DELTA_COPY.chatInterface.greeting.hello}</p>
          <p>{DELTA_COPY.chatInterface.greeting.hypothesis_prompt}</p>
          <input placeholder={DELTA_COPY.chatInterface.placeholders.hypothesis} />
          <button aria-label={DELTA_COPY.accessibility.interactions.record_voice}>
            Record Voice
          </button>
        </div>
      );
    };
  `,

  // Example: Email Integration
  emailIntegration: `
    import { EMAIL_SEQUENCES, EMAIL_UTILS } from '@/lib/email-sequences';
    
    const sendWelcomeEmail = async (userData) => {
      const template = EMAIL_UTILS.getTemplate('hypothesis_submitted');
      if (template && EMAIL_UTILS.shouldSendEmail(template, userData)) {
        const personalizedTemplate = EMAIL_UTILS.interpolateTemplate(template, {
          visitorNumber: COPY_UTILS.formatVisitorNumber(userData.visitorNumber),
          hypothesis: userData.hypothesis,
          userName: userData.name || 'Visitor',
          continueURL: \`\${process.env.BASE_URL}/continue/\${userData.sessionId}\`
        });
        
        await sendEmail(personalizedTemplate);
      }
    };
  `
};

// ============================
// INTEGRATION UTILITIES
// ============================

export const INTEGRATION_UTILS = {
  // Get appropriate copy based on device and context
  getContextualCopy: (
    desktopPath: string,
    mobilePath?: string,
    context?: 'hypothesis' | 'contact' | 'lab' | 'general'
  ) => {
    const isMobile = MOBILE_UTILS.isMobile();
    
    // Navigate to nested object property using dot notation
    const getNestedProperty = (obj: any, path: string) => {
      return path.split('.').reduce((current, key) => current?.[key], obj);
    };

    if (isMobile && mobilePath) {
      return getNestedProperty(MOBILE_COPY, mobilePath) || getNestedProperty(DELTA_COPY, desktopPath);
    }
    
    return getNestedProperty(DELTA_COPY, desktopPath);
  },

  // Get accessibility labels for components
  getAccessibilityLabel: (element: string, context?: Record<string, any>) => {
    const label = DELTA_COPY.accessibility.interactions[element as keyof typeof DELTA_COPY.accessibility.interactions];
    return context ? COPY_UTILS.interpolate(label || '', context) : label;
  },

  // Get loading message based on current phase
  getLoadingMessage: (phase: 'hypothesis' | 'chat' | 'unlock' | 'lab-hub' | 'general' = 'general') => {
    const messages = DELTA_COPY.systemMessages.loading;
    return messages[phase] || messages.general;
  },

  // Get error message with context
  getErrorMessage: (errorType: string, context?: Record<string, any>) => {
    const errorMessages = {
      ...DELTA_COPY.systemMessages.errors,
      ...DELTA_COPY.chatInterface.errors
    };
    
    const message = errorMessages[errorType as keyof typeof errorMessages] || errorMessages.generic;
    return context ? COPY_UTILS.interpolate(message, context) : message;
  },

  // Validate required copy constants are present
  validateCopyIntegration: () => {
    const requiredPaths = [
      'welcomeScreen.title',
      'welcomeScreen.primaryCTA',
      'chatInterface.greeting.hello',
      'chatInterface.greeting.hypothesis_prompt',
      'labEntrance.unlock.title',
      'systemMessages.loading.general',
      'systemMessages.errors.generic'
    ];

    const missing: string[] = [];
    
    requiredPaths.forEach(path => {
      const value = path.split('.').reduce((current, key) => current?.[key], DELTA_COPY);
      if (!value) {
        missing.push(path);
      }
    });

    return {
      isValid: missing.length === 0,
      missingPaths: missing
    };
  }
};

// ============================
// COMPONENT-SPECIFIC INTEGRATIONS
// ============================

export const COMPONENT_INTEGRATIONS = {
  // Welcome Screen
  welcomeScreen: {
    getTitle: (isMobile: boolean = false) => 
      isMobile ? MOBILE_COPY.welcomeScreen.title : DELTA_COPY.welcomeScreen.title,
    
    getPrimaryCTA: (isMobile: boolean = false) => 
      isMobile ? MOBILE_COPY.welcomeScreen.primaryCTA : DELTA_COPY.welcomeScreen.primaryCTA,
    
    getSecondaryCTA: (isMobile: boolean = false) => 
      isMobile ? MOBILE_COPY.welcomeScreen.secondaryCTA : DELTA_COPY.welcomeScreen.secondaryCTA,
    
    getLoadingMessage: (index: number = 0) => 
      DELTA_COPY.welcomeScreen.loadingMessages[index] || DELTA_COPY.systemMessages.loading.general
  },

  // Chat Interface
  chatInterface: {
    getGreeting: () => DELTA_COPY.chatInterface.greeting.hello,
    
    getHypothesisPrompt: () => DELTA_COPY.chatInterface.greeting.hypothesis_prompt,
    
    getAcknowledgment: (responseType: 'text' | 'audio' | 'photo' | 'video') => 
      DELTA_COPY.chatInterface.acknowledgments[`${responseType}_received`],
    
    getFollowUpPrompt: (hypothesisText: string) => 
      COPY_UTILS.selectFollowUpPrompt(hypothesisText),
    
    getPlaceholder: (fieldType: 'hypothesis' | 'name' | 'email') => 
      DELTA_COPY.chatInterface.placeholders[fieldType],
    
    getTransition: (type: 'to_contact_collection' | 'to_name_request' | 'to_email_request' | 'completion') => 
      DELTA_COPY.chatInterface.transitions[type]
  },

  // Lab Entrance (Level Complete Screen)
  labEntrance: {
    getUnlockTitle: () => DELTA_COPY.labEntrance.unlock.title,
    
    getUnlockDescription: () => DELTA_COPY.labEntrance.unlock.description,
    
    getBenefits: () => DELTA_COPY.labEntrance.benefits.items,
    
    getContactFormIntroduction: () => DELTA_COPY.labEntrance.contactForm.introduction,
    
    getFieldPlaceholder: (field: 'name' | 'email' | 'phone') => 
      DELTA_COPY.labEntrance.contactForm.fields[field].placeholder,
    
    getFieldDescription: (field: 'name' | 'email' | 'phone') => 
      DELTA_COPY.labEntrance.contactForm.fields[field].description,
    
    getSuccessMessage: () => DELTA_COPY.labEntrance.contactForm.success
  },

  // Lab Hub
  labHub: {
    getWelcomeTitle: () => DELTA_COPY.labHub.welcome.title,
    
    getWelcomeDescription: () => DELTA_COPY.labHub.welcome.description,
    
    getRoomInfo: (roomId: 'materials' | 'observatory' | 'archive') => 
      DELTA_COPY.labHub.rooms[roomId],
    
    getNavigationInstructions: () => DELTA_COPY.labHub.navigation.instructions,
    
    getEmailReminder: (type: 'persistent' | 'gentle' | 'urgent') => 
      DELTA_COPY.labHub.emailReminders[type]
  }
};

// ============================
// EMAIL AUTOMATION HELPERS
// ============================

export const EMAIL_INTEGRATION = {
  // Get email template with user data
  getPersonalizedEmail: (
    trigger: string, 
    userData: {
      visitorNumber?: number;
      hypothesis?: string;
      userName?: string;
      email?: string;
      sessionId?: string;
    }
  ) => {
    const template = EMAIL_UTILS.getTemplate(trigger as any);
    if (!template) return null;

    const variables = {
      visitorNumber: COPY_UTILS.formatVisitorNumber(userData.visitorNumber || null),
      hypothesis: userData.hypothesis || '',
      userName: userData.userName || 'Visitor',
      continueURL: `${process.env.REACT_APP_BASE_URL || ''}/continue/${userData.sessionId || ''}`,
      resultsURL: `${process.env.REACT_APP_BASE_URL || ''}/results/${userData.sessionId || ''}`,
      shopURL: `${process.env.REACT_APP_BASE_URL || ''}/shop`,
      accessCode: EMAIL_UTILS.generateAccessCode(userData.visitorNumber || 0),
      completionDate: EMAIL_UTILS.formatCompletionDate(new Date()),
      logoURL: `${process.env.REACT_APP_BASE_URL || ''}/assets/the-lab_logo_white-2_3.png`
    };

    return EMAIL_UTILS.interpolateTemplate(template, variables);
  },

  // Schedule email automation
  scheduleEmailSequence: (userData: any, trigger: string) => {
    const template = EMAIL_UTILS.getTemplate(trigger as any);
    if (!template || !EMAIL_UTILS.shouldSendEmail(template, userData)) {
      return null;
    }

    return {
      template: INTEGRATION_UTILS.getPersonalizedEmail(trigger, userData),
      delay: template.delay,
      recipient: userData.email,
      trigger
    };
  }
};

// ============================
// VALIDATION AND TESTING
// ============================

export const COPY_VALIDATION = {
  // Test all copy paths are accessible
  testCopyPaths: () => {
    const results = {
      passed: 0,
      failed: 0,
      errors: [] as string[]
    };

    // Test main copy paths
    const testPaths = [
      'DELTA_COPY.welcomeScreen.title',
      'DELTA_COPY.chatInterface.greeting.hello',
      'DELTA_COPY.labEntrance.unlock.title',
      'DELTA_COPY.labHub.welcome.title',
      'MOBILE_COPY.welcomeScreen.title',
      'EMAIL_SEQUENCES[0].subject'
    ];

    testPaths.forEach(path => {
      try {
        const value = eval(path);
        if (value) {
          results.passed++;
        } else {
          results.failed++;
          results.errors.push(`Path ${path} returned falsy value`);
        }
      } catch (error) {
        results.failed++;
        results.errors.push(`Path ${path} threw error: ${error}`);
      }
    });

    return results;
  },

  // Generate copy audit report
  generateCopyAudit: () => {
    const validation = INTEGRATION_UTILS.validateCopyIntegration();
    const pathTest = COPY_VALIDATION.testCopyPaths();

    return {
      timestamp: new Date().toISOString(),
      copyValidation: validation,
      pathTests: pathTest,
      emailTemplateCount: EMAIL_SEQUENCES.length,
      mobileVariationsCount: Object.keys(MOBILE_COPY).length,
      totalCopyKeys: Object.keys(DELTA_COPY).length,
      recommendations: validation.missingPaths.length > 0 ? [
        'Complete missing copy paths',
        'Test all component integrations',
        'Verify email template variables'
      ] : ['All copy validations passed']
    };
  }
};

export default {
  examples: INTEGRATION_EXAMPLES,
  utils: INTEGRATION_UTILS,
  components: COMPONENT_INTEGRATIONS,
  email: EMAIL_INTEGRATION,
  validation: COPY_VALIDATION
};