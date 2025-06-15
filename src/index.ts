
import { handleAgg } from './commands/aggregator';
import { handleBrowse } from './commands/browse';
import { CommandsRegistry, runCommand, registerCommand } from './commands/commands';
import { handleAddFeed, handleFeeds } from './commands/feeds';
import { handleFollow, handleFollowing } from './commands/follow';
import { handlerLogin } from './commands/login';
import { handlerRegister } from './commands/register';
import { handlerReset } from './commands/reset';
import { handleUnfollowFeed } from './commands/unfollow';
import { handleUsers } from './commands/users';
import { middlewareLoggedIn } from './middlewares/login';

async function main() {
    const args = process.argv.slice(2)
    if (args.length === 0) {
        console.log("Provide arguments!")
        process.exit(1);
    }
    const commandName = args[0];
    const commandArgs = args.slice(1)



    const commandsReg: CommandsRegistry = {}
    registerCommand(commandsReg, "login", handlerLogin)
    registerCommand(commandsReg, "register", handlerRegister)
    registerCommand(commandsReg, "reset", handlerReset)
    registerCommand(commandsReg, "users", handleUsers)
    registerCommand(commandsReg, "agg", handleAgg)
    registerCommand(commandsReg, "addfeed", middlewareLoggedIn(handleAddFeed))
    registerCommand(commandsReg, "feeds", handleFeeds)
    registerCommand(commandsReg, "follow", middlewareLoggedIn(handleFollow))
    registerCommand(commandsReg, "following",  middlewareLoggedIn(handleFollowing))
    registerCommand(commandsReg, "unfollow", middlewareLoggedIn(handleUnfollowFeed))
    registerCommand(commandsReg, "browse", middlewareLoggedIn(handleBrowse))

    try {
        await runCommand(commandsReg, commandName, ...commandArgs)
    } catch(err) {
        if( err instanceof Error) {
            console.log(`Error running command ${commandName}: ${err.message}`)
        } else {
            console.log(`Error running command ${commandName}: ${err}`)
        } 
         process.exit(1)
    }

}


await main();
process.exit(0)
