ALTER TYPE "public"."daily_flow_intensity" ADD VALUE 'variable';--> statement-breakpoint
ALTER TABLE "cycle_profile" ADD COLUMN "last_period" date NOT NULL;