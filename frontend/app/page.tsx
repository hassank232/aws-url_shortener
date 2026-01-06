'use client';

import { useState } from 'react';

export default function Home() {
  const [longUrl, setLongUrl] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleShorten = async () => {
    setError('');
    setShortCode('');
    setCopied(false);
    
    if (!longUrl.trim()) {
      setError('Please enter a URL');
      return;
    }

    try {
      const url = new URL(longUrl);
      // Check if it has http:// or https://
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        setError('URL must start with http:// or https://');
        return;
      }
    } catch {
      setError('Please enter a valid URL (must include http:// or https://)');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://ilcz7i7t4d.execute-api.us-east-1.amazonaws.com/dev/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ longUrl }),
      });

      const data = await response.json();

      if (response.ok) {
        setShortCode(data.shortCode);
      } else {
        setError('Failed to shorten URL');
      }
    } catch {
      setError('Network error. Please try again.');
    }

    setLoading(false);
  };

  const handleCopy = async () => {
    const shortUrl = `https://ilcz7i7t4d.execute-api.us-east-1.amazonaws.com/dev/${shortCode}`;
    
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      
      // Reset "Copied!" message after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError('Failed to copy to clipboard');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-900 via-black to-red-900 flex items-center justify-center p-4">
      <div className="bg-black rounded-lg shadow-2xl p-8 max-w-2xl w-full border border-red-600">
        
        <h1 className="text-5xl font-bold text-red-600 mb-2 text-center">
          URL Shortener
        </h1>
        
        <p className="text-gray-300 text-center mb-8 text-lg">
          Paste your long link here
        </p>
        
        <div className="mb-4">
          <input
            type="text"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-red-500 focus:outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleShorten()}
          />
        </div>

        <button
          onClick={handleShorten}
          disabled={loading}
          className="w-full bg-red-700 hover:bg-red-800 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg"
        >
          {loading ? 'Shortening...' : 'Shorten!'}
        </button>

        {error && (
          <div className="mt-4 p-1 w-84 mx-auto border border-red-700 rounded-lg">
            <p className="text-white text-2xl text-center">{error}</p>
          </div>
        )}

        {shortCode && (
          <div className="mt-6 p-6 bg-black rounded-lg border border-red-700">
            <p className="text-gray-400 text-sm mb-2">Your shortened URL (click the link or use Copy button):</p>
            
            <a
              href={`https://ilcz7i7t4d.execute-api.us-east-1.amazonaws.com/dev/${shortCode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-500 text-xl font-mono hover:text-blue-500 underline break-all block mb-4"
            >
              myshort.url/{shortCode}
            </a>

            <button
                onClick={handleCopy}
                className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg font-bold whitespace-nowrap"
              >
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
          </div>
        )}
      </div>
    </main>
  );
}