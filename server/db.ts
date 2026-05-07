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
  materials,
  InsertMaterial,
  Material,
  questions,
  InsertQuestion,
  Question,
  studentAnswers,
  InsertStudentAnswer,
  StudentAnswer,
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
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = { ...user };
    const updateSet: Record<string, unknown> = {};

    const fields = ["name", "email", "loginMethod", "username", "password", "role"] as const;
    fields.forEach((field) => {
      if (user[field] !== undefined) {
        updateSet[field] = user[field] ?? null;
      }
    });

    if (user.lastSignedIn !== undefined) {
      updateSet.lastSignedIn = user.lastSignedIn;
    } else {
      values.lastSignedIn = new Date();
      updateSet.lastSignedIn = new Date();
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
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByUsername(username: string) {
  const db = await getDb();
  if (!db) return undefined;
  try {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  }
  catch (error) {
    console.error("[Database] Failed to get user by username:", error);
    throw error;
  }
}

export async function createUser(data: InsertUser) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(users).values(data);
  const id = result[0].insertId;
  const user = await db.select().from(users).where(eq(users.id, id as number)).limit(1);
  return user[0]!;
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


// ============ MATERIALS ============

export async function createMaterial(data: InsertMaterial): Promise<Material> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(materials).values(data);
  const id = result[0].insertId;
  const material = await db.select().from(materials).where(eq(materials.id, id as number)).limit(1);
  return material[0]!;
}

export async function getMaterials(courseId: number, limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(materials)
    .where(and(eq(materials.courseId, courseId), eq(materials.status, "active")))
    .orderBy(desc(materials.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getMaterialById(id: number): Promise<Material | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(materials).where(eq(materials.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateMaterial(id: number, data: Partial<InsertMaterial>): Promise<Material | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  await db.update(materials).set(data).where(eq(materials.id, id));
  return getMaterialById(id);
}

export async function deleteMaterial(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const result = await db.delete(materials).where(eq(materials.id, id));
  return result[0].affectedRows > 0;
}

// ============ QUESTIONS ============

export async function createQuestion(data: InsertQuestion): Promise<Question> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(questions).values(data);
  const id = result[0].insertId;
  const question = await db.select().from(questions).where(eq(questions.id, id as number)).limit(1);
  return question[0]!;
}

export async function getQuestions(courseId: number, limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(questions)
    .where(and(eq(questions.courseId, courseId), eq(questions.status, "active")))
    .orderBy(desc(questions.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getQuestionById(id: number): Promise<Question | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(questions).where(eq(questions.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateQuestion(id: number, data: Partial<InsertQuestion>): Promise<Question | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  await db.update(questions).set(data).where(eq(questions.id, id));
  return getQuestionById(id);
}

export async function deleteQuestion(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const result = await db.delete(questions).where(eq(questions.id, id));
  return result[0].affectedRows > 0;
}

// ============ STUDENT ANSWERS ============

export async function submitAnswer(data: InsertStudentAnswer): Promise<StudentAnswer> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(studentAnswers).values(data);
  const id = result[0].insertId;
  const answer = await db.select().from(studentAnswers).where(eq(studentAnswers.id, id as number)).limit(1);
  return answer[0]!;
}

export async function getStudentAnswers(studentId: number, courseId: number, limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(studentAnswers)
    .where(and(eq(studentAnswers.studentId, studentId), eq(studentAnswers.courseId, courseId)))
    .orderBy(desc(studentAnswers.submittedAt))
    .limit(limit)
    .offset(offset);
}

export async function getStudentAnswer(studentId: number, questionId: number): Promise<StudentAnswer | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(studentAnswers)
    .where(and(eq(studentAnswers.studentId, studentId), eq(studentAnswers.questionId, questionId)))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateStudentAnswer(id: number, data: Partial<InsertStudentAnswer>): Promise<StudentAnswer | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  await db.update(studentAnswers).set(data).where(eq(studentAnswers.id, id));
  const result = await db.select().from(studentAnswers).where(eq(studentAnswers.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getQuestionAnswers(questionId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(studentAnswers)
    .where(eq(studentAnswers.questionId, questionId))
    .orderBy(desc(studentAnswers.submittedAt));
}
