import {
  AthleteProfileInsertSchema,
  AthleteProfileSchema,
  CycleProfileInsertSchema,
  CycleProfileSchema,
  HealthConditionInsertSchema,
  HealthConditionSchema,
  UserProfileInsertSchema,
  UserProfileSchema,
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
    }).optional(),
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

export const OnboardingUpdateInput = z
  .object({
    userProfile: UserProfileInsertSchema.omit({
      userId: true,
      createdAt: true,
      updatedAt: true,
    })
      .partial()
      .optional(),
    healthCondition: HealthConditionInsertSchema.omit({
      id: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
    })
      .partial()
      .optional(),
    cycleProfile: CycleProfileInsertSchema.omit({
      userId: true,
      createdAt: true,
      updatedAt: true,
    })
      .partial()
      .optional(),
    athleteProfile: AthleteProfileInsertSchema.omit({
      userId: true,
      createdAt: true,
      updatedAt: true,
    })
      .partial()
      .optional(),
  })
  .refine(
    (data) => {
      if (data.userProfile?.isAthlete === true && !data.athleteProfile) {
        return false;
      }
      return true;
    },
    {
      message: "Athlete profile is required when setting isAthlete to true",
      path: ["athleteProfile"],
    }
  );

export const OnboardingUpdateOutput = z.object({
  success: z.boolean(),
});

export const OnboardingGetInput = z.void();

export const OnboardingGetOutput = z.object({
  userProfile: UserProfileSchema.nullable(),
  healthCondition: HealthConditionSchema.nullable(),
  cycleProfile: CycleProfileSchema.nullable(),
  athleteProfile: AthleteProfileSchema.nullable(),
});
