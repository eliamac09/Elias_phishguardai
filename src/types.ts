export interface Indicator {
  rule_id: string;
  name: string;
  category: 'message' | 'url' | 'threat_intel';
  weight: number;
  evidence_snippets: string[];
  significance: string;
}

export interface EvidenceObject {
  input_type: string;
  risk_band: string;
  risk_score: number;
  indicators: Indicator[];
  examination_summary: string;
  observed_evidence: string[];
  rule_based_findings: string[];
  classification_rationale: string;
  system_limitations: string[];
  security_recommendations: string[];
  ai_explanation: string;
  ai_is_mock: boolean;
}

export interface HistoryEntry {
  ts: string;
  type: string;
  band: string;
  score: number;
  indicators: string[];
}

export type Page = 'home' | 'message' | 'url' | 'awareness' | 'history' | 'about';
