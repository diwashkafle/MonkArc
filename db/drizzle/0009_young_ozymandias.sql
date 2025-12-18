ALTER TABLE "journeys" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "journeys" ADD COLUMN "extended_at" timestamp;--> statement-breakpoint
ALTER TABLE "journeys" ADD COLUMN "is_extended" boolean DEFAULT false NOT NULL;