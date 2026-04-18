import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageDropInput } from "@/components/admin/image-drop-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { AdminSignInButton, AdminSignOutButton } from "@/components/admin/auth-buttons";
import { GitHubSyncButton } from "@/components/admin/github-sync-button";
import { ProjectGalleryEditor } from "@/components/admin/project-gallery-editor";
import { UploadPanel } from "@/components/admin/upload-panel";
import {
  getInquiries,
  getMediaAssets,
  getProjects,
  getServices,
  getSiteSettings,
  getTestimonials,
} from "@/lib/data";
import { getAuthSession } from "@/lib/auth";
import { isAuthConfigured } from "@/lib/env";
import type { Project } from "@/lib/types";
import {
  deleteProjectAction,
  deleteServiceAction,
  deleteTestimonialAction,
  saveProjectAction,
  saveServiceAction,
  saveSettingsAction,
  saveTestimonialAction,
  updateInquiryStatusAction,
} from "@/app/admin/actions";

function AdminSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-white/10 bg-white/[0.03]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function TextPair({
  label,
  name,
  enDefault = "",
  plDefault = "",
}: {
  label: string;
  name: string;
  enDefault?: string;
  plDefault?: string;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label>{label} (EN)</Label>
        <Textarea name={`${name}En`} defaultValue={enDefault} rows={4} />
      </div>
      <div className="space-y-2">
        <Label>{label} (PL)</Label>
        <Textarea name={`${name}Pl`} defaultValue={plDefault} rows={4} />
      </div>
    </div>
  );
}

function ListPair({
  label,
  name,
  enDefault = "",
  plDefault = "",
}: {
  label: string;
  name: string;
  enDefault?: string;
  plDefault?: string;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label>{label} (EN)</Label>
        <Textarea name={`${name}En`} defaultValue={enDefault} rows={5} />
      </div>
      <div className="space-y-2">
        <Label>{label} (PL)</Label>
        <Textarea name={`${name}Pl`} defaultValue={plDefault} rows={5} />
      </div>
    </div>
  );
}

const TAGS_PLACEHOLDER = "Next.js, SaaS, Dashboard";
const STACK_PLACEHOLDER = "Next.js, TypeScript, Drizzle, Postgres";

function DraftFieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] uppercase tracking-[0.2em] text-primary/80">
      {children}
    </p>
  );
}

function DraftTextPair({
  label,
  name,
  enDefault = "",
  plDefault = "",
  rows = 4,
  className = "",
}: {
  label: string;
  name: string;
  enDefault?: string;
  plDefault?: string;
  rows?: number;
  className?: string;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <DraftFieldLabel>{label} (EN)</DraftFieldLabel>
        <Textarea
          name={`${name}En`}
          defaultValue={enDefault}
          rows={rows}
          className={className}
        />
      </div>
      <div className="space-y-2">
        <DraftFieldLabel>{label} (PL)</DraftFieldLabel>
        <Textarea
          name={`${name}Pl`}
          defaultValue={plDefault}
          rows={rows}
          className={className}
        />
      </div>
    </div>
  );
}

