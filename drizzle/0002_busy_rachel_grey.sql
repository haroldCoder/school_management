CREATE TABLE `materials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseId` int NOT NULL,
	`uploadedBy` int NOT NULL,
	`title` varchar(200) NOT NULL,
	`description` text,
	`fileUrl` text NOT NULL,
	`fileKey` varchar(500) NOT NULL,
	`fileType` varchar(50) NOT NULL,
	`fileSize` int,
	`status` enum('active','archived') DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `materials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseId` int NOT NULL,
	`createdBy` int NOT NULL,
	`title` varchar(300) NOT NULL,
	`description` text,
	`questionType` enum('multiple_choice','short_answer','essay','true_false') NOT NULL,
	`content` text NOT NULL,
	`correctAnswer` text,
	`points` int DEFAULT 1,
	`status` enum('active','inactive','archived') DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `studentAnswers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`questionId` int NOT NULL,
	`studentId` int NOT NULL,
	`courseId` int NOT NULL,
	`answer` text NOT NULL,
	`isCorrect` int,
	`pointsEarned` int,
	`feedback` text,
	`submittedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `studentAnswers_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_student_question` UNIQUE(`studentId`,`questionId`)
);
--> statement-breakpoint
ALTER TABLE `materials` ADD CONSTRAINT `materials_courseId_courses_id_fk` FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `materials` ADD CONSTRAINT `materials_uploadedBy_users_id_fk` FOREIGN KEY (`uploadedBy`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `questions` ADD CONSTRAINT `questions_courseId_courses_id_fk` FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `questions` ADD CONSTRAINT `questions_createdBy_users_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `studentAnswers` ADD CONSTRAINT `studentAnswers_questionId_questions_id_fk` FOREIGN KEY (`questionId`) REFERENCES `questions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `studentAnswers` ADD CONSTRAINT `studentAnswers_studentId_students_id_fk` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `studentAnswers` ADD CONSTRAINT `studentAnswers_courseId_courses_id_fk` FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_material_course` ON `materials` (`courseId`);--> statement-breakpoint
CREATE INDEX `idx_material_status` ON `materials` (`status`);--> statement-breakpoint
CREATE INDEX `idx_question_course` ON `questions` (`courseId`);--> statement-breakpoint
CREATE INDEX `idx_question_status` ON `questions` (`status`);--> statement-breakpoint
CREATE INDEX `idx_answer_student` ON `studentAnswers` (`studentId`);--> statement-breakpoint
CREATE INDEX `idx_answer_question` ON `studentAnswers` (`questionId`);--> statement-breakpoint
CREATE INDEX `idx_answer_course` ON `studentAnswers` (`courseId`);