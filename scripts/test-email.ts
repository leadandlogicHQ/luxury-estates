/* scripts/test-email.ts */
import { readFileSync } from "node:fs";
import { Resend } from "resend";

/* Minimal .env loader */
for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m && !process.env[m[1]]) {
    process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

async function main() {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "onboarding@resend.dev";
  const to = process.env.ADMIN_EMAIL;

  if (!key) throw new Error("❌ RESEND_API_KEY missing in .env");
  if (!to) throw new Error("❌ ADMIN_EMAIL missing in .env");

  // DEBUG: Print exactly what we are sending to Resend
  console.log("🔍 Sending FROM:", `"${from}"`);
  console.log("🔍 Sending TO:", `"${to}"`);

  const resend = new Resend(key);
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject: "✅ Luxury Estates — delivery test",
    html: "<p>If you can read this, Resend delivery works end-to-end.</p>",
  });

  if (error) throw new Error(`❌ Resend rejected it: ${error.message}`);
  console.log("✅ Accepted by Resend — id:", data?.id);
  console.log("🎉 Success! Check your inbox (and spam folder).");
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});