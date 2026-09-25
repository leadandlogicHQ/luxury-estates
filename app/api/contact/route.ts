import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { sendInquiryEmails } from "@/lib/email";

const EMAIL_RE = /^\S+@\S+\.\S+$/;
const MAX_MESSAGE_LENGTH = 2000;

export async function POST(req: Request) {
  /* 1 — Rate limit: 5 submissions / minute / IP */
  const rl = rateLimit(clientKey(req, "contact"), 5, 60_000);
  if (!rl.success) {
    return NextResponse.json(
      { message: `Too many requests. Try again in ${rl.retryAfterSeconds}s.` },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } },
    );
  }

  try {
    const { firstName, lastName, email, phone, message, propertyId, website } =
      await req.json();

    /* 2 — Honeypot: fake success so bots believe they won */
    if (typeof website === "string" && website.trim() !== "") {
      return NextResponse.json({ message: "Inquiry submitted successfully!" });
    }

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }
    if (typeof email !== "string" || !EMAIL_RE.test(email)) {
      return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
    }
    if (typeof message !== "string" || message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ message: "Message is too long." }, { status: 400 });
    }

    /* Only attach a property reference that actually exists */
    let propertyRef: string | null = null;
    if (typeof propertyId === "string" && propertyId) {
      const exists = await prisma.property.findUnique({
        where: { id: propertyId },
        select: { id: true },
      });
      propertyRef = exists ? exists.id : null;
    }

    await prisma.inquiry.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        message,
        propertyId: propertyRef,
      },
    });

    /* 3 — Fire-and-forget email; never block the response on it */
    sendInquiryEmails({ firstName, lastName, email, message }).catch((err) =>
      console.error("[email] inquiry failed:", err),
    );

    return NextResponse.json({ message: "Inquiry submitted successfully!" });
  } catch {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}