import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { sendShortlistEmail } from "@/lib/email";

export async function POST(req: Request) {
  const rl = rateLimit(clientKey(req, "shortlist"), 3, 60_000);
  if (!rl.success) {
    return NextResponse.json(
      { message: `Too many requests. Try again in ${rl.retryAfterSeconds}s.` },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } },
    );
  }

  try {
    const { email, items, website } = (await req.json()) as {
      email?: string;
      items?: { id: string; title: string; price?: number }[];
      website?: string;
    };

    if (typeof website === "string" && website.trim() !== "") {
      return NextResponse.json({ message: "Request received — your shortlist is on its way." });
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: "Your shortlist is empty." }, { status: 400 });
    }

    const summary = items
      .map((item, i) => `${i + 1}. ${item.title}${item.price ? ` — $${item.price.toLocaleString()}` : ""}`)
      .join("\n");

    await prisma.$transaction([
      prisma.subscriber.upsert({ where: { email }, update: {}, create: { email } }),
      prisma.inquiry.create({
        data: {
          firstName: "Shortlist",
          lastName: "Request",
          email,
          message: `Shortlist request (${items.length} saved ${items.length === 1 ? "home" : "homes"}):\n${summary}\n\nPlease send me this shortlist with latest availability and pricing.`,
        },
      }),
    ]);

    sendShortlistEmail(email, items).catch((err) =>
      console.error("[email] shortlist failed:", err),
    );

    return NextResponse.json({ message: "Request received — your shortlist is on its way." });
  } catch {
    return NextResponse.json({ message: "Something went wrong. Please try again." }, { status: 500 });
  }
}