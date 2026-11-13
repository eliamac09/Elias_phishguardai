import { HistoryEntry, Page } from '../types';

interface HomePageProps {
  history: HistoryEntry[];
  onNavigate: (page: Page) => void;
}

export default function HomePage({ history, onNavigate }: HomePageProps) {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="text-center py-8">
        <div className="text-6xl mb-4">🛡️</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">PhishGuard AI</h1>
        <p className="text-xl text-gray-500">Detect. Alert. Educate. Protect.</p>
      </div>

      {/* Description */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <p className="text-gray-700 leading-relaxed">
          PhishGuard AI is an explainable, human-centred assistant that analyses suspicious emails, SMS messages and URLs. 
          It identifies observable risk indicators, assigns an advisory risk category, and offers plain-language cybersecurity advice.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <button
          onClick={() => onNavigate('message')}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-indigo-300 hover:shadow-md transition-all text-left group"
        >
          <div className="text-3xl mb-3">📧</div>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-700">Analyse a message</h3>
          <p className="text-sm text-gray-500 mt-1">Paste suspicious email or SMS text for analysis</p>
        </button>
        <button
          onClick={() => onNavigate('url')}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-indigo-300 hover:shadow-md transition-all text-left group"
        >
          <div className="text-3xl mb-3">🔗</div>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-700">Analyse a URL</h3>
          <p className="text-sm text-gray-500 mt-1">Check a suspicious link without opening it</p>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent activity</h3>
        {history.length === 0 ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-700 text-sm">
            No genuine scan records in this session. History is session-only and cleared when you close the tab.
          </div>
        ) : (
          <div className="space-y-3">
            {history.slice(0, 5).map((r, i) => (
              <div key={i} className="flex items-center gap-3 text-sm border-b border-gray-50 pb-2">
                <span className="text-gray-400 text-xs">{r.ts}</span>
                <span className="text-gray-600">{r.type}</span>
                <RiskBadge band={r.band} />
                <span className="text-gray-500 text-xs">score {r.score}</span>
                <span className="text-gray-400 text-xs truncate">
                  {r.indicators.length > 0 ? r.indicators.join(', ') : 'None'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RiskBadge({ band }: { band: string }) {
  const colors: Record<string, string> = {
    Low: 'bg-green-500',
    Medium: 'bg-yellow-500',
    High: 'bg-red-500',
    Inconclusive: 'bg-gray-500',
  };
  return (
    <span className={`${colors[band] || 'bg-gray-500'} text-white text-xs font-bold px-2 py-0.5 rounded-full`}>
      {band.toUpperCase()}
    </span>
  );
}
