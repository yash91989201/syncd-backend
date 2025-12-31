import { cycleProfile } from "@syncd-backend/db/schema/index";
import { eq } from "drizzle-orm";
import { protectedProcedure } from "../index";
import { GetPhaseInfoInput, GetPhaseInfoOutput } from "../lib/schema/cycle";
import { getBleedingDays, getCycleLengthDays, getPhase } from "../utils/cycle";

export const cycleRouter = {
  getPhaseInfo: protectedProcedure
    .input(GetPhaseInfoInput)
    .output(GetPhaseInfoOutput)
    .handler(async ({ context: { session, db } }) => {
      const userId = session.user.id;

      const profile = await db.query.cycleProfile.findFirst({
        where: eq(cycleProfile.userId, userId),
      });

      if (!profile) {
        return null;
      }

      const cycleLength = getCycleLengthDays(profile.cycleLength);
      const bleedingDays = getBleedingDays(profile.bleedingDays);

      const lastPeriodDate = new Date(profile.lastPeriod);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      lastPeriodDate.setHours(0, 0, 0, 0);

      const daysSinceLastPeriod = Math.floor(
        (today.getTime() - lastPeriodDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const dayOfCycle = (daysSinceLastPeriod % cycleLength) + 1;

      const daysUntilNextPeriod = cycleLength - dayOfCycle + 1;

      const phase = getPhase(dayOfCycle, cycleLength, bleedingDays);

      return {
        phase,
        dayOfCycle,
        cycleLength,
        daysUntilNextPeriod,
      };
    }),
};
