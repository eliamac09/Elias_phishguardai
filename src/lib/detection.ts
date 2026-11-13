import { Indicator, EvidenceObject } from '../types';

// ---------------------------------------------------------------------------
// 1. CONFIGURABLE RULE WEIGHTS & THRESHOLDS
// ---------------------------------------------------------------------------
const WEIGHTS: Record<string, number> = {
  MSG_URGENCY: 1,
  MSG_CREDENTIALS: 3,
  MSG_IMPERSONATION: 2,
  MSG_ATTACHMENT: 2,
  URL_OBFUSCATION: 2,
  URL_SHORTENER: 1,
  URL_MISLEADING: 2,
  THREAT_INTEL_MALICIOUS: 4,
};

const THRESHOLD_LOW_MAX = 1;
const THRESHOLD_MEDIUM_MAX = 4;

// ---------------------------------------------------------------------------
// 2. INDICATOR PATTERNS
// ---------------------------------------------------------------------------
const URGENCY_PATTERNS = [
  /\b(urgent|immediate|suspended|restricted|verify|confirm|expire|failed|alert|action required|final warning|locked|disconnected)\b/gi,
];
const CREDENTIAL_PATTERNS = [
  /\b(password|passwd|otp|one.time.passcode|pin|cvv|ssn|bank.account|credit.card|payment.info)\b/gi,
];
const IMPERSONATION_PATTERNS = [
  /\b(dear customer|dear user|dear account holder|support team|account team|service desk)\b/gi,
];
const ATTACHMENT_PATTERNS = [
  /\b(attachment|download|invoice\.zip|document\.pdf|click.here.to.view|shared.a.document)\b/gi,
];

const SHORTENERS = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd', 'rb.gt'];
const BRAND_KEYWORDS = ['paypal', 'apple', 'microsoft', 'amazon', 'netflix', 'bank', 'secure', 'login'];

// ---------------------------------------------------------------------------
// 3. FEATURE EXTRACTION
// ---------------------------------------------------------------------------
interface MessageFeatures {
  indicators: string[];
  snippets: Record<string, string[]>;
}

interface UrlFeatures {
  indicators: string[];
  snippets: Record<string, string[]>;
  is_valid: boolean;
}

function extractMessageFeatures(text: string): MessageFeatures {
  const features: MessageFeatures = { indicators: [], snippets: {} };
  if (!text) return features;

  const families: Record<string, RegExp[]> = {
    URGENCY: URGENCY_PATTERNS,
    CREDENTIALS: CREDENTIAL_PATTERNS,
    IMPERSONATION: IMPERSONATION_PATTERNS,
    ATTACHMENT: ATTACHMENT_PATTERNS,
  };

  for (const [fam, pats] of Object.entries(families)) {
    for (const pat of pats) {
      const matches = text.match(pat);
      if (matches) {
        features.indicators.push(fam);
        features.snippets[fam] = [...new Set(matches.map(m => m.toLowerCase()))].slice(0, 3);
        break;
      }
    }
  }
  return features;
}

function extractUrlsFromText(text: string): string[] {
  if (!text) return [];
  const pat = /(https?:\/\/[^\s)"'<>]+|www\.[^\s)"'<>]+)/gi;
  const matches = text.match(pat);
  return matches ? [...new Set(matches)] : [];
}

function analyzeUrlFeatures(url: string): UrlFeatures {
  const features: UrlFeatures = { indicators: [], snippets: {}, is_valid: false };
  if (!url) return features;

  let fullUrl = url;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    fullUrl = 'http://' + url;
  }

  let parsed: URL;
  try {
    parsed = new URL(fullUrl);
    features.is_valid = true;
  } catch {
    return features;
  }

  const host = (parsed.hostname || '').toLowerCase();

  // Check if IP literal
  const ipv4Pattern = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
  if (ipv4Pattern.test(host)) {
    features.indicators.push('IP_LITERAL');
    features.snippets['IP_LITERAL'] = [host];
  }

  // Check shorteners
  if (SHORTENERS.some(s => host.endsWith(s))) {
    features.indicators.push('URL_SHORTENER');
    features.snippets['URL_SHORTENER'] = [host];
  }

  // Check excessive subdomains
  if (host.split('.').length > 3) {
    features.indicators.push('EXCESSIVE_SUBDOMAINS');
    features.snippets['EXCESSIVE_SUBDOMAINS'] = [host];
  }

  // Check suspicious encoding
  if (fullUrl.includes('%2') || host.includes('xn--')) {
    features.indicators.push('SUSPICIOUS_ENCODING');
    features.snippets['SUSPICIOUS_ENCODING'] = [fullUrl.includes('%2') ? fullUrl : host];
  }

  // Check misleading domain
  if (BRAND_KEYWORDS.some(b => host.includes(b))) {
    if (host.includes('-') || host.length > 25 || ['verify', 'secure', 'update'].some(k => parsed.pathname.includes(k))) {
      features.indicators.push('MISLEADING_DOMAIN');
      features.snippets['MISLEADING_DOMAIN'] = [host];
    }
  }

  return features;
}

