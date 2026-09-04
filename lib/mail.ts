import nodemailer from "nodemailer";
import { site } from "@/lib/site";

export type EnquiryMailInput = {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function buildBodies(input: EnquiryMailInput) {
  const text = [
    "New enquiry from the AGOC website",
    "",
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone}`,
    `Service: ${input.service}`,
    "",
    "Message:",
    input.message,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#1e1e22">
      <h2 style="margin:0 0 12px;color:#C9A227">New website enquiry</h2>
      <p style="margin:0 0 16px">Someone submitted the contact form on agocsecurity.ae.</p>
      <table style="border-collapse:collapse;width:100%;max-width:560px">
        <tr><td style="padding:8px 0;color:#666;width:110px">Name</td><td style="padding:8px 0">${escapeHtml(input.name)}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0"><a href="mailto:${escapeHtml(input.email)}">${escapeHtml(input.email)}</a></td></tr>
        <tr><td style="padding:8px 0;color:#666">Phone</td><td style="padding:8px 0"><a href="tel:${escapeHtml(input.phone)}">${escapeHtml(input.phone)}</a></td></tr>
        <tr><td style="padding:8px 0;color:#666">Service</td><td style="padding:8px 0">${escapeHtml(input.service)}</td></tr>
      </table>
      <p style="margin:20px 0 6px;color:#666">Message</p>
      <p style="margin:0;white-space:pre-wrap">${escapeHtml(input.message)}</p>
    </div>
  `;

  return { text, html };
}

function mailTo() {
  return (
    process.env.MAIL_TO?.trim() ||
    process.env.ENQUIRY_TO?.trim() ||
    site.email
  );
}

/** Hostinger / custom domain mail (e.g. info@agoc.ae). */
function smtpHost() {
  return process.env.SMTP_HOST?.trim() || "smtp.hostinger.com";
}

function smtpConfigured() {
  return Boolean(
    process.env.SMTP_USER?.trim() && process.env.SMTP_PASS?.trim(),
  );
}

function isOutlookSmtp(host: string) {
  const h = host.toLowerCase();
  return (
    h.includes("office365.com") ||
    h.includes("outlook.com") ||
    h.includes("live.com")
  );
}

function isHostingerSmtp(host: string) {
  return host.toLowerCase().includes("hostinger.com");
}

async function sendViaSmtp(input: EnquiryMailInput) {
  const host = smtpHost();
  const port = Number(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER!.trim();
  const pass = process.env.SMTP_PASS!.trim();
  const secure =
    process.env.SMTP_SECURE === "true" || port === 465;
  const from =
    process.env.MAIL_FROM?.trim() ||
    process.env.SMTP_FROM?.trim() ||
    `"AGOC Website" <${user}>`;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    ...(isOutlookSmtp(host) && !secure
      ? { requireTLS: true, tls: { minVersion: "TLSv1.2" } }
      : {}),
    ...(isHostingerSmtp(host) && !secure ? { requireTLS: true } : {}),
  });

  const { text, html } = buildBodies(input);
  await transporter.sendMail({
    from,
    to: mailTo(),
    replyTo: input.email,
    subject: `New enquiry · ${input.service}`,
    text,
    html,
  });
}

