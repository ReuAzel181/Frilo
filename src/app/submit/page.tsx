'use client';

import { useState } from 'react';

export default function SubmitPage() {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, url, description }),
    });

    const data = await res.json();

    if (res.ok) {
      setSuccess(data.message);
      setTitle('');
      setUrl('');
      setDescription('');
    } else {
      setError(data.message);
    }
  };

  return (
    <section>
      <div className="max-w-2xl mx-auto">
          <h1 className="font-bold mb-4 text-center">Submit a Section</h1>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {success && <p className="text-green-500 text-center mb-4">{success}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-400">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 mt-2 text-white focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                required
              />
            </div>
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-400">URL</label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 mt-2 text-white focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-400">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 mt-2 text-white focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                required
              />
            </div>
            <div className="text-center gap-before-buttons">
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3 rounded-full transition-all transform hover:scale-105"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
    </section>
  );
}