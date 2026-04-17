import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "space-y-3",
        align === "center" && "mx-auto max-w-3xl text-center"
      )}
    >
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
        {eyebrow}
      </p>
      <h2 className="max-w-4xl text-3xl leading-tight sm:text-4xl">{title}</h2>
      {description ? (
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}
