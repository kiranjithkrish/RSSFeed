import { getFeeds } from "../lib/db/queries/feeds";
import { getUserForId } from "../lib/db/queries/users";
import { readConfig } from "../config"
import { createFeed, Feed } from "../lib/db/queries/feeds";
import { getUser, User } from "../lib/db/queries/users";
import { createFeedFollow } from "../lib/db/queries/feedfollow";

export async function handleFeeds(cmdName: string, ...args:string[]) {
    const result = await getFeeds()
    if (!result) {
        throw new Error('getFeeds failed!')
    }
    result.forEach(row => {
        console.log(row.feedName)
        console.log(row.userName)
        console.log(row.feedUrl)
    })
}

export async function handleAddFeed(cmdName: string,user: User, ...args: string[]) {
    if (args.length !== 2) {
        throw new Error('Add feeds expects a feedname and url')
    }
    const feedName = args[0];
    const feedUrl = args[1];
    const currentUser =  readConfig().currentUserName;
    const feed = await addFeed(feedName, feedUrl, user.id);
    if (!feed) {
        throw new Error(`Failed to add feed in DB`)
    }
    printFeed(feed, user)
}

async function addFeed(name: string, url: string, userId: string):  Promise<Feed | undefined> {
    try {
        console.log(`Creating feed: ${name} for user: ${userId}`);
        const feed = await createFeed(name, url, userId);
        //const feedfollow = await createFeedFollow(userId, feed.id);
        if (!feed) {
            throw new Error('Failed to create feed - no data returned');
        }
        console.log(`✅ Successfully created feed: ${feed.name}`);
        return feed
    } catch (err: unknown) {
        if (err instanceof Error){
            console.log(`Failed ${err.message}`)
        } else {
            console.log(`YYYYY${err}`)
        }
        throw new Error(`Create feed failed!!!`)
    }
}
function printFeed(feed: Feed, user: User) {
    console.log(`${feed.name} \n ${feed.url}}`)
}

