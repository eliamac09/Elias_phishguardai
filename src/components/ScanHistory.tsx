import { HistoryEntry } from '../types';

interface ScanHistoryProps {
  history: HistoryEntry[];
  onClear: () => void;
}

export default function ScanHistory({ history, onClear }: ScanHistoryProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">📜 Scan History</h2>
        </div>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
          >
            🗑️ Clear history
          </button>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-700 text-sm">
        <strong>Privacy-by-design:</strong> history is session-only. No raw text, URLs, passwords or OTPs are stored. 
        Data is lost when you close the tab or refresh.
      </div>

      {history.length === 0 ? (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
          <p className="text-gray-400 text-lg">No genuine scan records in this session.</p>
          <p className="text-gray-400 text-sm mt-2">Analyse a message or URL to see results here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((r, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-gray-400 text-xs font-mono">{r.ts}</span>
                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">
                  {r.type}
                </span>
                <RiskBadge band={r.band} />
                <span className="text-gray-500 text-sm">Score: {r.score}</span>
              </div>
              <div className="mt-2">
                <span className="text-xs text-gray-500">Indicators: </span>
                <span className="text-xs text-gray-700">
                  {r.indicators.length > 0 ? r.indicators.join(', ') : 'None'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RiskBadge({ band }: { band: string }) {
  const colors: Record<string, string> = {
    Low: 'bg-green-500',
    Medium: 'bg-yellow-500 text-gray-900',
    High: 'bg-red-500',
    Inconclusive: 'bg-gray-500',
  };
  return (
    <span className={`${colors[band] || 'bg-gray-500'} text-white text-xs font-bold px-3 py-1 rounded-full`}>
      {band.toUpperCase()}
    </span>
  );
}
