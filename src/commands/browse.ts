import { getPostsForUser } from "../lib/db/queries/posts"
import { User } from "../lib/db/queries/users"


export async function handleBrowse(cmdName: string, user: User, ...args: string[]) {
    let limit = 2
    if (args.length > 0) {
        limit = parseInt(args[0], 10)
    }
    const posts = await getPostsForUser(user, limit)
    if (!posts) {
        throw new Error(`Failed to get posts for ${user.name}`)
    }
    posts.forEach(post => {
        console.log(post.title)
    })
}