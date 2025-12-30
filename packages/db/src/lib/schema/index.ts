import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import {
  athleteProfile,
  cycleProfile,
  dailyLog,
  healthCondition,
  user,
  userProfile,
} from "../../schema";

// User schemas
export const UserSchema = createSelectSchema(user);
export const UserInsertSchema = createInsertSchema(user);
export const UserUpdateSchema = createUpdateSchema(user);

// User Profile schemas
export const UserProfileSchema = createSelectSchema(userProfile);
export const UserProfileInsertSchema = createInsertSchema(userProfile);
export const UserProfileUpdateSchema = createUpdateSchema(userProfile);

// Health Condition schemas
export const HealthConditionSchema = createSelectSchema(healthCondition);
export const HealthConditionInsertSchema = createInsertSchema(healthCondition);
export const HealthConditionUpdateSchema = createUpdateSchema(healthCondition);

// Cycle Profile schemas
export const CycleProfileSchema = createSelectSchema(cycleProfile);
export const CycleProfileInsertSchema = createInsertSchema(cycleProfile);
export const CycleProfileUpdateSchema = createUpdateSchema(cycleProfile);

// Athlete Profile schemas
export const AthleteProfileSchema = createSelectSchema(athleteProfile);
export const AthleteProfileInsertSchema = createInsertSchema(athleteProfile);
export const AthleteProfileUpdateSchema = createUpdateSchema(athleteProfile);

// Daily Log schemas
export const DailyLogSchema = createSelectSchema(dailyLog);
export const DailyLogInsertSchema = createInsertSchema(dailyLog);
export const DailyLogUpdateSchema = createUpdateSchema(dailyLog);
