import React from 'react';
import { GSTRule } from '../types/rule';
import RiskBadge from './RiskBadge';
import '../styles/rule-explorer.css';

interface RuleCardProps {
  rule: GSTRule;
  expanded?: boolean;
  onToggle?: () => void;
}

const RuleCard: React.FC<RuleCardProps> = ({ rule, expanded = false, onToggle }) => {
  const domainColors: Record<GSTRule['domain'], string> = {
    EXEMPTION: '#3182CE',
    TAXABILITY: '#38A169',
    PLACE_OF_SUPPLY: '#DD6B20',
    VALUATION: '#805AD5',
    COMPLIANCE: '#E53E3E'
  };

  return (
    <div className={`rule-card ${expanded ? 'expanded' : ''}`}>
      <div className="rule-card-header" onClick={onToggle}>
        <div className="rule-id-container">
          <span className="rule-id">{rule.id}</span>
          <span 
            className="rule-domain-badge"
            style={{ backgroundColor: domainColors[rule.domain] }}
          >
            {rule.domain}
          </span>
          {rule.subDomain && (
            <span className="rule-subdomain">{rule.subDomain}</span>
          )}
        </div>
        
        <div className="rule-title-section">
          <h3 className="rule-title">{rule.name}</h3>
          <div className="rule-meta">
            <span className="rule-version">v{rule.version}</span>
            <span className="rule-priority">Priority: {rule.priority}/10</span>
            <span className={`rule-status ${rule.active ? 'active' : 'inactive'}`}>
              {rule.active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
        
        <div className="rule-risk-section">
          <RiskBadge level={rule.risk.level} />
          <div className="confidence-indicator">
            <div className="confidence-label">Confidence</div>
            <div className="confidence-bar">
              <div 
                className="confidence-fill"
                style={{ width: `${rule.risk.confidence}%` }}
              />
            </div>
            <span className="confidence-value">{rule.risk.confidence}%</span>
          </div>
        </div>
        
        <div className="toggle-icon">
          {expanded ? '▼' : '▶'}
        </div>
      </div>
      
      {expanded && (
        <div className="rule-card-content">
          <div className="rule-description">
            <h4>Description</h4>
            <p>{rule.description}</p>
          </div>
          
          <div className="rule-conditions">
            <h4>Conditions</h4>
            <ul>
              {rule.conditions.map((cond, idx) => (
                <li key={idx} className="condition-item">
                  <span className="condition-fact">{cond.fact}</span>
                  <span className="condition-operator">{cond.operator}</span>
                  <span className="condition-value">{JSON.stringify(cond.value)}</span>
                  {cond.description && (
                    <span className="condition-description">// {cond.description}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="rule-actions">
            <h4>Actions</h4>
            <div className="actions-list">
              {rule.actions.map((action, idx) => (
                <span key={idx} className="action-tag">{action}</span>
              ))}
            </div>
          </div>
          
          <div className="rule-legal">
            <h4>Legal References</h4>
            {rule.legalReferences.map((ref, idx) => (
              <div key={idx} className="legal-reference">
                <div className="legal-domain">{ref.domain}</div>
                {ref.section && <div className="legal-section">Section: {ref.section}</div>}
                {ref.notification && <div className="legal-notification">Notification: {ref.notification}</div>}
                {ref.circular && <div className="legal-circular">Circular: {ref.circular}</div>}
                {ref.effectiveFrom && (
                  <div className="legal-effective">
                    Effective: {ref.effectiveFrom} {ref.effectiveTo && `to ${ref.effectiveTo}`}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {rule.tags.length > 0 && (
            <div className="rule-tags">
              <h4>Tags</h4>
              <div className="tags-list">
                {rule.tags.map((tag, idx) => (
                  <span key={idx} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          )}
          
          {rule.examples && rule.examples.length > 0 && (
            <div className="rule-examples">
              <h4>Examples</h4>
              <ul>
                {rule.examples.map((example, idx) => (
                  <li key={idx} className="example-item">{example}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="rule-footer">
            <div className="rule-dates">
              <span>Created: {rule.createdDate}</span>
              <span>Updated: {rule.lastUpdated}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RuleCard;
