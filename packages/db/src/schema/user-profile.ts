import { relations } from "drizzle-orm";
import { boolean, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const ageGroupEnum = pgEnum("age_group", ["under_18", "18_24", "25_34"]);

export const cycleStageEnum = pgEnum("cycle_stage", [
  "regular",
  "irregular",
  "pregnant",
  "trying_to_conceive",
  "perimenopause",
  "postpartum",
]);

export const physicalActivityEnum = pgEnum("physical_activity_level", [
  "daily_running",
  "gym_fitness",
  "walking",
  "yoga",
  "none",
]);

export const userProfile = pgTable("user_profile", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  ageGroup: ageGroupEnum("age_group").notNull(),
  cycleStage: cycleStageEnum("cycle_stage").notNull(),
  isAthlete: boolean().default(false).notNull(),
  physicalActivity: physicalActivityEnum("physical_activity"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userProfileRelations = relations(userProfile, ({ one }) => ({
  user: one(user, {
    fields: [userProfile.userId],
    references: [user.id],
  }),
}));
