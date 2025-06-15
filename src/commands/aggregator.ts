import { readConfig } from "../config";
import { fetchFeed, RSSFeed } from "../feeds";
import { getNextFeedToFetch, markFeedFetched } from "../lib/db/queries/feeds";
import { createPost } from "../lib/db/queries/posts";
import { getUser } from "../lib/db/queries/users";

function logError(context: string) {
    return (err: unknown) => {
        console.error(`${context}:`, err);
    };
}
export async function handleAgg(cmdName: string, ...args: string[]) {
    if(args.length != 1) {
        throw new Error(`agg command needs a duration`)
    }
    const time_between_reqs = args[0]
    const timeBetweenRequests = parseDuration(time_between_reqs)
    console.log(`Collecting feeds every ${time_between_reqs}`)
    scrapeFeeds().catch(logError("Scraping feeds fetch failed with"))
    const fetch_interval = setInterval(() => {
        scrapeFeeds().catch(logError("Scraping feeds fetch failed with"))
    }, timeBetweenRequests);

    await new Promise<void>((resolve) => {
        process.on("SIGINT",  () => {
            console.log("Shutting down feed aggregator...");
            clearInterval(fetch_interval);
            resolve();
        });
    });
}

export async function scrapeFeeds() {
    const next_feed = await getNextFeedToFetch()
    if (!next_feed) {
        throw new Error(`getNextFeedToFetch Error: No more feed to fetch?`)
    }
    await markFeedFetched(next_feed).catch(logError("Marking feed fetched failed"))
    const rssFeed = await fetchFeed(next_feed.url)
    if (!rssFeed) {
        throw new Error(`Failed to fetch the feeds!`)
    }
    console.log(`Scrape field successfully!!`)
    const currentUserName = readConfig().currentUserName;
    const currentUser = await getUser(currentUserName)
    if (currentUser) {
        const savedPosts = await createPost(next_feed.id, currentUser.id, rssFeed)
        console.log(`Posts saved to db successfully`)
    }
}

function logFeeds(feed: RSSFeed) {
    console.log(feed.channel.title)
    console.log(feed.channel.link)
    console.log(feed.channel.description)
    for(const item of feed.channel.item){
        console.log(item.title)
        console.log(item.description)
    }
}


function parseDuration(durationStr: string): number {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex);
    if (!match) {
        throw new Error(`Invalid duration format ${durationStr}`)
    }
    const value = parseInt(match[1], 10);
    const unit = match[2];
    switch(unit) {
        case "ms":
            return value
        case "s":
            return value * 1000
        case "m":
            return value * 60 * 1000
        case "h":
            return value * 60 * 60 * 1000
        default:
            throw new Error(`Unknown unit time ${unit}`)
    }
}
