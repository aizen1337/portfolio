import { z } from "zod";

export const contactFormSchema = z.object({
  inquiryType: z.enum(["employer", "client"]),
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().default(""),
  projectType: z.string().default(""),
  budgetRange: z.string().default(""),
  timeline: z.string().default(""),
  wantsCall: z.boolean().default(false),
  message: z.string().min(20),
  locale: z.enum(["en", "pl"]),
  honeypot: z.string().max(0).default(""),
  turnstileToken: z.string().default(""),
});

export type ContactFormInput = z.input<typeof contactFormSchema>;
export type ContactFormValues = z.infer<typeof contactFormSchema>;
