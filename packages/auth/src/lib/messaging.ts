import { env } from "@syncd-backend/env/server";
import twilio from "twilio";

export const twilioClient = twilio(
  env.TWILIO_ACCOUNT_SID,
  env.TWILIO_AUTH_TOKEN
);

export const sendVerificationOTP = async (
  phoneNumber: string,
  code: string
) => {
  await twilioClient.verify.v2
    .services(env.TWILIO_VERIFY_SERVICE_SID)
    .verifications.create({
      to: `+91${phoneNumber}`,
      channel: "sms",
      customCode: code,
    });
};

export const checkVerificationOTP = async (
  phoneNumber: string,
  code: string
) => {
  const verificationCheck = await twilioClient.verify.v2
    .services(env.TWILIO_VERIFY_SERVICE_SID)
    .verificationChecks.create({
      to: `+91${phoneNumber}`,
      code,
    });

  return verificationCheck.status === "approved";
};
