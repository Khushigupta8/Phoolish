CREATE TABLE `instagram_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`image` text NOT NULL,
	`caption` text,
	`link` text,
	`position` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL
);
