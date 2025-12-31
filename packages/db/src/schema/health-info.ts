import { cuid2 } from "drizzle-cuid2/postgres";
import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const healthConditionEnum = pgEnum("health_condition_type", [
  "none",
  "pcos",
  "thyroid",
  "endometriosis",
  "fibroids",
  "anemia",
  "diabetes",
]);

export const medicationTypeEnum = pgEnum("medication_type", [
  "none",
  "hormonal",
  "other",
]);

export const healthCondition = pgTable("health_condition", {
  id: cuid2("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  condition: healthConditionEnum("condition").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const healthBackgroundRelations = relations(
  healthCondition,
  ({ one }) => ({
    user: one(user, {
      fields: [healthCondition.userId],
      references: [user.id],
    }),
  })
);
