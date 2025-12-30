CREATE TYPE "public"."training_frequency" AS ENUM('1_2_per_week', '3_4_per_week', '5_plus_per_week');--> statement-breakpoint
CREATE TYPE "public"."bleeding_days" AS ENUM('1_2', '3_4', '5_6', '7_plus');--> statement-breakpoint
CREATE TYPE "public"."cycle_length" AS ENUM('21_24', '25_28', '29_32', '33_plus', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."flow_intensity" AS ENUM('light', 'medium', 'heavy', 'very_heavy');--> statement-breakpoint
CREATE TYPE "public"."pain_level" AS ENUM('none', 'mild', 'moderate', 'severe');--> statement-breakpoint
CREATE TYPE "public"."daily_flow_intensity" AS ENUM('light', 'medium', 'heavy', 'very_heavy');--> statement-breakpoint
CREATE TYPE "public"."daily_pain_level" AS ENUM('none', 'mild', 'moderate', 'severe');--> statement-breakpoint
CREATE TYPE "public"."daily_energy_level" AS ENUM('low', 'okay', 'good', 'high');--> statement-breakpoint
CREATE TYPE "public"."daily_mood_level" AS ENUM('low', 'neutral', 'good', 'great');--> statement-breakpoint
CREATE TYPE "public"."daily_stress_level" AS ENUM('low', 'moderate', 'high', 'very_high');--> statement-breakpoint
CREATE TYPE "public"."health_condition_type" AS ENUM('pcos', 'thyroid', 'endometriosis', 'fibroids', 'anemia', 'diabetes');--> statement-breakpoint
CREATE TYPE "public"."medication_type" AS ENUM('none', 'hormonal', 'other');--> statement-breakpoint
CREATE TYPE "public"."age_group" AS ENUM('under_18', '18_24', '25_34');--> statement-breakpoint
CREATE TYPE "public"."cycle_stage" AS ENUM('regular', 'pregnant', 'postpartum', 'irregular', 'not_sure');--> statement-breakpoint
CREATE TABLE "athlete_profile" (
	"user_id" text PRIMARY KEY NOT NULL,
	"training_frequency" "training_frequency",
	"sport" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"role" text,
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"ban_expires" timestamp,
	"phone_number" text,
	"phone_number_verified" boolean,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_phone_number_unique" UNIQUE("phone_number")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cycle_profile" (
	"user_id" text PRIMARY KEY NOT NULL,
	"cycle_length" "cycle_length",
	"bleeding_days" "bleeding_days",
	"flow_intensity" "flow_intensity",
	"pain_level" "pain_level",
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_log" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"pain_level" "daily_pain_level",
	"energy_level" "daily_energy_level",
	"mood" "daily_mood_level",
	"flow" "daily_flow_intensity",
	"stress_level" "daily_stress_level",
	"note" text,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "daily_log_user_id_created_at_unique" UNIQUE("user_id","created_at")
);
--> statement-breakpoint
CREATE TABLE "health_condition" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"user_id" text,
	"condition" "health_condition_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_profile" (
	"user_id" text PRIMARY KEY NOT NULL,
	"age_group" "age_group" NOT NULL,
	"cycle_stage" "cycle_stage" NOT NULL,
	"isAthlete" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "athlete_profile" ADD CONSTRAINT "athlete_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cycle_profile" ADD CONSTRAINT "cycle_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daily_log" ADD CONSTRAINT "daily_log_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "health_condition" ADD CONSTRAINT "health_condition_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");