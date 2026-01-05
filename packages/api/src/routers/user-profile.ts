import { auth } from "@syncd-backend/auth";
import { userProfile } from "@syncd-backend/db/schema/user-profile";
import { eq } from "drizzle-orm";
import { protectedProcedure } from "../index";
import { DeleteAccountOutput } from "../lib/schema/account";

export const userProfileRouter = {
  get: protectedProcedure.handler(async ({ context: { session, db } }) => {
    const userProfileData = await db.query.userProfile.findFirst({
      where: eq(userProfile.userId, session.user.id),
    });

    return userProfileData;
  }),

  delete: protectedProcedure.output(DeleteAccountOutput).handler(async () => {
    const res = await auth.api.deleteUser();

    return res;
  }),
};
