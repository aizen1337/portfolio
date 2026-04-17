"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Locale } from "@/lib/types";
import {
  contactFormSchema,
  type ContactFormInput,
  type ContactFormValues,
} from "@/lib/validation";

export function ContactForm({
  locale,
  calendlyUrl,
}: {
  locale: Locale;
  calendlyUrl: string | null;
}) {
  const t = useTranslations("contact");
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      inquiryType: "client",
      name: "",
      email: "",
      company: "",
      projectType: "",
      budgetRange: "",
      timeline: "",
      wantsCall: false,
      message: "",
      locale,
      honeypot: "",
      turnstileToken: "",
    },
  });
  const wantsCall = useWatch({
    control: form.control,
    name: "wantsCall",
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      toast.error(t("error"));
      return;
    }

    setSubmitted(true);
    form.reset({
      ...form.getValues(),
      name: "",
      email: "",
      company: "",
      projectType: "",
      budgetRange: "",
      timeline: "",
      message: "",
      honeypot: "",
      turnstileToken: "",
    });
    toast.success(t("success"));
  });

  if (submitted) {
    return (
      <Card className="border-primary/30 bg-primary/10">
        <CardHeader>
          <CardTitle>{t("success")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {locale === "en"
              ? "I typically reply with the best next step, a few clarifying questions, or a booking suggestion."
              : "Zwykle odpisuję z najlepszym kolejnym krokiem, kilkoma pytaniami doprecyzowującymi albo propozycją rozmowy."}
          </p>
          {calendlyUrl ? (
            <Button asChild>
              <a href={calendlyUrl} target="_blank" rel="noreferrer">
                {t("callCta")}
              </a>
            </Button>
          ) : null}
        </CardContent>
      </Card>
    );
  }

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <input type="hidden" {...form.register("locale")} value={locale} />
      <input type="text" className="hidden" tabIndex={-1} autoComplete="off" {...form.register("honeypot")} />
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label>{t("name")}</Label>
          <Input {...form.register("name")} />
        </div>
        <div className="space-y-2">
          <Label>{t("email")}</Label>
          <Input type="email" {...form.register("email")} />
        </div>
        <div className="space-y-2">
          <Label>{t("company")}</Label>
          <Input {...form.register("company")} />
        </div>
        <div className="space-y-2">
          <Label>{t("projectType")}</Label>
          <Input {...form.register("projectType")} />
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label>{t("budgetRange")}</Label>
          <Input {...form.register("budgetRange")} />
        </div>
        <div className="space-y-2">
          <Label>{t("timeline")}</Label>
          <Input {...form.register("timeline")} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Inquiry type</Label>
        <Select
          defaultValue={form.getValues("inquiryType")}
          onValueChange={(value) =>
            form.setValue("inquiryType", value as ContactFormValues["inquiryType"])
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="client">{t("client")}</SelectItem>
            <SelectItem value="employer">{t("employer")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>{t("message")}</Label>
        <Textarea rows={7} {...form.register("message")} />
      </div>
      <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm">
        <Checkbox
          checked={wantsCall}
          onCheckedChange={(checked) => form.setValue("wantsCall", Boolean(checked))}
        />
        <span>{t("wantsCall")}</span>
      </label>
      <Button type="submit" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? "Sending..." : t("submit")}
      </Button>
    </form>
  );
}
