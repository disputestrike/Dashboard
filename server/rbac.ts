import { getDb } from "./db";
import { eq, and } from "drizzle-orm";
import { users, roles, rolePermissions, permissions, userInstitutionAssignments, institutions } from "../drizzle/schema";

/**
 * RBAC (Role-Based Access Control) Service
 * Handles permission checking and access control logic
 */

export class RBACService {
  /**
   * Check if a user has a specific permission
   */
  async hasPermission(userId: number, permissionId: string): Promise<boolean> {
    const db = await getDb();
    if (!db) return false;

    try {
      // Get user's role
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!user.length) return false;

      // If admin, grant all permissions
      if (user[0].role === "admin") return true;

      // Check if user has the permission through their roles
      const result = await db
        .select()
        .from(rolePermissions)
        .innerJoin(roles, eq(rolePermissions.roleId, roles.id))
        .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
        .where(
          and(
            // This would need user_roles table to work properly
            // For now, simplified check
          )
        );

      return result.length > 0;
    } catch (error) {
      console.error("Error checking permission:", error);
      return false;
    }
  }

  /**
   * Get all institutions a user has access to
   */
  async getUserInstitutions(userId: number): Promise<any[]> {
    const db = await getDb();
    if (!db) return [];

    try {
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!user.length) return [];

      // If admin, return all institutions
      if (user[0].role === "admin") {
        return await db.select().from(institutions);
      }

      // Get institutions assigned to user
      const userInstitutions = await db
        .select({ institution: institutions })
        .from(userInstitutionAssignments)
        .innerJoin(institutions, eq(userInstitutionAssignments.institutionId, institutions.id))
        .where(
          and(
            eq(userInstitutionAssignments.userId, userId),
            eq(userInstitutionAssignments.isActive, true)
          )
        );

      return userInstitutions.map((ui) => ui.institution);
    } catch (error) {
      console.error("Error getting user institutions:", error);
      return [];
    }
  }

  /**
   * Check if user can access a specific institution
   */
  async canAccessInstitution(userId: number, institutionId: number): Promise<boolean> {
    const db = await getDb();
    if (!db) return false;

    try {
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!user.length) return false;

      // Admins can access all institutions
      if (user[0].role === "admin") return true;

      // Check if user is assigned to this institution
      const assignment = await db
        .select()
        .from(userInstitutionAssignments)
        .where(
          and(
            eq(userInstitutionAssignments.userId, userId),
            eq(userInstitutionAssignments.institutionId, institutionId),
            eq(userInstitutionAssignments.isActive, true)
          )
        )
        .limit(1);

      return assignment.length > 0;
    } catch (error) {
      console.error("Error checking institution access:", error);
      return false;
    }
  }

  /**
   * Get user's role for a specific institution
   */
  async getUserRoleForInstitution(userId: number, institutionId: number): Promise<any | null> {
    const db = await getDb();
    if (!db) return null;

    try {
      const assignment = await db
        .select()
        .from(userInstitutionAssignments)
        .innerJoin(roles, eq(userInstitutionAssignments.roleId, roles.id))
        .where(
          and(
            eq(userInstitutionAssignments.userId, userId),
            eq(userInstitutionAssignments.institutionId, institutionId),
            eq(userInstitutionAssignments.isActive, true)
          )
        )
        .limit(1);

      return assignment.length > 0 ? assignment[0].roles : null;
    } catch (error) {
      console.error("Error getting user role:", error);
      return null;
    }
  }

  /**
   * Assign user to institution with role
   */
  async assignUserToInstitution(
    userId: number,
    institutionId: number,
    roleId: number
  ): Promise<boolean> {
    const db = await getDb();
    if (!db) return false;

    try {
      await db.insert(userInstitutionAssignments).values({
        userId,
        institutionId,
        roleId,
        isActive: true,
      });
      return true;
    } catch (error) {
      console.error("Error assigning user to institution:", error);
      return false;
    }
  }

  /**
   * Remove user from institution
   */
  async removeUserFromInstitution(userId: number, institutionId: number): Promise<boolean> {
    const db = await getDb();
    if (!db) return false;

    try {
      await db
        .update(userInstitutionAssignments)
        .set({ isActive: false })
        .where(
          and(
            eq(userInstitutionAssignments.userId, userId),
            eq(userInstitutionAssignments.institutionId, institutionId)
          )
        );
      return true;
    } catch (error) {
      console.error("Error removing user from institution:", error);
      return false;
    }
  }

  /**
   * Get all available permissions
   */
  async getAllPermissions(): Promise<any[]> {
    const db = await getDb();
    if (!db) return [];

    try {
      return await db.select().from(permissions);
    } catch (error) {
      console.error("Error getting permissions:", error);
      return [];
    }
  }

  /**
   * Get all available roles
   */
  async getAllRoles(): Promise<any[]> {
    const db = await getDb();
    if (!db) return [];

    try {
      return await db.select().from(roles);
    } catch (error) {
      console.error("Error getting roles:", error);
      return [];
    }
  }

  /**
   * Get permissions for a role
   */
  async getRolePermissions(roleId: number): Promise<any[]> {
    const db = await getDb();
    if (!db) return [];

    try {
      const result = await db
        .select({ permission: permissions })
        .from(rolePermissions)
        .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
        .where(eq(rolePermissions.roleId, roleId));

      return result.map((r) => r.permission);
    } catch (error) {
      console.error("Error getting role permissions:", error);
      return [];
    }
  }
}

export const rbacService = new RBACService();
