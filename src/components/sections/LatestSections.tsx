"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type SectionImage = {
  id: string;
  url: string;
  label: string;
  description?: string | null;
  tags?: string[];
  createdAt: string;
};

export default function LatestSections() {
  const [items, setItems] = useState<SectionImage[]>([]);
  const [sortOrder, setSortOrder] = useState<"Newest" | "Oldest">("Newest");
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
  }, []);

  const sorted = useMemo(() => {
    const copy = [...items];
    copy.sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sortOrder === "Newest" ? db - da : da - db;
    });
    return copy;
  }, [items, sortOrder]);

  return (
    <section>
      <div className="container-expanded">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-bold">Latest Sections</h2>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 dark:text-gray-400">Sort:</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-full px-3 py-1.5 text-black dark:text-white text-sm"
            >
              <option value="Newest">Newest First</option>
              <option value="Oldest">Oldest First</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gutter-default">
          {loading && Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
          ))}
          {!loading && sorted.map((item, index) => (
            <div key={item.id} className="group relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-yellow-400 transition-all">
              <img src={item.url} alt={item.label} className="w-full h-40 object-cover" />
              
              <div className="p-6">
                <h5 className="font-semibold mb-3 group-hover:text-yellow-400 transition-colors">
                  {item.label}
                </h5>
                <div className="flex flex-wrap gap-2 mb-4">
                  {Array.isArray(item.tags) && item.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="px-2 py-1 bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">{new Date(item.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => navigator.clipboard.writeText(item.url)}
                      className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                      title="Copy URL"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <Link href={`/gallery`} className="bg-gray-200 dark:bg-gray-800 hover:bg-yellow-400 hover:text-black text-gray-600 dark:text-gray-300 px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105">
                      View Gallery
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}