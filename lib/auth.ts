import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { readSession, SESSION_COOKIE, sessionCookieOptions, signSession } from "@/lib/session";

export async function requireAdmin() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) redirect("/admin/login");
  try {
    const session = await readSession(token);
    if (!session || session.email !== process.env.ADMIN_EMAIL) redirect("/admin/login");
    return session;
  } catch {
    redirect("/admin/login");
  }
}

export async function login(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!adminEmail || !hash) {
    throw new Error("Login do admin não configurado.");
  }
  const emailOk = email.trim().toLowerCase() === adminEmail.trim().toLowerCase();
  const passwordOk = emailOk && (await bcrypt.compare(password, hash));
  if (!emailOk || !passwordOk) {
    return false;
  }
  const token = await signSession(adminEmail);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, sessionCookieOptions());
  return true;
}

export async function logout() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect("/admin/login");
}
