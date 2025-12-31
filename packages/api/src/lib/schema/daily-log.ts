import {
  DailyLogInsertSchema,
  DailyLogSchema,
  DailyLogUpdateSchema,
} from "@syncd-backend/db/lib/schema/index";
import { z } from "zod";

export const DailyLogCreateInput = DailyLogInsertSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const DailyLogUpdateInput = z.object({
  id: z.string(),
  data: DailyLogUpdateSchema.omit({
    id: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
  }),
});

export const DailyLogGetInput = z.void();

export const DailyLogGetOutput = DailyLogSchema.nullable();

export const DailyLogListInput = z.object({
  filter: z
    .object({
      date: z.coerce.date().optional(),
      flow: z.enum(["light", "medium", "heavy", "very_heavy"]).optional(),
    })
    .optional(),
  sort: z
    .object({
      column: z.enum([
        "createdAt",
        "painLevel",
        "energyLevel",
        "mood",
        "flow",
        "stressLevel",
      ]),
      order: z.enum(["asc", "desc"]),
    })
    .optional(),
});

export const DailyLogListOutput = z.array(DailyLogSchema);
