"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { setSessionCookie } from "@/lib/session";

export async function loginAction(formData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    redirect("/login?error=" + encodeURIComponent("Email dan kata sandi wajib diisi."));
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    redirect("/login?error=" + encodeURIComponent("Email atau kata sandi salah."));
  }

  const cocok = await bcrypt.compare(password, user.password);
  if (!cocok) {
    redirect("/login?error=" + encodeURIComponent("Email atau kata sandi salah."));
  }

  setSessionCookie(user);
  redirect("/dashboard");
}
