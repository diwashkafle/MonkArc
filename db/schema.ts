import { pgTable, uuid, varchar, text, integer, date, timestamp, boolean, pgEnum, primaryKey, jsonb, unique, json } from 'drizzle-orm/pg-core'
import type { AdapterAccount } from 'next-auth/adapters'

// AUTH.JS TABLES

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: timestamp('email_verified'),
  image: varchar('image', { length: 1024 }),
  username: varchar('username', { length: 30 }).unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const accounts = pgTable('accounts', {
  userId: uuid('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 255 }).$type<AdapterAccount['type']>().notNull(),
  provider: varchar('provider', { length: 255 }).notNull(),
  providerAccountId: varchar('providerAccountId', { length: 255 }).notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: varchar('token_type', { length: 255 }),
  scope: varchar('scope', { length: 255 }),
  id_token: text('id_token'),
  session_state: varchar('session_state', { length: 255 }),
}, (table) => [
  primaryKey({ columns: [table.provider, table.providerAccountId] })
])

export const sessions = pgTable('sessions', {
  sessionToken: varchar('sessionToken', { length: 255 }).notNull().primaryKey(),
  userId: uuid('userId').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires').notNull(),
})

export const verificationTokens = pgTable('verificationTokens', {
  identifier: varchar('identifier', { length: 255 }).notNull(),
  token: varchar('token', { length: 255 }).notNull(),
  expires: timestamp('expires').notNull(),
}, (table) => [
  primaryKey({ columns: [table.identifier, table.token] })
])

type ResourceItem = {
  id: string
  url: string
  title: string
  type: 'article' | 'video' | 'course' | 'book' | 'other' | 'docs'
  addedAt: string
}

// MONKARC TABLES

export const journeyTypeEnum = pgEnum('journey_type', ['learning', 'project'])
export const journeyPhaseEnum = pgEnum('journey_phase', ['seed', 'arc'])
export const journeyStatusEnum = pgEnum('journey_status', ['active', 'paused', 'frozen', 'dead', 'completed', 'extended', 'scheduled'])

export const journeys = pgTable('journeys', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  
  // Type & Content
  type: journeyTypeEnum('type').notNull(),
  title: varchar('title', { length: 500 }).notNull(),
  description: text('description').notNull(),
  deliverable: text('deliverable'),

  // Learning Resources
  resources: json('resources').$type<ResourceItem[]>().default([]),
  // Targets & Dates
  targetCheckIns: integer('target_check_ins').notNull(),
  startDate: date('start_date').notNull(),
  becameArcAt: timestamp('became_arc_at'),
  completedAt: timestamp('completed_at'),
  
  // State
  phase: journeyPhaseEnum('phase').notNull().default('seed'),
  status: journeyStatusEnum('status').notNull(),
  
  // Pause Tracking
  pausedAt: timestamp('paused_at'),
  pausedDays: integer('paused_days').notNull().default(0),
  
  // Activity Tracking
  lastCheckInDate: date('last_check_in_date'),
  frozenAt: timestamp('frozen_at'),
  deadAt: timestamp('dead_at'),
  
  // Metrics
  totalCheckIns: integer('total_check_ins').notNull().default(0),
  currentStreak: integer('current_streak').notNull().default(0),
  longestStreak: integer('longest_streak').notNull().default(0),
  
  // Type-Specific Fields
  repoURL: varchar('repo_url', { length: 1024 }),
  techStack: text('tech_stack').array(),
  coreResource: varchar('core_resource', { length: 1024 }),
  
  // Privacy
  isPublic: boolean('is_public').notNull().default(false),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const dailyProgress = pgTable('daily_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  journeyId: uuid('journey_id').notNull().references(() => journeys.id, { onDelete: 'cascade' }),
  date: date('date').notNull(),
  
  accomplishment:text('accomplishment').notNull(),
  notes: text('notes'),
  wordCount: integer('word_count').notNull(),
  promptUsed: varchar('prompt_used', { length: 500 }).notNull(),
  
  githubCommits: jsonb('github_commits'),
  commitCount: integer('commit_count').notNull().default(0),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  editedAt: timestamp('edited_at'),
}, (table) => [
  unique('uniqueJourneyDate').on(table.journeyId, table.date),
])

export const milestones = pgTable('milestones', {
  id: uuid('id').primaryKey().defaultRandom(),
  journeyId: uuid('journey_id').notNull().references(() => journeys.id, { onDelete: 'cascade' }),
  
  title: varchar('title', { length: 500 }).notNull(),
  description: text('description'),
  targetCheckIn: integer('target_check_in').notNull(),
  
  completed: boolean('completed').notNull().default(false),
  completedAt: timestamp('completed_at'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const leafTypeEnum = pgEnum('leaf_type', ['link', 'note', 'file'])

export const leaves = pgTable('leaves', {
  id: uuid('id').primaryKey().defaultRandom(),
  journeyId: uuid('journey_id').notNull().references(() => journeys.id, { onDelete: 'cascade' }),
  
  type: leafTypeEnum('type').notNull(),
  title: varchar('title', { length: 500 }).notNull(),
  
  url: varchar('url', { length: 2048 }),
  content: text('content'),
  fileURL: varchar('file_url', { length: 2048 }),
  fileName: varchar('file_name', { length: 255 }),
  
  attachedAt: timestamp('attached_at').defaultNow().notNull(),
})