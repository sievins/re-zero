"use server";

import { cookies } from "next/headers";

export async function setCookie(name: string, value: string) {
  const cookieStore = await cookies();

  const expires = new Date(Date.now() + 400 * 24 * 60 * 60 * 1000); // 400 days from now - max expiry time for a cookie

  cookieStore.set({
    name,
    value,
    expires,
    path: "/",
    secure: true,
  });
}

export async function getCookie(name: string) {
  const cookieStore = await cookies();

  return cookieStore.get(name)?.value;
}
