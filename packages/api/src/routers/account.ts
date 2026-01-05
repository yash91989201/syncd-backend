import { auth } from "@syncd-backend/auth";
import { protectedProcedure } from "..";
import { DeleteAccountInput, DeleteAccountOutput } from "../lib/schema/account";

export const accountRouter = {
  delete: protectedProcedure
    .input(DeleteAccountInput)
    .output(DeleteAccountOutput)
    .handler(async () => {
      const res = await auth.api.deleteUser();

      return res;
    }),
};
