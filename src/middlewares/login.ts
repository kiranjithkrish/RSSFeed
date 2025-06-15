import { CommandHandler } from "../commands/commands";
import { readConfig } from "../config";
import { getUser, User } from "../lib/db/queries/users";

    type UserCommandHandler = (
        cmdName: string,
        user: User,
        ...args: string[]
    ) => Promise<void>;

    //export type MiddlewareLoggedIn = (handler: UserCommandHandler) => CommandHandler

    export const middlewareLoggedIn = (handler: UserCommandHandler): CommandHandler => {
         return async (cmdName: string, ...args: string[]) => {
            const currentUser =  readConfig().currentUserName;
            const user = await getUser(currentUser) 
            if (!user) {
                throw new Error(`You are not logged in!`) 
            }
            return await handler(cmdName, user, ...args)
         }
    }

