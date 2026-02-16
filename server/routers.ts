import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { exportRouter } from "./routers/export";
import { smartsheetRouter } from "./routers/smartsheet";
import { rbacRouter } from "./routers/rbac";
import { roleManagementRouter } from "./routers/roleManagement";
import { z } from "zod";
import { authenticateUser } from "./auth-service";

export const appRouter = router({
  system: systemRouter,
  export: exportRouter,
  smartsheet: smartsheetRouter,
  rbac: rbacRouter,
  roleManagement: roleManagementRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    loginLocal: publicProcedure
      .input(z.object({ username: z.string(), password: z.string() }))
      .mutation(async ({ ctx, input }) => {
        try {
          const result = await authenticateUser(input.username, input.password);

          if (result.success && result.user) {
            return {
              success: true,
              user: result.user,
              message: "Login successful",
            };
          }

          return {
            success: false,
            error: result.error || "Authentication failed",
          };
        } catch (error) {
          console.error("Login error:", error);
          return {
            success: false,
            error: "Login failed",
          };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
