"use client";
import { useState } from "react";

export default function QuickUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [layoutTag, setLayoutTag] = useState<"Compact" | "Expanded">("Compact");
  const [deviceTag, setDeviceTag] = useState<"Mobile" | "Desktop">("Desktop");
  const [flagTags, setFlagTags] = useState<string[]>([]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!file) {
      setError("Please choose an image file");
      return;
    }

    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("file", file);
      fd.append("label", label);
      fd.append("description", description);
      const manualTags = tags.split(",").map(t => t.trim()).filter(Boolean);
      const combinedTags = Array.from(new Set([layoutTag, deviceTag, ...flagTags, ...manualTags]));
      fd.append("tags", JSON.stringify(combinedTags));

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Upload failed");

      setSuccess("Image added to Community Images");
      // Broadcast to homepage sections so CommunityImages can update immediately
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("section-image-added", { detail: json }));
      }
      // Clear form
      setFile(null);
      setLabel("");
      setDescription("");
      setTags("");
    } catch (err: any) {
      setError(err?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <section>
      {/* Minimalist header with toggle */}
      <div className="container-expanded">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold">Contribute an Image</h2>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-full"
          >
            {open ? "Hide Form" : "Add Image"}
          </button>
        </div>
      </div>
      {open && (
        <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 container-expanded overflow-visible">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Image File</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gutter-default">
              <div>
                <label className="block text-sm mb-2">Label</label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2"
                />
              </div>
            </div>
            {/* Preset labels for layout and device */}
            <div className="grid grid-cols-1 md:grid-cols-2 gutter-default">
              <div>
                <label className="block text-sm mb-2">Layout</label>
                <div className="flex gap-2">
                  {(["Compact","Expanded"] as const).map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setLayoutTag(opt)}
                      className={`px-3 py-1 rounded-full text-sm ${layoutTag===opt?"bg-yellow-400 text-black":"bg-gray-200 dark:bg-gray-800"}`}
                    >{opt}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm mb-2">Device</label>
                <div className="flex gap-2">
                  {(["Mobile","Desktop"] as const).map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setDeviceTag(opt)}
                      className={`px-3 py-1 rounded-full text-sm ${deviceTag===opt?"bg-yellow-400 text-black":"bg-gray-200 dark:bg-gray-800"}`}
                    >{opt}</button>
                  ))}
                </div>
              </div>
            </div>
            {/* Flags */}
            <div>
              <label className="block text-sm mb-2">Flags</label>
              <div className="flex flex-wrap gap-2">
                {["Featured","Popular"].map(f => {
                  const active = flagTags.includes(f);
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFlagTags(prev => active ? prev.filter(x=>x!==f) : [...prev, f])}
                      className={`px-3 py-1 rounded-full text-sm ${active?"bg-yellow-400 text-black":"bg-gray-200 dark:bg-gray-800"}`}
                    >{f}</button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="block text-sm mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2"
              />
            </div>
            <div className="buttons-inline">
              <button
                type="submit"
                disabled={uploading}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-full transition-all transform hover:scale-105 disabled:opacity-60"
              >
                {uploading ? "Uploading…" : "Add Image"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}