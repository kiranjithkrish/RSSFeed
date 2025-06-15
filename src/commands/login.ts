
import { setUser } from "../config";
import { getUser } from "../lib/db/queries/users";
export async function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length !== 1 ) {
        throw new Error('login handler expects a single input username')
    }
    const username = args[0];
    const user = await getUser(username)
    if (!user) {
        throw new Error("You can't login to an account that doesn't exist!")
    }
    setUser(user.name);
    console.log(`${user.name} logged in successfully`)
}
