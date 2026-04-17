import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { mediaAssets, siteSettings } from "@/db/schema";
import { authOptions } from "@/lib/auth";
import { requireDatabase } from "@/lib/data";
import { isBlobConfigured } from "@/lib/env";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!isBlobConfigured()) {
    return NextResponse.json(
      { error: "BLOB_READ_WRITE_TOKEN is not configured." },
      { status: 503 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const kind = formData.get("kind");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  if (kind !== "media" && kind !== "resume") {
    return NextResponse.json({ error: "Invalid upload kind." }, { status: 400 });
  }

  try {
    const blob = await put(
      `${kind}/${Date.now()}-${file.name}`,
      file,
      { access: "public" }
    );

    const db = requireDatabase();

    if (kind === "resume") {
      const existing = await db.query.siteSettings.findFirst({
        where: eq(siteSettings.id, "main"),
      });

      if (!existing) {
        return NextResponse.json(
          { error: "Site settings row is missing." },
          { status: 400 }
        );
      }

      await db
        .update(siteSettings)
        .set({ resumeUrl: blob.url })
        .where(eq(siteSettings.id, "main"));
    } else {
      await db.insert(mediaAssets).values({
        fileName: file.name,
        url: blob.url,
        mimeType: file.type,
        width: null,
        height: null,
        alt: {
          en: String(formData.get("altEn") ?? ""),
          pl: String(formData.get("altPl") ?? ""),
        },
      });
    }

    return NextResponse.json({ ok: true, url: blob.url });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Upload failed.",
      },
      { status: 500 }
    );
  }
}
