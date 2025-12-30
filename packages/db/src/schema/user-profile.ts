import { relations } from "drizzle-orm";
import { boolean, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const ageGroupEnum = pgEnum("age_group", ["under_18", "18_24", "25_34"]);

export const cycleStageEnum = pgEnum("cycle_stage", [
  "regular",
  "pregnant",
  "postpartum",
  "irregular",
  "not_sure",
]);

export const userProfile = pgTable("user_profile", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  ageGroup: ageGroupEnum("age_group").notNull(),
  cycleStage: cycleStageEnum("cycle_stage").notNull(),
  isAthlete: boolean().default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userProfileRelations = relations(userProfile, ({ one }) => ({
  user: one(user, {
    fields: [userProfile.userId],
    references: [user.id],
  }),
}));
