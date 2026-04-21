import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentCount,
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  getTeacherCount,
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCourseCount,
  createEnrollment,
  getEnrollments,
  getEnrollmentById,
  getEnrollmentsByStudent,
  getEnrollmentsByCourse,
  updateEnrollment,
  deleteEnrollment,
  getActiveEnrollmentCount,
  createGrade,
  getGrades,
  getGradeById,
  getGradesByStudent,
  getGradesByStudentAndCourse,
  getGradesByCourse,
  updateGrade,
  deleteGrade,
} from "./db";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Solo administradores pueden acceder a esto" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============ DASHBOARD ============
  dashboard: router({
    stats: protectedProcedure.query(async () => {
      const [studentCount, teacherCount, courseCount, enrollmentCount] = await Promise.all([
        getStudentCount(),
        getTeacherCount(),
        getCourseCount(),
        getActiveEnrollmentCount(),
      ]);

      return {
        studentCount,
        teacherCount,
        courseCount,
        enrollmentCount,
      };
    }),
  }),

  // ============ STUDENTS ============
  students: router({
    list: protectedProcedure
      .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
      .query(async ({ input }) => {
        return await getStudents(input.limit, input.offset);
      }),

    getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return await getStudentById(input.id);
    }),

    create: adminProcedure
      .input(
        z.object({
          firstName: z.string().min(1),
          lastName: z.string().min(1),
          email: z.string().email().optional(),
          phone: z.string().optional(),
          dateOfBirth: z.date().optional(),
          address: z.string().optional(),
          city: z.string().optional(),
          state: z.string().optional(),
          zipCode: z.string().optional(),
          enrollmentNumber: z.string().optional(),
          status: z.enum(["active", "inactive", "graduated"]).default("active"),
        })
      )
      .mutation(async ({ input }) => {
        return await createStudent(input);
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          firstName: z.string().optional(),
          lastName: z.string().optional(),
          email: z.string().email().optional(),
          phone: z.string().optional(),
          dateOfBirth: z.date().optional(),
          address: z.string().optional(),
          city: z.string().optional(),
          state: z.string().optional(),
          zipCode: z.string().optional(),
          enrollmentNumber: z.string().optional(),
          status: z.enum(["active", "inactive", "graduated"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await updateStudent(id, data);
      }),

    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      const success = await deleteStudent(input.id);
      return { success };
    }),
  }),

  // ============ TEACHERS ============
  teachers: router({
    list: protectedProcedure
      .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
      .query(async ({ input }) => {
        return await getTeachers(input.limit, input.offset);
      }),

    getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return await getTeacherById(input.id);
    }),

    create: adminProcedure
      .input(
        z.object({
          firstName: z.string().min(1),
          lastName: z.string().min(1),
          email: z.string().email().optional(),
          phone: z.string().optional(),
          specialization: z.string().optional(),
          employeeNumber: z.string().optional(),
          hireDate: z.date().optional(),
          status: z.enum(["active", "inactive", "on_leave"]).default("active"),
        })
      )
      .mutation(async ({ input }) => {
        return await createTeacher(input);
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          firstName: z.string().optional(),
          lastName: z.string().optional(),
          email: z.string().email().optional(),
          phone: z.string().optional(),
          specialization: z.string().optional(),
          employeeNumber: z.string().optional(),
          hireDate: z.date().optional(),
          status: z.enum(["active", "inactive", "on_leave"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await updateTeacher(id, data);
      }),

    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      const success = await deleteTeacher(input.id);
      return { success };
    }),
  }),

  // ============ COURSES ============
  courses: router({
    list: protectedProcedure
      .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
      .query(async ({ input }) => {
        return await getCourses(input.limit, input.offset);
      }),

    getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return await getCourseById(input.id);
    }),

    create: adminProcedure
      .input(
        z.object({
          name: z.string().min(1),
          code: z.string().min(1),
          description: z.string().optional(),
          credits: z.number().optional(),
          teacherId: z.number().optional(),
          academicYear: z.string().min(1),
          semester: z.enum(["1", "2"]),
          maxStudents: z.number().optional(),
          status: z.enum(["active", "inactive", "archived"]).default("active"),
        })
      )
      .mutation(async ({ input }) => {
        return await createCourse(input);
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          code: z.string().optional(),
          description: z.string().optional(),
          credits: z.number().optional(),
          teacherId: z.number().optional(),
          academicYear: z.string().optional(),
          semester: z.enum(["1", "2"]).optional(),
          maxStudents: z.number().optional(),
          status: z.enum(["active", "inactive", "archived"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await updateCourse(id, data);
      }),

    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      const success = await deleteCourse(input.id);
      return { success };
    }),
  }),

  // ============ ENROLLMENTS ============
  enrollments: router({
    list: protectedProcedure
      .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
      .query(async ({ input }) => {
        return await getEnrollments(input.limit, input.offset);
      }),

    getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return await getEnrollmentById(input.id);
    }),

    byStudent: protectedProcedure.input(z.object({ studentId: z.number() })).query(async ({ input }) => {
      return await getEnrollmentsByStudent(input.studentId);
    }),

    byCourse: protectedProcedure.input(z.object({ courseId: z.number() })).query(async ({ input }) => {
      return await getEnrollmentsByCourse(input.courseId);
    }),

    create: adminProcedure
      .input(
        z.object({
          studentId: z.number(),
          courseId: z.number(),
          status: z.enum(["enrolled", "completed", "dropped", "pending"]).default("enrolled"),
        })
      )
      .mutation(async ({ input }) => {
        return await createEnrollment(input);
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["enrolled", "completed", "dropped", "pending"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await updateEnrollment(id, data);
      }),

    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      const success = await deleteEnrollment(input.id);
      return { success };
    }),
  }),

  // ============ GRADES ============
  grades: router({
    list: protectedProcedure
      .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
      .query(async ({ input }) => {
        return await getGrades(input.limit, input.offset);
      }),

    getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return await getGradeById(input.id);
    }),

    byStudent: protectedProcedure.input(z.object({ studentId: z.number() })).query(async ({ input }) => {
      return await getGradesByStudent(input.studentId);
    }),

    byStudentAndCourse: protectedProcedure
      .input(z.object({ studentId: z.number(), courseId: z.number() }))
      .query(async ({ input }) => {
        return await getGradesByStudentAndCourse(input.studentId, input.courseId);
      }),

    byCourse: protectedProcedure.input(z.object({ courseId: z.number() })).query(async ({ input }) => {
      return await getGradesByCourse(input.courseId);
    }),

    create: adminProcedure
      .input(
        z.object({
          enrollmentId: z.number(),
          studentId: z.number(),
          courseId: z.number(),
          grade: z.number().min(0).max(100),
          gradeType: z.enum(["midterm", "final", "assignment", "participation", "project"]),
        })
      )
      .mutation(async ({ input, ctx }) => {
        return await createGrade({
          enrollmentId: input.enrollmentId,
          studentId: input.studentId,
          courseId: input.courseId,
          grade: input.grade.toString(),
          gradeType: input.gradeType,
          recordedBy: ctx.user.id,
        });
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          grade: z.number().min(0).max(100).optional(),
          gradeType: z.enum(["midterm", "final", "assignment", "participation", "project"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, grade, ...data } = input;
        const updateData: any = { ...data };
        if (grade !== undefined) {
          updateData.grade = grade.toString();
        }
        return await updateGrade(id, updateData);
      }),

    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      const success = await deleteGrade(input.id);
      return { success };
    }),
  }),
});

export type AppRouter = typeof appRouter;
