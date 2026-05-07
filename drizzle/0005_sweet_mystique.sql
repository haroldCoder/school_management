ALTER TABLE `users` DROP INDEX `users_email_unique`;--> statement-breakpoint
ALTER TABLE `students` ADD `idUser` int NOT NULL;--> statement-breakpoint
ALTER TABLE `teachers` ADD `idUser` int NOT NULL;--> statement-breakpoint
ALTER TABLE `students` ADD CONSTRAINT `students_idUser_unique` UNIQUE(`idUser`);--> statement-breakpoint
ALTER TABLE `teachers` ADD CONSTRAINT `teachers_idUser_unique` UNIQUE(`idUser`);--> statement-breakpoint
ALTER TABLE `students` ADD CONSTRAINT `students_idUser_users_id_fk` FOREIGN KEY (`idUser`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `teachers` ADD CONSTRAINT `teachers_idUser_users_id_fk` FOREIGN KEY (`idUser`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `name`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `email`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `createdAt`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `updatedAt`;