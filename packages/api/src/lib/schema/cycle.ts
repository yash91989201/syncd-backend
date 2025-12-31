import { z } from "zod";

export const GetPhaseInfoInput = z.void();

export const GetPhaseInfoOutput = z
  .object({
    phase: z.enum(["menstrual", "follicular", "ovulation", "luteal"]),
    dayOfCycle: z.number(),
    cycleLength: z.number(),
    daysUntilNextPeriod: z.number(),
  })
  .nullable();