function ProjectEditorForm({ project }: { project?: Project }) {
  const isEditing = Boolean(project);
  return (
    <form
      action={saveProjectAction}
      className={`space-y-8 rounded-lg border px-4 py-6 sm:px-6 sm:py-8 ${
        isEditing ? "border-white/10 bg-white/[0.015]" : "border-dashed border-white/10 bg-white/[0.01]"
      }`}
    >
      {project ? <input type="hidden" name="id" value={project.id} /> : null}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{isEditing ? "Editable Draft" : "New Draft"}</Badge>
          {project?.featured ? <Badge>Featured</Badge> : null}
          <span className="text-sm text-muted-foreground">
            {project?.slug ? `/${project.slug}` : "Unsaved project"}
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="submit">{isEditing ? "Save project" : "Create project"}</Button>
          {isEditing && project ? (
            <>
              <Button type="submit" formAction={deleteProjectAction} variant="outline">
                Delete
              </Button>
              <GitHubSyncButton projectId={project.id} repository={project.repository} />
            </>
          ) : null}
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-2">
            <DraftFieldLabel>Tags</DraftFieldLabel>
            <Input
              name="tags"
              defaultValue={project?.tags.join(", ") ?? ""}
              placeholder={TAGS_PLACEHOLDER}
              className="h-10 rounded-lg border-white/10 bg-white/[0.03] text-sm"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <DraftFieldLabel>Slug</DraftFieldLabel>
              <Input
                name="slug"
                defaultValue={project?.slug ?? ""}
                className="h-10 rounded-lg border-white/10 bg-white/[0.03] text-sm"
              />
            </div>
            <div className="space-y-2">
              <DraftFieldLabel>Sort order</DraftFieldLabel>
              <Input
                name="sortOrder"
                type="number"
                defaultValue={project?.sortOrder ?? "99"}
                className="h-10 rounded-lg border-white/10 bg-white/[0.03] text-sm"
              />
            </div>
            <div className="flex items-end">
              <label className="flex h-10 w-full items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-sm">
                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked={project?.featured ?? false}
                />
                Featured
              </label>
            </div>
          </div>
        </div>

        <DraftTextPair
          label="Title"
          name="title"
          enDefault={project?.title.en}
          plDefault={project?.title.pl}
          rows={2}
          className="min-h-28 border-none bg-transparent px-0 py-0 text-4xl leading-tight font-semibold text-foreground shadow-none focus-visible:ring-0 sm:text-5xl"
        />
        <DraftTextPair
          label="Summary"
          name="summary"
          enDefault={project?.summary.en}
          plDefault={project?.summary.pl}
          rows={4}
          className="min-h-28 border-none bg-transparent px-0 py-0 text-lg leading-8 text-muted-foreground shadow-none focus-visible:ring-0"
        />
      </div>

      <div className="space-y-3">
        <DraftFieldLabel>Cover image</DraftFieldLabel>
        <ImageDropInput
          name="coverImage"
          initialValue={project?.coverImage ?? ""}
          aspectClassName="aspect-[16/9]"
          emptyLabel="Drop a cover image here or choose a file"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="space-y-6 rounded-lg border border-white/10 bg-white/[0.03] p-6">
          <div className="space-y-4">
            <DraftFieldLabel>Role</DraftFieldLabel>
            <DraftTextPair
              label="Role"
              name="role"
              enDefault={project?.role.en}
              plDefault={project?.role.pl}
              rows={4}
              className="min-h-28 rounded-lg border-white/10 bg-white/[0.02] text-sm leading-7 text-muted-foreground"
            />
          </div>
          <div className="space-y-2">
            <DraftFieldLabel>Stack</DraftFieldLabel>
            <Input
              name="stack"
              defaultValue={project?.stack.join(", ") ?? ""}
              placeholder={STACK_PLACEHOLDER}
              className="h-10 rounded-lg border-white/10 bg-white/[0.03] text-sm"
            />
          </div>
          <div className="grid gap-4">
            <div className="space-y-2">
              <DraftFieldLabel>Repository</DraftFieldLabel>
              <Input
                name="repository"
                defaultValue={project?.repository ?? ""}
                className="h-10 rounded-lg border-white/10 bg-white/[0.03] text-sm"
              />
            </div>
            <div className="space-y-2">
              <DraftFieldLabel>Live URL</DraftFieldLabel>
              <Input
                name="liveUrl"
                defaultValue={project?.liveUrl ?? ""}
                className="h-10 rounded-lg border-white/10 bg-white/[0.03] text-sm"
              />
            </div>
            <div className="space-y-2">
              <DraftFieldLabel>Demo URL</DraftFieldLabel>
              <Input
                name="demoUrl"
                defaultValue={project?.demoUrl ?? ""}
                className="h-10 rounded-lg border-white/10 bg-white/[0.03] text-sm"
              />
            </div>
          </div>
        </aside>

        <div className="space-y-8">
          <section className="space-y-3">
            <h2 className="text-2xl">Overview</h2>
            <DraftTextPair
              label="Overview"
              name="overview"
              enDefault={project?.overview.en}
              plDefault={project?.overview.pl}
              rows={6}
              className="min-h-40 border-none bg-transparent px-0 py-0 text-base leading-8 text-muted-foreground shadow-none focus-visible:ring-0"
            />
          </section>
          <section className="space-y-3">
            <h2 className="text-2xl">Challenge</h2>
            <DraftTextPair
              label="Challenge"
              name="challenge"
              enDefault={project?.challenge.en}
              plDefault={project?.challenge.pl}
              rows={6}
              className="min-h-40 border-none bg-transparent px-0 py-0 text-base leading-8 text-muted-foreground shadow-none focus-visible:ring-0"
            />
          </section>
          <section className="space-y-3">
            <h2 className="text-2xl">Approach</h2>
            <DraftTextPair
              label="Approach"
              name="approach"
              enDefault={project?.approach.en}
              plDefault={project?.approach.pl}
              rows={6}
              className="min-h-40 border-none bg-transparent px-0 py-0 text-base leading-8 text-muted-foreground shadow-none focus-visible:ring-0"
            />
          </section>
          <section className="space-y-3">
            <h2 className="text-2xl">Outcome</h2>
            <DraftTextPair
              label="Outcome"
              name="outcome"
              enDefault={project?.outcome.en}
              plDefault={project?.outcome.pl}
              rows={6}
              className="min-h-40 border-none bg-transparent px-0 py-0 text-base leading-8 text-muted-foreground shadow-none focus-visible:ring-0"
            />
          </section>
        </div>
      </div>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl">Gallery</h2>
          <p className="text-sm text-muted-foreground">
            Edit this like the media section of the project page.
          </p>
        </div>
        <ProjectGalleryEditor initialItems={project?.gallery} />
      </section>
    </form>
  );
}

