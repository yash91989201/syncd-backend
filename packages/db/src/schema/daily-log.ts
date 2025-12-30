import { cuid2 } from "drizzle-cuid2/postgres";
import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const dailyPainLevelEnum = pgEnum("daily_pain_level", [
  "none",
  "mild",
  "moderate",
  "severe",
]);

export const energyLevelEnum = pgEnum("daily_energy_level", [
  "low",
  "okay",
  "good",
  "high",
]);

export const moodLevelEnum = pgEnum("daily_mood_level", [
  "low",
  "neutral",
  "good",
  "great",
]);

export const dailyFlowIntensityEnum = pgEnum("daily_flow_intensity", [
  "light",
  "medium",
  "heavy",
  "very_heavy",
]);

export const stressLevelEnum = pgEnum("daily_stress_level", [
  "low",
  "moderate",
  "high",
  "very_high",
]);

export const dailyLog = pgTable(
  "daily_log",
  {
    id: cuid2("id").defaultRandom().primaryKey(),
    painLevel: dailyPainLevelEnum("pain_level"),
    energyLevel: energyLevelEnum("energy_level"),
    mood: moodLevelEnum("mood"),
    flow: dailyFlowIntensityEnum("flow"),
    stressLevel: stressLevelEnum("stress_level"),
    note: text("note"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [unique().on(table.userId, table.createdAt)]
);

export const dailyLogRelations = relations(dailyLog, ({ one }) => ({
  user: one(user, {
    fields: [dailyLog.userId],
    references: [user.id],
  }),
}));
