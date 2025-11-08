"use client";
import Link from "next/link";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function HeaderNav() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-black/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container-expanded py-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            <Link href="/">FRILO</Link>
          </div>
          <nav className="hidden lg:flex space-x-6">
            <Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Discover</Link>
            <Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Templates</Link>
            <Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Categories</Link>
            <Link href="#" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Collections</Link>
            <Link href="/submit" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Submit</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <Link href="/signin" className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-black dark:text-white font-semibold px-6 py-3 rounded-full transition-all transform hover:scale-105">Sign In</Link>
          <Link href="/signup" className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-3 rounded-full transition-all transform hover:scale-105">Get Started</Link>
        </div>
      </div>
    </header>
  );
}