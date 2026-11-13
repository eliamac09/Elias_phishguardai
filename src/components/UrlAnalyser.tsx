import { useState } from 'react';

interface UrlAnalyserProps {
  onAnalyze: (url: string) => void;
  isAnalyzing: boolean;
}

export default function UrlAnalyser({ onAnalyze, isAnalyzing }: UrlAnalyserProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!url.trim()) {
      setError('Please paste a URL to analyse.');
      return;
    }
    onAnalyze(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">🔗 URL Analyser</h2>
        <p className="text-gray-500 mt-1">
          Paste a suspicious URL below. <strong>The URL is analysed lexically only — it is never opened or fetched.</strong>
        </p>
      </div>

      {/* Privacy Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
        <p className="font-medium">⚠️ Privacy & Safety:</p>
        <p className="text-sm mt-1">
          Do NOT enter passwords, OTPs, bank account numbers, or confidential information. 
          URLs are analysed lexically only — they are never opened or fetched.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Suspicious URL
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isAnalyzing}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Analysing...
            </>
          ) : (
            'Analyse URL'
          )}
        </button>
      </form>
    </div>
  );
}
