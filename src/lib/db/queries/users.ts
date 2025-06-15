
import { eq } from "drizzle-orm";
import { db } from "../index";
import { users } from "../schema"
import { InferSelectModel } from "drizzle-orm";

export type User = InferSelectModel<typeof users>;
export async function createUser(name: string) {
    const [result] = await db.insert(users).values( {name: name}).returning();
    return result
}
export async function getUser(name: string): Promise<User | undefined> {
    const [result] = await db
    .select()
    .from(users)
    .where(eq(users.name, name));
    return result
}


export async function getUserForId(userId: string): Promise<User | undefined> {
    const [result] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId));
    return result
}

export async function truncateUsers() {
    await db.delete(users)
}

export async function getUsers(): Promise<User[] | undefined> {
    const result = await db.select().from(users)
    return result
}