import React, { useState, useEffect } from 'react';
import { Shield, Activity, RefreshCw, Layers, FileSpreadsheet } from 'lucide-react';

import img1 from '../assets/1.jpeg';
import img2 from '../assets/2.jpeg';
import img3 from '../assets/3.jpeg';
import img4 from '../assets/4.jpeg';
import img5 from '../assets/5.jpeg';
import img6 from '../assets/6.jpeg';

const slides = [img1, img2, img3, img4, img5, img6];

export default function Dashboard({ alertState, triggerAlert }) {
  const [data, setData] = useState({
    divisions: {
      BSP: { name: 'Bilaspur Division', node: 'Bilaspur Node', uptime: 99.8, activeNodes: 12, totalNodes: 12, status: 'Active', code: 'B' },
      R: { name: 'Raipur Division', node: 'Raipur Node', uptime: 100.0, activeNodes: 58, totalNodes: 58, status: 'Stable', code: 'R' },
      NGP: { name: 'Nagpur Division', node: 'Nagpur Node', uptime: 82.4, activeNodes: 13, totalNodes: 15, status: 'Warning', code: 'N' }
    },
    networkCapacity: 72
  });

  const [logs, setLogs] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(slideInterval);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const statusRes = await fetch('/api/status');
      const statusData = await statusRes.json();
      setData(statusData);

      const logsRes = await fetch('/api/logs');
      const logsData = await logsRes.json();
      setLogs(logsData);
    } catch (error) {
      console.error('Error loading operational data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Map nodes representation
  const mapNodes = [
    { id: 'BSP', name: 'Bilaspur Junction (BSP)', x: 380, y: 110, status: 'Active', description: 'Active junction point connecting SECR backbone to Central Railway corridor. High traffic volume reported.', color: '#5b73e5' },
    { id: 'R', name: 'Raipur Junction (R)', x: 320, y: 220, status: 'Active', description: 'Central communication hub. Fiber loop diagnostics stable.', color: '#3cd070' },
    { id: 'NGP', name: 'Nagpur Junction (NGP)', x: 120, y: 310, status: 'Warning', description: 'Warning: 2 secondary links down. Packet delivery rate slightly degraded.', color: '#f15858' },
    { id: 'G', name: 'Gondia Node (G)', x: 220, y: 270, status: 'Active', description: 'Intermediate repeater station. Operational capacity normal.', color: '#3cd070' },
    { id: 'D', name: 'Durg Node (D)', x: 280, y: 240, status: 'Active', description: 'OFC terminal and distribution point. All systems operating within thresholds.', color: '#3cd070' }
  ];

  return (
    <div>
      {/* Hero Banner Section */}
      <div className="hero-banner">
        {/* Background Slideshow Containers */}
        <div className="hero-banner-bg-container">
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`hero-banner-slide ${idx === currentSlide ? 'active' : ''}`}
              style={{
                backgroundImage: `url(${slide})`
              }}
            />
          ))}
          <div className="hero-banner-gradient" />
        </div>

        <span className="hero-tag">Operational Excellence</span>
        <h1 className="hero-title" style={{ marginBottom: '10px' }}>
          SECR TELECOM <br />
          <span style={{ fontSize: '32px', fontWeight: '700', opacity: 0.9 }}>_</span>
        </h1>
        
        {/* Tricolor divider line */}
        <div style={{ display: 'flex', width: '150px', height: '6px', borderRadius: '3px', overflow: 'hidden', margin: '14px 0 18px 0' }}>
          <div style={{ flex: 1, backgroundColor: '#FF9933' }}></div>
          <div style={{ flex: 1, backgroundColor: '#FFFFFF' }}></div>
          <div style={{ flex: 1, backgroundColor: '#138808' }}></div>
        </div>

        <p className="hero-description">
          The grand administrative heart of South East Central Railway operations, digital utility portals, and regional connectivity.
        </p>
        <div className="hero-buttons">
          <button className="btn-primary" onClick={fetchData}>
            {loading ? 'Refreshing...' : 'LIVE MONITORING'}
          </button>
        </div>
      </div>

      {/* Division Status Cards */}
      <div className="division-grid">
        {Object.entries(data.divisions).map(([code, div]) => {
          let cardType = 'success';
          if (div.uptime < 90) cardType = 'warning';
          else if (div.uptime < 100) cardType = 'info';

          return (
            <div key={code} className={`div-card ${cardType}`}>
              <div className="div-header">
                <div>
                  <div className="div-title">{div.name}</div>
                  <div className="div-node">{div.node}</div>
                </div>
                <div className="div-badge">{div.code}</div>
              </div>
              <div className="div-uptime">
                {div.uptime}%
                <span className="div-uptime-label">Uptime</span>
              </div>
              <div className="div-footer">
                <div className="status-indicator">
                  <span className={`status-dot ${div.uptime >= 100 ? 'bg-green' : div.uptime >= 90 ? 'bg-blue' : 'bg-red'}`}></span>
                  <span className={div.uptime >= 100 ? 'color-green' : div.uptime >= 90 ? 'color-blue' : 'color-red'}>
                    {div.status}
                  </span>
                </div>
                <div style={{ color: 'var(--text-muted)' }}>
                  {div.activeNodes} / {div.totalNodes} Nodes Active
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Middle Row (Map & Metrics) */}
      <div className="middle-row">
        {/* Live Infrastructure GIS Map */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">
              <Activity size={18} className="color-green" />
              Live Infrastructure GIS
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => setSelectedNode(null)}>
                Layers
              </button>
              <button className="btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }}>
                Export
              </button>
            </div>
          </div>

          <div className="gis-container">
            <svg className="gis-svg" viewBox="0 0 500 380">
              {/* Railway route paths representing fiber lines */}
              <line x1="380" y1="110" x2="320" y2="220" stroke="#5b73e5" strokeWidth="4" strokeDasharray="5,5" />
              <line x1="320" y1="220" x2="280" y2="240" stroke="#3cd070" strokeWidth="4" />
              <line x1="280" y1="240" x2="220" y2="270" stroke="#3cd070" strokeWidth="4" />
              <line x1="220" y1="270" x2="120" y2="310" stroke="#f15858" strokeWidth="4" strokeWidth="3" />

              {/* Connecting line indicators */}
              {mapNodes.map((n) => (
                <g key={n.id} className="map-node" onClick={() => setSelectedNode(n)}>
                  <circle cx={n.x} cy={n.y} r="8" fill={n.color} />
                  <circle cx={n.x} cy={n.y} r="14" fill="none" stroke={n.color} strokeWidth="1.5" opacity="0.5" />
                  <text x={n.x + 12} y={n.y + 4} fill="#fff" fontSize="10" fontWeight="bold">{n.id}</text>
                </g>
              ))}
            </svg>

            {/* Selected Node overlay details */}
            <div className="map-tooltip">
              <div className="map-tooltip-title">
                {selectedNode ? 'ASSET HIGHLIGHT' : 'Interactive Map Guidelines'}
              </div>
              <div className="map-tooltip-desc">
                {selectedNode ? (
                  <div>
                    <strong>{selectedNode.name}</strong>
                    <div style={{ marginTop: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {selectedNode.description}
                    </div>
                  </div>
                ) : (
                  'Click on any network junction node (BSP, R, NGP, G, D) to inspect assets, path routing, and fault status.'
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Network Capacity and System Logs */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">
              <Shield size={18} className="color-green" />
              Network Capacity & Logs
            </div>
          </div>

          <div className="capacity-container">
            <svg className="radial-progress" width="120" height="120">
              <circle className="radial-bg" cx="60" cy="60" r="40" />
              <circle 
                className="radial-value" 
                cx="60" 
                cy="60" 
                r="40" 
                style={{ strokeDashoffset: 251.2 - (251.2 * data.networkCapacity) / 100 }} 
              />
            </svg>
            <div className="capacity-text-center">
              <span className="capacity-percent">{data.networkCapacity}%</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '20px', color: 'var(--text-secondary)' }}>
            <span>OFC Backbone: 86.4 Gbps</span>
            <span>Secondary Link: 12.1 Gbps</span>
          </div>

          <div className="panel-title" style={{ fontSize: '14px', marginBottom: '10px' }}>
            System Logs
          </div>
          <div className="logs-list">
            {logs.map((log) => (
              <div key={log.id} className={`log-item ${log.type}`}>
                <span className="log-time">{log.time}</span>
                <span className="log-div">{log.division} Node</span>
                <span>{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Infrastructure Health Index */}
      <div className="panel health-index-panel">
        <div className="panel-header">
          <div className="panel-title">
            <Activity size={18} className="color-blue" />
            Infrastructure Health Index
          </div>
          <div style={{ display: 'flex', gap: '20px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span className="status-dot bg-blue"></span> Copper Links</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span className="status-dot bg-green"></span> Fiber Links</span>
          </div>
        </div>

        <div className="health-bar-container">
          {Object.entries(data.divisions).map(([code, div]) => (
            <div className="health-row" key={code}>
              <div className="health-labels">
                <span>{div.name} ({code})</span>
                <span style={{ fontWeight: 'bold' }}>{div.uptime >= 100 ? '92%' : div.uptime >= 95 ? '88%' : '75%'} CAPACITY</span>
              </div>
              <div className="health-track">
                <div 
                  className="health-fill" 
                  style={{ 
                    width: `${div.uptime >= 100 ? 92 : div.uptime >= 95 ? 88 : 75}%`,
                    background: `linear-gradient(90deg, var(--accent-blue) 60%, ${div.uptime >= 95 ? 'var(--accent-green)' : 'var(--accent-red)'} 100%)`
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
