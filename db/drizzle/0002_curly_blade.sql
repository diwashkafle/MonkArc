CREATE TABLE "accounts" (
	"userId" uuid NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"providerAccountId" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "accounts_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sessionToken" varchar(255) PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verificationTokens" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationTokens_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
ALTER TABLE "daily_progress" DROP CONSTRAINT "uniqueJourneyDate";--> statement-breakpoint
ALTER TABLE "journeys" ALTER COLUMN "description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "journeys" ALTER COLUMN "is_public" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "journeys" ADD COLUMN "deliverable" text;--> statement-breakpoint
ALTER TABLE "journeys" ADD COLUMN "core_resource" varchar(1024);--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journeys" DROP COLUMN "core_resources";--> statement-breakpoint
ALTER TABLE "daily_progress" ADD CONSTRAINT "daily_progress_journey_id_date_unique" UNIQUE("journey_id","date");