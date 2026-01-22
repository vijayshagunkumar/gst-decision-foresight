import { GSTRule, RuleFilterOptions } from '../types/rule';

// Mock data for development (replace with real API)
const MOCK_RULES: GSTRule[] = [
  {
    id: 'GST-EXEMPT-001',
    name: 'SEZ Authorized Operations Exemption',
    description: 'Supplies to SEZ unit/developer for authorized operations are exempt',
    version: 'v1.0.0',
    domain: 'EXEMPTION',
    subDomain: 'SEZ',
    priority: 1,
    conditions: [
      { fact: 'supply_to', operator: 'equals', value: 'SEZ_UNIT_OR_DEVELOPER' },
      { fact: 'supply_purpose', operator: 'equals', value: 'AUTHORIZED_OPERATIONS' },
      { fact: 'exemption_claimed', operator: 'equals', value: true }
    ],
    actions: ['EXEMPT_FROM_GST'],
    risk: {
      level: 'LOW',
      reason: 'Clear exemption under Section 16 of IGST Act',
      confidence: 95,
      impact: 'Compliance'
    },
    legalReferences: [
      {
        domain: 'IGST Act, 2017',
        section: 'Section 16',
        notification: 'No. 48/2017-Central Tax',
        effectiveFrom: '2017-07-01'
      }
    ],
    tags: ['SEZ', 'Exemption', 'Authorized Operations'],
    examples: [
      'Supply of machinery to SEZ unit for manufacturing',
      'IT services provided to SEZ developer'
    ],
    notes: 'Valid only with proper LUT/Bond execution',
    createdDate: '2024-01-15',
    lastUpdated: '2024-03-20',
    active: true
  },
  {
    id: 'GST-COMP-002',
    name: 'DTA Supply with Exemption Claim',
    description: 'Supply to DTA with exemption claim requires verification',
    version: 'v1.0.0',
    domain: 'COMPLIANCE',
    subDomain: 'Verification',
    priority: 5,
    conditions: [
      { fact: 'supply_to', operator: 'equals', value: 'DTA' },
      { fact: 'exemption_claimed', operator: 'equals', value: true }
    ],
    actions: ['REQUIRES_VERIFICATION', 'DOCUMENTATION_REQUIRED'],
    risk: {
      level: 'HIGH',
      reason: 'Potential misuse of exemption provisions',
      confidence: 80,
      impact: 'Financial'
    },
    legalReferences: [
      {
        domain: 'CGST Act, 2017',
        section: 'Section 54',
        circular: 'Circular No. 160/16/2021-GST'
      }
    ],
    tags: ['DTA', 'Verification', 'Compliance'],
    examples: [
      'Supply to DTA with incorrect exemption certificate',
      'Missing supporting documents for exemption'
    ],
    createdDate: '2024-01-20',
    lastUpdated: '2024-03-25',
    active: true
  },
  {
    id: 'GST-TAX-003',
    name: 'Other Purpose Supply Taxability',
    description: 'Supply for purposes other than authorized operations',
    version: 'v1.0.0',
    domain: 'TAXABILITY',
    priority: 3,
    conditions: [
      { fact: 'supply_purpose', operator: 'equals', value: 'OTHER' }
    ],
    actions: ['STANDARD_RATE_APPLICABLE', 'REQUIRES_TAX_INVOICE'],
    risk: {
      level: 'MEDIUM',
      reason: 'Standard GST rates apply with input credit eligibility',
      confidence: 90,
      impact: 'Financial'
    },
    legalReferences: [
      {
        domain: 'CGST Act, 2017',
        section: 'Section 9',
        notification: 'No. 1/2017-Central Tax (Rate)'
      }
    ],
    tags: ['Taxability', 'Standard Rate', 'Input Credit'],
    createdDate: '2024-02-10',
    lastUpdated: '2024-04-01',
    active: true
  }
];

export async function fetchAllRules(): Promise<GSTRule[]> {
  // In production: fetch from /api/rules endpoint
  // return fetch(`${process.env.REACT_APP_API_BASE}/rules`).then(res => res.json());
  
  return new Promise(resolve => {
    setTimeout(() => resolve(MOCK_RULES), 300); // Simulate API delay
  });
}

export async function fetchRulesByFilter(filter: RuleFilterOptions): Promise<GSTRule[]> {
  const allRules = await fetchAllRules();
  
  return allRules.filter(rule => {
    // Search term filter
    if (filter.searchTerm) {
      const searchLower = filter.searchTerm.toLowerCase();
      const matchesSearch = 
        rule.id.toLowerCase().includes(searchLower) ||
        rule.name.toLowerCase().includes(searchLower) ||
        rule.description.toLowerCase().includes(searchLower) ||
        rule.tags.some(tag => tag.toLowerCase().includes(searchLower));
      
      if (!matchesSearch) return false;
    }
    
    // Domain filter
    if (filter.domain && rule.domain !== filter.domain) return false;
    
    // Risk level filter
    if (filter.riskLevel && rule.risk.level !== filter.riskLevel) return false;
    
    // Tags filter
    if (filter.tags && filter.tags.length > 0) {
      const hasAllTags = filter.tags.every(tag => rule.tags.includes(tag));
      if (!hasAllTags) return false;
    }
    
    // Active only filter
    if (filter.activeOnly && !rule.active) return false;
    
    // Version filter
    if (filter.version && rule.version !== filter.version) return false;
    
    return true;
  });
}

export async function fetchRuleById(ruleId: string): Promise<GSTRule | null> {
  const allRules = await fetchAllRules();
  return allRules.find(rule => rule.id === ruleId) || null;
}

export function getRuleStats(rules: GSTRule[]) {
  const stats = {
    total: rules.length,
    byDomain: {} as Record<string, number>,
    byRiskLevel: { HIGH: 0, MEDIUM: 0, LOW: 0 },
    byStatus: { active: 0, inactive: 0 }
  };
  
  rules.forEach(rule => {
    stats.byDomain[rule.domain] = (stats.byDomain[rule.domain] || 0) + 1;
    stats.byRiskLevel[rule.risk.level]++;
    if (rule.active) stats.byStatus.active++;
    else stats.byStatus.inactive++;
  });
  
  return stats;
}
