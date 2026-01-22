import React, { useState, useEffect } from 'react';
import { GSTRule, RuleFilterOptions } from '../types/rule';
import { fetchAllRules, fetchRulesByFilter, getRuleStats } from '../api/rulesApi';
import RuleCard from '../components/RuleCard';
import RuleFilter from '../components/RuleFilter';
import '../styles/rule-explorer.css';

const RuleExplorer: React.FC = () => {
  const [rules, setRules] = useState<GSTRule[]>([]);
  const [filteredRules, setFilteredRules] = useState<GSTRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRuleId, setExpandedRuleId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<RuleFilterOptions>({
    activeOnly: true
  });

  // Extract unique tags from all rules
  const availableTags = Array.from(
    new Set(rules.flatMap(rule => rule.tags))
  ).sort();

  // Get stats for filter display
  const stats = getRuleStats(rules);

  useEffect(() => {
    loadRules();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [rules, activeFilter]);

  const loadRules = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllRules();
      setRules(data);
    } catch (err) {
      setError('Failed to load rules. Please try again.');
      console.error('Error loading rules:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    if (rules.length === 0) return;
    
    try {
      const filtered = await fetchRulesByFilter(activeFilter);
      setFilteredRules(filtered);
    } catch (err) {
      console.error('Error applying filters:', err);
      setFilteredRules([]);
    }
  };

  const handleFilterChange = (filter: RuleFilterOptions) => {
    setActiveFilter(filter);
    setExpandedRuleId(null); // Collapse all when filtering
  };

  const toggleRuleExpand = (ruleId: string) => {
    setExpandedRuleId(expandedRuleId === ruleId ? null : ruleId);
  };

  const handleRefresh = () => {
    loadRules();
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading rules database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-container">
          <h3>⚠️ Error Loading Rules</h3>
          <p>{error}</p>
          <button onClick={handleRefresh} className="refresh-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>GST Rule Explorer</h1>
        <p className="page-subtitle">
          Explore the decision logic behind the GST engine. {rules.length} rules loaded.
        </p>
      </div>

      <div className="rule-explorer-layout">
        {/* Left sidebar - Filters */}
        <div className="filter-sidebar">
          <div className="filter-container">
            <RuleFilter 
              onFilterChange={handleFilterChange}
              availableTags={availableTags}
              stats={stats}
            />
          </div>
          
          <div className="stats-panel">
            <h3>Database Stats</h3>
            <div className="stat-item">
              <span className="stat-label">Total Rules:</span>
              <span className="stat-value">{rules.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Active Rules:</span>
              <span className="stat-value">{stats.byStatus.active}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Inactive Rules:</span>
              <span className="stat-value">{stats.byStatus.inactive}</span>
            </div>
            
            <div className="stat-divider"></div>
            
            <h4>By Domain</h4>
            {Object.entries(stats.byDomain).map(([domain, count]) => (
              <div key={domain} className="stat-item">
                <span className="stat-label">{domain}:</span>
                <span className="stat-value">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main content - Rules list */}
        <div className="rules-main">
          <div className="results-header">
            <div className="results-info">
              <h2>Rules ({filteredRules.length})</h2>
              <p className="results-description">
                Showing {filteredRules.length} of {rules.length} rules
                {activeFilter.searchTerm && ` matching "${activeFilter.searchTerm}"`}
              </p>
            </div>
            <div className="results-actions">
              <button onClick={handleRefresh} className="action-btn">
                ↻ Refresh
              </button>
              <button 
                onClick={() => setExpandedRuleId(null)}
                className="action-btn"
                disabled={!expandedRuleId}
              >
                Collapse All
              </button>
            </div>
          </div>

          {filteredRules.length === 0 ? (
            <div className="no-results">
              <h3>No rules match your criteria</h3>
              <p>Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <div className="rules-list">
              {filteredRules.map(rule => (
                <RuleCard
                  key={rule.id}
                  rule={rule}
                  expanded={expandedRuleId === rule.id}
                  onToggle={() => toggleRuleExpand(rule.id)}
                />
              ))}
            </div>
          )}

          <div className="rules-footer">
            <div className="export-options">
              <button className="export-btn">
                📄 Export to JSON
              </button>
              <button className="export-btn">
                📊 Download Report
              </button>
            </div>
            <div className="version-info">
              <span>Rule Engine Version: v1.0.0</span>
              <span>Last Updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RuleExplorer;
