import { Menu } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/types";

async function NavLinks({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "nav" });
  const items = [
    { href: "/", label: t("home") },
    { href: "/projects", label: t("projects") },
    { href: "/services", label: t("services") },
    { href: "/employers", label: t("employers") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          locale={locale}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          {item.label}
        </Link>
      ))}
    </>
  );
}

export async function SiteHeader({ locale }: { locale: Locale }) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link locale={locale} href="/" className="text-sm font-semibold tracking-tight">
          MK / Portfolio
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <NavLinks locale={locale} />
        </nav>
        <div className="hidden items-center gap-4 md:flex">
          <LocaleSwitcher />
          <Button asChild size="sm">
            <Link href="/contact" locale={locale}>
              Let&apos;s talk
            </Link>
          </Button>
        </div>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger
              aria-label="Open navigation"
              className={cn(buttonVariants({ variant: "outline", size: "icon-sm" }))}
            >
              <Menu className="size-4" />
            </SheetTrigger>
            <SheetContent side="right" className="border-white/10 bg-card">
              <div className="mt-8 flex flex-col gap-5">
                <NavLinks locale={locale} />
                <LocaleSwitcher />
                <Button asChild>
                  <Link href="/contact" locale={locale}>
                    Let&apos;s talk
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
