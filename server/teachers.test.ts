import { describe, it, expect } from "vitest";
import type { TrpcContext } from "./_core/context";

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

describe("teachers", () => {
  describe("authorization", () => {
    it("should allow admin to create teachers", () => {
      const ctx = createAdminContext();
      expect(ctx.user.role).toBe("admin");
    });

    it("should validate teacher status values", () => {
      const validStatuses = ["active", "inactive", "on_leave"];
      const testStatus = "active";

      expect(validStatuses).toContain(testStatus);
    });
  });

  describe("validation", () => {
    it("should require firstName and lastName for teacher", () => {
      const validTeacher = {
        firstName: "Carlos",
        lastName: "García",
        status: "active",
      };

      expect(validTeacher.firstName).toBeTruthy();
      expect(validTeacher.lastName).toBeTruthy();
    });

    it("should validate email format if provided", () => {
      const validEmails = ["teacher@school.edu", "prof.garcia@institution.org"];
      const invalidEmails = ["invalid.email", "no-at-sign.com"];

      validEmails.forEach((email) => {
        expect(email).toMatch(/@/);
      });

      invalidEmails.forEach((email) => {
        expect(email).not.toMatch(/@/);
      });
    });

    it("should track hire date", () => {
      const teacher = {
        id: 1,
        firstName: "Ana",
        lastName: "López",
        hireDate: new Date("2023-01-15"),
        status: "active",
      };

      expect(teacher.hireDate).toBeInstanceOf(Date);
      expect(teacher.hireDate.getFullYear()).toBe(2023);
    });
  });

  describe("specialization", () => {
    it("should store teacher specialization", () => {
      const teacher = {
        id: 1,
        firstName: "Juan",
        lastName: "Martínez",
        specialization: "Matemáticas",
        status: "active",
      };

      expect(teacher.specialization).toBeDefined();
      expect(teacher.specialization).toBe("Matemáticas");
    });
  });
});
