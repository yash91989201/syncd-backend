import {
  athleteProfile,
  cycleProfile,
  dailyLog,
  healthCondition,
  userProfile,
} from "@syncd-backend/db/schema/index";
import { eq } from "drizzle-orm";
import { protectedProcedure } from "../index";
import {
  OnboardingCompleteInput,
  OnboardingCompleteOutput,
  OnboardingGetInput,
  OnboardingGetOutput,
  OnboardingIsCompleteInput,
  OnboardingIsCompleteOutput,
  OnboardingUpdateInput,
  OnboardingUpdateOutput,
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

          const flowValue =
            input.cycleProfile.flowIntensity === "variable"
              ? null
              : input.cycleProfile.flowIntensity;

          await tx.insert(dailyLog).values({
            userId,
            painLevel: input.cycleProfile.painLevel ?? "none",
            flow: flowValue,
            energyLevel: null,
            mood: null,
            stressLevel: null,
            note: null,
          });
        });

        return { success: true };
      } catch (error) {
        console.error("Error completing onboarding:", error);
        return { success: false };
      }
    }),

  update: protectedProcedure
    .input(OnboardingUpdateInput)
    .output(OnboardingUpdateOutput)
    .handler(async ({ context: { session, db }, input }) => {
      const userId = session.user.id;

      try {
        await db.transaction(async (tx) => {
          if (input.userProfile) {
            // Get current user profile to check if isAthlete is being changed
            const currentUserProfile = await tx.query.userProfile.findFirst({
              where: eq(userProfile.userId, userId),
            });

            await tx
              .update(userProfile)
              .set({
                ...input.userProfile,
                updatedAt: new Date(),
              })
              .where(eq(userProfile.userId, userId));

            // If isAthlete is being changed from true to false, delete athleteProfile
            if (
              currentUserProfile?.isAthlete === true &&
              input.userProfile.isAthlete === false
            ) {
              await tx
                .delete(athleteProfile)
                .where(eq(athleteProfile.userId, userId));
            }
          }

          if (input.healthCondition) {
            await tx
              .update(healthCondition)
              .set({
                ...input.healthCondition,
                updatedAt: new Date(),
              })
              .where(eq(healthCondition.userId, userId));
          }

          if (input.cycleProfile) {
            await tx
              .update(cycleProfile)
              .set({
                ...input.cycleProfile,
                updatedAt: new Date(),
              })
              .where(eq(cycleProfile.userId, userId));
          }

          if (input.athleteProfile) {
            const existingAthleteProfile =
              await tx.query.athleteProfile.findFirst({
                where: eq(athleteProfile.userId, userId),
              });

            if (existingAthleteProfile) {
              await tx
                .update(athleteProfile)
                .set({
                  ...input.athleteProfile,
                  updatedAt: new Date(),
                })
                .where(eq(athleteProfile.userId, userId));
            } else if (
              input.athleteProfile.sport !== undefined &&
              input.athleteProfile.sport !== null
            ) {
              await tx.insert(athleteProfile).values({
                userId,
                sport: input.athleteProfile.sport,
                trainingFrequency: input.athleteProfile.trainingFrequency,
              });
            }
          }
        });

        return { success: true };
      } catch (error) {
        console.error("Error updating onboarding:", error);
        return { success: false };
      }
    }),

  get: protectedProcedure
    .input(OnboardingGetInput)
    .output(OnboardingGetOutput)
    .handler(async ({ context: { session, db } }) => {
      const userId = session.user.id;

      const userProfileData = await db.query.userProfile.findFirst({
        where: eq(userProfile.userId, userId),
      });

      const healthConditionData = await db.query.healthCondition.findFirst({
        where: eq(healthCondition.userId, userId),
      });

      const cycleProfileData = await db.query.cycleProfile.findFirst({
        where: eq(cycleProfile.userId, userId),
      });

      const athleteProfileData = await db.query.athleteProfile.findFirst({
        where: eq(athleteProfile.userId, userId),
      });

      return {
        userProfile: userProfileData ?? null,
        healthCondition: healthConditionData ?? null,
        cycleProfile: cycleProfileData ?? null,
        athleteProfile: athleteProfileData ?? null,
      };
    }),
};
