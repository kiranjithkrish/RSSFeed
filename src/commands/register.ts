
import { setUser } from "../config";
import { createUser } from "../lib/db/queries/users";
import { PostgresErrorCode } from "../lib/db/errors";

export async function handlerRegister(cmdName: string, ...args: string[]) {
    if (args.length !== 1 ) {
        throw new Error('Register handler expects a single input username')
    }
    const username = args[0];
   
    try {
        const user = await createUser(username)
        setUser(user.name);
        console.log(`${user.name} has been created successfully`)
    } catch(err: unknown) {
        if (
            err &&
            typeof err === "object" &&
            "code" in err &&
            (err as any).code === PostgresErrorCode.UniqueViolation
        ) {
            console.error("A user with that name already exists.");
            return undefined;
        } else {
        console.error(`User creation failed: ${err}`)
        }

        return;
    }
   
}