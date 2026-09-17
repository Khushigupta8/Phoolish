CREATE TABLE "admin_products" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"price" integer NOT NULL,
	"category" text NOT NULL,
	"image" text NOT NULL,
	"images" text DEFAULT '[]' NOT NULL,
	"badge" text,
	"description" text NOT NULL,
	"material" text NOT NULL,
	"size" text NOT NULL,
	"care" text NOT NULL,
	"variants" text DEFAULT '[]' NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"personalised" integer DEFAULT 0 NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "instagram_posts" (
	"id" text PRIMARY KEY NOT NULL,
	"image" text NOT NULL,
	"caption" text,
	"link" text,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" text NOT NULL
);
