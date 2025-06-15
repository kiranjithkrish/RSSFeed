
import { pgTable, timestamp, uuid, text, unique } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
id: uuid("id").primaryKey().defaultRandom().notNull(),
createdAt: timestamp("created_at").notNull().defaultNow(),
updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
name: text("name").notNull().unique()
})

export const feeds = pgTable("feeds", {
id: uuid("id").primaryKey().defaultRandom().notNull(),
createdAt: timestamp("created_at").notNull().defaultNow(),
lastFetchedAt: timestamp("last_fetched_at"),
updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
name: text("name").notNull().unique(),
url: text("url").notNull().unique(),
userId: uuid("user_id")
            .notNull()
            .references(() => users.id, {
                onDelete: 'cascade'
            })
});

export const feedFollows = pgTable("feed_follows", {
id: uuid("id").primaryKey().defaultRandom().notNull(),
createdAt: timestamp("created_at").notNull().defaultNow(),
updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
userId: uuid("user_id")
            .notNull()
            .references(() => users.id, {
                onDelete: 'cascade',
            }),
feedId: uuid("feed_id")
                .notNull()
                .references(() => feeds.id, {
                    onDelete: 'cascade'
                })
}, (table) => ([
    // Return array instead of object
    unique('user_feed_unique').on(table.userId, table.feedId)
])

);

export const posts = pgTable("posts", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    title: text("title").notNull(),
    url: text("url").notNull().unique(),
    description: text("description"),
    publishedAt: timestamp("published_at"),
    feedId: uuid("feed_id"),
    userId: uuid("user_id").notNull()
}) 