import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const cycleLengthEnum = pgEnum("cycle_length", [
  "21_24",
  "25_28",
  "29_32",
  "33_plus",
  "unknown",
]);

export const bleedingDaysEnum = pgEnum("bleeding_days", [
  "1_2",
  "3_4",
  "5_6",
  "7_plus",
]);

export const flowIntensityEnum = pgEnum("flow_intensity", [
  "light",
  "medium",
  "heavy",
  "very_heavy",
  "variable",
]);

export const painLevelEnum = pgEnum("pain_level", [
  "none",
  "mild",
  "moderate",
  "severe",
]);

export const cycleProfile = pgTable("cycle_profile", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  cycleLength: cycleLengthEnum("cycle_length"),
  bleedingDays: bleedingDaysEnum("bleeding_days"),
  flowIntensity: flowIntensityEnum("flow_intensity"),
  painLevel: painLevelEnum("pain_level"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const cycleProfileRelations = relations(cycleProfile, ({ one }) => ({
  user: one(user, {
    fields: [cycleProfile.userId],
    references: [user.id],
  }),
}));
