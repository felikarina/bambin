import { pgTable, foreignKey, uuid, timestamp, text, date, smallint } from 'drizzle-orm/pg-core'

export const activity = pgTable(
  'Activity',
  {
    idActivity: uuid('id_activity').defaultRandom().primaryKey().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    title: text(),
    date: date(),
    description: text(),
    category: text(),
    userId: uuid('user_id').defaultRandom(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.idUser],
      name: 'activity_user_id_fkey',
    }),
  ],
)

export const child = pgTable(
  'Child',
  {
    idChild: uuid('id_child').defaultRandom().primaryKey().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    firstname: text(),
    lastname: text(),
    birthDate: date('birth_date'),
    userId: uuid('user_id').defaultRandom(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.idUser],
      name: 'child_user_id_fkey',
    }),
  ],
)

export const childSection = pgTable(
  'Child_section',
  {
    idChildSection: uuid('id_child_section').defaultRandom().primaryKey().notNull(),
    childId: uuid('child_id').defaultRandom().notNull(),
    sectionId: uuid('section_id').defaultRandom(),
  },
  (table) => [
    foreignKey({
      columns: [table.childId],
      foreignColumns: [child.idChild],
      name: 'child_section_child_id_fkey',
    }),
    foreignKey({
      columns: [table.sectionId],
      foreignColumns: [section.idSection],
      name: 'child_section_section_id_fkey',
    }),
  ],
)

export const user = pgTable('User', {
  idUser: uuid('id_user').defaultRandom().primaryKey().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  role: text().default('parent'),
  firstname: text(),
  lastname: text(),
  email: text(),
  password: text(),
})

export const picture = pgTable(
  'Picture',
  {
    idPicture: uuid('id_picture').defaultRandom().primaryKey().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    title: text(),
    date: date(),
    media: text(),
    userId: uuid('user_id').defaultRandom(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.idUser],
      name: 'picture_user_id_fkey',
    }),
  ],
)

export const pictureTag = pgTable(
  'Picture_tag',
  {
    idPicureTag: uuid('id_picure-tag').defaultRandom().primaryKey().notNull(),
    childId: uuid('child_id').defaultRandom().notNull(),
    pictureId: uuid('picture_id').defaultRandom(),
  },
  (table) => [
    foreignKey({
      columns: [table.pictureId],
      foreignColumns: [picture.idPicture],
      name: 'picture_tag_picture_id_fkey',
    }),
    foreignKey({
      columns: [table.childId],
      foreignColumns: [child.idChild],
      name: 'picture_tag_child_id_fkey',
    }),
  ],
)

export const section = pgTable('Section', {
  idSection: uuid('id_section').defaultRandom().primaryKey().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  name: text(),
  year: smallint(),
  numberOfChild: smallint('number_of_child'),
})

export const sectionActivity = pgTable(
  'Section_activity',
  {
    idSectionActivity: uuid('id_section_activity').defaultRandom().primaryKey().notNull(),
    sectionId: uuid('section_id').defaultRandom().notNull(),
    activityId: uuid('activity_id').defaultRandom(),
  },
  (table) => [
    foreignKey({
      columns: [table.activityId],
      foreignColumns: [activity.idActivity],
      name: 'section_activity_activity_id_fkey',
    }),
    foreignKey({
      columns: [table.sectionId],
      foreignColumns: [section.idSection],
      name: 'section_activity_section_id_fkey',
    }),
  ],
)

export const message = pgTable(
  'Message',
  {
    idMessage: uuid('id_message').defaultRandom().primaryKey().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    content: text(),
    senderId: uuid('sender_id').defaultRandom(),
  },
  (table) => [
    foreignKey({
      columns: [table.senderId],
      foreignColumns: [user.idUser],
      name: 'message_sender_id_fkey',
    }),
  ],
)
