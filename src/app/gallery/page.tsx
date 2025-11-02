"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

type Item = {
  id: string;
  url: string;
  label: string;
  description?: string | null;
  tags?: any[];
  createdAt: string;
};

const LABELS = ["All", "Header", "Footer", "Hero", "Feature", "Contact", "CTA", "Pricing", "FAQ", "Testimonial"];

export default function GalleryPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [labelFilter, setLabelFilter] = useState<string>("All");
  const [search, setSearch] = useState<string>("");
  const [selected, setSelected] = useState<Item | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (labelFilter && labelFilter !== "All") params.set("label", labelFilter);
        const res = await fetch(`/api/sections?${params.toString()}`);
        const json = await res.json();
        setItems(json);
      } finally {
        setLoading(false);
      }
    })();
  }, [labelFilter]);

  const filtered = useMemo(() => {
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter(i =>
      (i.label?.toLowerCase().includes(q)) ||
      (i.description?.toLowerCase().includes(q)) ||
      (Array.isArray(i.tags) && i.tags.some((t: any) => String(t).toLowerCase().includes(q)))
    );
  }, [items, search]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Gallery</h1>
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3 items-center">
            <Select value={labelFilter} onValueChange={(v) => setLabelFilter(v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter label" />
              </SelectTrigger>
              <SelectContent>
                {LABELS.map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by tag or text" className="flex-1 min-w-[200px]" />
            <Button variant="outline" asChild>
              <a href="/upload">Upload New</a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading && Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-40 rounded border bg-gray-100 animate-pulse" />
        ))}
        {!loading && filtered.length === 0 && (
          <div className="col-span-full text-center text-sm text-gray-600">No items match your filters.</div>
        )}
        {!loading && filtered.map(item => (
          <motion.div
            key={item.id}
            className="group relative cursor-pointer"
            onClick={() => setSelected(item)}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <img src={item.url} alt={item.label} className="w-full h-40 object-cover rounded border" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-end p-2">
              <div className="text-white text-sm">
                <div className="font-medium">{item.label}</div>
                {item.description && <div className="line-clamp-2 text-xs">{item.description}</div>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-3xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.label}</DialogTitle>
                {selected.description && (
                  <DialogDescription>{selected.description}</DialogDescription>
                )}
              </DialogHeader>
              <motion.img
                src={selected.url}
                alt={selected.label}
                className="w-full max-h-[65vh] object-contain rounded border"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
              {Array.isArray(selected.tags) && selected.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {selected.tags.map((t: any, idx: number) => (
                    <Badge key={idx} variant="secondary">{String(t)}</Badge>
                  ))}
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}