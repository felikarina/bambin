--> statement-breakpoint
-- Drop existing foreign key constraints
ALTER TABLE "Activity" DROP CONSTRAINT IF EXISTS "activity_user_id_fkey";
--> statement-breakpoint
ALTER TABLE "Child" DROP CONSTRAINT IF EXISTS "child_user_id_fkey";
--> statement-breakpoint
ALTER TABLE "Child" DROP CONSTRAINT IF EXISTS "child_user_id2_fkey";
--> statement-breakpoint
ALTER TABLE "Picture" DROP CONSTRAINT IF EXISTS "picture_user_id_fkey";
--> statement-breakpoint
ALTER TABLE "Message" DROP CONSTRAINT IF EXISTS "message_sender_id_fkey";

--> statement-breakpoint
-- Recreate foreign key constraints with ON DELETE SET NULL
ALTER TABLE "Activity" ADD CONSTRAINT "activity_user_id_fkey" 
  FOREIGN KEY ("user_id") REFERENCES "User"("id_user") ON DELETE SET NULL ON UPDATE NO ACTION;
--> statement-breakpoint
ALTER TABLE "Child" ADD CONSTRAINT "child_user_id_fkey" 
  FOREIGN KEY ("user_id") REFERENCES "User"("id_user") ON DELETE SET NULL ON UPDATE NO ACTION;
--> statement-breakpoint
ALTER TABLE "Child" ADD CONSTRAINT "child_user_id2_fkey" 
  FOREIGN KEY ("user_id2") REFERENCES "User"("id_user") ON DELETE SET NULL ON UPDATE NO ACTION;
--> statement-breakpoint
ALTER TABLE "Picture" ADD CONSTRAINT "picture_user_id_fkey" 
  FOREIGN KEY ("user_id") REFERENCES "User"("id_user") ON DELETE SET NULL ON UPDATE NO ACTION;
--> statement-breakpoint
ALTER TABLE "Message" ADD CONSTRAINT "message_sender_id_fkey" 
  FOREIGN KEY ("sender_id") REFERENCES "User"("id_user") ON DELETE SET NULL ON UPDATE NO ACTION; 