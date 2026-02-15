import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { roles, rolePermissions, permissions } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const roleManagementRouter = router({
  /**
   * Create a new role (admin only)
   */
  createRole: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        permissionIds: z.array(z.number()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can create roles",
        });
      }

      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database connection failed",
        });
      }

      try {
        // Create role
        const result = await db.insert(roles).values({
          name: input.name,
          description: input.description,
        });

        // Get the inserted role ID
        const newRole = await db
          .select()
          .from(roles)
          .where(eq(roles.name, input.name))
          .limit(1);

        if (!newRole.length) {
          throw new Error("Failed to create role");
        }

        const roleId = newRole[0].id;

        // Assign permissions if provided
        if (input.permissionIds && input.permissionIds.length > 0) {
          await db.insert(rolePermissions).values(
            input.permissionIds.map((permId) => ({
              roleId,
              permissionId: permId,
            }))
          );
        }

        return {
          success: true,
          roleId,
          message: "Role created successfully",
        };
      } catch (error) {
        console.error("Error creating role:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create role",
        });
      }
    }),

  /**
   * Update a role (admin only)
   */
  updateRole: protectedProcedure
    .input(
      z.object({
        roleId: z.number(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        permissionIds: z.array(z.number()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can update roles",
        });
      }

      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database connection failed",
        });
      }

      try {
        // Update role
        if (input.name || input.description !== undefined) {
          await db
            .update(roles)
            .set({
              name: input.name,
              description: input.description,
            })
            .where(eq(roles.id, input.roleId));
        }

        // Update permissions if provided
        if (input.permissionIds !== undefined) {
          // Delete existing permissions
          await db
            .delete(rolePermissions)
            .where(eq(rolePermissions.roleId, input.roleId));

          // Add new permissions
          if (input.permissionIds.length > 0) {
            await db.insert(rolePermissions).values(
              input.permissionIds.map((permId) => ({
                roleId: input.roleId,
                permissionId: permId,
              }))
            );
          }
        }

        return {
          success: true,
          message: "Role updated successfully",
        };
      } catch (error) {
        console.error("Error updating role:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update role",
        });
      }
    }),

  /**
   * Delete a role (admin only)
   */
  deleteRole: protectedProcedure
    .input(z.object({ roleId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only admins can delete roles",
        });
      }

      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database connection failed",
        });
      }

      try {
        // Delete role permissions first
        await db
          .delete(rolePermissions)
          .where(eq(rolePermissions.roleId, input.roleId));

        // Delete role
        await db.delete(roles).where(eq(roles.id, input.roleId));

        return {
          success: true,
          message: "Role deleted successfully",
        };
      } catch (error) {
        console.error("Error deleting role:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete role",
        });
      }
    }),

  /**
   * Get all roles with their permissions (admin only)
   */
  getAllRolesWithPermissions: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only admins can view roles",
      });
    }

    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database connection failed",
      });
    }

    try {
      const allRoles = await db.select().from(roles);

      const rolesWithPerms = await Promise.all(
        allRoles.map(async (role) => {
          const perms = await db
            .select({ permission: permissions })
            .from(rolePermissions)
            .innerJoin(
              permissions,
              eq(rolePermissions.permissionId, permissions.id)
            )
            .where(eq(rolePermissions.roleId, role.id));

          return {
            ...role,
            permissions: perms.map((p) => p.permission),
          };
        })
      );

      return {
        success: true,
        data: rolesWithPerms,
      };
    } catch (error) {
      console.error("Error getting roles:", error);
      return {
        success: false,
        data: [],
      };
    }
  }),

  /**
   * Seed default roles (admin only, idempotent)
   */
  seedDefaultRoles: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only admins can seed roles",
      });
    }

    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database connection failed",
      });
    }

    try {
      // Check if roles already exist
      const existingRoles = await db.select().from(roles);
      if (existingRoles.length > 0) {
        return {
          success: true,
          message: "Roles already seeded",
          skipped: true,
        };
      }

      // Get all permissions
      const allPerms = await db.select().from(permissions);
      const permMap = new Map(allPerms.map((p) => [p.permissionId, p.id]));

      // Define default roles
      const defaultRoles = [
        {
          name: "Executive",
          description: "Executive leadership with full system access",
          permissions: [
            "view_dashboard",
            "view_data",
            "export_reports",
            "manage_users",
            "manage_roles",
          ],
        },
        {
          name: "Institution Lead",
          description: "Lead for a specific institution",
          permissions: [
            "view_dashboard",
            "view_data",
            "export_reports",
            "submit_data",
          ],
        },
        {
          name: "Data Analyst",
          description: "Analyst with data viewing and export capabilities",
          permissions: ["view_dashboard", "view_data", "export_reports"],
        },
        {
          name: "Viewer",
          description: "Read-only access to dashboard and reports",
          permissions: ["view_dashboard"],
        },
      ];

      // Create roles
      for (const roleData of defaultRoles) {
        const result = await db.insert(roles).values({
          name: roleData.name,
          description: roleData.description,
        });

        const newRole = await db
          .select()
          .from(roles)
          .where(eq(roles.name, roleData.name))
          .limit(1);

        if (newRole.length > 0) {
          const roleId = newRole[0].id;

          // Assign permissions
          const permIds = roleData.permissions
            .map((p) => permMap.get(p))
            .filter((id) => id !== undefined) as number[];

          if (permIds.length > 0) {
            await db.insert(rolePermissions).values(
              permIds.map((permId) => ({
                roleId,
                permissionId: permId,
              }))
            );
          }
        }
      }

      return {
        success: true,
        message: "Default roles seeded successfully",
      };
    } catch (error) {
      console.error("Error seeding roles:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to seed roles",
      });
    }
  }),
});
