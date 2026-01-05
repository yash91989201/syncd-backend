import { z } from "zod";

export const DeleteAccountInput = z.void();

export const DeleteAccountOutput = z.object({
  success: z.boolean(),
  message: z.string(),
});
