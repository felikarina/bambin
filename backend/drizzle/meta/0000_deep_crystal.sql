CREATE TABLE "Activity" (
	"id_activity" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"title" text,
	"date" date,
	"description" text,
	"category" text,
	"user_id" uuid DEFAULT gen_random_uuid()
);
--> statement-breakpoint
CREATE TABLE "Child" (
	"id_child" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"firstname" text,
	"lastname" text,
	"birth_date" date,
	"user_id" uuid DEFAULT gen_random_uuid(),
	"user_id2" uuid
);
--> statement-breakpoint
CREATE TABLE "Child_section" (
	"id_child_section" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"child_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"section_id" text
);
--> statement-breakpoint
CREATE TABLE "Message" (
	"id_message" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"content" text,
	"sender_id" uuid DEFAULT gen_random_uuid()
);
--> statement-breakpoint
CREATE TABLE "Picture" (
	"id_picture" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"title" text,
	"date" date,
	"media" text,
	"user_id" uuid DEFAULT gen_random_uuid()
);
--> statement-breakpoint
CREATE TABLE "Picture_tag" (
	"id_picure-tag" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"child_id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"picture_id" uuid DEFAULT gen_random_uuid()
);
--> statement-breakpoint
CREATE TABLE "Section" (
	"id_section" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text,
	"year" smallint,
	"number_of_child" smallint
);
--> statement-breakpoint
CREATE TABLE "Section_activity" (
	"id_section_activity" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"section_id" text,
	"activity_id" uuid DEFAULT gen_random_uuid()
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id_user" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"role" text DEFAULT 'parent',
	"firstname" text,
	"lastname" text,
	"email" text,
	"password" text
);
--> statement-breakpoint
ALTER TABLE "Activity" ADD CONSTRAINT "activity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id_user") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Child" ADD CONSTRAINT "child_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id_user") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Child" ADD CONSTRAINT "child_user_id2_fkey" FOREIGN KEY ("user_id2") REFERENCES "public"."User"("id_user") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Child_section" ADD CONSTRAINT "child_section_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "public"."Child"("id_child") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Message" ADD CONSTRAINT "message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."User"("id_user") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Picture" ADD CONSTRAINT "picture_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id_user") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Picture_tag" ADD CONSTRAINT "picture_tag_picture_id_fkey" FOREIGN KEY ("picture_id") REFERENCES "public"."Picture"("id_picture") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Picture_tag" ADD CONSTRAINT "picture_tag_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "public"."Child"("id_child") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Section_activity" ADD CONSTRAINT "section_activity_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "public"."Activity"("id_activity") ON DELETE no action ON UPDATE no action;