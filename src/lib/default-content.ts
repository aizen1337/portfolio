import type {
  Inquiry,
  MediaAsset,
  Project,
  Service,
  SiteSettings,
  Testimonial,
} from "@/lib/types";

export const defaultSiteSettings: SiteSettings = {
  id: "main",
  heroEyebrow: {
    en: "Full-stack engineer for ambitious product teams",
    pl: "Full-stack developer dla ambitnych zespołów produktowych",
  },
  heroTitle: {
    en: "I design polished products, ship reliable systems, and help ideas feel ready for the world.",
    pl: "Projektuję dopracowane produkty, dostarczam solidne systemy i pomagam pomysłom wejść w świat z pewnością.",
  },
  heroBody: {
    en: "This portfolio is built for both employers and clients: case studies with technical depth, clear service offers, and a contact flow that turns interest into conversation.",
    pl: "To portfolio jest stworzone jednocześnie dla pracodawców i klientów: zawiera case studies z techniczną głębią, jasne oferty usług i kontakt, który zamienia zainteresowanie w rozmowę.",
  },
  aboutBody: {
    en: "I work across product strategy, interface design, and full-stack delivery. My favorite builds are the ones that feel calm, sharp, and deeply usable under real constraints.",
    pl: "Łączę strategię produktu, projektowanie interfejsów i realizację full-stack. Najbardziej lubię projekty, które są spokojne, precyzyjne i naprawdę użyteczne w realnych ograniczeniach.",
  },
  employerIntro: {
    en: "A concise route for hiring teams: strongest projects, operating style, stack, and a resume download.",
    pl: "Konkretna ścieżka dla zespołów rekrutujących: najmocniejsze projekty, sposób pracy, stack i pobranie CV.",
  },
  servicesIntro: {
    en: "Custom engagements for teams who need a partner across interface design, architecture, and product delivery.",
    pl: "Współpraca szyta na miarę dla zespołów, które potrzebują partnera od designu interfejsu, architektury i realizacji produktu.",
  },
  contactIntro: {
    en: "Tell me what you're building or who you're hiring for. I will come back with a practical next step.",
    pl: "Napisz, co budujesz albo kogo szukasz. Wrócę z konkretną propozycją następnego kroku.",
  },
  socialLinks: [
    { label: "GitHub", href: "https://github.com/your-handle" },
    { label: "LinkedIn", href: "https://linkedin.com/in/your-handle" },
    { label: "Email", href: "mailto:hello@example.com" },
  ],
  contactEmail: "hello@example.com",
  calendlyUrl: "https://calendly.com/your-handle/intro-call",
  resumeUrl: null,
};

