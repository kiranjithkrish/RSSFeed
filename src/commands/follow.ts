import { readConfig } from "../config";
import { createFeedFollow, EnrichedFeedFollow, FeedFollow, getFollowedFeeds } from "../lib/db/queries/feedfollow";
import { getFeed } from "../lib/db/queries/feeds";
import { getUser, User } from "../lib/db/queries/users";


export async function handleFollow(mdName: string,user: User, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error('Add follow expects a feed url')
    }
    const feedUrl = args[0];
    const currentUser =  readConfig().currentUserName;
    const feedfollow = await addFollow(feedUrl, user.id)
    if (!feedfollow) {
        throw new Error(`FeedFollow Error:Failed to add feed in DB`)
    }
}

async function addFollow(url: string, userId: string):  Promise<EnrichedFeedFollow | undefined> {
    const feed = await getFeed(url)
    if (!feed) {
        throw new Error('FeedFollow Error: Failed to fetch feed')
    }
    try {
        const feedfollow = await createFeedFollow(userId, feed.id);
        console.log(`✅ FeedFollow: ${feedfollow.userName} is following ${feedfollow.feedName}`);
        return feedfollow
    } catch (err: unknown) {
        if (err instanceof Error){
            console.log(`XXXXX${err.message}`)
        } else {
            console.log(`YYYYY${err}`)
        }
        throw new Error(`Create feed failed!!!`)
    }
}

export async function handleFollowing(cmdName: string,user: User, ...args: string[]) {
    const currentUser =  readConfig().currentUserName;
    const followedFeeds = await getFollowedFeeds(user.id);
    if(!followedFeeds) {
        console.log("Feed Follow Erro: Failed to fetch followed feeds")
    }
    followedFeeds.forEach(feed => {
        console.log(feed.feedName)
    })
}