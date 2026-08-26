import type { Collection } from "mongodb";
import { getDb } from "./db";
import { hashPassword, verifyPassword } from "./password";

export type AdminUser = {
  email: string;
  passwordHash: string;
  role: "admin";
  createdAt: string;
  updatedAt?: string;
};

export async function usersCollection(): Promise<Collection<AdminUser>> {
  return (await getDb()).collection<AdminUser>("users");
}

export async function ensureAdminUser() {
  const users = await usersCollection();
  const count = await users.countDocuments({ role: "admin" });
  if (count > 0) return;
  const email = (process.env.ADMIN_EMAIL || "admin@agocsecurity.ae")
    .trim()
    .toLowerCase();
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
  const user = await users.findOne({
    email: email.toLowerCase(),
    role: "admin",
  });
  if (!user) return null;
  const ok = await verifyPassword(password, user.passwordHash);
  return ok ? user : null;
}

export async function getAdminByEmail(email: string) {
  const users = await usersCollection();
  return users.findOne({ email: email.toLowerCase(), role: "admin" });
}

export async function updateAdminCredentials(input: {
  currentEmail: string;
  currentPassword: string;
  nextEmail?: string;
  nextPassword?: string;
}) {
  const users = await usersCollection();
  const currentEmail = input.currentEmail.trim().toLowerCase();
  const user = await users.findOne({ email: currentEmail, role: "admin" });
  if (!user) {
    throw new Error("Admin account not found.");
  }

  const passwordOk = await verifyPassword(
    input.currentPassword,
    user.passwordHash,
  );
  if (!passwordOk) {
    throw new Error("Current password is incorrect.");
  }

  const nextEmail = (input.nextEmail ?? currentEmail).trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail)) {
    throw new Error("Please enter a valid email address.");
  }

  if (nextEmail !== currentEmail) {
    const taken = await users.findOne({ email: nextEmail, role: "admin" });
    if (taken) {
      throw new Error("That email is already in use.");
    }
  }

  const nextPassword = input.nextPassword?.trim() ?? "";
  if (nextPassword && nextPassword.length < 8) {
    throw new Error("New password must be at least 8 characters.");
  }

  const patch: Partial<AdminUser> = {
    email: nextEmail,
    updatedAt: new Date().toISOString(),
  };
  if (nextPassword) {
    patch.passwordHash = await hashPassword(nextPassword);
  }

  await users.updateOne(
    { email: currentEmail, role: "admin" },
    { $set: patch },
  );
  return { email: nextEmail };
}
