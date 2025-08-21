/**
 * Email Sequence Templates and Automation Logic
 * 
 * Complete email marketing automation for the Delta Final Stretch
 * lab experience, including dynamic content and personalization.
 */

import { DELTA_COPY, COPY_UTILS } from './copy-constants';

// Email template types
export type EmailTrigger = 
  | 'hypothesis_submitted' 
  | 'contact_captured' 
  | 'lab_unlocked'
  | 'room_selected'
  | 'experience_completed'
  | 'experience_incomplete_24h'
  | 'early_access_available'
  | 'delivery_reminder';

// Email template structure
export interface EmailTemplate {
  id: string;
  trigger: EmailTrigger;
  delay: number; // milliseconds
  subject: string;
  preheader: string;
  htmlContent: string;
  textContent: string;
  variables: string[];
  conditions?: EmailCondition[];
}

// Conditional logic for email sends
export interface EmailCondition {
  field: string;
  operator: 'equals' | 'contains' | 'exists' | 'not_exists' | 'greater_than' | 'less_than';
  value: any;
}

// Email sequence configuration
export const EMAIL_SEQUENCES: EmailTemplate[] = [
  // ============================
  // WELCOME SEQUENCE - Hypothesis Submitted
  // ============================
  {
    id: 'welcome_hypothesis',
    trigger: 'hypothesis_submitted',
    delay: 0, // Immediate
    subject: 'Your Lab Experience Has Begun - Visitor #{visitorNumber}',
    preheader: 'Your hypothesis: "{hypothesis}" is being processed...',
    variables: ['visitorNumber', 'hypothesis', 'userName', 'continueURL'],
    htmlContent: `
      <div style="font-family: 'Magda Clean', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #141414 0%, #2a2a2a 100%); padding: 40px 20px; text-align: center;">
          <img src="{logoURL}" alt="The Lab" style="height: 60px; margin-bottom: 20px;">
          <h1 style="color: #eeeeee; font-size: 28px; font-weight: bold; margin: 0;">
            Welcome to The Lab
          </h1>
          <p style="color: #eeeeee; font-size: 16px; margin: 10px 0 0 0;">
            Visitor #{visitorNumber}
          </p>
        </div>

        <!-- Content -->
        <div style="background: #141414; padding: 40px 20px; color: #eeeeee;">
          <h2 style="color: #eeeeee; font-size: 22px; margin-bottom: 20px;">
            Your Hypothesis Has Been Recorded
          </h2>
          
          <div style="background: rgba(238,238,238,0.1); padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="font-style: italic; font-size: 16px; line-height: 1.5; margin: 0;">
              "{hypothesis}"
            </p>
          </div>

          <p style="line-height: 1.6; margin-bottom: 20px;">
            Hello {userName},
          </p>
          
          <p style="line-height: 1.6; margin-bottom: 20px;">
            Your lab experience is now being personalized based on your unique prediction. 
            This isn't just another website interaction - you're participating in a real 
            experiment on perception and reality.
          </p>

          <h3 style="color: #eeeeee; font-size: 18px; margin: 30px 0 15px 0;">
            What Happens Next:
          </h3>
          
          <ul style="line-height: 1.6; margin-bottom: 30px; padding-left: 20px;">
            <li style="margin-bottom: 10px;">Your experience is now personalized based on your prediction</li>
            <li style="margin-bottom: 10px;">Continue exploring the three lab environments</li>
            <li style="margin-bottom: 10px;">Your results will be compiled as you complete each section</li>
            <li style="margin-bottom: 10px;">Unlock early access to our complete collection</li>
          </ul>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="{continueURL}" style="background: #eeeeee; color: #141414; padding: 15px 30px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block;">
              Continue Your Experience
            </a>
          </div>

          <p style="font-size: 14px; color: #aaa; margin-top: 40px;">
            Your visitor number is #{visitorNumber}. Save this email to return to your experience anytime.
          </p>
        </div>
      </div>
    `,
    textContent: `
Welcome to The Lab - Visitor #{visitorNumber}

Your Hypothesis Has Been Recorded:
"{hypothesis}"

Hello {userName},

Your lab experience is now being personalized based on your unique prediction. This isn't just another website interaction - you're participating in a real experiment on perception and reality.

What Happens Next:
• Your experience is now personalized based on your prediction
• Continue exploring the three lab environments  
• Your results will be compiled as you complete each section
• Unlock early access to our complete collection

Continue your experience: {continueURL}

Your visitor number is #{visitorNumber}. Save this email to return to your experience anytime.
    `
  },

  // ============================
  // PROGRESS REMINDER - 24 Hours Incomplete
  // ============================
  {
    id: 'progress_reminder',
    trigger: 'experience_incomplete_24h',
    delay: 86400000, // 24 hours
    subject: 'Your Lab Experience Awaits - Don\'t Lose Your Progress',
    preheader: '60% complete... Continue where you left off',
    variables: ['visitorNumber', 'userName', 'hypothesis', 'continueURL', 'completionRate'],
    conditions: [
      { field: 'completionRate', operator: 'less_than', value: 100 }
    ],
    htmlContent: `
      <div style="font-family: 'Magda Clean', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #141414 0%, #2a2a2a 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: #eeeeee; font-size: 26px; font-weight: bold; margin: 0;">
            Don't Lose Your Progress
          </h1>
          <p style="color: #eeeeee; font-size: 16px; margin: 10px 0 0 0;">
            Visitor #{visitorNumber} - {completionRate}% Complete
          </p>
        </div>

        <!-- Progress Bar -->
        <div style="background: #141414; padding: 20px;">
          <div style="background: rgba(238,238,238,0.2); height: 8px; border-radius: 4px; overflow: hidden;">
            <div style="background: #eeeeee; height: 100%; width: {completionRate}%; transition: width 0.5s;"></div>
          </div>
        </div>

        <!-- Content -->
        <div style="background: #141414; padding: 20px 20px 40px 20px; color: #eeeeee;">
          <p style="line-height: 1.6; margin-bottom: 20px;">
            Hello {userName},
          </p>
          
          <p style="line-height: 1.6; margin-bottom: 20px;">
            You've made excellent progress in your lab experience, but there's still more to explore. 
            Your hypothesis <strong>"{hypothesis}"</strong> is waiting to be fully tested.
          </p>

          <h3 style="color: #eeeeee; font-size: 18px; margin: 30px 0 15px 0;">
            Still to Explore:
          </h3>
          
          <ul style="line-height: 1.6; margin-bottom: 30px; padding-left: 20px;">
            <li style="margin-bottom: 8px;">🔬 Complete your perception analysis</li>
            <li style="margin-bottom: 8px;">🎯 Unlock your personalized results</li>
            <li style="margin-bottom: 8px;">🚚 Activate early access delivery</li>
            <li style="margin-bottom: 8px;">💎 Access exclusive visitor rewards</li>
          </ul>

          <p style="line-height: 1.6; margin-bottom: 30px; font-weight: bold;">
            Each section adds depth to your final results report and unlocks additional benefits.
          </p>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="{continueURL}" style="background: #eeeeee; color: #141414; padding: 15px 30px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block;">
              Complete Your Experience
            </a>
          </div>
        </div>
      </div>
    `,
    textContent: `
Don't Lose Your Progress - Visitor #{visitorNumber}

{completionRate}% Complete

Hello {userName},

You've made excellent progress in your lab experience, but there's still more to explore. Your hypothesis "{hypothesis}" is waiting to be fully tested.

Still to Explore:
• Complete your perception analysis
• Unlock your personalized results  
• Activate early access delivery
• Access exclusive visitor rewards

Each section adds depth to your final results report and unlocks additional benefits.

Complete your experience: {continueURL}
    `
  },

  // ============================
  // RESULTS DELIVERY - Experience Complete
  // ============================
  {
    id: 'results_complete',
    trigger: 'experience_completed',
    delay: 600000, // 10 minutes after completion
    subject: '🔬 Your Personalized Lab Results Are Ready',
    preheader: 'Based on "{hypothesis}" - Your complete analysis inside...',
    variables: ['visitorNumber', 'userName', 'hypothesis', 'resultsURL', 'completionDate'],
    conditions: [
      { field: 'completionRate', operator: 'equals', value: 100 }
    ],
    htmlContent: `
      <div style="font-family: 'Magda Clean', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #141414 0%, #2a2a2a 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: #eeeeee; font-size: 28px; font-weight: bold; margin: 0;">
            🎉 Congratulations!
          </h1>
          <p style="color: #eeeeee; font-size: 18px; margin: 15px 0 0 0;">
            Your Lab Results Are Ready
          </p>
          <p style="color: #aaa; font-size: 14px; margin: 10px 0 0 0;">
            Visitor #{visitorNumber} - Completed {completionDate}
          </p>
        </div>

        <!-- Content -->
        <div style="background: #141414; padding: 40px 20px; color: #eeeeee;">
          <p style="line-height: 1.6; margin-bottom: 20px;">
            Exceptional work, {userName}!
          </p>
          
          <p style="line-height: 1.6; margin-bottom: 20px;">
            Your lab experience is complete. Based on your hypothesis and interactions throughout 
            the experience, we've compiled your personalized results and analysis.
          </p>

          <div style="background: rgba(238,238,238,0.1); padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #eeeeee; margin: 0 0 10px 0;">Your Original Hypothesis:</h4>
            <p style="font-style: italic; font-size: 16px; line-height: 1.5; margin: 0;">
              "{hypothesis}"
            </p>
          </div>

          <h3 style="color: #eeeeee; font-size: 20px; margin: 30px 0 20px 0;">
            Your Personalized Results Include:
          </h3>
          
          <div style="margin-bottom: 30px;">
            <div style="margin-bottom: 15px; padding: 15px; background: rgba(238,238,238,0.05); border-radius: 6px;">
              <strong>🧠 Hypothesis Analysis</strong><br>
              <span style="color: #aaa; font-size: 14px;">How your prediction compared to your actual experience</span>
            </div>
            <div style="margin-bottom: 15px; padding: 15px; background: rgba(238,238,238,0.05); border-radius: 6px;">
              <strong>👁️ Perception Profile</strong><br>
              <span style="color: #aaa; font-size: 14px;">Your unique visual and emotional response patterns</span>
            </div>
            <div style="margin-bottom: 15px; padding: 15px; background: rgba(238,238,238,0.05); border-radius: 6px;">
              <strong>🕶️ Recommended Collection</strong><br>
              <span style="color: #aaa; font-size: 14px;">Curated frame selection based on your lab interactions</span>
            </div>
            <div style="margin-bottom: 15px; padding: 15px; background: rgba(238,238,238,0.05); border-radius: 6px;">
              <strong>✨ Your Visual Signature</strong><br>
              <span style="color: #aaa; font-size: 14px;">Unique identifier based on your perception patterns</span>
            </div>
          </div>

          <div style="background: rgba(238,238,238,0.1); padding: 25px; border-radius: 8px; margin: 30px 0;">
            <h4 style="color: #eeeeee; margin: 0 0 15px 0; font-size: 18px;">🎁 Exclusive Verified Visitor Benefits:</h4>
            <ul style="line-height: 1.8; margin: 0; padding-left: 20px;">
              <li>48-hour early access to complete collection</li>
              <li>Expedited worldwide shipping (starts tomorrow)</li> 
              <li>Personal consultation based on your lab results</li>
              <li>Limited edition visitor-only accessories</li>
              <li>Lifetime access to new collections preview</li>
            </ul>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="{resultsURL}" style="background: #eeeeee; color: #141414; padding: 18px 35px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; display: inline-block;">
              View Your Complete Results
            </a>
          </div>

          <p style="font-size: 14px; color: #aaa; margin-top: 40px; text-align: center;">
            Your results are saved permanently under Visitor #{visitorNumber}
          </p>
        </div>
      </div>
    `,
    textContent: `
🎉 Congratulations! Your Lab Results Are Ready
Visitor #{visitorNumber} - Completed {completionDate}

Exceptional work, {userName}!

Your lab experience is complete. Based on your hypothesis and interactions throughout the experience, we've compiled your personalized results and analysis.

Your Original Hypothesis:
"{hypothesis}"

Your Personalized Results Include:
• Hypothesis Analysis - How your prediction compared to your actual experience
• Perception Profile - Your unique visual and emotional response patterns  
• Recommended Collection - Curated frame selection based on your lab interactions
• Your Visual Signature - Unique identifier based on your perception patterns

Exclusive Verified Visitor Benefits:
• 48-hour early access to complete collection
• Expedited worldwide shipping (starts tomorrow)
• Personal consultation based on your lab results
• Limited edition visitor-only accessories
• Lifetime access to new collections preview

View your complete results: {resultsURL}

Your results are saved permanently under Visitor #{visitorNumber}
    `
  },

  // ============================
  // EARLY ACCESS NOTIFICATION
  // ============================
  {
    id: 'early_access_open',
    trigger: 'early_access_available',
    delay: 86400000, // 24 hours after completion
    subject: '🚚 Your Early Access Window Opens NOW - 48 Hours Only',
    preheader: 'Worldwide shipping available for verified lab participants...',
    variables: ['visitorNumber', 'userName', 'shopURL', 'accessCode'],
    conditions: [
      { field: 'completionRate', operator: 'equals', value: 100 },
      { field: 'contactEmail', operator: 'exists', value: true }
    ],
    htmlContent: `
      <div style="font-family: 'Magda Clean', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: #000; font-size: 28px; font-weight: bold; margin: 0;">
            🚚 Early Access is LIVE
          </h1>
          <p style="color: #000; font-size: 16px; margin: 15px 0 0 0; font-weight: bold;">
            48-Hour Exclusive Window for Visitor #{visitorNumber}
          </p>
        </div>

        <!-- Urgency Banner -->
        <div style="background: #ff4444; color: #fff; padding: 15px; text-align: center;">
          <strong>⏰ LIMITED TIME: Early Access Expires in 48 Hours</strong>
        </div>

        <!-- Content -->
        <div style="background: #141414; padding: 40px 20px; color: #eeeeee;">
          <p style="line-height: 1.6; margin-bottom: 20px; font-size: 18px;">
            Exciting news, {userName}!
          </p>
          
          <p style="line-height: 1.6; margin-bottom: 25px;">
            Your early access period begins <strong>right now</strong>. As a verified lab participant, 
            you have 48-hour priority access to our complete collection with expedited worldwide shipping.
          </p>

          <h3 style="color: #eeeeee; font-size: 20px; margin: 30px 0 20px 0;">
            🎯 Your Early Access Benefits:
          </h3>
          
          <div style="margin-bottom: 30px;">
            <div style="margin-bottom: 12px; padding: 12px; background: rgba(255,107,53,0.1); border-left: 4px solid #ff6b35; border-radius: 4px;">
              <strong>🕶️ Complete Frame Collection</strong><br>
              <span style="color: #ccc; font-size: 14px;">Access to all styles with your lab-tested customizations</span>
            </div>
            <div style="margin-bottom: 12px; padding: 12px; background: rgba(255,107,53,0.1); border-left: 4px solid #ff6b35; border-radius: 4px;">
              <strong>🚀 Expedited Worldwide Shipping</strong><br>
              <span style="color: #ccc; font-size: 14px;">Priority processing and 2-3 day delivery anywhere</span>
            </div>
            <div style="margin-bottom: 12px; padding: 12px; background: rgba(255,107,53,0.1); border-left: 4px solid #ff6b35; border-radius: 4px;">
              <strong>👨‍⚕️ Personal Consultation</strong><br>
              <span style="color: #ccc; font-size: 14px;">Based on your unique lab results and perception profile</span>
            </div>
            <div style="margin-bottom: 12px; padding: 12px; background: rgba(255,107,53,0.1); border-left: 4px solid #ff6b35; border-radius: 4px;">
              <strong>🎁 Visitor-Only Accessories</strong><br>
              <span style="color: #ccc; font-size: 14px;">Exclusive items not available to general public</span>
            </div>
          </div>

          <div style="background: rgba(255,68,68,0.1); padding: 20px; border-radius: 8px; border: 1px solid #ff4444; margin: 30px 0;">
            <p style="color: #ff6b35; font-weight: bold; margin: 0 0 10px 0;">
              ⚠️ Early Access Restrictions:
            </p>
            <ul style="color: #ccc; margin: 0; padding-left: 20px; line-height: 1.6;">
              <li>Limited to verified lab participants only</li>
              <li>Access expires in exactly 48 hours</li>
              <li>Some items have limited inventory</li>
              <li>Cannot be combined with other offers</li>
            </ul>
          </div>

          <!-- Access Code -->
          <div style="background: rgba(238,238,238,0.1); padding: 25px; border-radius: 8px; margin: 30px 0; text-align: center;">
            <p style="margin: 0 0 10px 0; color: #ccc;">Your Early Access Code:</p>
            <div style="font-size: 24px; font-weight: bold; color: #ff6b35; letter-spacing: 3px; font-family: monospace;">
              {accessCode}
            </div>
            <p style="margin: 10px 0 0 0; font-size: 12px; color: #aaa;">
              Use this code at checkout for early access pricing
            </p>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="{shopURL}" style="background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%); color: #000; padding: 18px 35px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; display: inline-block;">
              Activate Early Access Now
            </a>
          </div>

          <p style="font-size: 12px; color: #666; margin-top: 30px; text-align: center; line-height: 1.5;">
            This early access window is exclusive to lab participants and expires in 48 hours. 
            Your access code {accessCode} is linked to Visitor #{visitorNumber}.
          </p>
        </div>
      </div>
    `,
    textContent: `
🚚 Early Access is LIVE - 48 Hours Only
Visitor #{visitorNumber}

⏰ LIMITED TIME: Early Access Expires in 48 Hours

Exciting news, {userName}!

Your early access period begins right now. As a verified lab participant, you have 48-hour priority access to our complete collection with expedited worldwide shipping.

Your Early Access Benefits:
• Complete Frame Collection - Access to all styles with lab-tested customizations
• Expedited Worldwide Shipping - Priority processing and 2-3 day delivery anywhere  
• Personal Consultation - Based on your unique lab results and perception profile
• Visitor-Only Accessories - Exclusive items not available to general public

Your Early Access Code: {accessCode}
Use this code at checkout for early access pricing

Activate Early Access: {shopURL}

This early access window is exclusive to lab participants and expires in 48 hours.
    `
  }
];

