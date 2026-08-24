import type { Collection } from "mongodb";
import { getDb } from "./db";
import { hashPassword, verifyPassword } from "./password";

export type AdminUser = {
  email: string;
  passwordHash: string;
  role: "admin";
  createdAt: string;
};

export async function usersCollection(): Promise<Collection<AdminUser>> {
  return (await getDb()).collection<AdminUser>("users");
}

export async function ensureAdminUser() {
  const users = await usersCollection();
  const count = await users.countDocuments({ role: "admin" });
  if (count > 0) return;
  const email = (process.env.ADMIN_EMAIL || "admin@agocsecurity.ae").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "AgocAdmin2026";
  await users.insertOne({
    email,
    passwordHash: await hashPassword(password),
    role: "admin",
    createdAt: new Date().toISOString(),
  });
}

export async function authenticateAdmin(email: string, password: string) {
  const users = await usersCollection();
  const user = await users.findOne({ email: email.toLowerCase(), role: "admin" });
  if (!user) return null;
  const ok = await verifyPassword(password, user.passwordHash);
  return ok ? user : null;
}
