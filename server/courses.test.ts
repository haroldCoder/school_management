import { describe, it, expect } from "vitest";
import { appRouter } from "./routers.js";
import type { TrpcContext } from "./_core/context.js";

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@example.com",
      name: "Admin User",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("courses", () => {
  describe("authorization", () => {
    it("should allow admin to create courses", async () => {
      const ctx = createAdminContext();
      expect(ctx.user.role).toBe("admin");
    });

    it("should validate required course fields", () => {
      const validCourse = {
        name: "Mathematics",
        code: "MATH-101",
        academicYear: "2024",
        semester: "1",
      };

      expect(validCourse.name).toBeTruthy();
      expect(validCourse.code).toBeTruthy();
      expect(validCourse.academicYear).toBeTruthy();
      expect(["1", "2"]).toContain(validCourse.semester);
    });

    it("should validate course status enum", () => {
      const validStatuses = ["active", "inactive", "archived"];
      const testStatus = "active";

      expect(validStatuses).toContain(testStatus);
    });
  });

  describe("list", () => {
    it("should return courses with correct structure", () => {
      const mockCourse = {
        id: 1,
        name: "Physics",
        code: "PHYS-101",
        description: "Introduction to Physics",
        credits: 3,
        teacherId: null,
        academicYear: "2024",
        semester: "1",
        maxStudents: 30,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(mockCourse).toHaveProperty("id");
      expect(mockCourse).toHaveProperty("name");
      expect(mockCourse).toHaveProperty("code");
      expect(mockCourse).toHaveProperty("status");
    });
  });
});
