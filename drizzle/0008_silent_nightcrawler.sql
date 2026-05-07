ALTER TABLE `students` DROP INDEX `students_idUser_unique`;--> statement-breakpoint
ALTER TABLE `students` DROP FOREIGN KEY `students_idUser_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `password` varchar(255);--> statement-breakpoint
ALTER TABLE `students` ADD `user_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `students` ADD CONSTRAINT `students_user_id_unique` UNIQUE(`user_id`);--> statement-breakpoint
ALTER TABLE `students` ADD CONSTRAINT `students_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `students` DROP COLUMN `idUser`;