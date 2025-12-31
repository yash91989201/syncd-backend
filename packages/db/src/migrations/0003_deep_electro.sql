CREATE TYPE "public"."physical_activity_level" AS ENUM('daily_running', 'gym_fitness', 'walking', 'yoga', 'none');--> statement-breakpoint
ALTER TABLE "athlete_profile" ALTER COLUMN "training_frequency" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."training_frequency";--> statement-breakpoint
CREATE TYPE "public"."training_frequency" AS ENUM('1_2_per_week', '3_4_per_week', '5_6_per_week', 'daily', 'twice_daily');--> statement-breakpoint
ALTER TABLE "athlete_profile" ALTER COLUMN "training_frequency" SET DATA TYPE "public"."training_frequency" USING "training_frequency"::"public"."training_frequency";--> statement-breakpoint
DROP TYPE "public"."medication_type";--> statement-breakpoint
CREATE TYPE "public"."medication_type" AS ENUM('none', 'pill', 'iud', 'implant', 'other');--> statement-breakpoint
ALTER TABLE "user_profile" ALTER COLUMN "cycle_stage" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."cycle_stage";--> statement-breakpoint
CREATE TYPE "public"."cycle_stage" AS ENUM('regular', 'irregular', 'pregnant', 'trying_to_conceive', 'perimenopause', 'postpartum');--> statement-breakpoint
ALTER TABLE "user_profile" ALTER COLUMN "cycle_stage" SET DATA TYPE "public"."cycle_stage" USING "cycle_stage"::"public"."cycle_stage";--> statement-breakpoint
ALTER TABLE "health_condition" ADD COLUMN "medication" "medication_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "user_profile" ADD COLUMN "physical_activity" "physical_activity_level";