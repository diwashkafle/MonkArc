import {
  boolean,
  date,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const JourneyTypeEnum = pgEnum("journey_type", ["learning", "project"]);
export const journeyPhaseEnum = pgEnum("journey_phase", ["seed", "arc"]);
export const journeyStatusEnum = pgEnum("journey_status", [
  "active",
  "paused",
  "frozen",
  "dead",
  "completed",
]);
export const leafTypeEnum = pgEnum('leaf_type',['link','note','file'])

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("email_verified"),
  image: varchar("image", { length: 1024 }),
  username: varchar('username', { length: 30 }).unique(),  // Unique username
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const journeys = pgTable("journeys", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // when user with specific userId is deleted it's journey deleted as well that responsibility is hold by this onDelete:cascade attribute here.

  // types and content
  type: JourneyTypeEnum("type").notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description").notNull(),
  deliverable: text("description"), // only for project seeds

  //target and dates
  targetCheckIns: integer("target_check_ins").notNull(),
  startDate: date("start_date").notNull(),
  becomeArcAt: timestamp("became_arc_at"),
  completedAt: timestamp("completed_at"),

  // state
  phase: journeyPhaseEnum("phase").notNull().default("seed"),
  status: journeyStatusEnum("status").notNull().default("active"),

  // pause tracking
  pausedAt: timestamp("paused_at"),
  pausedDays: integer("paused_days").notNull().default(0),

  // activity tracking
  lastCheckInDate: date("last_check_in_date"),
  frozenAt: timestamp("frozen_at"),
  deadAt: timestamp("dead_at"),

  //metrics
  totalCheckIns: integer("total_check_ins").notNull().default(0),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),

  //type-specific fields
  repoURL: varchar("repo_url", { length: 1024 }),
  techStack: text("tech_stack").array(),
  coreResources: varchar("core_resources", { length: 1024 }),

  //privacy
  isPublic: boolean("is_public").notNull().default(true),

  //timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const dailyProgress = pgTable('daily_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  journeyId: uuid('journey_id').notNull().references(() => journeys.id, { onDelete: 'cascade' }),
  date: date('date').notNull(),
  
  // Journal
  journal: text('journal').notNull(),
  wordCount: integer('word_count').notNull(),
  promptUsed: varchar('prompt_used', { length: 500 }).notNull(),
  
  // GitHub (Project only)
  githubCommits: jsonb('github_commits'),
  commitCount: integer('commit_count').notNull().default(0),
  
  // Metadata
  createdAt: timestamp('created_at').defaultNow().notNull(),
  editedAt: timestamp('edited_at'),
}, 
(table) => [
    // Composite unique constraint
  unique('uniqueJourneyDate').on(table.journeyId, table.date), // this prevents the duplicate check-ins in same day
])

export const milestones = pgTable('milestones',{
    id:uuid('id').primaryKey().defaultRandom(),
    journeyId: uuid('journey_id').notNull().references(() => journeys.id, { onDelete: 'cascade' }),
  
  title: varchar('title', { length: 500 }).notNull(),
  description: text('description'),
  targetCheckIn: integer('target_check_in').notNull(),
  
  completed: boolean('completed').notNull().default(false),
  completedAt: timestamp('completed_at'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const leaves = pgTable('leaves', {
  id: uuid('id').primaryKey().defaultRandom(),
  journeyId: uuid('journey_id').notNull().references(() => journeys.id, { onDelete: 'cascade' }),
  
  type: leafTypeEnum('type').notNull(),
  title: varchar('title', { length: 500 }).notNull(),
  
  // Type-specific (only one will be filled based on type)
  url: varchar('url', { length: 2048 }),
  content: text('content'),
  fileURL: varchar('file_url', { length: 2048 }),
  fileName: varchar('file_name', { length: 255 }),
  
  attachedAt: timestamp('attached_at').defaultNow().notNull(),
})