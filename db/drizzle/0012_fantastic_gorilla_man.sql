DROP TABLE "leaves" CASCADE;--> statement-breakpoint
ALTER TABLE "journeys" ADD COLUMN "is_extended" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "journeys" ADD COLUMN "original_target" integer;--> statement-breakpoint
ALTER TABLE "journeys" ADD COLUMN "times_extended" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "journeys" ADD COLUMN "last_extended_at" timestamp;--> statement-breakpoint
ALTER TABLE "journeys" ADD COLUMN "extension_history" json DEFAULT '[]'::json;--> statement-breakpoint
DROP TYPE "public"."leaf_type";