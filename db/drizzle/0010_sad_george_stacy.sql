ALTER TABLE "journeys" DROP COLUMN "type";--> statement-breakpoint
ALTER TABLE "journeys" DROP COLUMN "extended_at";--> statement-breakpoint
ALTER TABLE "journeys" DROP COLUMN "is_extended";--> statement-breakpoint
DROP TYPE "public"."journey_type";