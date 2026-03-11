CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
ALTER TABLE `transactions` ADD `user_id` text;--> statement-breakpoint
ALTER TABLE `categories` ADD `user_id` text;--> statement-breakpoint
ALTER TABLE `budgets` ADD `user_id` text;