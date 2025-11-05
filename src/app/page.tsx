'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useContext, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import ThemeSwitcher from '@/components/ThemeSwitcher';

export default function Home() {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return null; // Or a loading indicator
  }

  const { isAuthenticated, logout } = authContext;

  type SectionImage = {
    id: string;
    url: string;
    label: string;
    description?: string | null;
    tags: any;
    createdAt: string;
  };

  const [templates, setTemplates] = useState<Template[]>([]);
  const [sortOrder, setSortOrder] = useState('Newest First');
  const [activeStyle, setActiveStyle] = useState('Latest');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<SectionImage[]>([]);
  const [layout, setLayout] = useState('Compact');

  const handleFavorite = async (submissionId: string) => {
    if (!isAuthenticated) {
      alert('Please sign in to favorite submissions');
      return;
    }

    try {
      const response = await fetch('/api/favorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ submissionId }),
      });

      if (response.ok) {
        // Update the local state to reflect the favorite status
        setTemplates(prevTemplates => 
          prevTemplates.map(template => 
            template._id === submissionId 
              ? { ...template, isFavorited: !template.isFavorited }
              : template
          )
        );
      } else {
        console.error('Failed to update favorite status');
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
  };

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      alert('URL copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy URL:', error);
      alert('Failed to copy URL');
    }
  };



  const filteredTemplates = useMemo(() => {
    // Create a shallow copy to sort, to avoid mutating the original `templates` array.
    let filtered = [...templates];

    if (activeStyle === 'Favorite') {
      filtered = filtered.filter(template => template.isFavorited);
    } else if (activeStyle === 'Followed') {
      // TODO: Implement 'Followed' filter when follow functionality is added
    }

    if (sortOrder === "Newest First") {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortOrder === "Oldest First") {
      filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    return filtered;
  }, [templates, sortOrder, activeStyle]);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Header/Navigation - Webflow-style */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-black/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              FRILO
            </div>
            <nav className="hidden lg:flex space-x-6">
              <Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Discover</Link>
              <Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Templates</Link>
              <Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Categories</Link>
              <Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Collections</Link>
              <Link href="/submit" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Submit</Link>
              <Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <span>Favorites</span>
                </div>
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-full transition-all transform hover:scale-105"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link href="/signin">
                  <button className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-black dark:text-white font-semibold px-6 py-3 rounded-full transition-all transform hover:scale-105">
                    Sign In
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-full transition-all transform hover:scale-105">
                    Get Started
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section - Combined approach */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-black via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
            Discover Curated Website Sections
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-8">
            Showcasing 1,500+ premium website sections, hover effects, and SVG library. 
            New content added weekly from top designers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="relative flex-1 max-w-md mx-auto sm:mx-0">
              <input 
                type="text" 
                placeholder="Search sections, templates, components..."
                className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-full px-6 py-3 text-black dark:text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-400 hover:bg-yellow-500 text-black p-2 rounded-full">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            <button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold px-8 py-3 rounded-full transition-all transform hover:scale-105">
              Browse All Sections
            </button>
          </div>
        </div>
      </section>




  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch('/api/sections');
        if (res.ok) {
          const data = await res.json();
          setImages(data);
        }
      } catch (err) {
        console.error('Error fetching community images', err);
      }
    };
    fetchImages();
  }, []);

      {/* Community Images Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Community Images</h2>
          <div className="flex items-center space-x-2">
            <button onClick={() => setLayout('Compact')} className={`px-3 py-1 rounded-full text-sm font-medium ${layout === 'Compact' ? 'bg-yellow-400 text-black' : 'bg-gray-200 dark:bg-gray-800'}`}>Compact</button>
            <button onClick={() => setLayout('Expanded')} className={`px-3 py-1 rounded-full text-sm font-medium ${layout === 'Expanded' ? 'bg-yellow-400 text-black' : 'bg-gray-200 dark:bg-gray-800'}`}>Expanded</button>
            <button className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 dark:bg-gray-800">Featured</button>
            <button className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 dark:bg-gray-800">New</button>
            <button className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 dark:bg-gray-800">Popular</button>
          </div>
        </div>
        <div className={`grid gap-8 ${layout === 'Compact' ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
          {images.map((item) => (
            <div key={item.id} className="group relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-yellow-400 transition-all">
              <div className="aspect-video bg-gray-100 dark:bg-gray-800">
                <img src={item.url} alt={item.label} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2 group-hover:text-yellow-400 transition-colors">{item.label}</h3>
                {item.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{item.description}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(item.tags) ? item.tags.map((t: any, i: number) => (
                    <span key={i} className="px-2 py-1 bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full">{String(t)}</span>
                  )) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Latest Sections</h2>
          <div className="flex items-center space-x-4">
            <span className="text-gray-500 dark:text-gray-400">Sort by:</span>
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-black dark:text-white"
            >
              <option>Latest</option>
              <option>Favorite</option>
              <option>Followed</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template, index) => (
            <div key={index} className="group relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-yellow-400 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
              {/* Card Image Preview */}
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                      </svg>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{template.category}</p>
                  </div>
                </div>
                <div className="absolute top-3 right-3 flex items-center space-x-2">
                  {template.featured && (
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                      NEW
                    </div>
                  )}
                  <button 
                    onClick={() => handleFavorite(template._id)}
                    className={`p-2 rounded-full transition-colors ${
                      template.isFavorited 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-black/50 hover:bg-black/75'
                    }`}
                  >
                    <svg 
                      className={`w-5 h-5 ${template.isFavorited ? 'text-white' : 'text-white'}`} 
                      fill={template.isFavorited ? 'currentColor' : 'none'}
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-3 group-hover:text-yellow-400 transition-colors">
                  {template.title}
                </h3>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {template.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="px-2 py-1 bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">{new Date(template.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleCopy(template.url || window.location.href)}
                      className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                      title="Copy URL"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <Link href={`/components/${index}`} passHref>
                      <button className="bg-gray-200 dark:bg-gray-800 hover:bg-yellow-400 hover:text-black text-gray-600 dark:text-gray-300 px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105">
                        View Section
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-700 px-8 py-3 rounded-full font-medium transition-all transform hover:scale-105">
            Load More Sections
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-gray-900 to-black py-16 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">1,500+</div>
              <div className="text-gray-400">Website Sections</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">50+</div>
              <div className="text-gray-400">Categories</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">Weekly</div>
              <div className="text-gray-400">New Content</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">Premium</div>
              <div className="text-gray-400">Quality</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4">
                FRILO
              </div>
              <p className="text-gray-500 dark:text-gray-400 max-w-xs">
                A curated collection of the best website sections and components from around the web.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-black dark:text-white">Explore</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li><Link href="#" className="hover:text-yellow-400 transition-colors">Discover</Link></li>
                <li><Link href="#" className="hover:text-yellow-400 transition-colors">Templates</Link></li>
                <li><Link href="#" className="hover:text-yellow-400 transition-colors">Categories</Link></li>
                <li><Link href="#" className="hover:text-yellow-400 transition-colors">Collections</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-black dark:text-white">Contribute</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li><Link href="/submit" className="hover:text-yellow-400 transition-colors">Submit a Section</Link></li>
                <li><Link href="#" className="hover:text-yellow-400 transition-colors">Guidelines</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-black dark:text-white">Follow</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li><Link href="#" className="hover:text-yellow-400 transition-colors">Twitter</Link></li>
                <li><Link href="#" className="hover:text-yellow-400 transition-colors">Discord</Link></li>
                <li><Link href="#" className="hover:text-yellow-400 transition-colors">GitHub</Link></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-gray-500 dark:text-gray-400 pt-8 border-t border-gray-200 dark:border-gray-800">
            <p>&copy; {new Date().getFullYear()} FRILO. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
