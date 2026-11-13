import { useState } from 'react';

type Tab = 'phishing' | 'emails' | 'websites' | 'impersonation' | 'passwords' | 'reporting';

export default function AwarenessCentre() {
  const [activeTab, setActiveTab] = useState<Tab>('phishing');

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'phishing', label: 'What is phishing?', icon: '🎣' },
    { id: 'emails', label: 'Emails & SMS', icon: '📧' },
    { id: 'websites', label: 'Fake websites', icon: '🔗' },
    { id: 'impersonation', label: 'Impersonation & BEC', icon: '🎭' },
    { id: 'passwords', label: 'Passwords & OTPs', icon: '🔐' },
    { id: 'reporting', label: 'Reporting & recovery', icon: '🚨' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">🎓 Cybersecurity Awareness Centre</h2>
        <p className="text-gray-500 mt-1">Learn to recognise and defend against phishing attacks.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        {activeTab === 'phishing' && (
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed">
              Phishing is a cyberattack where criminals disguise themselves as trusted entities to trick you into 
              clicking malicious links, opening infected attachments, or revealing sensitive information.
            </p>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mt-4">
              <p className="text-indigo-800 font-medium">
                💡 The golden rule: if a message demands immediate action or asks for sensitive data, pause and verify independently.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'emails' && (
          <div className="space-y-4">
            <p className="text-gray-700"><strong>Common tactics:</strong> urgency/fear, curiosity/greed, authority impersonation.</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 italic">
                📱 "Delivery Notice: Your package is delayed. Track it here: bit.ly/3xYz9"
              </p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Why suspicious:</strong> URL shortener hides the true destination, and a minor inconvenience prompts quick clicking.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'websites' && (
          <div className="space-y-4">
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>
                <strong>Lookalike domains</strong> — <code className="bg-gray-100 px-1 rounded">paypa1.com</code> (number '1' instead of 'l').
              </li>
              <li>
                <strong>IP addresses</strong> — legitimate businesses rarely use <code className="bg-gray-100 px-1 rounded">http://192.168.1.45/login</code>.
              </li>
              <li>
                <strong>Excessive subdomains</strong> — <code className="bg-gray-100 px-1 rounded text-xs">secure.login.verify.apple.com.suspicious-site.net</code>.
              </li>
              <li>
                <strong>The HTTPS myth</strong> — a padlock only means the connection is encrypted, not that the site is legitimate.
              </li>
            </ol>
          </div>
        )}

        {activeTab === 'impersonation' && (
          <div className="space-y-4">
            <p className="text-gray-700">
              <strong>Business Email Compromise (BEC):</strong> attackers compromise business email accounts to authorise fraudulent wire transfers.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 italic">
                📧 "Hi Team, I'm in a meeting. Please urgently update the bank details for Invoice #9928 to the attached new account. Thanks, CEO."
              </p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Why suspicious:</strong> bypasses standard procurement, creates artificial urgency, requests a change in financial routing. Always verify via a secondary channel.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'passwords' && (
          <div className="space-y-4">
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span><strong>Never share your OTP</strong> — no legitimate service asks for it via email/SMS.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span><strong>Beware MFA fatigue</strong> — deny unexpected push notifications.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span><strong>Use a password manager</strong> for unique, complex passwords.</span>
              </li>
            </ul>
          </div>
        )}

        {activeTab === 'reporting' && (
          <div className="space-y-4">
            <p className="text-gray-700 font-medium">If you clicked a suspicious link or entered data:</p>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>Disconnect from the internet if you downloaded a file.</li>
              <li>From a <em>different, secure device</em>, change the compromised password.</li>
              <li>Contact your bank's fraud department if you entered financial details.</li>
              <li>Monitor for unauthorised activity.</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
