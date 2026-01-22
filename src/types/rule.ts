// Complete rule type definitions
export interface RuleCondition {
  fact: string;
  operator: 'equals' | 'notEquals' | 'in' | 'notIn' | 'greaterThan' | 'lessThan';
  value: any;
  description?: string;
}

export interface RiskAssessment {
  level: 'HIGH' | 'MEDIUM' | 'LOW';
  reason: string;
  confidence: number; // 0-100
  impact: string; // Financial, Compliance, Operational
}

export interface LegalReference {
  domain: string;
  section?: string;
  notification?: string;
  circular?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
}

export interface GSTRule {
  id: string;
  name: string;
  description: string;
  version: string;
  domain: 'EXEMPTION' | 'TAXABILITY' | 'PLACE_OF_SUPPLY' | 'VALUATION' | 'COMPLIANCE';
  subDomain?: string;
  priority: number; // 1-10
  conditions: RuleCondition[];
  actions: string[];
  risk: RiskAssessment;
  legalReferences: LegalReference[];
  tags: string[];
  examples?: string[];
  notes?: string;
  createdDate: string;
  lastUpdated: string;
  active: boolean;
}

export interface RuleFilterOptions {
  searchTerm?: string;
  domain?: GSTRule['domain'];
  riskLevel?: RiskAssessment['level'];
  tags?: string[];
  activeOnly?: boolean;
  version?: string;
}

export interface RuleGroup {
  domain: GSTRule['domain'];
  count: number;
  rules: GSTRule[];
}
