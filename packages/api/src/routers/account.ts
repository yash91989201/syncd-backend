import { auth } from "@syncd-backend/auth";
import { protectedProcedure } from "..";

export const accountRouter = {
  delete: protectedProcedure.handler(async () => {
    const res = await auth.api.deleteUser();

    return res;
  }),
};
