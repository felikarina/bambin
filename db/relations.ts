import { relations } from "drizzle-orm/relations";
import { user, activity, child, childSection, section, picture, pictureTag, sectionActivity, message } from "./schema";

export const activityRelations = relations(activity, ({one, many}) => ({
	user: one(user, {
		fields: [activity.userId],
		references: [user.idUser]
	}),
	sectionActivities: many(sectionActivity),
}));

export const userRelations = relations(user, ({many}) => ({
	activities: many(activity),
	children: many(child),
	pictures: many(picture),
	messages: many(message),
}));

export const childRelations = relations(child, ({one, many}) => ({
	user: one(user, {
		fields: [child.userId],
		references: [user.idUser]
	}),
	childSections: many(childSection),
	pictureTags: many(pictureTag),
}));

export const childSectionRelations = relations(childSection, ({one}) => ({
	child: one(child, {
		fields: [childSection.childId],
		references: [child.idChild]
	}),
	section: one(section, {
		fields: [childSection.sectionId],
		references: [section.idSection]
	}),
}));

export const sectionRelations = relations(section, ({many}) => ({
	childSections: many(childSection),
	sectionActivities: many(sectionActivity),
}));

export const pictureRelations = relations(picture, ({one, many}) => ({
	user: one(user, {
		fields: [picture.userId],
		references: [user.idUser]
	}),
	pictureTags: many(pictureTag),
}));

export const pictureTagRelations = relations(pictureTag, ({one}) => ({
	picture: one(picture, {
		fields: [pictureTag.pictureId],
		references: [picture.idPicture]
	}),
	child: one(child, {
		fields: [pictureTag.childId],
		references: [child.idChild]
	}),
}));

export const sectionActivityRelations = relations(sectionActivity, ({one}) => ({
	activity: one(activity, {
		fields: [sectionActivity.activityId],
		references: [activity.idActivity]
	}),
	section: one(section, {
		fields: [sectionActivity.sectionId],
		references: [section.idSection]
	}),
}));

export const messageRelations = relations(message, ({one}) => ({
	user: one(user, {
		fields: [message.senderId],
		references: [user.idUser]
	}),
}));