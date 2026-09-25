import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM =
  process.env.EMAIL_FROM || "Luxury Estates <onboarding@resend.dev>";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

if (!ADMIN_EMAIL) {
  console.warn(
    "[email] ADMIN_EMAIL not set — admin notifications will be skipped"
  );
}

const SITE = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");

/*
 * Luxury Estates — Email Design System
 * ------------------------------------
 * Every email follows the same hierarchy:
 *
 * 01 Context
 * 02 Most important information
 * 03 Clear next action
 * 04 Reassurance / supporting detail
 *
 * The visual system intentionally stays restrained because email clients
 * have inconsistent CSS support. Tables, inline styles, soft borders,
 * editorial typography and a small number of meaningful cues are used
 * instead of decorative effects.
 */

/* Escape all user-provided content before inserting it into HTML. */
const esc = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character] as string,
  );

const nl2br = (value: string) => esc(value).replace(/\r?\n/g, "<br />");

const shell = (content: string, preheader = "") => `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>Luxury Estates</title>

    ${preheader
    ? `<style>
            .preheader {
              display:none !important;
              visibility:hidden;
              opacity:0;
              color:transparent;
              height:0;
              width:0;
              overflow:hidden;
              mso-hide:all;
            }

            @media only screen and (max-width: 620px) {
              .page-pad {
                padding-left: 10px !important;
                padding-right: 10px !important;
              }

              .content-pad {
                padding-left: 22px !important;
                padding-right: 22px !important;
              }

              .footer-pad {
                padding-left: 22px !important;
                padding-right: 22px !important;
              }

              .mobile-heading {
                font-size: 25px !important;
              }
            }
          </style>`
    : ""
  }
  </head>

  <body
    style="
      margin:0;
      padding:0;
      background:#f7f4ee;
      color:#2f2b27;
      font-family:Arial,Helvetica,sans-serif;
      -webkit-font-smoothing:antialiased;
    "
  >
    ${preheader
    ? `<span class="preheader">${esc(preheader)}</span>`
    : ""
  }

    <table
      role="presentation"
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="
        width:100%;
        border-collapse:collapse;
        background:#f7f4ee;
      "
    >
      <tr>
        <td
          class="page-pad"
          align="center"
          style="padding:30px 16px 40px;"
        >
          <table
            role="presentation"
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="
              width:100%;
              max-width:620px;
              border-collapse:collapse;
              background:#ffffff;
              border:1px solid #e5ded2;
            "
          >
            <!-- Brand -->
            <tr>
              <td
                style="
                  padding:23px 30px 21px;
                  background:#171717;
                  border-bottom:1px solid #292929;
                "
              >
                <div
                  style="
                    font-family:Georgia,'Times New Roman',serif;
                    font-size:21px;
                    font-weight:bold;
                    line-height:1.2;
                    letter-spacing:-0.2px;
                    color:#ffffff;
                  "
                >
                  Luxury Estates
                  <span
                    style="
                      display:inline-block;
                      width:6px;
                      height:6px;
                      margin-left:6px;
                      border-radius:50%;
                      background:#c8a45d;
                      vertical-align:middle;
                    "
                  ></span>
                </div>

                <div
                  style="
                    margin-top:6px;
                    font-size:9px;
                    font-weight:bold;
                    line-height:1.4;
                    letter-spacing:2px;
                    text-transform:uppercase;
                    color:#aca59d;
                  "
                >
                  Private property advisory
                </div>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td
                class="content-pad"
                style="
                  padding:36px 30px 34px;
                  background:#ffffff;
                "
              >
                ${content}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="footer-pad"
                style="
                  padding:16px 30px 18px;
                  border-top:1px solid #e5ded2;
                  background:#fbfaf7;
                "
              >
                <p
                  style="
                    margin:0;
                    font-size:10px;
                    line-height:1.7;
                    color:#746d64;
                  "
                >
                  © ${new Date().getFullYear()} Luxury Estates · 123 Rodeo Drive, Beverly Hills, CA
                </p>

                <p
                  style="
                    margin:5px 0 0;
                    font-size:10px;
                    line-height:1.7;
                    color:#9a9389;
                  "
                >
                  This message relates to an action taken on the Luxury Estates website.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

const eyebrow = (text: string) =>
  `<p
    style="
      margin:0 0 9px;
      font-size:9px;
      font-weight:bold;
      line-height:1.4;
      letter-spacing:2px;
      text-transform:uppercase;
      color:#a9843d;
    "
  >${esc(text)}</p>`;

const heading = (text: string) =>
  `<h1
    class="mobile-heading"
    style="
      margin:0;
      font-family:Georgia,'Times New Roman',serif;
      font-size:30px;
      font-weight:bold;
      line-height:1.15;
      letter-spacing:-0.4px;
      color:#171717;
    "
  >${esc(text)}</h1>`;

const paragraph = (
  text: string,
  options: { last?: boolean; muted?: boolean } = {},
) =>
  `<p
    style="
      margin:${options.last ? "0" : "0 0 16px"};
      font-size:14px;
      line-height:1.75;
      color:${options.muted ? "#746d64" : "#2f2b27"};
    "
  >${text}</p>`;

const divider = () =>
  `<div
    style="
      height:1px;
      margin:28px 0;
      background:#e5ded2;
    "
  ></div>`;

const accentRule = () =>
  `<div
    style="
      width:42px;
      height:2px;
      margin:15px 0 20px;
      background:#c8a45d;
    "
  ></div>`;

const infoPanel = (content: string) =>
  `<table
    role="presentation"
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
      width:100%;
      margin:22px 0;
      border-collapse:collapse;
      background:#f7f4ee;
      border-left:2px solid #c8a45d;
    "
  >
    <tr>
      <td style="padding:17px 19px;">
        ${content}
      </td>
    </tr>
  </table>`;

const btn = (href: string, label: string) =>
  `<a
    href="${esc(href)}"
    style="
      display:inline-block;
      background:#171717;
      color:#ffffff;
      text-decoration:none;
      padding:13px 22px;
      font-size:11px;
      font-weight:bold;
      line-height:1.2;
      letter-spacing:1px;
      text-transform:uppercase;
    "
  >${esc(label)}<span style="color:#c8a45d;margin-left:8px;">→</span></a>`;

const goldBtn = (href: string, label: string) =>
  `<a
    href="${esc(href)}"
    style="
      display:inline-block;
      background:#c8a45d;
      color:#171717;
      text-decoration:none;
      padding:13px 22px;
      font-size:11px;
      font-weight:bold;
      line-height:1.2;
      letter-spacing:1px;
      text-transform:uppercase;
    "
  >${esc(label)}</a>`;

const metaRow = (label: string, value: string) =>
  `<tr>
    <td
      style="
        padding:11px 0;
        border-bottom:1px solid #e5ded2;
        font-size:11px;
        line-height:1.5;
        color:#746d64;
      "
    >
      ${esc(label)}
    </td>
    <td
      align="right"
      style="
        padding:11px 0 11px 15px;
        border-bottom:1px solid #e5ded2;
        font-size:12px;
        font-weight:bold;
        line-height:1.5;
        color:#171717;
      "
    >
      ${esc(value)}
    </td>
  </tr>`;

async function send(to: string, subject: string, html: string) {
  if (!resend) {
    console.log(`[email:skipped] to=${to} subject=${subject}`);
    return;
  }

  try {
    const result = await resend.emails.send({
      from: FROM,
      to,
      subject,
      html,
    });

    if (result.error) {
      console.warn(
        `[email:failed] to=${to} subject="${subject}":`,
        result.error,
      );
    }
  } catch (error) {
    console.warn(
      `[email:failed] to=${to} subject="${subject}":`,
      error,
    );
  }
}

/* ─────────────────────────────────────────────
   Contact form
   ───────────────────────────────────────────── */

export async function sendInquiryEmails(p: {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}) {
  const fullName = `${esc(p.firstName)} ${esc(p.lastName)}`;

  const adminHtml = shell(
    `
      ${eyebrow("New inquiry")}
      ${heading("A client request needs attention.")}
      ${accentRule()}

      ${paragraph(
      "A new request has arrived through the Luxury Estates website. Review the details below and follow up from the inquiry desk.",
    )}

      <table
        role="presentation"
        width="100%"
        cellpadding="0"
        cellspacing="0"
        border="0"
        style="width:100%;border-collapse:collapse;"
      >
        ${metaRow("Client", fullName)}
        ${metaRow("Email", esc(p.email))}
      </table>

      ${infoPanel(`
        <p
          style="
            margin:0 0 8px;
            font-size:9px;
            font-weight:bold;
            line-height:1.4;
            letter-spacing:1.6px;
            text-transform:uppercase;
            color:#a9843d;
          "
        >
          Client message
        </p>

        <p
          style="
            margin:0;
            font-size:14px;
            line-height:1.75;
            color:#2f2b27;
          "
        >
          ${nl2br(p.message)}
        </p>
      `)}

      ${paragraph(
      "The next action is to review the inquiry, confirm the request context, and respond.",
      { last: true, muted: true },
    )}

      <div style="margin-top:22px;">
        ${goldBtn(`${SITE}/admin/inquiries`, "Open Inquiry Desk")}
      </div>
    `,
    `New inquiry from ${p.firstName} ${p.lastName}`,
  );

  const clientHtml = shell(
    `
      ${eyebrow("Request received")}
      ${heading("Thank you for reaching out.")}
      ${accentRule()}

      ${paragraph(`Dear ${esc(p.firstName)},`)}

      ${paragraph(
      "Your request has been received and is now with our team. An advisor will respond within <strong>2 hours</strong> during office hours.",
    )}

      ${infoPanel(`
        <p
          style="
            margin:0;
            font-size:13px;
            line-height:1.7;
            color:#2f2b27;
          "
        >
          <strong style="color:#171717;">What happens next</strong><br />
          An advisor reviews your request, prepares the relevant context, and follows up with the next practical step.
        </p>
      `)}

      ${paragraph(
      "You can continue exploring the collection while we prepare your response.",
      { last: true, muted: true },
    )}

      <div style="margin-top:22px;">
        ${btn(`${SITE}/listings`, "Browse Properties")}
      </div>

      ${divider()}

      <p
        style="
          margin:0;
          font-size:10px;
          line-height:1.65;
          color:#8c857b;
        "
      >
        Demonstration platform engineered by <strong>LeadAndLogic</strong>. Interested in bespoke growth infrastructure for your brand? Reply directly to this email.
      </p>
    `,
    "Your Luxury Estates request has been received.",
  );

  const promises = [
    send(
      p.email,
      "We've received your request — Luxury Estates",
      clientHtml,
    ),
  ];

  if (ADMIN_EMAIL) {
    promises.push(
      send(
        ADMIN_EMAIL,
        `New inquiry — ${p.firstName} ${p.lastName}`,
        adminHtml,
      )
    );
  }

  await Promise.allSettled(promises);
}

/* ─────────────────────────────────────────────
   Newsletter welcome
   ───────────────────────────────────────────── */

export async function sendNewsletterWelcome(email: string) {
  await send(
    email,
    "Welcome to Luxury Estates private updates",
    shell(
      `
        ${eyebrow("Private updates")}
        ${heading("You're on the list.")}
        ${accentRule()}

        ${paragraph(
        "From now on you'll receive new listings, notable residences, and selected market insights — curated, never crowded.",
        { last: true },
      )}

        ${infoPanel(`
          <p
            style="
              margin:0 0 10px;
              font-size:9px;
              font-weight:bold;
              line-height:1.4;
              letter-spacing:1.6px;
              text-transform:uppercase;
              color:#a9843d;
            "
          >
            What to expect
          </p>

          <p
            style="
              margin:0;
              font-size:13px;
              line-height:1.7;
              color:#2f2b27;
            "
          >
            New residences<br />
            Selected market insights<br />
            Considered updates
          </p>
        `)}

        ${paragraph(
        "Your inbox should feel useful, not crowded. We'll keep the updates focused.",
        { last: true, muted: true },
      )}

        <div style="margin-top:22px;">
          ${btn(`${SITE}/listings`, "Explore the Collection")}
        </div>
      `,
      "Welcome to Luxury Estates private updates.",
    ),
  );
}

/* ─────────────────────────────────────────────
   Shortlist delivery
   ───────────────────────────────────────────── */

export async function sendShortlistEmail(
  email: string,
  items: { id: string; title: string; price?: number }[],
) {
  const rows = items
    .map(
      (item, index) => `
        <tr>
          <td
            valign="top"
            style="
              width:28px;
              padding:14px 12px 14px 0;
              border-bottom:1px solid #e5ded2;
              font-family:Georgia,'Times New Roman',serif;
              font-size:14px;
              color:#a9843d;
            "
          >
            ${String(index + 1).padStart(2, "0")}
          </td>

          <td
            style="
              padding:14px 0;
              border-bottom:1px solid #e5ded2;
            "
          >
            <a
              href="${esc(`${SITE}/property/${item.id}`)}"
              style="
                color:#171717;
                text-decoration:none;
                font-family:Georgia,'Times New Roman',serif;
                font-size:15px;
                font-weight:bold;
                line-height:1.45;
              "
            >
              ${esc(item.title)}
            </a>

            ${item.price
          ? `<div
                    style="
                      margin-top:4px;
                      font-size:11px;
                      line-height:1.5;
                      color:#746d64;
                    "
                  >$${item.price.toLocaleString()}</div>`
          : ""
        }
          </td>
        </tr>
      `,
    )
    .join("");

  await send(
    email,
    `Your Luxury Estates shortlist (${items.length} ${items.length === 1 ? "home" : "homes"
    })`,
    shell(
      `
        ${eyebrow("Saved residences")}
        ${heading("Your shortlist is ready.")}
        ${accentRule()}

        ${paragraph(
        `You saved ${items.length} ${items.length === 1 ? "residence" : "residences"
        } to revisit at your own pace.`,
        { last: true },
      )}

        <table
          role="presentation"
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            width:100%;
            margin-top:24px;
            border-collapse:collapse;
          "
        >
          ${rows}
        </table>

        ${paragraph(
        "Select a residence above to return directly to its property page.",
        { last: true, muted: true },
      )}

        <div style="margin-top:22px;">
          ${btn(`${SITE}/listings`, "Continue Exploring")}
        </div>
      `,
      `Your Luxury Estates shortlist contains ${items.length} ${items.length === 1 ? "home" : "homes"
      }.`,
    ),
  );
}