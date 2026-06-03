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
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';

import Dashboard from './components/Dashboard';
import Meggering from './components/Meggering';
import irLogo from './assets/ir_logo.jpg';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [theme, setTheme] = useState('light');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
        return null;
      case 'patrolling':
        return null;
      case 'meggering':
        return <Meggering />;
      case 'daily position':
        return null;
      default:
        return <Dashboard alertState={alertState} triggerAlert={handleToggleAlert} />;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Backdrop Overlay for Mobile */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
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
          <div style={{ flexGrow: 1 }}>
            <div className="logo-text">SECR</div>
            <div className="logo-sub" style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>TELECOM</div>
          </div>
          <button 
            className="sidebar-close-btn" 
            onClick={() => setIsSidebarOpen(false)}
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
          >
            <X size={18} />
          </button>
        </div>

        <nav className="nav-links">
          <a 
            className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => { setCurrentPage('dashboard'); setIsSidebarOpen(false); }}
          >
            <LayoutDashboard size={18} />
            DASHBOARD
          </a>
          <a 
            className="nav-item"
            href="https://cable.secrtelecom.com/"
            onClick={() => setIsSidebarOpen(false)}
          >
            <Route size={18} />
            CABLE ROUTE
          </a>
          <a 
            className="nav-item"
            href="https://ohe-tracker-frontend-vikzmhbwja-el.a.run.app/"
            onClick={() => setIsSidebarOpen(false)}
          >
            <Eye size={18} />
            PATROLLING
          </a>
          <a 
            className="nav-item"
            href="https://meggering.secrtelecom.com/"
            onClick={() => setIsSidebarOpen(false)}
          >
            <Activity size={18} />
            MEGGERING
          </a>
          <a 
            className={`nav-item ${currentPage === 'reports' ? 'active' : ''}`}
            onClick={() => { setCurrentPage('reports'); setIsSidebarOpen(false); }}
          >
            <FileText size={18} />
            DAILY POSITION
          </a>
        </nav>

        <div className="sidebar-footer">
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
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button 
              className="hamburger-btn"
              onClick={() => setIsSidebarOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                display: 'none', // styled/displayed in CSS under media query
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                marginRight: '12px'
              }}
            >
              <Menu size={22} />
            </button>
            <div className="header-links">
              <a className={`header-link ${currentPage === 'dashboard' ? 'active' : ''}`} onClick={() => { setCurrentPage('dashboard'); setIsSidebarOpen(false); }}>Home</a>
              <a className="header-link" onClick={() => {
                setCurrentPage('dashboard');
                setIsSidebarOpen(false);
                setTimeout(() => {
                  const element = document.getElementById('gis-map-panel');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }, 100);
              }}>GIS Map</a>
            </div>
          </div>

          <div className="header-controls">
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
