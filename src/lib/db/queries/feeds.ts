
import { db } from "../index";
import { feeds, users } from "../schema"
import { asc, eq, InferSelectModel, sql } from "drizzle-orm";

export type Feed = InferSelectModel<typeof feeds>;
export async function createFeed(name: string, url: string, userId: string): Promise<Feed> {
    try {
        const feed = {
            name: name,
            url: url,
            userId: userId
        };
        
        const [result] = await db
            .insert(feeds)
            .values(feed)
            .returning();
        
        if (!result) {
            throw new Error('Database insert failed - no result returned');
        }
        return result;

    } catch (err: any) {
        // Handle specific PostgreSQL errors
        if (err.code === 'ECONNREFUSED') {
            throw new Error('Database connection failed. Is PostgreSQL running?');
        }
        if (err.code === '23503') { // Foreign key violation
            throw new Error(`User ${userId} does not exist`);
        }
        if (err.code === '23505') { // Unique constraint violation
            throw new Error(`Feed with name '${name}' or URL '${url}' already exists`);
        }
        
        console.error('Database error:', err);
        throw new Error(`Failed to create feed: ${err.message || err}`);
    }
}

export async function getFeeds() {
    const result = await db
                        .select({userName: users.name, feedName: feeds.name, feedUrl: feeds.url})
                        .from(feeds)
                        .innerJoin(users, eq(feeds.userId, users.id))
    return result
}

export async function getFeed(url: string) {
    const [result] = await db
                        .select()
                        .from(feeds)
                        .where(eq(feeds.url, url))
    if (!result) {
        throw new Error(`Feed not found: ${url}`);
    }
    
    return result
}

export async function markFeedFetched(feed: Feed) {
    await db
        .update(feeds)
        .set({
            lastFetchedAt: new Date(),
            updatedAt: new Date()
        })
        .where(eq(feeds.id, feed.id))
}

export async function getNextFeedToFetch(): Promise<Feed | undefined> {
    const  [oldest_feed] = await db.select()
                                    .from(feeds)
                                    .orderBy(sql`${feeds.lastFetchedAt} ASC NULLS FIRST`)
                                    .limit(1)
    return oldest_feed
}