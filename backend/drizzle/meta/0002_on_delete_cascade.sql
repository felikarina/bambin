-- Enable ON DELETE CASCADE on junction tables

-- Child_section.child_id -> Child.id_child
ALTER TABLE "Child_section" DROP CONSTRAINT IF EXISTS "child_section_child_id_fkey";
ALTER TABLE "Child_section" ADD CONSTRAINT "child_section_child_id_fkey"
  FOREIGN KEY ("child_id") REFERENCES "Child"("id_child") ON DELETE CASCADE ON UPDATE NO ACTION;

-- Picture_tag.picture_id -> Picture.id_picture
ALTER TABLE "Picture_tag" DROP CONSTRAINT IF EXISTS "picture_tag_picture_id_fkey";
ALTER TABLE "Picture_tag" ADD CONSTRAINT "picture_tag_picture_id_fkey"
  FOREIGN KEY ("picture_id") REFERENCES "Picture"("id_picture") ON DELETE CASCADE ON UPDATE NO ACTION;

-- Section_activity.activity_id -> Activity.id_activity
ALTER TABLE "Section_activity" DROP CONSTRAINT IF EXISTS "section_activity_activity_id_fkey";
ALTER TABLE "Section_activity" ADD CONSTRAINT "section_activity_activity_id_fkey"
  FOREIGN KEY ("activity_id") REFERENCES "Activity"("id_activity") ON DELETE CASCADE ON UPDATE NO ACTION;


