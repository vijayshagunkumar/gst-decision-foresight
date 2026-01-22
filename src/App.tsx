import React from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'; // CHANGED: HashRouter
import './styles/main.css';
import DecisionReview from './pages/DecisionReview';
import RuleExplorer from './pages/RuleExplorer';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  return (
    <nav className="main-nav">
      <div className="nav-container">
        <div className="nav-brand">
          <span className="nav-brand-icon">⚖️</span>
          <span className="nav-brand-text">GST Decision Engine</span>
        </div>
        
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Decision Review
          </Link>
          <Link 
            to="/rules" 
            className={`nav-link ${location.pathname === '/rules' ? 'active' : ''}`}
          >
            Rule Explorer
          </Link>
        </div>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <Router> {/* HashRouter automatically works with GitHub Pages */}
      <div className="app">
        <Navigation />
        <header>
          <h1>GST Decision Review & Foresight Engine</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<DecisionReview />} />
            <Route path="/rules" element={<RuleExplorer />} />
          </Routes>
        </main>
        <footer className="app-footer">
          <div className="footer-content">
            <p>© 2024 GST Decision Engine. For compliance use only.</p>
            <div className="footer-links">
              <span>v1.0.0</span>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
