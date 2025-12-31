import type { RouterClient } from "@orpc/server";

import { protectedProcedure, publicProcedure } from "../index";
import { cycleRouter } from "./cycle";
import { dailyLogRouter } from "./daily-log";
import { onboardingRouter } from "./onboarding";

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return "OK";
  }),
  privateData: protectedProcedure.handler(({ context }) => {
    return {
      message: "This is private",
      user: context.session?.user,
    };
  }),
  onboarding: onboardingRouter,
  dailyLog: dailyLogRouter,
  cycle: cycleRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
