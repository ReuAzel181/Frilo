"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const LABELS = ["Header", "Footer", "Hero", "Feature", "Contact", "CTA", "Pricing", "FAQ", "Testimonial"];

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [label, setLabel] = useState<string>(LABELS[0]);
  const [description, setDescription] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const blob = item.getAsFile();
          if (blob) {
            setFile(blob);
            setPreview(URL.createObjectURL(blob));
            break;
          }
        }
      }
    };
    window.addEventListener("paste", handler as any);
    return () => window.removeEventListener("paste", handler as any);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  }, []);

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const onSubmit = async () => {
    if (!file) return alert("Please select an image");
    const form = new FormData();
    form.set("file", file);
    form.set("label", label);
    form.set("description", description);
    form.set("tags", JSON.stringify(tags));
    const res = await fetch("/api/upload", { method: "POST", body: form });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert("Upload failed: " + (err.error || res.statusText));
      return;
    }
    const json = await res.json();
    alert("Uploaded!");
    setFile(null);
    setPreview(null);
    setDescription("");
    setTags([]);
    setTagInput("");
    console.log("created", json);
  };

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload / Paste Design Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-gray-600">Drag-and-drop, paste, or choose a file. Label the section and add optional tags.</p>

      <div
        ref={dropRef}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-3 bg-gray-50 hover:bg-gray-100 transition"
      >
        <input type="file" accept="image/*" onChange={onSelect} className="hidden" id="file-input" />
        <Button onClick={() => document.getElementById("file-input")?.click()}>Choose Image</Button>
        <span className="text-xs text-gray-500">or drop/paste an image here</span>
        {preview && (
          <motion.img
            src={preview}
            alt="preview"
            className="mt-3 max-h-64 rounded border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        )}
      </div>

      <div className="grid grid-cols-1 md-grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Section Label</label>
          <Select value={label} onValueChange={(v) => setLabel(v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a label" />
            </SelectTrigger>
            <SelectContent>
              {LABELS.map((l) => (
                <SelectItem key={l} value={l}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm mb-1">Tags</label>
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && tagInput.trim()) {
                setTags((prev) => Array.from(new Set([...prev, tagInput.trim()])));
                setTagInput("");
                e.preventDefault();
              }
            }}
            placeholder="Type a tag and press Enter"
          />
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((t) => (
                <Badge key={t} className="cursor-pointer" onClick={() => setTags((prev) => prev.filter((x) => x !== t))} title="Click to remove">
                  {t}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <Separator />
      <div>
        <label className="block text-sm mb-1">Description (optional)</label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Briefly describe this section" />
      </div>

      <div className="flex gap-3">
        <Button onClick={onSubmit} disabled={!file}>Upload & Save</Button>
        <Button variant="outline" asChild>
          <a href="/gallery">Go to Gallery</a>
        </Button>
      </div>
        </CardContent>
      </Card>
    </div>
  );
}