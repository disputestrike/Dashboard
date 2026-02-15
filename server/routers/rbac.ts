import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { rbacService } from "../rbac";
import { TRPCError } from "@trpc/server";

export const rbacRouter = router({
  /**
   * Get all users (admin only)
   */
  getAllUsers: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can view all users" });
    }

    // TODO: Implement getting all users from database
    return [];
  }),

  /**
   * Get institutions accessible to current user
   */
  getMyInstitutions: protectedProcedure.query(async ({ ctx }) => {
    try {
      const institutions = await rbacService.getUserInstitutions(ctx.user!.id);
      return {
        success: true,
        data: institutions,
      };
    } catch (error) {
      console.error("Error getting user institutions:", error);
      return {
        success: false,
        error: "Failed to get institutions",
        data: [],
      };
    }
  }),

  /**
   * Check if user can access institution
   */
  canAccessInstitution: protectedProcedure
    .input(z.object({ institutionId: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const canAccess = await rbacService.canAccessInstitution(
          ctx.user!.id,
          input.institutionId
        );
        return {
          success: true,
          canAccess,
        };
      } catch (error) {
        console.error("Error checking institution access:", error);
        return {
          success: false,
          canAccess: false,
        };
      }
    }),

  /**
   * Get all available permissions (admin only)
   */
  getAllPermissions: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can view permissions" });
    }

    try {
      const perms = await rbacService.getAllPermissions();
      return {
        success: true,
        data: perms,
      };
    } catch (error) {
      console.error("Error getting permissions:", error);
      return {
        success: false,
        error: "Failed to get permissions",
        data: [],
      };
    }
  }),

  /**
   * Get all available roles (admin only)
   */
  getAllRoles: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can view roles" });
    }

    try {
      const rolesList = await rbacService.getAllRoles();
      return {
        success: true,
        data: rolesList,
      };
    } catch (error) {
      console.error("Error getting roles:", error);
      return {
        success: false,
        error: "Failed to get roles",
        data: [],
      };
    }
  }),

  /**
   * Get permissions for a role (admin only)
   */
  getRolePermissions: protectedProcedure
    .input(z.object({ roleId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can view role permissions" });
      }

      try {
        const perms = await rbacService.getRolePermissions(input.roleId);
        return {
          success: true,
          data: perms,
        };
      } catch (error) {
        console.error("Error getting role permissions:", error);
        return {
          success: false,
          error: "Failed to get role permissions",
          data: [],
        };
      }
    }),

  /**
   * Assign user to institution with role (admin only)
   */
  assignUserToInstitution: protectedProcedure
    .input(
      z.object({
        userId: z.number(),
        institutionId: z.number(),
        roleId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can assign users to institutions",
        });
      }

      try {
        const success = await rbacService.assignUserToInstitution(
          input.userId,
          input.institutionId,
          input.roleId
        );

        return {
          success,
          message: success ? "User assigned successfully" : "Failed to assign user",
        };
      } catch (error) {
        console.error("Error assigning user:", error);
        return {
          success: false,
          message: "Error assigning user to institution",
        };
      }
    }),

  /**
   * Remove user from institution (admin only)
   */
  removeUserFromInstitution: protectedProcedure
    .input(
      z.object({
        userId: z.number(),
        institutionId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can remove users from institutions",
        });
      }

      try {
        const success = await rbacService.removeUserFromInstitution(
          input.userId,
          input.institutionId
        );

        return {
          success,
          message: success ? "User removed successfully" : "Failed to remove user",
        };
      } catch (error) {
        console.error("Error removing user:", error);
        return {
          success: false,
          message: "Error removing user from institution",
        };
      }
    }),
});
