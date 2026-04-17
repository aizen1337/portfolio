import { SectionHeading } from "@/components/section-heading";
import { ProjectFilterGrid } from "@/components/project-filter-grid";
import { getProjects } from "@/lib/data";
import type { Locale } from "@/lib/types";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const projects = await getProjects();

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow={locale === "en" ? "Projects" : "Projekty"}
        title={
          locale === "en"
            ? "A portfolio of interfaces, systems, and delivery work built to hold up outside the mockup."
            : "Portfolio interfejsów, systemów i pracy delivery, które mają sens także poza mockupem."
        }
      />
      <ProjectFilterGrid locale={locale} projects={projects} />
    </div>
  );
}
