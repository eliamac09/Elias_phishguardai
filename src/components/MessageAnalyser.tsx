import { useState } from 'react';

interface MessageAnalyserProps {
  onAnalyze: (text: string) => void;
  isAnalyzing: boolean;
}

export default function MessageAnalyser({ onAnalyze, isAnalyzing }: MessageAnalyserProps) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!text.trim()) {
      setError('Please paste a message to analyse.');
      return;
    }
    if (text.length > 5000) {
      setError('Input exceeds the 5000-character limit.');
      return;
    }
    onAnalyze(text);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">📧 Message Analyser</h2>
        <p className="text-gray-500 mt-1">Paste the text of a suspicious email or SMS message below.</p>
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
            Suspicious message text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            placeholder="Paste email or SMS text here..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-sm font-mono"
          />
          <p className="text-xs text-gray-400 mt-1">{text.length}/5000 characters</p>
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
            'Analyse message'
          )}
        </button>
      </form>
    </div>
  );
}
