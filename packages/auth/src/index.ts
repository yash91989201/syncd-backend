import { db } from "@syncd-backend/db";
import * as schema from "@syncd-backend/db/schema/auth";
import { env } from "@syncd-backend/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, phoneNumber } from "better-auth/plugins";
import { checkVerificationOTP, sendVerificationOTP } from "./lib/messaging";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  trustedOrigins: env.CORS_ORIGIN,
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin(),
    phoneNumber({
      sendOTP: async ({ phoneNumber, code }) => {
        await sendVerificationOTP(phoneNumber, code);
      },
      verifyOTP: async ({ phoneNumber, code }) => {
        const verified = await checkVerificationOTP(phoneNumber, code);
        return verified;
      },
      signUpOnVerification: {
        getTempEmail: (phoneNumber) => {
          return `${phoneNumber}@syncd.com`;
        },
        getTempName: (phoneNumber) => {
          return phoneNumber;
        },
      },
    }),
  ],
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
  },
});
