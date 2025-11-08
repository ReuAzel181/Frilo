"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

type SectionImage = {
  id: string;
  url: string;
  label: string;
  description?: string | null;
  tags?: string[];
  createdAt: string;
};

export default function CommunityImages() {
  const [items, setItems] = useState<SectionImage[]>([]);
  const [layout, setLayout] = useState<"Compact" | "Expanded">("Compact");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/sections");
        if (!res.ok) throw new Error(`Failed /api/sections: ${res.status}`);
        const ct = res.headers.get("content-type") || "";
        const data = ct.includes("application/json") ? await res.json() : [];
        setItems(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    })();

    const onAdded = (e: any) => {
      const detail = e?.detail;
      if (detail) {
        setItems((prev) => [detail, ...(prev || [])]);
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("section-image-added", onAdded);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("section-image-added", onAdded);
      }
    };
  }, []);

  return (
    <section>
      <div className="container-expanded">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-bold">Community Images</h2>
          <div className="flex items-center space-x-2">
            <button onClick={() => setLayout("Compact")} className={`px-3 py-1 rounded-full text-sm font-medium ${layout === "Compact" ? "bg-yellow-400 text-black" : "bg-gray-200 dark:bg-gray-800"}`}>Compact</button>
            <button onClick={() => setLayout("Expanded")} className={`px-3 py-1 rounded-full text-sm font-medium ${layout === "Expanded" ? "bg-yellow-400 text-black" : "bg-gray-200 dark:bg-gray-800"}`}>Expanded</button>
            <button className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 dark:bg-gray-800">Featured</button>
            <button className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 dark:bg-gray-800">New</button>
            <button className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 dark:bg-gray-800">Popular</button>
          </div>
        </div>
        <div className={`grid ${layout === "Compact" ? "grid-cols-2 md:grid-cols-4 lg:grid-cols-5" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"} gutter-default`}>
          {loading && Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
          ))}
          {!loading && items.map((item) => (
            <div key={item.id} className="group relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-yellow-400 transition-all">
              <div className="aspect-video bg-gray-100 dark:bg-gray-800">
                <Image src={item.url} alt={item.label} width={640} height={360} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h5 className="font-semibold mb-2 group-hover:text-yellow-400 transition-colors">{item.label}</h5>
                {item.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{item.description}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(item.tags) ? item.tags.map((t: string, i: number) => (
                    <span key={i} className="px-2 py-1 bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full">{t}</span>
                  )) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}