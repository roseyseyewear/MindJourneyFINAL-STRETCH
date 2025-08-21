/**
 * Lab Experience Database Setup
 * Sets up the complete 4-level Delta Final Stretch lab experience
 */

import { db } from './db';
import { experiments, experimentLevels } from '@shared/schema';
import { sql } from 'drizzle-orm';

export async function setupLabExperience() {
  console.log('🏗️  Setting up Delta Final Stretch lab experience...');

  try {
    // Create the main experiment
    const experimentResult = await db.insert(experiments).values({
      title: 'The Delta Final Stretch Experience',
      description: 'An immersive laboratory experience exploring perception and hypothesis validation through rose-colored glasses',
      totalLevels: 4,
      isActive: true
    }).returning();

    const experimentId = experimentResult[0].id;
    console.log('✅ Created experiment:', experimentId);

    // Set up the 4 levels corresponding to each lab phase
    const labLevels = [
      {
        // Level 1: Hypothesis Entry
        experimentId,
        levelNumber: 1,
        videoUrl: '/videos/lab-phases/hypothesis-intro.mp4',
        backgroundVideoUrl: '/videos/backgrounds/welcome-ambient.mp4',
        postSubmissionVideoUrl: '/videos/hypothesis-post-submission.mp4',
        videoThumbnail: '/videos/thumbnails/hypothesis-intro.jpg',
        questions: JSON.stringify([
          {
            id: 'hypothesis-response',
            type: 'text',
            title: 'Your Hypothesis',
            text: 'Share your hypothesis to continue. What will you see wearing rose colored glasses? What will you feel?',
            required: true,
            allowedMediaTypes: ['photo', 'video', 'audio']
          }
        ]),
        branchingRules: JSON.stringify([
          {
            condition: 'default',
            targetPath: 'chat',
            nextLevelId: '2'
          }
        ])
      },
      {
        // Level 2: Chat Response & Follow-up
        experimentId,
        levelNumber: 2,
        videoUrl: '/videos/chat-loop.mp4',
        backgroundVideoUrl: '/videos/backgrounds/chat-loop.mp4',
        postSubmissionVideoUrl: '/videos/hypothesis-post-submission.mp4',
        videoThumbnail: '/videos/thumbnails/chat-interface.jpg',
        questions: JSON.stringify([
          {
            id: 'follow-up-1',
            type: 'text',
            title: 'Follow-up Question',
            text: 'Can you elaborate on what specific changes you expect to notice?',
            required: true
          },
          {
            id: 'confidence-level',
            type: 'scale',
            title: 'Confidence Level',
            text: 'How confident are you in your hypothesis?',
            required: true,
            scaleRange: { min: 1, max: 10, labels: ['Not confident', 'Very confident'] }
          }
        ]),
        branchingRules: JSON.stringify([
          {
            condition: 'default',
            targetPath: 'labEntrance',
            nextLevelId: '3'
          }
        ])
      },
      {
        // Level 3: Lab Entrance & Contact Capture
        experimentId,
        levelNumber: 3,
        videoUrl: '/videos/transitions/door-opening.mp4',
        backgroundVideoUrl: '/videos/level1-forest.mp4',
        videoThumbnail: '/videos/thumbnails/door-opening.jpg',
        questions: JSON.stringify([
          {
            id: 'email-capture',
            type: 'text',
            title: 'Email Address',
            text: 'Enter your email to unlock exclusive lab access and early access benefits',
            required: true
          },
          {
            id: 'name-capture',
            type: 'text',
            title: 'First Name',
            text: 'What should we call you?',
            required: false
          }
        ]),
        branchingRules: JSON.stringify([
          {
            condition: 'default',
            targetPath: 'labHub',
            nextLevelId: '4'
          }
        ])
      },
      {
        // Level 4: Lab Hub & Room Selection
        experimentId,
        levelNumber: 4,
        videoUrl: '/videos/lab-phases/lab-hub.mp4',
        backgroundVideoUrl: '/videos/backgrounds/futuristic-interface-1.mp4',
        videoThumbnail: '/videos/thumbnails/lab-hub.jpg',
        questions: JSON.stringify([
          {
            id: 'room-selection',
            type: 'multiple_choice',
            title: 'Choose Your Lab Experience',
            text: 'Select which lab room you\'d like to explore first',
            required: true,
            options: [
              'Materials Lab - Touch & Feel',
              'Observatory - Science & Tests', 
              'Archive - Stories & Community'
            ]
          },
          {
            id: 'experience-feedback',
            type: 'text',
            title: 'Experience Reflection',
            text: 'How has this experience compared to your initial hypothesis?',
            required: false
          }
        ]),
        branchingRules: JSON.stringify([
          {
            condition: 'default',
            targetPath: 'completed',
            nextLevelId: null
          }
        ])
      }
    ];

    // Insert all levels
    const levelResults = await db.insert(experimentLevels).values(labLevels).returning();
    console.log('✅ Created levels:', levelResults.length);

    console.log('🎉 Lab experience setup complete!');
    console.log('Experiment ID:', experimentId);
    console.log('Levels created:', levelResults.map(l => `Level ${l.levelNumber}: ${l.videoUrl}`));

    return {
      experimentId,
      levels: levelResults
    };

  } catch (error) {
    console.error('❌ Failed to setup lab experience:', error);
    throw error;
  }
}

// Export for manual setup if needed
export async function resetLabExperience() {
  console.log('🔄 Resetting lab experience...');
  
  try {
    // Delete existing experiment and levels (cascading)
    await db.delete(experiments).where(sql`title = 'The Delta Final Stretch Experience'`);
    console.log('✅ Cleared existing data');
    
    // Setup fresh experience
    return await setupLabExperience();
  } catch (error) {
    console.error('❌ Failed to reset lab experience:', error);
    throw error;
  }
}