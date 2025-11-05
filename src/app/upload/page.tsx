'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Cropper from 'react-easy-crop';
import getCroppedImg from './cropImage'; // Helper function to get cropped image

// Define the type for the image data
type SectionImage = {
  id: string;
  url: string;
  label: string;
  description?: string | null;
  tags: any;
  createdAt: string;
};

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result as string);
      });
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select an image file to upload');
      return;
    }
    setUploading(true);
    try {
      const croppedImage = await getCroppedImg(
        imageSrc!,
        croppedAreaPixels!,
        0
      );

      const formData = new FormData();
      // @ts-ignore
      formData.append('file', croppedImage, selectedFile.name);
      formData.append('label', label);
      formData.append('description', description);
      const tagsArray = tagsInput
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);
      formData.append('tags', JSON.stringify(tagsArray));

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Upload failed');
      }

      alert('Image uploaded successfully');
      window.location.href = '/';
    } catch (err) {
      console.error('Upload error', err);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-black/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              <a href="/">FRILO</a>
            </div>
          </div>
        </div>
      </header>
      <section className="container mx-auto px-4 py-8">
        <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4">Add Your Image</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Upload an image and tag it. It will appear on the homepage in the Community Images section.</p>
          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm mb-2">Image File</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2"
                />
              </div>
            </div>
            {imageSrc && (
              <div className="relative h-96 bg-gray-200 dark:bg-gray-800 rounded-lg my-4">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={16 / 9}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
            )}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm mb-2">Label</label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g., Hero Section"
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
                rows={3}
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Tags (comma-separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g., hero, gradient, minimal"
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={uploading}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-full transition-all transform hover:scale-105 disabled:opacity-60"
              >
                {uploading ? 'Uploading…' : 'Upload Image'}
              </button>
              {selectedFile && (
                <span className="text-sm text-gray-600 dark:text-gray-400">Selected: {selectedFile.name}</span>
              )}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}