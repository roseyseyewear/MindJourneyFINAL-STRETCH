import { 
  type User, 
  type UpsertUser,
  type InsertUser,
  type Experiment,
  type InsertExperiment,
  type ExperimentLevel,
  type InsertExperimentLevel,
  type ExperimentSession,
  type InsertExperimentSession,
  type ExperimentResponse,
  type InsertExperimentResponse,
  type ParticipationSetting,
  type InsertParticipationSetting,
  type ActivityTrackingEvent,
  type InsertActivityTracking,
  type Question
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";
import { 
  users, 
  experiments, 
  experimentLevels, 
  experimentSessions, 
  experimentResponses,
  participationSettings,
  activityTracking,
  visitorCounterSequence
} from "@shared/schema";
import { setupLabExperience } from "./lab-experience-setup";

export interface IStorage {
  // User methods (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createAnonymousUser(): Promise<User>;

  // Privacy settings methods
  getParticipationSettings(userId: string): Promise<ParticipationSetting | undefined>;
  setParticipationSettings(settings: InsertParticipationSetting): Promise<ParticipationSetting>;

  // Experiment methods
  getExperiment(id: string): Promise<Experiment | undefined>;
  getActiveExperiment(): Promise<Experiment | undefined>;
  createExperiment(experiment: InsertExperiment): Promise<Experiment>;
  getExperimentLevels(experimentId: string): Promise<ExperimentLevel[]>;
  getExperimentLevel(levelId: string): Promise<ExperimentLevel | undefined>;
  createExperimentLevel(level: InsertExperimentLevel): Promise<ExperimentLevel>;

  // Session methods
  createSession(session: InsertExperimentSession): Promise<ExperimentSession>;
  getSession(sessionId: string): Promise<ExperimentSession | undefined>;
  updateSession(sessionId: string, updates: Partial<ExperimentSession>): Promise<ExperimentSession>;
  getUserSessions(userId: string): Promise<ExperimentSession[]>;
  getAllSessions(): Promise<ExperimentSession[]>;

  // Response methods
  createResponse(response: InsertExperimentResponse): Promise<ExperimentResponse>;
  getSessionResponses(sessionId: string): Promise<ExperimentResponse[]>;
  getUserResponses(userId: string): Promise<ExperimentResponse[]>;

  // Activity tracking methods
  trackActivity(activity: InsertActivityTracking): Promise<ActivityTrackingEvent>;
  getUserActivity(userId: string): Promise<ActivityTrackingEvent[]>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize with lab experience data
    this.initializeLabExperience();
  }

  private async initializeLabExperience() {
    try {
      // Check if we already have the lab experience
      const existingExperiment = await db.select()
        .from(experiments)
        .where(eq(experiments.title, 'The Delta Final Stretch Experience'))
        .limit(1);
      
      if (existingExperiment.length > 0) {
        console.log('✅ Lab experience already exists');
        return;
      }

      console.log('🚀 Setting up Delta Final Stretch lab experience...');
      await setupLabExperience();
    } catch (error) {
      console.error('❌ Failed to initialize lab experience:', error);
    }
  }

  // User methods (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async createAnonymousUser(): Promise<User> {
    try {
      // Get next visitor number atomically
      const visitorNumberResult = await db.execute(
        sql`SELECT nextval('visitor_counter_sequence') as visitor_number`
      );
      const visitorNumber = (visitorNumberResult.rows[0] as any)?.visitor_number;
      
      console.log('🔢 Generated visitor number:', visitorNumber);
      
      const [user] = await db
        .insert(users)
        .values({
          isAnonymous: true,
          visitorNumber: visitorNumber
        })
        .returning();

      console.log('✅ Created anonymous user with visitor number:', user.visitorNumber);
      return user;
    } catch (error) {
      console.error('❌ Error creating anonymous user with visitor number:', error);
      
      // Fallback: create user without visitor number to not break user flow
      const [user] = await db
        .insert(users)
        .values({
          isAnonymous: true,
        })
        .returning();
        
      console.log('⚠️ Anonymous user created without visitor number as fallback');
      return user;
    }
  }

  // Rest of the methods remain the same...
  // [Include all the other methods from the original storage.ts]
}

// Create and export the storage instance
export const storage = new DatabaseStorage();