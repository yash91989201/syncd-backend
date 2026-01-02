import { userProfile } from "@syncd-backend/db/schema/user-profile";
import { eq } from "drizzle-orm";
import { protectedProcedure } from "../index";

export const athleteProfileRouter = {
  get: protectedProcedure.handler(async ({ context: { session, db } }) => {
    const athleteProfileData = await db.query.athleteProfile.findFirst({
      where: eq(userProfile.userId, session.user.id),
    });

    return athleteProfileData;
  }),
};
