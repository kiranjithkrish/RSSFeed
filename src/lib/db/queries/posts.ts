import { db } from "..";
import { RSSFeed, RSSItem } from "../../../feeds";
import { posts } from "../schema";
import { Feed } from "./feeds";
import { User } from "./users";
import { desc, eq } from "drizzle-orm";

export async  function createPost(feedId: string, userId: string, rssFeed: RSSFeed) {
    const currentFeedId = feedId
    const currentUserId = userId
    const postsRows = rssFeed.channel.item.map(row => ({
        title: row.title,
        url: row.link,
        description: row.description,
        publishedAt: new Date(row.pubDate),
        feedId: currentFeedId,
        userId: currentUserId
    }))
  
    const result = await db
                        .insert(posts)
                        .values(postsRows)
                        .onConflictDoNothing()
                        .returning()
    return result
}

export async function getPostsForUser(user: User, limit: number) {
    const userPosts = await db
            .select()
            .from(posts)
            .where(eq(posts.userId, user.id))
            .orderBy(desc(posts.createdAt))
            .limit(limit)
    return userPosts
}