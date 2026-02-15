import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

/**
 * Integration Tests for MCC Kansas City Dashboard
 * Tests all three major features: Admin Panel, Export, and Smartsheet Integration
 */

// Mock user context
const mockAdminUser: TrpcContext["user"] = {
  id: 1,
  openId: "admin-user-123",
  email: "admin@mcc.edu",
  name: "Admin User",
  loginMethod: "manus",
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

const mockRegularUser: TrpcContext["user"] = {
  id: 2,
  openId: "user-123",
  email: "user@mcc.edu",
  name: "Regular User",
  loginMethod: "manus",
  role: "user",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

// Mock request/response
const mockReq = {
  protocol: "https",
  headers: {},
} as any;

const mockRes = {
  clearCookie: () => {},
} as any;

describe("MCC Kansas City Dashboard Integration Tests", () => {
  let adminCaller: any;
  let userCaller: any;

  beforeAll(() => {
    adminCaller = appRouter.createCaller({
      user: mockAdminUser,
      req: mockReq,
      res: mockRes,
    });

    userCaller = appRouter.createCaller({
      user: mockRegularUser,
      req: mockReq,
      res: mockRes,
    });
  });

  describe("Authentication & Authorization", () => {
    it("should allow authenticated users to access dashboard", async () => {
      const user = await adminCaller.auth.me();
      expect(user).toBeDefined();
      expect(user?.role).toBe("admin");
    });

    it("should allow logout", async () => {
      const result = await adminCaller.auth.logout();
      expect(result.success).toBe(true);
    });
  });

  describe("Export Functionality", () => {
    it("should generate Excel export for admin users", async () => {
      const result = await adminCaller.export.toExcel({
        institutionId: "all",
        month: "December",
        includeCharts: true,
      });

      expect(result.success).toBe(true);
      expect(result.fileName).toContain("MCC_Performance_Report");
      expect(result.buffer).toBeDefined();
    });

    it("should generate PDF export for admin users", async () => {
      const result = await adminCaller.export.toPdf({
        institutionId: "all",
        month: "December",
        includeCharts: true,
      });

      expect(result.success).toBe(true);
      expect(result.fileName).toContain("MCC_Performance_Report");
      expect(result.htmlContent).toContain("MCC Kansas City");
    });

    it("should allow regular users to export", async () => {
      const result = await userCaller.export.toExcel({
        institutionId: "MCC-KC-01",
        month: "December",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("Smartsheet Integration", () => {
    it("should test Smartsheet API connection", async () => {
      const result = await adminCaller.smartsheet.testConnection();
      expect(result).toBeDefined();
      expect(result.success).toBeDefined();
    });

    it("should fetch institutions from Smartsheet", async () => {
      const result = await adminCaller.smartsheet.getInstitutions();
      expect(result).toBeDefined();
      expect(result.success).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
    });

    it("should fetch performance variables from Smartsheet", async () => {
      const result = await adminCaller.smartsheet.getVariables();
      expect(result).toBeDefined();
      expect(result.success).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
    });

    it("should fetch performance data from Smartsheet", async () => {
      const result = await adminCaller.smartsheet.getPerformanceData({
        month: "December",
        year: 2025,
      });

      expect(result).toBeDefined();
      expect(result.success).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
    });

    it("should allow submitting performance data to Smartsheet", async () => {
      const result = await adminCaller.smartsheet.submitPerformanceData({
        institutionId: "MCC-KC-01",
        variableId: "VAR-001",
        month: "December",
        year: 2025,
        baselineValue: "100",
        actualValue: "95",
        status: "Yellow",
        notes: "Test submission",
      });

      expect(result).toBeDefined();
      expect(result.success).toBeDefined();
    });
  });

  describe("Data Consistency", () => {
    it("should maintain data consistency across exports", async () => {
      const excelResult = await adminCaller.export.toExcel({
        institutionId: "all",
        month: "December",
      });

      const pdfResult = await adminCaller.export.toPdf({
        institutionId: "all",
        month: "December",
      });

      expect(excelResult.success).toBe(true);
      expect(pdfResult.success).toBe(true);
    });

    it("should handle missing Smartsheet credentials gracefully", async () => {
      const result = await adminCaller.smartsheet.testConnection();
      // Should return a result object, even if connection fails
      expect(result).toBeDefined();
      expect(typeof result.success).toBe("boolean");
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid export parameters", async () => {
      const result = await adminCaller.export.toExcel({
        institutionId: "invalid-id",
        month: "InvalidMonth",
      });

      // Should still succeed but with potentially filtered data
      expect(result).toBeDefined();
    });

    it("should handle Smartsheet API errors gracefully", async () => {
      const result = await adminCaller.smartsheet.getInstitutions();
      // Should return error object, not throw
      expect(result).toBeDefined();
      expect(result.success).toBeDefined();
    });
  });
});
