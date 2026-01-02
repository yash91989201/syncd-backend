import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),
    CORS_ORIGIN: z
      .string()
      .transform((val) => val.split(",").map((s) => s.trim()))
      .pipe(z.array(z.string())),
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    TWILIO_ACCOUNT_SID: z.string(),
    TWILIO_AUTH_TOKEN: z.string(),
    TWILIO_VERIFY_SERVICE_SID: z.string(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