export const defaultProjects: Project[] = [
  {
    id: "proj-1",
    slug: "atelier-commerce",
    featured: true,
    sortOrder: 1,
    title: {
      en: "Atelier Commerce",
      pl: "Atelier Commerce",
    },
    summary: {
      en: "A premium e-commerce rebuild focused on conversion clarity, editorial storytelling, and fast storefront performance.",
      pl: "Premiumowa przebudowa e-commerce skupiona na czytelnej konwersji, storytellingu i szybkiej wydajności storefrontu.",
    },
    overview: {
      en: "I redesigned the public funnel, rebuilt the frontend architecture, and aligned content around higher-intent buyer journeys.",
      pl: "Przeprojektowałem lejek publiczny, przebudowałem architekturę frontendu i uporządkowałem treść pod ścieżki zakupowe o wyższej intencji.",
    },
    challenge: {
      en: "The legacy storefront felt generic and slow, and the merchandising story changed too often for static marketing pages.",
      pl: "Stary storefront był generyczny i wolny, a historia merchandisingowa zmieniała się zbyt często jak na statyczne strony marketingowe.",
    },
    approach: {
      en: "I paired a modular content system with polished UI states, resilient data fetching, and measurable call-to-action paths.",
      pl: "Połączyłem modułowy system treści z dopracowanymi stanami UI, odpornym pobieraniem danych i mierzalnymi ścieżkami CTA.",
    },
    outcome: {
      en: "The new launch improved product discovery, tightened storytelling, and created a far more confident premium feel.",
      pl: "Nowa wersja poprawiła odkrywanie produktów, uporządkowała storytelling i dała dużo bardziej premium odczucie.",
    },
    role: {
      en: "Product design, frontend architecture, implementation lead",
      pl: "Product design, architektura frontendu, lider implementacji",
    },
    tags: ["Next.js", "Design Systems", "E-commerce"],
    stack: ["Next.js", "TypeScript", "Tailwind", "Postgres"],
    coverImage:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80"
    ],
    repository: "your-handle/atelier-commerce",
    liveUrl: "https://example.com",
    demoUrl: null,
    repoDescription: "Premium commerce rebuild with a modular content system.",
    repoStars: 24,
    repoForks: 7,
    repoUpdatedAt: new Date().toISOString(),
  },
  {
    id: "proj-2",
    slug: "signal-os",
    featured: true,
    sortOrder: 2,
    title: {
      en: "Signal OS",
      pl: "Signal OS",
    },
    summary: {
      en: "A lead-to-delivery workspace for a service business that needed one calm operating system for sales, handoff, and reporting.",
      pl: "Workspace lead-to-delivery dla biznesu usługowego, który potrzebował jednego spokojnego systemu do sprzedaży, handoffu i raportowania.",
    },
    overview: {
      en: "I turned fragmented spreadsheets and forms into a unified internal product with stronger visibility across the whole pipeline.",
      pl: "Zamieniłem porozrzucane arkusze i formularze w spójny produkt wewnętrzny z lepszą widocznością całego pipeline'u.",
    },
    challenge: {
      en: "The team was losing time between inquiry intake, delivery planning, and account follow-up.",
      pl: "Zespół tracił czas między przyjmowaniem zapytań, planowaniem realizacji i follow-upem klienta.",
    },
    approach: {
      en: "I mapped the workflow end to end, designed the key surfaces, and built a role-aware dashboard with strong defaults.",
      pl: "Rozrysowałem workflow end to end, zaprojektowałem kluczowe widoki i zbudowałem dashboard uwzględniający role z mocnymi domyślnymi ustawieniami.",
    },
    outcome: {
      en: "The platform shortened handoff time, reduced context switching, and gave leadership a much clearer operating picture.",
      pl: "Platforma skróciła czas handoffu, zmniejszyła przełączanie kontekstu i dała leadershipowi znacznie czytelniejszy obraz operacyjny.",
    },
    role: {
      en: "Discovery, UX, data modeling, full-stack delivery",
      pl: "Discovery, UX, modelowanie danych, realizacja full-stack",
    },
    tags: ["SaaS", "Automation", "Operations"],
    stack: ["Next.js", "Drizzle", "Neon", "Auth.js"],
    coverImage:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80"
    ],
    repository: "your-handle/signal-os",
    liveUrl: null,
    demoUrl: "https://demo.example.com",
    repoDescription: "Service operations platform for pipeline and delivery.",
    repoStars: 17,
    repoForks: 4,
    repoUpdatedAt: new Date().toISOString(),
  },
  {
    id: "proj-3",
    slug: "studio-brief",
    featured: false,
    sortOrder: 3,
    title: {
      en: "Studio Brief",
      pl: "Studio Brief",
    },
    summary: {
      en: "A bilingual intake and proposal experience designed to qualify better leads without making the first step feel heavy.",
      pl: "Dwujęzyczne doświadczenie intake i proposal zaprojektowane tak, by lepiej kwalifikować leady bez obciążania pierwszego kroku.",
    },
    overview: {
      en: "The project brought together contact strategy, persuasive UX, and a content model flexible enough for two audiences and two languages.",
      pl: "Projekt połączył strategię kontaktu, perswazyjny UX i model treści wystarczająco elastyczny dla dwóch odbiorców i dwóch języków.",
    },
    challenge: {
      en: "The client needed clearer project-fit signals and fewer vague inquiry threads.",
      pl: "Klient potrzebował wyraźniejszych sygnałów dopasowania projektu i mniej ogólnikowych wątków zapytań.",
    },
    approach: {
      en: "I designed a compact brief form, localized the information architecture, and connected submissions to follow-up automation.",
      pl: "Zaprojektowałem kompaktowy brief, zlokalizowałem architekturę informacji i połączyłem zgłoszenia z automatyzacją follow-upu.",
    },
    outcome: {
      en: "The new flow improved qualification quality while keeping the experience warm, lightweight, and direct.",
      pl: "Nowy flow poprawił jakość kwalifikacji przy zachowaniu ciepłego, lekkiego i bezpośredniego doświadczenia.",
    },
    role: {
      en: "UX strategy, frontend implementation, automation integration",
      pl: "Strategia UX, implementacja frontendu, integracja automatyzacji",
    },
    tags: ["Bilingual", "Lead Gen", "Forms"],
    stack: ["Next.js", "Zod", "Resend", "Vercel Blob"],
    coverImage:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80"
    ],
    repository: "your-handle/studio-brief",
    liveUrl: null,
    demoUrl: null,
    repoDescription: "Bilingual lead qualification flow with CRM-friendly submissions.",
    repoStars: 11,
    repoForks: 2,
    repoUpdatedAt: new Date().toISOString(),
  },
];

