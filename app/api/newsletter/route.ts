import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { sendNewsletterWelcome } from "@/lib/email";

const EMAIL_RE = /^\S+@\S+\.\S+$/;

export async function POST(req: Request) {
  const rl = rateLimit(clientKey(req, "newsletter"), 3, 60_000);
  if (!rl.success) {
    return NextResponse.json(
      { message: `Too many requests. Try again in ${rl.retryAfterSeconds}s.` },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } },
    );
  }

  try {
    const { email, website } = await req.json();

    if (typeof website === "string" && website.trim() !== "") {
      return NextResponse.json({ message: "Subscribed successfully!" });
    }
    if (!email || typeof email !== "string" || !EMAIL_RE.test(email)) {
      return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
    }

    const existing = await prisma.subscriber.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: "You're already on the list." });
    }

    await prisma.subscriber.create({ data: { email } });

    sendNewsletterWelcome(email).catch((err) =>
      console.error("[email] newsletter failed:", err),
    );

    return NextResponse.json({ message: "Subscribed successfully!" });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}