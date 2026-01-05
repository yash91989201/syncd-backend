import { z } from "zod";

export const DeleteAccountInput = z.object({}).optional();

export const DeleteAccountOutput = z.object({
  success: z.boolean(),
  message: z.string(),
});
