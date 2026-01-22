import React, { useState } from 'react';
import { RuleFilterOptions, GSTRule } from '../types/rule';
import '../styles/rule-explorer.css';

interface RuleFilterProps {
  onFilterChange: (filter: RuleFilterOptions) => void;
  availableTags: string[];
  stats: {
    byDomain: Record<string, number>;
    byRiskLevel: { HIGH: number; MEDIUM: number; LOW: number };
  };
}

const RuleFilter: React.FC<RuleFilterProps> = ({ onFilterChange, availableTags, stats }) => {
  const [filter, setFilter] = useState<RuleFilterOptions>({
    activeOnly: true,
  });
  
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const domains: GSTRule['domain'][] = ['EXEMPTION', 'TAXABILITY', 'PLACE_OF_SUPPLY', 'VALUATION', 'COMPLIANCE'];
  const riskLevels = ['HIGH', 'MEDIUM', 'LOW'] as const;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilter = { ...filter, searchTerm: e.target.value || undefined };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleDomainChange = (domain: GSTRule['domain'] | 'ALL') => {
    const newFilter = { ...filter, domain: domain === 'ALL' ? undefined : domain };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleRiskLevelChange = (level: 'HIGH' | 'MEDIUM' | 'LOW' | 'ALL') => {
    const newFilter = { ...filter, riskLevel: level === 'ALL' ? undefined : level };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(newTags);
    const newFilter = { ...filter, tags: newTags.length > 0 ? newTags : undefined };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleActiveOnlyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilter = { ...filter, activeOnly: e.target.checked };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const clearFilters = () => {
    const newFilter: RuleFilterOptions = { activeOnly: true };
    setFilter(newFilter);
    setSelectedTags([]);
    onFilterChange(newFilter);
  };

  return (
    <div className="rule-filter">
      <div className="filter-section">
        <h3>Search Rules</h3>
        <input
          type="text"
          placeholder="Search by ID, name, description, or tags..."
          className="search-input"
          value={filter.searchTerm || ''}
          onChange={handleSearchChange}
        />
      </div>

      <div className="filter-section">
        <h3>Domain</h3>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${!filter.domain ? 'active' : ''}`}
            onClick={() => handleDomainChange('ALL')}
          >
            All ({Object.values(stats.byDomain).reduce((a, b) => a + b, 0)})
          </button>
          {domains.map(domain => (
            <button
              key={domain}
              className={`filter-btn ${filter.domain === domain ? 'active' : ''}`}
              onClick={() => handleDomainChange(domain)}
            >
              {domain} ({stats.byDomain[domain] || 0})
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3>Risk Level</h3>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${!filter.riskLevel ? 'active' : ''}`}
            onClick={() => handleRiskLevelChange('ALL')}
          >
            All
          </button>
          {riskLevels.map(level => (
            <button
              key={level}
              className={`filter-btn risk-${level.toLowerCase()} ${filter.riskLevel === level ? 'active' : ''}`}
              onClick={() => handleRiskLevelChange(level)}
            >
              {level} ({stats.byRiskLevel[level] || 0})
            </button>
          ))}
        </div>
      </div>

      {availableTags.length > 0 && (
        <div className="filter-section">
          <h3>Tags</h3>
          <div className="tags-filter">
            {availableTags.map(tag => (
              <button
                key={tag}
                className={`tag-btn ${selectedTags.includes(tag) ? 'selected' : ''}`}
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="filter-section">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={filter.activeOnly || false}
            onChange={handleActiveOnlyChange}
          />
          Show only active rules
        </label>
      </div>

      <div className="filter-actions">
        <button className="clear-filters-btn" onClick={clearFilters}>
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default RuleFilter;