// Email automation utilities
export const EMAIL_UTILS = {
  // Get email template by trigger
  getTemplate: (trigger: EmailTrigger): EmailTemplate | null => {
    return EMAIL_SEQUENCES.find(seq => seq.trigger === trigger) || null;
  },

  // Interpolate template variables
  interpolateTemplate: (template: EmailTemplate, variables: Record<string, any>): EmailTemplate => {
    return {
      ...template,
      subject: COPY_UTILS.interpolate(template.subject, variables),
      preheader: COPY_UTILS.interpolate(template.preheader, variables),
      htmlContent: COPY_UTILS.interpolate(template.htmlContent, variables),
      textContent: COPY_UTILS.interpolate(template.textContent, variables)
    };
  },

  // Check if email conditions are met
  shouldSendEmail: (template: EmailTemplate, userData: Record<string, any>): boolean => {
    if (!template.conditions) return true;

    return template.conditions.every(condition => {
      const fieldValue = userData[condition.field];

      switch (condition.operator) {
        case 'equals':
          return fieldValue === condition.value;
        case 'contains':
          return typeof fieldValue === 'string' && fieldValue.includes(condition.value);
        case 'exists':
          return fieldValue !== undefined && fieldValue !== null;
        case 'not_exists':
          return fieldValue === undefined || fieldValue === null;
        case 'greater_than':
          return typeof fieldValue === 'number' && fieldValue > condition.value;
        case 'less_than':
          return typeof fieldValue === 'number' && fieldValue < condition.value;
        default:
          return true;
      }
    });
  },

  // Generate access code for early access
  generateAccessCode: (visitorNumber: number): string => {
    const base = `LAB${COPY_UTILS.formatVisitorNumber(visitorNumber)}`;
    const timestamp = Date.now().toString().slice(-4);
    return `${base}${timestamp}`;
  },

  // Format completion date
  formatCompletionDate: (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
};

export default EMAIL_SEQUENCES;