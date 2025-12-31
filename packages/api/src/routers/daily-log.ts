import { ORPCError } from "@orpc/server";
import { DailyLogSchema } from "@syncd-backend/db/lib/schema/index";
import { dailyLog } from "@syncd-backend/db/schema/index";
import { and, asc, between, desc, eq } from "drizzle-orm";
import { protectedProcedure } from "../index";
import {
  DailyLogCreateInput,
  DailyLogGetInput,
  DailyLogGetOutput,
  DailyLogListInput,
  DailyLogListOutput,
  DailyLogUpdateInput,
} from "../lib/schema/daily-log";

export const dailyLogRouter = {
  create: protectedProcedure
    .input(DailyLogCreateInput)
    .output(DailyLogSchema)
    .handler(async ({ context: { session, db }, input }) => {
      const userId = session.user.id;

      const [created] = await db
        .insert(dailyLog)
        .values({
          ...input,
          userId,
        })
        .returning();

      if (!created) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "Failed to create daily log",
        });
      }

      return created;
    }),

  update: protectedProcedure
    .input(DailyLogUpdateInput)
    .output(DailyLogSchema)
    .handler(async ({ context: { session, db }, input }) => {
      const userId = session.user.id;

      const existing = await db.query.dailyLog.findFirst({
        where: and(eq(dailyLog.id, input.id), eq(dailyLog.userId, userId)),
      });

      if (!existing) {
        throw new ORPCError("NOT_FOUND", {
          message:
            "Daily log not found or you don't have permission to update it",
        });
      }

      const [updated] = await db
        .update(dailyLog)
        .set({
          ...input.data,
          updatedAt: new Date(),
        })
        .where(and(eq(dailyLog.id, input.id), eq(dailyLog.userId, userId)))
        .returning();

      if (!updated) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "Failed to update daily log",
        });
      }

      return updated;
    }),

  get: protectedProcedure
    .input(DailyLogGetInput)
    .output(DailyLogGetOutput)
    .handler(async ({ context: { session, db } }) => {
      const userId = session.user.id;

      const today = new Date();
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
      );

      const result = await db.query.dailyLog.findFirst({
        where: and(
          eq(dailyLog.userId, userId),
          between(dailyLog.createdAt, startOfDay, endOfDay)
        ),
      });

      return result ?? null;
    }),

  list: protectedProcedure
    .input(DailyLogListInput)
    .output(DailyLogListOutput)
    .handler(async ({ context: { session, db }, input }) => {
      const userId = session.user.id;
      const conditions = [eq(dailyLog.userId, userId)];

      if (input.filter?.date) {
        const filterDate = input.filter.date;
        const startOfDay = new Date(
          filterDate.getFullYear(),
          filterDate.getMonth(),
          filterDate.getDate()
        );
        const endOfDay = new Date(
          filterDate.getFullYear(),
          filterDate.getMonth(),
          filterDate.getDate() + 1
        );
        conditions.push(between(dailyLog.createdAt, startOfDay, endOfDay));
      }

      if (input.filter?.flow) {
        conditions.push(eq(dailyLog.flow, input.filter.flow));
      }

      const sortColumn = input.sort?.column ?? "createdAt";
      const sortOrder = input.sort?.order ?? "desc";
      const orderFn = sortOrder === "asc" ? asc : desc;

      const results = await db
        .select()
        .from(dailyLog)
        .where(and(...conditions))
        .orderBy(orderFn(dailyLog[sortColumn]));

      return results;
    }),
};
