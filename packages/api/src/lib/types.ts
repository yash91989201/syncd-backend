import type { z } from "zod";
import type {
  OnboardingCompleteInput,
  OnboardingCompleteOutput,
  OnboardingIsCompleteInput,
  OnboardingIsCompleteOutput,
} from "./schema/onboarding";

// Type inference for main input/output schemas
export type OnboardingIsCompleteInputType = z.infer<
  typeof OnboardingIsCompleteInput
>;
export type OnboardingIsCompleteOutputType = z.infer<
  typeof OnboardingIsCompleteOutput
>;

export type OnboardingCompleteInputType = z.infer<
  typeof OnboardingCompleteInput
>;
export type OnboardingCompleteOutputType = z.infer<
  typeof OnboardingCompleteOutput
>;
