import { readConfig } from "../config";
import { getUsers } from "../lib/db/queries/users";

export async function handleUsers(cmdName: string, ...args: string[]) {
    try {
        const users = await getUsers();
        if (!users) {
            throw new Error("Failed to get users")
        }
        const userNames = users.map(user => user.name)
        const currentUser = readConfig().currentUserName;
        for(const name of userNames) {
            const message = (name === currentUser) ? `* ${name} (current)` : `* ${name}`
            console.log(message)
        }
    } catch(err: unknown) {
         if(err instanceof Error) {
            console.log(`Failed to get users: ${err.message}`)
        } else {
            console.log(`Failed to get users: ${err}`)
        }
        return
    }
}