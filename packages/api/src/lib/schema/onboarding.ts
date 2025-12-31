import {
  AthleteProfileInsertSchema,
  CycleProfileInsertSchema,
  HealthConditionInsertSchema,
  UserProfileInsertSchema,
} from "@syncd-backend/db/lib/schema/index";
import { z } from "zod";

export const OnboardingIsCompleteInput = z.void();

export const OnboardingIsCompleteOutput = z.object({
  complete: z.boolean(),
});

export const OnboardingCompleteInput = z
  .object({
    userProfile: UserProfileInsertSchema.omit({
      userId: true,
      createdAt: true,
      updatedAt: true,
    }),
    healthCondition: HealthConditionInsertSchema.omit({
      id: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
    }),
    cycleProfile: CycleProfileInsertSchema.omit({
      userId: true,
      createdAt: true,
      updatedAt: true,
    }),
    athleteProfile: AthleteProfileInsertSchema.omit({
      userId: true,
      createdAt: true,
      updatedAt: true,
    }).nullable(),
  })
  .refine(
    (data) => {
      if (data.userProfile.isAthlete && !data.athleteProfile) {
        return false;
      }

      return true;
    },
    {
      message: "Athlete profile is required for athletes",
      path: ["athleteProfile"],
    }
  );

export const OnboardingCompleteOutput = z.object({
  success: z.boolean(),
});
