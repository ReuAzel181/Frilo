export default function Stats() {
  return (
    <section>
      <div className="container-expanded no-side-padding">
        <div className="grid grid-cols-2 md:grid-cols-4 gutter-default text-center">
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
  );
}