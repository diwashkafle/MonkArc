CREATE TYPE "public"."journey_type" AS ENUM('learning', 'project');--> statement-breakpoint
CREATE TYPE "public"."journey_phase" AS ENUM('seed', 'arc');--> statement-breakpoint
CREATE TYPE "public"."journey_status" AS ENUM('active', 'paused', 'frozen', 'dead', 'completed');--> statement-breakpoint
CREATE TYPE "public"."leaf_type" AS ENUM('link', 'note', 'file');--> statement-breakpoint
CREATE TABLE "daily_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"journey_id" uuid NOT NULL,
	"date" date NOT NULL,
	"journal" text NOT NULL,
	"word_count" integer NOT NULL,
	"prompt_used" varchar(500) NOT NULL,
	"github_commits" jsonb,
	"commit_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"edited_at" timestamp,
	CONSTRAINT "uniqueJourneyDate" UNIQUE("journey_id","date")
);
--> statement-breakpoint
CREATE TABLE "journeys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "journey_type" NOT NULL,
	"title" varchar(500) NOT NULL,
	"description" text,
	"target_check_ins" integer NOT NULL,
	"start_date" date NOT NULL,
	"became_arc_at" timestamp,
	"completed_at" timestamp,
	"phase" "journey_phase" DEFAULT 'seed' NOT NULL,
	"status" "journey_status" DEFAULT 'active' NOT NULL,
	"paused_at" timestamp,
	"paused_days" integer DEFAULT 0 NOT NULL,
	"last_check_in_date" date,
	"frozen_at" timestamp,
	"dead_at" timestamp,
	"total_check_ins" integer DEFAULT 0 NOT NULL,
	"current_streak" integer DEFAULT 0 NOT NULL,
	"longest_streak" integer DEFAULT 0 NOT NULL,
	"repo_url" varchar(1024),
	"tech_stack" text[],
	"core_resources" varchar(1024),
	"is_public" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leaves" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"journey_id" uuid NOT NULL,
	"type" "leaf_type" NOT NULL,
	"title" varchar(500) NOT NULL,
	"url" varchar(2048),
	"content" text,
	"file_url" varchar(2048),
	"file_name" varchar(255),
	"attached_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "milestones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"journey_id" uuid NOT NULL,
	"title" varchar(500) NOT NULL,
	"description" text,
	"target_check_in" integer NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp,
	"image" varchar(1024),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "daily_progress" ADD CONSTRAINT "daily_progress_journey_id_journeys_id_fk" FOREIGN KEY ("journey_id") REFERENCES "public"."journeys"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journeys" ADD CONSTRAINT "journeys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leaves" ADD CONSTRAINT "leaves_journey_id_journeys_id_fk" FOREIGN KEY ("journey_id") REFERENCES "public"."journeys"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "milestones" ADD CONSTRAINT "milestones_journey_id_journeys_id_fk" FOREIGN KEY ("journey_id") REFERENCES "public"."journeys"("id") ON DELETE cascade ON UPDATE no action;