async function sendViaResend(input: EnquiryMailInput) {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) throw new Error("RESEND_API_KEY is not set.");

  const from =
    process.env.RESEND_FROM?.trim() ||
    process.env.MAIL_FROM?.trim() ||
    "AGOC Website <onboarding@resend.dev>";

  const { text, html } = buildBodies(input);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [mailTo()],
      reply_to: input.email,
      subject: `New enquiry · ${input.service}`,
      text,
      html,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Resend failed: ${response.status} ${detail}`);
  }
}

export function mailConfigured() {
  return smtpConfigured() || Boolean(process.env.RESEND_API_KEY?.trim());
}

/** Sends enquiry alert via Outlook SMTP to info@agoc.ae (or MAIL_TO). */
export async function sendEnquiryEmail(input: EnquiryMailInput) {
  if (smtpConfigured()) {
    await sendViaSmtp(input);
    return { provider: "outlook-smtp" as const };
  }
  if (process.env.RESEND_API_KEY?.trim()) {
    await sendViaResend(input);
    return { provider: "resend" as const };
  }
  throw new Error(
    "Email is not configured. Set SMTP_USER and SMTP_PASS (Outlook) in .env.local.",
  );
}

export type EnquiryReplyMailInput = {
  toName: string;
  toEmail: string;
  subject: string;
  body: string;
  originalMessage?: string;
  service?: string;
};

function buildReplyBodies(input: EnquiryReplyMailInput) {
  const text = [
    `Dear ${input.toName},`,
    "",
    input.body,
    "",
    "—",
    "AGOC Security",
    site.email,
    ...(input.originalMessage
      ? ["", "———", "Your original message:", input.originalMessage]
      : []),
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.55;color:#1e1e22">
      <p style="margin:0 0 16px">Dear ${escapeHtml(input.toName)},</p>
      <div style="white-space:pre-wrap;margin:0 0 24px">${escapeHtml(input.body)}</div>
      <p style="margin:0;color:#666;font-size:13px">—<br/>AGOC Security<br/><a href="mailto:${escapeHtml(site.email)}">${escapeHtml(site.email)}</a></p>
      ${
        input.originalMessage
          ? `<hr style="border:none;border-top:1px solid #ddd;margin:28px 0 16px" />
             <p style="margin:0 0 8px;color:#888;font-size:12px">Your original message</p>
             <p style="margin:0;white-space:pre-wrap;color:#555;font-size:13px">${escapeHtml(input.originalMessage)}</p>`
          : ""
      }
    </div>
  `;

  return { text, html };
}

async function sendReplyViaSmtp(input: EnquiryReplyMailInput) {
  const host = smtpHost();
  const port = Number(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER!.trim();
  const pass = process.env.SMTP_PASS!.trim();
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const from =
    process.env.MAIL_FROM?.trim() ||
    process.env.SMTP_FROM?.trim() ||
    `"AGOC Security" <${user}>`;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    ...(isOutlookSmtp(host) && !secure
      ? { requireTLS: true, tls: { minVersion: "TLSv1.2" } }
      : {}),
    ...(isHostingerSmtp(host) && !secure ? { requireTLS: true } : {}),
  });

  const { text, html } = buildReplyBodies(input);
  await transporter.sendMail({
    from,
    to: input.toEmail,
    replyTo: mailTo(),
    subject: input.subject,
    text,
    html,
  });
}

