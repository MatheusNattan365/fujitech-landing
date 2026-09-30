import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "fujitech_session";

function secretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET não configurada");
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(email: string) {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(email)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey());
}

export async function readSession(token: string) {
  const { payload } = await jwtVerify(token, secretKey());
  const email = typeof payload.email === "string" ? payload.email : payload.sub;
  if (!email) return null;
  return { email };
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}
