import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { smartsheetService } from "../smartsheet";

export const smartsheetRouter = router({
  /**
   * Fetch all institutions from Smartsheet
   */
  getInstitutions: protectedProcedure.query(async () => {
    try {
      const institutions = await smartsheetService.getInstitutions();
      return {
        success: true,
        data: institutions,
      };
    } catch (error) {
      console.error("Error fetching institutions:", error);
      return {
        success: false,
        error: "Failed to fetch institutions from Smartsheet",
        data: [],
      };
    }
  }),

  /**
   * Fetch all performance variables from Smartsheet
   */
  getVariables: protectedProcedure.query(async () => {
    try {
      const variables = await smartsheetService.getPerformanceVariables();
      return {
        success: true,
        data: variables,
      };
    } catch (error) {
      console.error("Error fetching variables:", error);
      return {
        success: false,
        error: "Failed to fetch variables from Smartsheet",
        data: [],
      };
    }
  }),

  /**
   * Fetch performance data with optional filtering
   */
  getPerformanceData: protectedProcedure
    .input(
      z.object({
        month: z.string().optional(),
        year: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const data = await smartsheetService.getPerformanceData(input.month, input.year);
        return {
          success: true,
          data,
        };
      } catch (error) {
        console.error("Error fetching performance data:", error);
        return {
          success: false,
          error: "Failed to fetch performance data from Smartsheet",
          data: [],
        };
      }
    }),

  /**
   * Submit performance data to Smartsheet
   */
  submitPerformanceData: protectedProcedure
    .input(
      z.object({
        institutionId: z.string(),
        variableId: z.string(),
        month: z.string(),
        year: z.number(),
        baselineValue: z.string(),
        actualValue: z.string(),
        status: z.enum(["Green", "Yellow", "Red"]),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await smartsheetService.submitPerformanceData(input);
        return {
          success: true,
          message: "Performance data submitted successfully",
          data: result,
        };
      } catch (error) {
        console.error("Error submitting performance data:", error);
        return {
          success: false,
          error: "Failed to submit performance data to Smartsheet",
        };
      }
    }),

  /**
   * Test Smartsheet API connection
   */
  testConnection: protectedProcedure.query(async ({ ctx }) => {
    try {
      const result = await smartsheetService.testConnection();
      return result;
    } catch (error) {
      console.error("Error testing Smartsheet connection:", error);
      return {
        success: false,
        error: "Failed to test Smartsheet connection",
      };
    }
  }),
});
