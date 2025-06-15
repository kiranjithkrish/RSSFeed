import { deleteFeedFollow } from "../lib/db/queries/feedfollow";
import { User } from "../lib/db/queries/users";

export async function handleUnfollowFeed(cmdName: string, user: User, ...args: string[]) {
    if (args.length != 1) {
        throw new Error(`Delete expects feed url`)
    }
    const feedUrl = args[0]
    const result = await deleteFeedFollow(user, feedUrl)
    if(!result) {
        throw new Error(`Unfollow feed failed for ${user.name}`)
    }
}