import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Route, 
  Eye, 
  Activity, 
  FileText, 
  AlertOctagon, 
  HelpCircle, 
  LogOut, 
  Search, 
  Bell, 
  Settings,
  Sun,
  Moon
} from 'lucide-react';

import Dashboard from './components/Dashboard';
import CableRoute from './components/CableRoute';
import Patrolling from './components/Patrolling';
import Meggering from './components/Meggering';
import Reports from './components/Reports';
import irLogo from './assets/ir_logo.jpg';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [theme, setTheme] = useState('light');
  const [alertState, setAlertState] = useState({
    active: false,
    message: '',
    timestamp: null,
    division: ''
  });

  const fetchAlertState = async () => {
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      setAlertState(data.alert);
    } catch (err) {
      console.error('Error fetching alert status:', err);
    }
  };

  useEffect(() => {
    fetchAlertState();
    const interval = setInterval(fetchAlertState, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const handleToggleAlert = async () => {
    const isActivating = !alertState.active;
    const body = isActivating 
      ? { active: true, message: '[CRITICAL] CABLE CUT DETECTED - PATROLLING AND REPAIR TEAMS DISPATCHED', division: 'NGP' }
      : { active: false };

    try {
      const res = await fetch('/api/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      setAlertState(data);
    } catch (err) {
      console.error(err);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard alertState={alertState} triggerAlert={handleToggleAlert} />;
      case 'cable-route':
        return <CableRoute />;
      case 'patrolling':
        return <Patrolling />;
      case 'meggering':
        return <Meggering />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard alertState={alertState} triggerAlert={handleToggleAlert} />;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src={irLogo} 
            alt="Indian Railways Logo" 
            style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              objectFit: 'cover',
              border: '2px solid var(--border-color)' 
            }} 
          />
          <div>
            <div className="logo-text">SECR TELECOM</div>
          </div>
        </div>

        <nav className="nav-links">
          <a 
            className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentPage('dashboard')}
          >
            <LayoutDashboard size={18} />
            DASHBOARD
          </a>
          <a 
            className="nav-item"
            href="https://cable.secrtelecom.com/"
          >
            <Route size={18} />
            CABLE ROUTE
          </a>
          <a 
            className="nav-item"
            href="https://ohe-tracker-frontend-vikzmhbwja-el.a.run.app/"
          >
            <Eye size={18} />
            PATROLLING
          </a>
          <a 
            className="nav-item"
            href="https://meggering.secrtelecom.com/"
          >
            <Activity size={18} />
            MEGGERING
          </a>
          <a 
            className={`nav-item ${currentPage === 'reports' ? 'active' : ''}`}
            onClick={() => setCurrentPage('reports')}
          >
            <FileText size={18} />
            REPORTS
          </a>
        </nav>

        <div className="sidebar-footer">
          <button 
            className={`btn-emergency ${alertState.active ? 'active' : ''}`}
            onClick={handleToggleAlert}
          >
            {alertState.active ? 'Clear Alert' : 'Emergency Alert'}
          </button>
          <a className="nav-item" style={{ marginTop: 0 }} href="#help">
            <HelpCircle size={18} />
            HELP CENTER
          </a>
          <a className="nav-item" style={{ marginTop: 0 }} href="#logout">
            <LogOut size={18} />
            LOG OUT
          </a>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <div className="main-wrapper">
        <header className="top-header">
          <div className="header-links">
            <a className={`header-link ${currentPage === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentPage('dashboard')}>Home</a>
            <a className="header-link" onClick={() => setCurrentPage('dashboard')}>GIS Map</a>
            <a className="header-link" onClick={() => setCurrentPage('patrolling')}>Maintenance</a>
            <a className="header-link" onClick={() => setCurrentPage('cable-route')}>Inventory</a>
          </div>

          <div className="header-controls">
            <Bell size={18} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} />
            <Settings size={18} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} />
            <button 
               onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
               style={{
                 background: 'none',
                 border: 'none',
                 cursor: 'pointer',
                 color: 'var(--text-secondary)',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 padding: '4px'
               }}
               title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
             >
               {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
             </button>
            <div className="user-profile">
              <div className="profile-avatar">S</div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Component */}
        <main className="page-container">
          {renderPage()}
        </main>

        {/* Footer */}
        <footer className="secr-footer">
          <div>
            <span className="footer-brand">SECR TELECOM</span>
            <div>&copy; 2026 South East Central Railway - Telecom Wing. All Rights Reserved.</div>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="#privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
            <a href="#infrastructure" style={{ color: 'inherit', textDecoration: 'none' }}>Infrastructure Map</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
