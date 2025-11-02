import { useRouter } from 'next/router';
import { useState } from 'react';

const ComponentDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const codeToCopy = `// Code for component ${id}`;
    navigator.clipboard.writeText(codeToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-4">Component Detail Page</h1>
      <p>Component ID: {id}</p>
      <button 
        onClick={handleCopy}
        className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-full transition-all transform hover:scale-105 mt-4"
      >
        {copied ? 'Copied!' : 'Copy Code'}
      </button>
    </div>
  );
};

export default ComponentDetailPage;