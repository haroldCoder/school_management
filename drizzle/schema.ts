import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  unique,
  foreignKey,
  index,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with role-based access control.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).unique(), // Made nullable to transition to local auth
  username: varchar("username", { length: 64 }).unique(),
  password: varchar("password", { length: 255 }),
  loginMethod: varchar("loginMethod", { length: 64 }).default("local").notNull(),
  role: mysqlEnum("role", ["admin", "user"]).default("user").notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Students table - stores student information
 */
export const students = mysqlTable(
  "students",
  {
    id: int("id").autoincrement().primaryKey(),
    firstName: varchar("firstName", { length: 100 }).notNull(),
    lastName: varchar("lastName", { length: 100 }).notNull(),
    email: varchar("email", { length: 320 }).unique(),
    phone: varchar("phone", { length: 20 }),
    dateOfBirth: timestamp("dateOfBirth"),
    address: text("address"),
    city: varchar("city", { length: 100 }),
    state: varchar("state", { length: 100 }),
    zipCode: varchar("zipCode", { length: 20 }),
    enrollmentNumber: varchar("enrollmentNumber", { length: 50 }).unique(),
    status: mysqlEnum("status", ["active", "inactive", "graduated"]).default("active"),
    idUser: int("user_id").unique().notNull().references(() => users.id),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [index("idx_student_status").on(table.status)]
);

export type Student = typeof students.$inferSelect;
export type InsertStudent = typeof students.$inferInsert;

/**
 * Teachers table - stores teacher/staff information
 */
export const teachers = mysqlTable(
  "teachers",
  {
    id: int("id").autoincrement().primaryKey(),
    firstName: varchar("firstName", { length: 100 }).notNull(),
    lastName: varchar("lastName", { length: 100 }).notNull(),
    email: varchar("email", { length: 320 }).unique(),
    phone: varchar("phone", { length: 20 }),
    specialization: varchar("specialization", { length: 200 }),
    employeeNumber: varchar("employeeNumber", { length: 50 }).unique(),
    hireDate: timestamp("hireDate"),
    status: mysqlEnum("status", ["active", "inactive", "on_leave"]).default("active"),
    idUser: int("idUser").unique().notNull().references(() => users.id),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [index("idx_teacher_status").on(table.status)]
);

export type Teacher = typeof teachers.$inferSelect;
export type InsertTeacher = typeof teachers.$inferInsert;

/**
 * Courses table - stores course/subject information
 */
export const courses = mysqlTable(
  "courses",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 200 }).notNull(),
    code: varchar("code", { length: 50 }).unique().notNull(),
    description: text("description"),
    credits: int("credits").default(0),
    teacherId: int("teacherId"),
    academicYear: varchar("academicYear", { length: 20 }).notNull(),
    semester: mysqlEnum("semester", ["1", "2"]).notNull(),
    maxStudents: int("maxStudents"),
    status: mysqlEnum("status", ["active", "inactive", "archived"]).default("active"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    foreignKey({ columns: [table.teacherId], foreignColumns: [teachers.id] }).onDelete("set null"),
    index("idx_course_status").on(table.status),
    index("idx_course_teacher").on(table.teacherId),
  ]
);

export type Course = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;

/**
 * Enrollments table - tracks student enrollment in courses
 */
