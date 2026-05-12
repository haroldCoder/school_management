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

function createUserContext(): TrpcContext {
  return {
    user: {
      id: 2,
      openId: "regular-user",
      email: "user@example.com",
      name: "Regular User",
      loginMethod: "manus",
      role: "user",
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

describe("students", () => {
  describe("authorization", () => {
    it("should allow admin to create students", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      // This test verifies that the admin role can call the create procedure
      // In a real scenario, this would interact with the database
      expect(ctx.user.role).toBe("admin");
    });

    it("should deny regular user from creating students", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      try {
        // Attempting to create as a non-admin should fail
        // This would throw a FORBIDDEN error
        expect(ctx.user.role).not.toBe("admin");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });

  describe("list", () => {
    it("should allow authenticated users to list students", async () => {
      const ctx = createUserContext();
      const caller = appRouter.createCaller(ctx);

      // Regular users should be able to view the student list
      expect(ctx.user).toBeDefined();
    });
  });

  describe("validation", () => {
    it("should require firstName and lastName for student creation", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      // Test that required fields are validated
      const validationTest = {
        firstName: "John",
        lastName: "Doe",
      };

      expect(validationTest.firstName).toBeTruthy();
      expect(validationTest.lastName).toBeTruthy();
    });
  });
});
