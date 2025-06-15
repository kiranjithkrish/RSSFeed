import { db } from "../index";
import { feedFollows, feeds, users } from "../schema"
import { and, eq, InferSelectModel } from "drizzle-orm";
import { Feed, getFeed } from "./feeds";
import { User } from "./users";
import { error } from "console";

export type FeedFollow = InferSelectModel<typeof feedFollows>;


export async function createFeedFollow(userId: string, feedId: string): Promise<EnrichedFeedFollow> {
    const input = {
        userId: userId,
        feedId: feedId
    }
    try {
        const [newFollow] = await db
                            .insert(feedFollows)
                            .values(input)
                            .returning()
        const [enrichedResult] = await db
                                    .select({
                                        id: feedFollows.id,
                                        userId: feedFollows.userId,
                                        feedId: feedFollows.feedId,
                                        createdAt: feedFollows.createdAt,
                                        updatedAt: feedFollows.updatedAt,
                                        userName: users.name,
                                        feedName: feeds.name
                                    })
                                    .from(feedFollows)
                                    .innerJoin(users, eq(feedFollows.userId, users.id))
                                    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
                                    .where(eq(feedFollows.id, newFollow.id))
        return enrichedResult
    } catch (err: any) {
        if (err.code === '23505') { // Unique constraint violation
            throw new Error('User is already following this feed');
        }
        if (err.code === '23503') { // Foreign key violation
            throw new Error('User or feed does not exist');
        }
        console.log(err)
        throw err;
    }

}

export async function getFollowedFeeds(userId: string) {
    try {
        // const result = await db.execute(sql`
        //     SELECT name AS feed_name
        //     FROM feeds
        //     WHERE user_id = ${userId}
        //     UNION
        //     SELECT f.name AS feed_name
        //     FROM feeds f
        //     INNER JOIN feed_follows ff ON f.id = ff.feed_id
        //     WHERE ff.user_id = ${userId}
        //     ORDER BY feed_name
        // `);
        const result = await db
                            .select({
                                id: feedFollows.id,
                                userName: users.name,
                                feedName: feeds.name
                            })
                            .from(feedFollows)
                            .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
                            .innerJoin(users, eq(feedFollows.userId, users.id))
                            .where(eq(feedFollows.userId, userId))
        if(!result) {
            throw new Error('Feed Follow Error: Failed to fetch feeds for user id')
        }
        return result
    } catch (err: any) {
        if (err.code === '23505') { // Unique constraint violation
            throw new Error('User is already following this feed');
        }
        if (err.code === '23503') { // Foreign key violation
            throw new Error('User or feed does not exist');
        }
        throw err;
    }
}

export async function deleteFeedFollow(user: User, feedUrl: string) {
    try {
        const feed = await getFeed(feedUrl)
        const [deletedFollow]  = await  db.delete(feedFollows).where(
            and(
                eq(feedFollows.userId, user.id),
                eq(feedFollows.feedId, feed.id)
            )
        ).returning()
        if(!deleteFeedFollow) {
            throw new Error("Failed to delete from DB")
        }
        return deletedFollow
    } catch(err) {
        console.log(`Error in delete feed request failed: ${err}`)
        throw err;
    }
    

}

export type EnrichedFeedFollow = {
    id: string;
    userId: string;
    feedId: string;
    createdAt: Date;
    updatedAt: Date;
    userName: string;    
    feedName: string; 
}