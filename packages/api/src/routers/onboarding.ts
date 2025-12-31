import {
  athleteProfile,
  cycleProfile,
  healthCondition,
  userProfile,
} from "@syncd-backend/db/schema/index";
import { eq } from "drizzle-orm";
import { protectedProcedure } from "../index";
import {
  OnboardingCompleteInput,
  OnboardingCompleteOutput,
  OnboardingIsCompleteInput,
  OnboardingIsCompleteOutput,
} from "../lib/schema/onboarding";

export const onboardingRouter = {
  isComplete: protectedProcedure
    .input(OnboardingIsCompleteInput)
    .output(OnboardingIsCompleteOutput)
    .handler(async ({ context: { session, db } }) => {
      const userId = session.user.id;

      try {
        const userProfileData = await db.query.userProfile.findFirst({
          where: eq(userProfile.userId, userId),
        });

        if (!userProfileData) {
          return { complete: false };
        }

        const healthConditionResult = await db.query.healthCondition.findMany({
          where: eq(healthCondition.userId, userId),
        });

        if (healthConditionResult.length === 0) {
          return { complete: false };
        }

        const cycleProfileResult = await db.query.cycleProfile.findMany({
          where: eq(cycleProfile.userId, userId),
        });

        if (cycleProfileResult.length === 0) {
          return { complete: false };
        }

        if (userProfileData.isAthlete) {
          const athleteProfileResult = await db.query.athleteProfile.findMany({
            where: eq(athleteProfile.userId, userId),
          });

          if (athleteProfileResult.length === 0) {
            return { complete: false };
          }
        }

        return { complete: true };
      } catch {
        return { complete: false };
      }
    }),

  complete: protectedProcedure
    .input(OnboardingCompleteInput)
    .output(OnboardingCompleteOutput)
    .handler(async ({ context: { session, db }, input }) => {
      const userId = session.user.id;

      try {
        await db.transaction(async (tx) => {
          await tx.insert(userProfile).values({
            userId,
            ...input.userProfile,
          });

          await tx.insert(healthCondition).values({
            userId,
            ...input.healthCondition,
          });

          await tx.insert(cycleProfile).values({
            userId,
            ...input.cycleProfile,
          });

          if (input.userProfile.isAthlete && input.athleteProfile) {
            await tx.insert(athleteProfile).values({
              userId,
              ...input.athleteProfile,
            });
          }
        });

        return { success: true };
      } catch (error) {
        console.error("Error completing onboarding:", error);
        return { success: false };
      }
    }),
};
