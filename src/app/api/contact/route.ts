import { NextResponse } from "next/server";
import { Resend } from "resend";
import { inquiries } from "@/db/schema";
import { requireDatabase } from "@/lib/data";
import { getNotificationEmail } from "@/lib/env";
import { contactFormSchema } from "@/lib/validation";

async function verifyTurnstile(token?: string) {
  if (!process.env.TURNSTILE_SECRET_KEY) {
    return true;
  }

  if (!token) {
    return false;
  }

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token,
    }),
  });

  const payload = (await response.json()) as { success?: boolean };
  return Boolean(payload.success);
}

async function sendNotificationEmail(values: {
  inquiryType: string;
  name: string;
  email: string;
  company?: string;
  projectType?: string;
  budgetRange?: string;
  timeline?: string;
  wantsCall: boolean;
  message: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    return;
  }

  const to = getNotificationEmail();
  if (!to) {
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: process.env.RESEND_FROM ?? "Portfolio <onboarding@resend.dev>",
    to,
    subject: `New ${values.inquiryType} inquiry from ${values.name}`,
    text: [
      `Name: ${values.name}`,
      `Email: ${values.email}`,
      `Company: ${values.company || "-"}`,
      `Project type: ${values.projectType || "-"}`,
      `Budget: ${values.budgetRange || "-"}`,
      `Timeline: ${values.timeline || "-"}`,
      `Wants call: ${values.wantsCall ? "yes" : "no"}`,
      "",
      values.message,
    ].join("\n"),
  });
}

export async function POST(request: Request) {
  const payload = await request.json();
  const parsed = contactFormSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid form submission.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  if (parsed.data.honeypot) {
    return NextResponse.json({ error: "Spam detected." }, { status: 400 });
  }

  const turnstilePassed = await verifyTurnstile(parsed.data.turnstileToken);
  if (!turnstilePassed) {
    return NextResponse.json({ error: "Turnstile verification failed." }, { status: 400 });
  }

  try {
    await requireDatabase()
      .insert(inquiries)
      .values({
        inquiryType: parsed.data.inquiryType,
        name: parsed.data.name,
        email: parsed.data.email,
        company: parsed.data.company || null,
        projectType: parsed.data.projectType || null,
        budgetRange: parsed.data.budgetRange || null,
        timeline: parsed.data.timeline || null,
        wantsCall: parsed.data.wantsCall,
        message: parsed.data.message,
        locale: parsed.data.locale,
        status: "new",
      });

    await sendNotificationEmail(parsed.data);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Contact form is not fully configured yet.",
      },
      { status: 503 }
    );
  }
}