// ---------------------------------------------------------------------------
// 4. SCORING & CLASSIFICATION
// ---------------------------------------------------------------------------
interface ClassificationResult {
  score: number;
  indicators: Indicator[];
  band: string;
}

function classify(
  msgFeat: MessageFeatures,
  urlFeat: UrlFeatures,
  _threatIntelMalicious: boolean = false
): ClassificationResult {
  let score = 0;
  const indicators: Indicator[] = [];

  const msgMap: Record<string, [string, string, string]> = {
    URGENCY: ['MSG_URGENCY', 'Urgency/Pressure Tactics',
      'Urgency or pressure tactics are commonly used in phishing to bypass critical thinking.'],
    CREDENTIALS: ['MSG_CREDENTIALS', 'Credential/Payment Request',
      'Requests for passwords, OTPs, or financial details are primary indicators of credential harvesting.'],
    IMPERSONATION: ['MSG_IMPERSONATION', 'Generic Impersonation',
      'Generic greetings or claims of being a support team are often used when the attacker lacks specific target details.'],
    ATTACHMENT: ['MSG_ATTACHMENT', 'Suspicious Attachment',
      'Unexpected attachments or download links are common vectors for malware delivery.'],
  };

  for (const [fam, [rid, name, sig]] of Object.entries(msgMap)) {
    if (msgFeat.indicators.includes(fam)) {
      const w = WEIGHTS[rid];
      score += w;
      indicators.push({
        rule_id: rid,
        name,
        category: 'message',
        weight: w,
        evidence_snippets: msgFeat.snippets[fam] || [],
        significance: sig,
      });
    }
  }

  // URL obfuscation family
  const obfuscation = ['IP_LITERAL', 'EXCESSIVE_SUBDOMAINS', 'SUSPICIOUS_ENCODING'];
  if (urlFeat.indicators.some(t => obfuscation.includes(t))) {
    const w = WEIGHTS['URL_OBFUSCATION'];
    score += w;
    const snippets: string[] = [];
    for (const t of obfuscation) {
      if (urlFeat.snippets[t]) snippets.push(...urlFeat.snippets[t]);
    }
    indicators.push({
      rule_id: 'URL_OBFUSCATION',
      name: 'URL Obfuscation/IP Literal',
      category: 'url',
      weight: w,
      evidence_snippets: [...new Set(snippets)].slice(0, 3),
      significance: 'IP addresses, excessive subdomains, or encoding are used to hide the true destination of a link.',
    });
  }

  if (urlFeat.indicators.includes('URL_SHORTENER')) {
    const w = WEIGHTS['URL_SHORTENER'];
    score += w;
    indicators.push({
      rule_id: 'URL_SHORTENER',
      name: 'URL Shortener',
      category: 'url',
      weight: w,
      evidence_snippets: urlFeat.snippets['URL_SHORTENER'] || [],
      significance: 'Shortened URLs hide the final destination, preventing the user from verifying the link\'s safety before clicking.',
    });
  }

  if (urlFeat.indicators.includes('MISLEADING_DOMAIN')) {
    const w = WEIGHTS['URL_MISLEADING'];
    score += w;
    indicators.push({
      rule_id: 'URL_MISLEADING',
      name: 'Misleading/Lookalike Domain',
      category: 'url',
      weight: w,
      evidence_snippets: urlFeat.snippets['MISLEADING_DOMAIN'] || [],
      significance: 'Domains that mimic trusted brands are frequently used for impersonation.',
    });
  }

  let band: string;
  if (_threatIntelMalicious) {
    band = 'High';
  } else if (score <= THRESHOLD_LOW_MAX) {
    band = 'Low';
  } else if (score <= THRESHOLD_MEDIUM_MAX) {
    band = 'Medium';
  } else {
    band = 'High';
  }

  return { score, indicators, band };
}