export const enrollments = mysqlTable(
  "enrollments",
  {
    id: int("id").autoincrement().primaryKey(),
    studentId: int("studentId").notNull(),
    courseId: int("courseId").notNull(),
    enrollmentDate: timestamp("enrollmentDate").defaultNow().notNull(),
    status: mysqlEnum("status", ["enrolled", "completed", "dropped", "pending"]).default("enrolled"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    foreignKey({ columns: [table.studentId], foreignColumns: [students.id] }).onDelete("cascade"),
    foreignKey({ columns: [table.courseId], foreignColumns: [courses.id] }).onDelete("cascade"),
    unique("unique_student_course").on(table.studentId, table.courseId),
    index("idx_enrollment_status").on(table.status),
    index("idx_enrollment_student").on(table.studentId),
    index("idx_enrollment_course").on(table.courseId),
  ]
);

export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = typeof enrollments.$inferInsert;

/**
 * Grades table - stores student grades for courses
 */
export const grades = mysqlTable(
  "grades",
  {
    id: int("id").autoincrement().primaryKey(),
    enrollmentId: int("enrollmentId").notNull(),
    studentId: int("studentId").notNull(),
    courseId: int("courseId").notNull(),
    grade: decimal("grade", { precision: 5, scale: 2 }).notNull(),
    gradeType: mysqlEnum("gradeType", ["midterm", "final", "assignment", "participation", "project"]).notNull(),
    recordedBy: int("recordedBy"),
    recordedDate: timestamp("recordedDate").defaultNow().notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    foreignKey({ columns: [table.enrollmentId], foreignColumns: [enrollments.id] }).onDelete("cascade"),
    foreignKey({ columns: [table.studentId], foreignColumns: [students.id] }).onDelete("cascade"),
    foreignKey({ columns: [table.courseId], foreignColumns: [courses.id] }).onDelete("cascade"),
    foreignKey({ columns: [table.recordedBy], foreignColumns: [users.id] }).onDelete("set null"),
    index("idx_grade_student").on(table.studentId),
    index("idx_grade_course").on(table.courseId),
    index("idx_grade_enrollment").on(table.enrollmentId),
  ]
);

export type Grade = typeof grades.$inferSelect;
export type InsertGrade = typeof grades.$inferInsert;

/**
 * Materials table - stores course materials (PDFs, images, etc.)
 */
export const materials = mysqlTable(
  "materials",
  {
    id: int("id").autoincrement().primaryKey(),
    courseId: int("courseId").notNull(),
    uploadedBy: int("uploadedBy"),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description"),
    fileUrl: text("fileUrl").notNull(),
    fileKey: varchar("fileKey", { length: 500 }).notNull(),
    fileType: varchar("fileType", { length: 50 }).notNull(),
    fileSize: int("fileSize"),
    status: mysqlEnum("status", ["active", "archived"]).default("active"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    foreignKey({ columns: [table.courseId], foreignColumns: [courses.id] }).onDelete("cascade"),
    foreignKey({ columns: [table.uploadedBy], foreignColumns: [users.id] }).onDelete("set null"),
    index("idx_material_course").on(table.courseId),
    index("idx_material_status").on(table.status),
  ]
);

export type Material = typeof materials.$inferSelect;
export type InsertMaterial = typeof materials.$inferInsert;

/**
 * Questions table - stores course questions for students to answer
 */
export const questions = mysqlTable(
  "questions",
  {
    id: int("id").autoincrement().primaryKey(),
    courseId: int("courseId").notNull(),
    createdBy: int("createdBy"),
    title: varchar("title", { length: 300 }).notNull(),
    description: text("description"),
    questionType: mysqlEnum("questionType", ["multiple_choice", "short_answer", "essay", "true_false"]).notNull(),
    content: text("content").notNull(),
    correctAnswer: text("correctAnswer"),
    points: int("points").default(1),
    status: mysqlEnum("status", ["active", "inactive", "archived"]).default("active"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    foreignKey({ columns: [table.courseId], foreignColumns: [courses.id] }).onDelete("cascade"),
    foreignKey({ columns: [table.createdBy], foreignColumns: [users.id] }).onDelete("set null"),
    index("idx_question_course").on(table.courseId),
    index("idx_question_status").on(table.status),
  ]
);

export type Question = typeof questions.$inferSelect;
export type InsertQuestion = typeof questions.$inferInsert;

/**
 * Student Answers table - stores student responses to questions
 */
export const studentAnswers = mysqlTable(
  "studentAnswers",
  {
    id: int("id").autoincrement().primaryKey(),
    questionId: int("questionId").notNull(),
    studentId: int("studentId").notNull(),
    courseId: int("courseId").notNull(),
    answer: text("answer").notNull(),
    isCorrect: int("isCorrect"),
    pointsEarned: int("pointsEarned"),
    feedback: text("feedback"),
    submittedAt: timestamp("submittedAt").defaultNow().notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    foreignKey({ columns: [table.questionId], foreignColumns: [questions.id] }).onDelete("cascade"),
    foreignKey({ columns: [table.studentId], foreignColumns: [students.id] }).onDelete("cascade"),
    foreignKey({ columns: [table.courseId], foreignColumns: [courses.id] }).onDelete("cascade"),
    unique("unique_student_question").on(table.studentId, table.questionId),
    index("idx_answer_student").on(table.studentId),
    index("idx_answer_question").on(table.questionId),
    index("idx_answer_course").on(table.courseId),
  ]
);

export type StudentAnswer = typeof studentAnswers.$inferSelect;
export type InsertStudentAnswer = typeof studentAnswers.$inferInsert;
