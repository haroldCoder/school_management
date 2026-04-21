import { eq, and, desc, asc, like, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  students,
  InsertStudent,
  Student,
  teachers,
  InsertTeacher,
  Teacher,
  courses,
  InsertCourse,
  Course,
  enrollments,
  InsertEnrollment,
  Enrollment,
  grades,
  InsertGrade,
  Grade,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ STUDENTS ============

export async function createStudent(data: InsertStudent): Promise<Student> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(students).values(data);
  const id = result[0].insertId;
  const student = await db.select().from(students).where(eq(students.id, id as number)).limit(1);
  return student[0]!;
}

export async function getStudents(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(students)
    .orderBy(desc(students.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getStudentById(id: number): Promise<Student | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(students).where(eq(students.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateStudent(id: number, data: Partial<InsertStudent>): Promise<Student | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  await db.update(students).set(data).where(eq(students.id, id));
  return getStudentById(id);
}

export async function deleteStudent(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const result = await db.delete(students).where(eq(students.id, id));
  return result[0].affectedRows > 0;
}

export async function getStudentCount(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const result = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(students)
    .where(eq(students.status, "active"));
  return result[0]?.count ?? 0;
}

// ============ TEACHERS ============

export async function createTeacher(data: InsertTeacher): Promise<Teacher> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(teachers).values(data);
  const id = result[0].insertId;
  const teacher = await db.select().from(teachers).where(eq(teachers.id, id as number)).limit(1);
  return teacher[0]!;
}

export async function getTeachers(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(teachers)
    .orderBy(desc(teachers.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getTeacherById(id: number): Promise<Teacher | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(teachers).where(eq(teachers.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateTeacher(id: number, data: Partial<InsertTeacher>): Promise<Teacher | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  await db.update(teachers).set(data).where(eq(teachers.id, id));
  return getTeacherById(id);
}

export async function deleteTeacher(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const result = await db.delete(teachers).where(eq(teachers.id, id));
  return result[0].affectedRows > 0;
}

export async function getTeacherCount(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const result = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(teachers)
    .where(eq(teachers.status, "active"));
  return result[0]?.count ?? 0;
}

// ============ COURSES ============

export async function createCourse(data: InsertCourse): Promise<Course> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(courses).values(data);
  const id = result[0].insertId;
  const course = await db.select().from(courses).where(eq(courses.id, id as number)).limit(1);
  return course[0]!;
}

export async function getCourses(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(courses)
    .orderBy(desc(courses.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getCourseById(id: number): Promise<Course | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateCourse(id: number, data: Partial<InsertCourse>): Promise<Course | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  await db.update(courses).set(data).where(eq(courses.id, id));
  return getCourseById(id);
}

export async function deleteCourse(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const result = await db.delete(courses).where(eq(courses.id, id));
  return result[0].affectedRows > 0;
}

export async function getCourseCount(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const result = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(courses)
    .where(eq(courses.status, "active"));
  return result[0]?.count ?? 0;
}

// ============ ENROLLMENTS ============

export async function createEnrollment(data: InsertEnrollment): Promise<Enrollment> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(enrollments).values(data);
  const id = result[0].insertId;
  const enrollment = await db
    .select()
    .from(enrollments)
    .where(eq(enrollments.id, id as number))
    .limit(1);
  return enrollment[0]!;
}

export async function getEnrollments(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(enrollments)
    .orderBy(desc(enrollments.enrollmentDate))
    .limit(limit)
    .offset(offset);
}

export async function getEnrollmentById(id: number): Promise<Enrollment | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(enrollments).where(eq(enrollments.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getEnrollmentsByStudent(studentId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(enrollments).where(eq(enrollments.studentId, studentId));
}

export async function getEnrollmentsByCourse(courseId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(enrollments).where(eq(enrollments.courseId, courseId));
}

export async function updateEnrollment(id: number, data: Partial<InsertEnrollment>): Promise<Enrollment | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  await db.update(enrollments).set(data).where(eq(enrollments.id, id));
  return getEnrollmentById(id);
}

export async function deleteEnrollment(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const result = await db.delete(enrollments).where(eq(enrollments.id, id));
  return result[0].affectedRows > 0;
}

export async function getActiveEnrollmentCount(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const result = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(enrollments)
    .where(eq(enrollments.status, "enrolled"));
  return result[0]?.count ?? 0;
}

// ============ GRADES ============

export async function createGrade(data: InsertGrade): Promise<Grade> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(grades).values(data);
  const id = result[0].insertId;
  const grade = await db.select().from(grades).where(eq(grades.id, id as number)).limit(1);
  return grade[0]!;
}

export async function getGrades(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(grades)
    .orderBy(desc(grades.recordedDate))
    .limit(limit)
    .offset(offset);
}

export async function getGradeById(id: number): Promise<Grade | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(grades).where(eq(grades.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getGradesByStudent(studentId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(grades).where(eq(grades.studentId, studentId));
}

export async function getGradesByStudentAndCourse(studentId: number, courseId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(grades)
    .where(and(eq(grades.studentId, studentId), eq(grades.courseId, courseId)));
}

export async function getGradesByCourse(courseId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(grades).where(eq(grades.courseId, courseId));
}

export async function updateGrade(id: number, data: Partial<InsertGrade>): Promise<Grade | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  await db.update(grades).set(data).where(eq(grades.id, id));
  return getGradeById(id);
}

export async function deleteGrade(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const result = await db.delete(grades).where(eq(grades.id, id));
  return result[0].affectedRows > 0;
}