// ---------------------------------------------------------------------------
// 5. DETECTION ORCHESTRATOR
// ---------------------------------------------------------------------------
export function runDetection(text: string = '', url: string = ''): EvidenceObject {
  const inputType = text && url ? 'combined' : text ? 'message' : 'url';
  const limitations: string[] = [];
  let isInconclusive = false;

  if (text.trim().length < 20 && !url) {
    isInconclusive = true;
    limitations.push('The provided text is too brief to establish context or identify meaningful patterns.');
  }
  if (url) {
    const uf = analyzeUrlFeatures(url);
    if (!uf.is_valid) {
      isInconclusive = true;
      limitations.push('The provided URL is malformed or could not be parsed.');
    }
  }
  if (!text.trim() && !url) {
    isInconclusive = true;
    limitations.push('No input was provided for analysis.');
  }

  // Feature extraction
  const msgFeat = text ? extractMessageFeatures(text) : { indicators: [], snippets: {} };
  const embeddedUrls = text ? extractUrlsFromText(text) : [];
  const allUrls = (url ? [url] : []).concat(embeddedUrls);

  const mergedUrlFeat: UrlFeatures = { indicators: [], snippets: {}, is_valid: false };
  for (const u of allUrls) {
    const uf = analyzeUrlFeatures(u);
    if (uf.is_valid) mergedUrlFeat.is_valid = true;
    for (const ind of uf.indicators) {
      if (!mergedUrlFeat.indicators.includes(ind)) mergedUrlFeat.indicators.push(ind);
    }
    for (const [k, v] of Object.entries(uf.snippets)) {
      if (!mergedUrlFeat.snippets[k]) mergedUrlFeat.snippets[k] = [];
      mergedUrlFeat.snippets[k].push(...v);
    }
  }

  const { score, indicators, band: rawBand } = classify(msgFeat, mergedUrlFeat);
  const band = isInconclusive ? 'Inconclusive' : rawBand;
  const finalScore = isInconclusive ? 0 : score;

  // Build explanation components
  const observed: string[] = [];
  const ruleFindings: string[] = [];
  for (const ind of indicators) {
    observed.push(...ind.evidence_snippets);
    ruleFindings.push(`Rule ${ind.rule_id} triggered in ${ind.category} content.`);
  }

  if (!isInconclusive) {
    limitations.push('Analysis is based solely on provided text/URL. Full email headers (SPF/DKIM) are not available.');
    limitations.push('The system does not automatically open or resolve links; analysis is strictly lexical.');
  }

  const rationale = indicators.length > 0
    ? `The risk score of ${finalScore} was calculated by summing the weights of ${indicators.length} triggered indicators.`
    : 'The risk score is 0 as no indicators were triggered.';

  const finalRationale = band === 'Inconclusive'
    ? 'The classification is Inconclusive because the available evidence is insufficient to make a reliable determination.'
    : rationale;

  const recommendations = [
    'Do not click links or download attachments from this message.',
    'Verify the sender\'s identity through an official, independent channel (e.g., type the organization\'s URL manually).',
    'Never share passwords, OTPs, or financial details via email or SMS.',
  ];
  if (band === 'Low') {
    recommendations.push('Note: a "Low" score indicates few observable indicators, but does not guarantee the message is safe.');
  }

  return {
    input_type: inputType,
    risk_band: band,
    risk_score: finalScore,
    indicators,
    examination_summary: `Analyzed ${inputType} content for phishing indicators.`,
    observed_evidence: [...new Set(observed)],
    rule_based_findings: ruleFindings,
    classification_rationale: finalRationale,
    system_limitations: limitations,
    security_recommendations: recommendations,
    ai_explanation: '',
    ai_is_mock: false,
  };
}

// ---------------------------------------------------------------------------
// 6. MOCK AI EXPLAINER
// ---------------------------------------------------------------------------
export function mockAiExplanation(ev: EvidenceObject): string {
  const parts: string[] = [`[MOCK AI] ${ev.examination_summary}`];

  if (ev.indicators.length > 0) {
    parts.push('Suspicious characteristics detected:');
    for (const ind of ev.indicators) {
      parts.push(`  • ${ind.name} — ${ind.significance}`);
      if (ind.evidence_snippets.length > 0) {
        parts.push(`      Observed: ${ind.evidence_snippets.slice(0, 2).map(s => `"${s}"`).join(', ')}`);
      }
    }
  } else {
    parts.push('No significant phishing indicators were identified.');
  }

  parts.push('');
  if (ev.risk_band === 'Inconclusive') {
    parts.push('Classification: INCONCLUSIVE. The available evidence is insufficient for a reliable assessment.');
  } else if (ev.risk_band === 'Low') {
    parts.push(`Classification: LOW RISK (score ${ev.risk_score}). This does not mean the message is safe; further verification is recommended if you have any doubts.`);
  } else if (ev.risk_band === 'Medium') {
    parts.push(`Classification: MEDIUM RISK (score ${ev.risk_score}). Suspicious characteristics were detected. Further verification is strongly recommended.`);
  } else {
    parts.push(`Classification: HIGH RISK (score ${ev.risk_score}). Multiple suspicious characteristics were detected; this content exhibits strong indicators of a phishing attempt.`);
  }

  parts.push('');
  parts.push('Recommended actions:');
  for (const r of ev.security_recommendations) {
    parts.push(`  ✓ ${r}`);
  }

  if (ev.system_limitations.length > 0) {
    parts.push('');
    parts.push('What the system could not verify:');
    for (const lim of ev.system_limitations) {
      parts.push(`  ⚠ ${lim}`);
    }
  }

  return parts.join('\n');
}
