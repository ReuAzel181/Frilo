export default function Hero() {
  return (
    <section>
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="font-bold mb-4 bg-gradient-to-r from-black via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
          Discover Curated Website Sections
        </h1>
        <p className="text-gray-600 dark:text-gray-400 gap-title-body">
          Showcasing 1,500+ premium website sections, hover effects, and SVG library. New content added weekly from top designers.
        </p>
        <div className="gap-before-buttons" />
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
  );
}