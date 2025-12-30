import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const trainingFrequencyEnum = pgEnum("training_frequency", [
  "1_2_per_week",
  "3_4_per_week",
  "5_plus_per_week",
]);

export const athleteProfile = pgTable("athlete_profile", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  trainingFrequency: trainingFrequencyEnum("training_frequency"),
  sport: text("sport").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const athleteProfileRelations = relations(athleteProfile, ({ one }) => ({
  user: one(user, {
    fields: [athleteProfile.userId],
    references: [user.id],
  }),
}));