async function sendReplyViaResend(input: EnquiryReplyMailInput) {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) throw new Error("RESEND_API_KEY is not set.");

  const from =
    process.env.RESEND_FROM?.trim() ||
    process.env.MAIL_FROM?.trim() ||
    "AGOC Security <onboarding@resend.dev>";

  const { text, html } = buildReplyBodies(input);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [input.toEmail],
      reply_to: mailTo(),
      subject: input.subject,
      text,
      html,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Resend failed: ${response.status} ${detail}`);
  }
}

/** Reply to a website enquiry visitor from the admin inbox. */
export async function sendEnquiryReplyEmail(input: EnquiryReplyMailInput) {
  if (!input.toEmail.trim()) {
    throw new Error("Visitor email is missing.");
  }
  if (!input.subject.trim() || !input.body.trim()) {
    throw new Error("Subject and message are required.");
  }

  if (smtpConfigured()) {
    await sendReplyViaSmtp(input);
    return { provider: "smtp" as const };
  }
  if (process.env.RESEND_API_KEY?.trim()) {
    await sendReplyViaResend(input);
    return { provider: "resend" as const };
  }
  throw new Error(
    "Email is not configured. Set SMTP_USER and SMTP_PASS in .env.local.",
  );
}

export type CareerApplicationMailInput = {
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  experience: string;
  message: string;
};

function buildCareerBodies(input: CareerApplicationMailInput) {
  const text = [
    "New career application from the AGOC website",
    "",
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone}`,
    `Role: ${input.jobTitle}`,
    `Experience: ${input.experience}`,
    "",
    "Message:",
    input.message,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#1e1e22">
      <h2 style="margin:0 0 12px;color:#C9A227">New career application</h2>
      <p style="margin:0 0 16px">Someone applied through the careers page on agocsecurity.ae.</p>
      <table style="border-collapse:collapse;width:100%;max-width:560px">
        <tr><td style="padding:8px 0;color:#666;width:110px">Name</td><td style="padding:8px 0">${escapeHtml(input.name)}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0"><a href="mailto:${escapeHtml(input.email)}">${escapeHtml(input.email)}</a></td></tr>
        <tr><td style="padding:8px 0;color:#666">Phone</td><td style="padding:8px 0"><a href="tel:${escapeHtml(input.phone)}">${escapeHtml(input.phone)}</a></td></tr>
        <tr><td style="padding:8px 0;color:#666">Role</td><td style="padding:8px 0">${escapeHtml(input.jobTitle)}</td></tr>
        <tr><td style="padding:8px 0;color:#666">Experience</td><td style="padding:8px 0">${escapeHtml(input.experience)}</td></tr>
      </table>
      <p style="margin:20px 0 6px;color:#666">Message</p>
      <p style="margin:0;white-space:pre-wrap">${escapeHtml(input.message)}</p>
    </div>
  `;

  return { text, html };
}

/** Notify ops of a careers application. */
export async function sendCareerApplicationEmail(
  input: CareerApplicationMailInput,
) {
  const payload: EnquiryMailInput = {
    name: input.name,
    email: input.email,
    phone: input.phone,
    service: `Careers · ${input.jobTitle}`,
    message: [
      `Experience: ${input.experience}`,
      "",
      input.message,
    ].join("\n"),
  };

  // Reuse SMTP/Resend transport via a careers-specific subject by calling low-level send.
  if (smtpConfigured()) {
    const host = smtpHost();
    const port = Number(process.env.SMTP_PORT || "587");
    const user = process.env.SMTP_USER!.trim();
    const pass = process.env.SMTP_PASS!.trim();
    const secure = process.env.SMTP_SECURE === "true" || port === 465;
    const from =
      process.env.MAIL_FROM?.trim() ||
      process.env.SMTP_FROM?.trim() ||
      `"AGOC Website" <${user}>`;
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      ...(isOutlookSmtp(host) && !secure
        ? { requireTLS: true, tls: { minVersion: "TLSv1.2" } }
        : {}),
      ...(isHostingerSmtp(host) && !secure ? { requireTLS: true } : {}),
    });
    const { text, html } = buildCareerBodies(input);
    await transporter.sendMail({
      from,
      to: mailTo(),
      replyTo: input.email,
      subject: `Career application · ${input.jobTitle}`,
      text,
      html,
    });
    return { provider: "smtp" as const };
  }

  if (process.env.RESEND_API_KEY?.trim()) {
    const key = process.env.RESEND_API_KEY.trim();
    const from =
      process.env.RESEND_FROM?.trim() ||
      process.env.MAIL_FROM?.trim() ||
      "AGOC Website <onboarding@resend.dev>";
    const { text, html } = buildCareerBodies(input);
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [mailTo()],
        reply_to: input.email,
        subject: `Career application · ${input.jobTitle}`,
        text,
        html,
      }),
    });
    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Resend failed: ${response.status} ${detail}`);
    }
    return { provider: "resend" as const };
  }

  void payload;
  throw new Error(
    "Email is not configured. Set SMTP_USER and SMTP_PASS in .env.local.",
  );
}
