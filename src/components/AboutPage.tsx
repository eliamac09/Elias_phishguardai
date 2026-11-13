export default function AboutPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">ℹ️ About PhishGuard AI</h2>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-6">
        <p className="text-gray-700">
          PhishGuard AI is a lightweight, privacy-first, explainable phishing-awareness assistant. It is{' '}
          <strong>not</strong> a replacement for email security gateways, MFA, endpoint protection, or professional incident response.
        </p>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Design principles</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="bg-indigo-100 text-indigo-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shrink-0">1</span>
              <div>
                <p className="font-medium text-gray-900">Deterministic classification</p>
                <p className="text-sm text-gray-500">Risk bands come from a transparent rule engine.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-indigo-100 text-indigo-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shrink-0">2</span>
              <div>
                <p className="font-medium text-gray-900">AI as explainer, not decider</p>
                <p className="text-sm text-gray-500">The AI cannot override the rule-based score.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-indigo-100 text-indigo-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shrink-0">3</span>
              <div>
                <p className="font-medium text-gray-900">Privacy-by-design</p>
                <p className="text-sm text-gray-500">No data retention, no credential collection, no URL fetching.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-indigo-100 text-indigo-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shrink-0">4</span>
              <div>
                <p className="font-medium text-gray-900">Zero-trust input</p>
                <p className="text-sm text-gray-500">All user input is treated as untrusted data.</p>
              </div>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Limitations</h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-red-400">⚠</span>
              <span>No inbox integration — requires manual copy/paste.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400">⚠</span>
              <span>Lexical analysis only — cannot verify sender identity (SPF/DKIM).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400">⚠</span>
              <span>English-language patterns; other languages may be less effective.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400">⚠</span>
              <span>This prototype uses a <strong>mock</strong> AI explainer; a real LLM provider can be wired in later.</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Honest status</h4>
          <ul className="space-y-1 text-xs text-gray-600">
            <li>✅ Rule-based detection: implemented and runs locally.</li>
            <li>✅ URL analysis: lexical only, NO network requests (SSRF-safe).</li>
            <li>⚙️ AI explanation: MOCK explainer, clearly labelled [MOCK] in the UI.</li>
            <li>❌ Threat intel / ML: not wired in this single-file build (out of scope).</li>
            <li>✅ History: session-only, metadata only, no raw text stored.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
