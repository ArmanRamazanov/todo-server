import db from "@/profile/data/db.js";
import type { UpdateInput, userWithoutPassword } from "@/types/User.types.js";

export async function getProfile(
  userId: string,
): Promise<Pick<userWithoutPassword, "profile">> {
  return await db.getProfile(userId);
}

export async function changeProfile(
  userId: string,
  input: UpdateInput,
): Promise<Pick<userWithoutPassword, "profile">> {
  return await db.changeProfile(userId, input);
}
