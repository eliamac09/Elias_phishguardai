import { useState, useCallback } from 'react';
import { Page, EvidenceObject, HistoryEntry } from './types';
import { runDetection, mockAiExplanation } from './lib/detection';
import HomePage from './components/HomePage';
import MessageAnalyser from './components/MessageAnalyser';
import UrlAnalyser from './components/UrlAnalyser';
import AwarenessCentre from './components/AwarenessCentre';
import ScanHistory from './components/ScanHistory';
import AboutPage from './components/AboutPage';
import ResultsPanel from './components/ResultsPanel';

function App() {
  const [page, setPage] = useState<Page>('home');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [lastResult, setLastResult] = useState<EvidenceObject | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const addToHistory = useCallback((ev: EvidenceObject) => {
    const entry: HistoryEntry = {
      ts: new Date().toLocaleString(),
      type: ev.input_type,
      band: ev.risk_band,
      score: ev.risk_score,
      indicators: ev.indicators.map(i => i.name),
    };
    setHistory(prev => [entry, ...prev].slice(0, 20));
  }, []);

  const analyzeMessage = useCallback((text: string) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const ev = runDetection(text);
      ev.ai_explanation = mockAiExplanation(ev);
      ev.ai_is_mock = true;
      setLastResult(ev);
      addToHistory(ev);
      setIsAnalyzing(false);
    }, 600);
  }, [addToHistory]);

  const analyzeUrl = useCallback((url: string) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const ev = runDetection('', url);
      ev.ai_explanation = mockAiExplanation(ev);
      ev.ai_is_mock = true;
      setLastResult(ev);
      addToHistory(ev);
      setIsAnalyzing(false);
    }, 600);
  }, [addToHistory]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const navItems: { id: Page; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'message', label: 'Message Analyser', icon: '📧' },
    { id: 'url', label: 'URL Analyser', icon: '🔗' },
    { id: 'awareness', label: 'Awareness Centre', icon: '🎓' },
    { id: 'history', label: 'Scan History', icon: '📜' },
    { id: 'about', label: 'About', icon: 'ℹ️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🛡️</span>
            <div>
              <h1 className="text-xl font-bold tracking-tight">PhishGuard AI</h1>
              <p className="text-indigo-200 text-xs">Detect. Alert. Educate. Protect.</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  page === item.id
                    ? 'bg-white/20 text-white'
                    : 'text-indigo-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="mr-1">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar - mobile toggle + desktop sidebar */}
        <aside className="hidden md:block w-64 bg-white border-r border-gray-200 shadow-sm">
          <nav className="p-4 space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-3 ${
                  page === item.id
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
          <div className="flex justify-around py-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`flex flex-col items-center px-2 py-1 rounded-lg text-xs ${
                  page === item.id ? 'text-indigo-700' : 'text-gray-500'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="mt-0.5">{item.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {page === 'home' && (
              <HomePage
                history={history}
                onNavigate={setPage}
              />
            )}
            {page === 'message' && (
              <MessageAnalyser
                onAnalyze={analyzeMessage}
                isAnalyzing={isAnalyzing}
              />
            )}
            {page === 'url' && (
              <UrlAnalyser
                onAnalyze={analyzeUrl}
                isAnalyzing={isAnalyzing}
              />
            )}
            {page === 'awareness' && <AwarenessCentre />}
            {page === 'history' && (
              <ScanHistory
                history={history}
                onClear={clearHistory}
              />
            )}
            {page === 'about' && <AboutPage />}

            {/* Results Panel */}
            {lastResult && (page === 'message' || page === 'url') && (
              <ResultsPanel result={lastResult} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
