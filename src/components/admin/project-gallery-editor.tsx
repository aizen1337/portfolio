"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { ImageDropInput } from "@/components/admin/image-drop-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ProjectGalleryItem } from "@/lib/types";

const emptyGalleryItem: ProjectGalleryItem = {
  image: "",
  description: {
    en: "",
    pl: "",
  },
};

interface ProjectGalleryEditorProps {
  initialItems?: ProjectGalleryItem[];
}

export function ProjectGalleryEditor({
  initialItems = [],
}: ProjectGalleryEditorProps) {
  const [items, setItems] = useState<ProjectGalleryItem[]>(
    initialItems.length > 0 ? initialItems : [emptyGalleryItem]
  );

  function updateItem(index: number, nextItem: ProjectGalleryItem) {
    setItems((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? nextItem : item))
    );
  }

  function addItem() {
    setItems((current) => [...current, emptyGalleryItem]);
  }

  function removeItem(index: number) {
    setItems((current) => {
      const nextItems = current.filter((_, itemIndex) => itemIndex !== index);
      return nextItems.length > 0 ? nextItems : [emptyGalleryItem];
    });
  }

  return (
    <div className="space-y-4">
      <input type="hidden" name="galleryCount" value={items.length} />
      <div className="grid gap-6">
        {items.map((item, index) => (
          <section key={index} className="space-y-4 rounded-lg border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-[0.2em] text-primary/80">
                  Gallery image {index + 1}
                </p>
                <p className="text-sm text-muted-foreground">
                  Swipe item and caption pair.
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeItem(index)}
              >
                <Trash2 />
                Remove
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Image</Label>
              <ImageDropInput
                name={`galleryImage-${index}`}
                value={item.image}
                onChange={(nextValue) =>
                  updateItem(index, {
                    ...item,
                    image: nextValue,
                  })
                }
                aspectClassName="aspect-[16/10]"
                emptyLabel="Drop a gallery image here or choose a file"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`gallery-description-en-${index}`}>Description (EN)</Label>
                <Textarea
                  id={`gallery-description-en-${index}`}
                  name={`galleryDescriptionEn-${index}`}
                  rows={4}
                  value={item.description.en}
                  placeholder="What this screen shows"
                  className="min-h-28 border-none bg-transparent px-0 py-0 text-sm leading-7 text-muted-foreground shadow-none focus-visible:ring-0"
                  onChange={(event) =>
                    updateItem(index, {
                      ...item,
                      description: {
                        ...item.description,
                        en: event.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`gallery-description-pl-${index}`}>Description (PL)</Label>
                <Textarea
                  id={`gallery-description-pl-${index}`}
                  name={`galleryDescriptionPl-${index}`}
                  rows={4}
                  value={item.description.pl}
                  placeholder="Co pokazuje ten ekran"
                  className="min-h-28 border-none bg-transparent px-0 py-0 text-sm leading-7 text-muted-foreground shadow-none focus-visible:ring-0"
                  onChange={(event) =>
                    updateItem(index, {
                      ...item,
                      description: {
                        ...item.description,
                        pl: event.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
          </section>
        ))}
      </div>
      <Button type="button" variant="outline" onClick={addItem}>
        <Plus />
        Add gallery image
      </Button>
    </div>
  );
}
