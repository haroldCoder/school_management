CREATE TABLE `courses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`code` varchar(50) NOT NULL,
	`description` text,
	`credits` int DEFAULT 0,
	`teacherId` int,
	`academicYear` varchar(20) NOT NULL,
	`semester` enum('1','2') NOT NULL,
	`maxStudents` int,
	`status` enum('active','inactive','archived') DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courses_id` PRIMARY KEY(`id`),
	CONSTRAINT `courses_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `enrollments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`studentId` int NOT NULL,
	`courseId` int NOT NULL,
	`enrollmentDate` timestamp NOT NULL DEFAULT (now()),
	`status` enum('enrolled','completed','dropped','pending') DEFAULT 'enrolled',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `enrollments_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_student_course` UNIQUE(`studentId`,`courseId`)
);
--> statement-breakpoint
CREATE TABLE `grades` (
	`id` int AUTO_INCREMENT NOT NULL,
	`enrollmentId` int NOT NULL,
	`studentId` int NOT NULL,
	`courseId` int NOT NULL,
	`grade` decimal(5,2) NOT NULL,
	`gradeType` enum('midterm','final','assignment','participation','project') NOT NULL,
	`recordedBy` int,
	`recordedDate` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `grades_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `students` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`email` varchar(320),
	`phone` varchar(20),
	`dateOfBirth` timestamp,
	`address` text,
	`city` varchar(100),
	`state` varchar(100),
	`zipCode` varchar(20),
	`enrollmentNumber` varchar(50),
	`status` enum('active','inactive','graduated') DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `students_id` PRIMARY KEY(`id`),
	CONSTRAINT `students_email_unique` UNIQUE(`email`),
	CONSTRAINT `students_enrollmentNumber_unique` UNIQUE(`enrollmentNumber`)
);
--> statement-breakpoint
CREATE TABLE `teachers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`email` varchar(320),
	`phone` varchar(20),
	`specialization` varchar(200),
	`employeeNumber` varchar(50),
	`hireDate` timestamp,
	`status` enum('active','inactive','on_leave') DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `teachers_id` PRIMARY KEY(`id`),
	CONSTRAINT `teachers_email_unique` UNIQUE(`email`),
	CONSTRAINT `teachers_employeeNumber_unique` UNIQUE(`employeeNumber`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('admin','user') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_unique` UNIQUE(`email`);--> statement-breakpoint
ALTER TABLE `courses` ADD CONSTRAINT `courses_teacherId_teachers_id_fk` FOREIGN KEY (`teacherId`) REFERENCES `teachers`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `enrollments` ADD CONSTRAINT `enrollments_studentId_students_id_fk` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `enrollments` ADD CONSTRAINT `enrollments_courseId_courses_id_fk` FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `grades` ADD CONSTRAINT `grades_enrollmentId_enrollments_id_fk` FOREIGN KEY (`enrollmentId`) REFERENCES `enrollments`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `grades` ADD CONSTRAINT `grades_studentId_students_id_fk` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `grades` ADD CONSTRAINT `grades_courseId_courses_id_fk` FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `grades` ADD CONSTRAINT `grades_recordedBy_users_id_fk` FOREIGN KEY (`recordedBy`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_course_status` ON `courses` (`status`);--> statement-breakpoint
CREATE INDEX `idx_course_teacher` ON `courses` (`teacherId`);--> statement-breakpoint
CREATE INDEX `idx_enrollment_status` ON `enrollments` (`status`);--> statement-breakpoint
CREATE INDEX `idx_enrollment_student` ON `enrollments` (`studentId`);--> statement-breakpoint
CREATE INDEX `idx_enrollment_course` ON `enrollments` (`courseId`);--> statement-breakpoint
CREATE INDEX `idx_grade_student` ON `grades` (`studentId`);--> statement-breakpoint
CREATE INDEX `idx_grade_course` ON `grades` (`courseId`);--> statement-breakpoint
CREATE INDEX `idx_grade_enrollment` ON `grades` (`enrollmentId`);--> statement-breakpoint
CREATE INDEX `idx_student_status` ON `students` (`status`);--> statement-breakpoint
CREATE INDEX `idx_teacher_status` ON `teachers` (`status`);