export const defaultServices: Service[] = [
  {
    id: "svc-1",
    slug: "product-design-engineering",
    icon: "Sparkles",
    sortOrder: 1,
    title: {
      en: "Product design + engineering",
      pl: "Product design + engineering",
    },
    summary: {
      en: "From idea shaping to production-grade implementation, with one person owning the quality bar across the whole surface.",
      pl: "Od dopracowania pomysłu po implementację gotową do produkcji, z jedną osobą pilnującą jakości całej powierzchni produktu.",
    },
    outcomes: {
      en: ["Stronger UX clarity", "Faster iteration loops", "Cohesive shipped experience"],
      pl: ["Lepsza klarowność UX", "Szybsze iteracje", "Spójne wdrożone doświadczenie"],
    },
    process: {
      en: ["Discovery and scope framing", "Design direction", "Build and polish"],
      pl: ["Discovery i określenie zakresu", "Kierunek projektowy", "Build i dopracowanie"],
    },
    ctaLabel: {
      en: "Plan a custom engagement",
      pl: "Zaplanuj współpracę",
    },
  },
  {
    id: "svc-2",
    slug: "frontend-rebuild",
    icon: "MonitorCog",
    sortOrder: 2,
    title: {
      en: "Frontend rebuilds",
      pl: "Przebudowy frontendu",
    },
    summary: {
      en: "For products that need a sharper interface, cleaner architecture, and a more trustworthy user journey.",
      pl: "Dla produktów, które potrzebują ostrzejszego interfejsu, czystszej architektury i bardziej wiarygodnej ścieżki użytkownika.",
    },
    outcomes: {
      en: ["Better performance", "Better maintainability", "Clearer conversion paths"],
      pl: ["Lepsza wydajność", "Lepsza utrzymywalność", "Jaśniejsze ścieżki konwersji"],
    },
    process: {
      en: ["Audit and prioritization", "System cleanup", "Launch support"],
      pl: ["Audyt i priorytetyzacja", "Porządkowanie systemu", "Wsparcie wdrożenia"],
    },
    ctaLabel: {
      en: "Talk through your rebuild",
      pl: "Porozmawiaj o przebudowie",
    },
  },
  {
    id: "svc-3",
    slug: "technical-partner",
    icon: "BriefcaseBusiness",
    sortOrder: 3,
    title: {
      en: "Technical partner for lean teams",
      pl: "Partner techniczny dla małych zespołów",
    },
    summary: {
      en: "A flexible collaboration model for founders and teams who need senior judgment without adding full-time overhead immediately.",
      pl: "Elastyczny model współpracy dla founderów i zespołów, które potrzebują seniorskiego osądu bez natychmiastowego zatrudniania na pełen etat.",
    },
    outcomes: {
      en: ["Fewer risky decisions", "Faster direction changes", "More calm delivery"],
      pl: ["Mniej ryzykownych decyzji", "Szybsze zmiany kierunku", "Spokojniejsza realizacja"],
    },
    process: {
      en: ["Weekly operating rhythm", "Priority support", "Implementation and review"],
      pl: ["Tygodniowy rytm pracy", "Wsparcie priorytetów", "Implementacja i review"],
    },
    ctaLabel: {
      en: "See if this fits your team",
      pl: "Sprawdź, czy to pasuje do Twojego zespołu",
    },
  },
];

export const defaultTestimonials: Testimonial[] = [
  {
    id: "test-1",
    sortOrder: 1,
    name: "Marta Zielinska",
    role: "Head of Product",
    company: "Northline Studio",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=320&q=80",
    quote: {
      en: "He brings unusual calm to difficult product decisions. The work gets sharper, the team gets clearer, and the end result simply feels more finished.",
      pl: "Wnosi niezwykły spokój do trudnych decyzji produktowych. Praca staje się ostrzejsza, zespół ma większą jasność, a efekt końcowy jest po prostu bardziej dopracowany.",
    },
  },
  {
    id: "test-2",
    sortOrder: 2,
    name: "Daniel Foster",
    role: "Founder",
    company: "Signal Works",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=320&q=80",
    quote: {
      en: "Rare mix of product taste and engineering discipline. We moved faster because we weren't paying the same decision tax twice.",
      pl: "Rzadkie połączenie wyczucia produktu i dyscypliny inżynierskiej. Ruszaliśmy szybciej, bo nie płaciliśmy dwa razy za te same decyzje.",
    },
  },
];

export const defaultMediaAssets: MediaAsset[] = [];
export const defaultInquiries: Inquiry[] = [];