export default async function AdminPage() {
  const [session, projects, services, testimonials, inquiries, settings, media] =
    await Promise.all([
      getAuthSession(),
      getProjects(),
      getServices(),
      getTestimonials(),
      getInquiries(),
      getSiteSettings(),
      getMediaAssets(),
    ]);

  if (!isAuthConfigured()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24">
        <AdminSection
          title="Admin setup needed"
          description="Add GITHUB_ID, GITHUB_SECRET, NEXTAUTH_SECRET, and ADMIN_GITHUB_LOGINS to enable the CMS."
        >
          <p className="text-sm text-muted-foreground">
            The public site will still run with seeded demo content, but admin sign-in and write actions stay disabled until auth is configured.
          </p>
        </AdminSection>
      </div>
    );
  }

  if (!session?.user?.email) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24">
        <AdminSection
          title="Portfolio CMS"
          description="Owner-only access via GitHub."
        >
          <AdminSignInButton />
        </AdminSection>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Signed in as {session.user.email}</p>
          <h1 className="text-3xl">Portfolio CMS</h1>
        </div>
        <AdminSignOutButton />
      </div>

      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList className="flex h-auto flex-wrap gap-2 bg-transparent p-0">
          {["projects", "services", "testimonials", "settings", "inquiries", "media"].map((tab) => (
            <TabsTrigger key={tab} value={tab} className="border border-white/10 bg-white/[0.03] capitalize">
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="projects" className="space-y-6">
          <AdminSection title="Projects" description="Create, update, and sync project case studies.">
            <div className="grid gap-6">
              <div className="flex justify-end">
                <GitHubSyncButton syncAll />
              </div>
              {projects.map((project) => (
                <ProjectEditorForm key={project.id} project={project} />
              ))}
              <div className="space-y-4">
                <h3 className="text-lg">New project</h3>
                <ProjectEditorForm />
              </div>
            </div>
          </AdminSection>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <AdminSection title="Services">
            <div className="grid gap-6">
              {services.map((service) => (
                <form key={service.id} action={saveServiceAction} className="space-y-4 rounded-lg border border-white/10 p-4">
                  <input type="hidden" name="id" value={service.id} />
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Slug</Label>
                      <Input name="slug" defaultValue={service.slug} />
                    </div>
                    <div className="space-y-2">
                      <Label>Icon</Label>
                      <Input name="icon" defaultValue={service.icon} />
                    </div>
                    <div className="space-y-2">
                      <Label>Sort order</Label>
                      <Input name="sortOrder" type="number" defaultValue={service.sortOrder} />
                    </div>
                  </div>
                  <TextPair label="Title" name="title" enDefault={service.title.en} plDefault={service.title.pl} />
                  <TextPair label="Summary" name="summary" enDefault={service.summary.en} plDefault={service.summary.pl} />
                  <ListPair label="Outcomes" name="outcomes" enDefault={service.outcomes.en.join("\n")} plDefault={service.outcomes.pl.join("\n")} />
                  <ListPair label="Process" name="process" enDefault={service.process.en.join("\n")} plDefault={service.process.pl.join("\n")} />
                  <TextPair label="CTA label" name="ctaLabel" enDefault={service.ctaLabel.en} plDefault={service.ctaLabel.pl} />
                  <div className="flex gap-3">
                    <Button type="submit">Save service</Button>
                    <Button type="submit" formAction={deleteServiceAction} variant="outline">
                      Delete
                    </Button>
                  </div>
                </form>
              ))}
            </div>
          </AdminSection>
        </TabsContent>

        <TabsContent value="testimonials" className="space-y-6">
          <AdminSection title="Testimonials">
            <div className="grid gap-6">
              {testimonials.map((testimonial) => (
                <form key={testimonial.id} action={saveTestimonialAction} className="space-y-4 rounded-lg border border-white/10 p-4">
                  <input type="hidden" name="id" value={testimonial.id} />
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input name="name" defaultValue={testimonial.name} />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Input name="role" defaultValue={testimonial.role} />
                    </div>
                    <div className="space-y-2">
                      <Label>Company</Label>
                      <Input name="company" defaultValue={testimonial.company} />
                    </div>
                    <div className="space-y-2">
                      <Label>Sort order</Label>
                      <Input name="sortOrder" type="number" defaultValue={testimonial.sortOrder} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Avatar URL</Label>
                    <Input name="avatarUrl" defaultValue={testimonial.avatarUrl} />
                  </div>
                  <TextPair label="Quote" name="quote" enDefault={testimonial.quote.en} plDefault={testimonial.quote.pl} />
                  <div className="flex gap-3">
                    <Button type="submit">Save testimonial</Button>
                    <Button type="submit" formAction={deleteTestimonialAction} variant="outline">
                      Delete
                    </Button>
                  </div>
                </form>
              ))}
            </div>
          </AdminSection>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <AdminSection title="Site settings" description="Text content, links, contact info, and resume URL.">
            <form action={saveSettingsAction} className="space-y-4">
              <TextPair label="Hero eyebrow" name="heroEyebrow" enDefault={settings.heroEyebrow.en} plDefault={settings.heroEyebrow.pl} />
              <TextPair label="Hero title" name="heroTitle" enDefault={settings.heroTitle.en} plDefault={settings.heroTitle.pl} />
              <TextPair label="Hero body" name="heroBody" enDefault={settings.heroBody.en} plDefault={settings.heroBody.pl} />
              <TextPair label="About body" name="aboutBody" enDefault={settings.aboutBody.en} plDefault={settings.aboutBody.pl} />
              <TextPair label="Employer intro" name="employerIntro" enDefault={settings.employerIntro.en} plDefault={settings.employerIntro.pl} />
              <TextPair label="Services intro" name="servicesIntro" enDefault={settings.servicesIntro.en} plDefault={settings.servicesIntro.pl} />
              <TextPair label="Contact intro" name="contactIntro" enDefault={settings.contactIntro.en} plDefault={settings.contactIntro.pl} />
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Contact email</Label>
                  <Input name="contactEmail" defaultValue={settings.contactEmail} />
                </div>
                <div className="space-y-2">
                  <Label>Booking integration</Label>
                  <Input value="Google Calendar appointment schedule" readOnly />
                  <input type="hidden" name="bookingProvider" value="google-calendar" />
                </div>
                <div className="space-y-2">
                  <Label>Resume URL</Label>
                  <Input name="resumeUrl" defaultValue={settings.resumeUrl ?? ""} />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-[auto_1fr] md:items-end">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="bookingEnabled" defaultChecked={settings.bookingEnabled} />
                  Booking enabled
                </label>
                <div className="space-y-2">
                  <Label>Google Calendar booking URL</Label>
                  <Input name="bookingUrl" defaultValue={settings.bookingUrl ?? ""} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Social links (one per line as Label|URL)</Label>
                <Textarea
                  name="socialLinks"
                  rows={5}
                  defaultValue={settings.socialLinks.map((item) => `${item.label}|${item.href}`).join("\n")}
                />
              </div>
              <Button type="submit">Save settings</Button>
            </form>
          </AdminSection>
        </TabsContent>

        <TabsContent value="inquiries">
          <AdminSection title="Inquiries">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inquiries.map((inquiry) => (
                  <TableRow key={inquiry.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{inquiry.name}</p>
                        <p className="text-xs text-muted-foreground">{inquiry.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{inquiry.inquiryType}</Badge>
                    </TableCell>
                    <TableCell>{inquiry.budgetRange ?? "-"}</TableCell>
                    <TableCell>
                      <form action={updateInquiryStatusAction} className="flex gap-2">
                        <input type="hidden" name="id" value={inquiry.id} />
                        <input type="hidden" name="status" value={
                          inquiry.status === "new"
                            ? "replied"
                            : inquiry.status === "replied"
                              ? "archived"
                              : "new"
                        } />
                        <Button type="submit" size="sm" variant="outline">
                          {inquiry.status}
                        </Button>
                      </form>
                    </TableCell>
                    <TableCell className="max-w-sm text-sm text-muted-foreground">
                      {inquiry.message}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AdminSection>
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <UploadPanel
              kind="media"
              title="Media uploads"
              description="Upload project and testimonial images to Vercel Blob and store metadata in Postgres."
            />
            <UploadPanel
              kind="resume"
              title="Resume upload"
              description="Upload a resume or CV and automatically store the public file URL in site settings."
            />
          </div>
          <AdminSection title="Stored assets">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {media.map((asset) => (
                <div key={asset.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                  <p className="font-medium">{asset.fileName}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{asset.mimeType}</p>
                  <a
                    className="mt-3 block text-sm text-primary"
                    href={asset.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open asset
                  </a>
                </div>
              ))}
            </div>
          </AdminSection>
        </TabsContent>
      </Tabs>
    </div>
  );
}
