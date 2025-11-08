import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
      <div className="container-expanded py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gutter-default mb-8">
          <div className="md:col-span-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4">
              FRILO
            </div>
            <p className="text-gray-500 dark:text-gray-400 max-w-xs">
              A curated collection of the best website sections and components from around the web.
            </p>
          </div>
          <div>
            <h6 className="font-semibold mb-4 text-black dark:text-white">Explore</h6>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li><Link href="#" className="hover:text-yellow-400 transition-colors">Discover</Link></li>
              <li><Link href="#" className="hover:text-yellow-400 transition-colors">Templates</Link></li>
              <li><Link href="#" className="hover:text-yellow-400 transition-colors">Categories</Link></li>
              <li><Link href="#" className="hover:text-yellow-400 transition-colors">Collections</Link></li>
            </ul>
          </div>
          <div>
            <h6 className="font-semibold mb-4 text-black dark:text-white">Contribute</h6>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li><Link href="/submit" className="hover:text-yellow-400 transition-colors">Submit a Section</Link></li>
              <li><Link href="#" className="hover:text-yellow-400 transition-colors">Guidelines</Link></li>
            </ul>
          </div>
          <div>
            <h6 className="font-semibold mb-4 text-black dark:text-white">Follow</h6>
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
  );
}