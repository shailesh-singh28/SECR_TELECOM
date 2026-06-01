import React, { useState, useEffect, useRef } from 'react';
import { Shield, Activity, RefreshCw, Layers, FileSpreadsheet } from 'lucide-react';

import img1 from '../assets/1.jpeg';
import img2 from '../assets/2.jpeg';
import img3 from '../assets/3.jpeg';
import img4 from '../assets/4.jpeg';
import img5 from '../assets/5.jpeg';
import img6 from '../assets/6.jpeg';
import mapPng from '../assets/map.png';

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
  const [zoom, setZoom] = useState(100);
  const containerRef = useRef(null);
  const scrollTargetRef = useRef(null);
  const zoomRef = useRef(zoom);

  // Keep zoomRef up-to-date with current state
  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  const handleZoomIn = () => {
    const container = containerRef.current;
    if (!container) return;
    const newZoom = Math.min(zoom + 10, 1000);
    if (newZoom === zoom) return;

    const rect = container.getBoundingClientRect();
    const mouseX = rect.width / 2;
    const mouseY = rect.height / 2;
    const oldScrollLeft = container.scrollLeft;
    const oldScrollTop = container.scrollTop;

    scrollTargetRef.current = {
      left: (oldScrollLeft + mouseX) * (newZoom / zoom) - mouseX,
      top: (oldScrollTop + mouseY) * (newZoom / zoom) - mouseY
    };
    setZoom(newZoom);
  };

  const handleZoomOut = () => {
    const container = containerRef.current;
    if (!container) return;
    const newZoom = Math.max(zoom - 10, 100);
    if (newZoom === zoom) return;

    const rect = container.getBoundingClientRect();
    const mouseX = rect.width / 2;
    const mouseY = rect.height / 2;
    const oldScrollLeft = container.scrollLeft;
    const oldScrollTop = container.scrollTop;

    scrollTargetRef.current = {
      left: (oldScrollLeft + mouseX) * (newZoom / zoom) - mouseX,
      top: (oldScrollTop + mouseY) * (newZoom / zoom) - mouseY
    };
    setZoom(newZoom);
  };

  // Listen to zoom changes and adjust container scrolls synchronously
  useEffect(() => {
    if (scrollTargetRef.current && containerRef.current) {
      containerRef.current.scrollLeft = scrollTargetRef.current.left;
      containerRef.current.scrollTop = scrollTargetRef.current.top;
      scrollTargetRef.current = null;
    }
  }, [zoom]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const currentZoom = zoomRef.current;
      const zoomFactor = 10;
      let newZoom;
      if (e.deltaY < 0) {
        newZoom = Math.min(currentZoom + zoomFactor, 1000);
      } else {
        newZoom = Math.max(currentZoom - zoomFactor, 100);
      }

      if (newZoom === currentZoom) return;

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const oldScrollLeft = container.scrollLeft;
      const oldScrollTop = container.scrollTop;

      scrollTargetRef.current = {
        left: (oldScrollLeft + mouseX) * (newZoom / currentZoom) - mouseX,
        top: (oldScrollTop + mouseY) * (newZoom / currentZoom) - mouseY
      };

      setZoom(newZoom);
    };

    // Click and drag to pan
    let isDown = false;
    let startX;
    let startY;
    let scrollLeft;
    let scrollTop;

    const handleMouseDown = (e) => {
      isDown = true;
      container.style.cursor = 'grabbing';
      startX = e.clientX;
      startY = e.clientY;
      scrollLeft = container.scrollLeft;
      scrollTop = container.scrollTop;
      e.preventDefault(); // Prevents selection/focus and default browser drag overrides
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.clientX;
      const y = e.clientY;
      const walkX = x - startX;
      const walkY = y - startY;
      container.scrollLeft = scrollLeft - walkX;
      container.scrollTop = scrollTop - walkY;
    };

    const handleMouseUp = () => {
      if (isDown) {
        isDown = false;
        container.style.cursor = 'grab';
      }
    };

    // Set initial cursor style
    container.style.cursor = 'grab';

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

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
        {/* SECR Rail Route */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">
              <Activity size={18} className="color-green" />
              SECR Rail Route
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-outline" style={{ padding: '6px 12px', fontSize: '12px', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }} onClick={handleZoomOut}>
                Zoom Out
              </button>
              <button className="btn-outline" style={{ padding: '6px 12px', fontSize: '12px', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }} onClick={handleZoomIn}>
                Zoom In ({zoom}%)
              </button>
            </div>
          </div>

          <div ref={containerRef} className="gis-container" style={{ overflow: 'auto', position: 'relative', width: '100%', height: '380px', display: 'block' }}>
            <img 
              src={mapPng} 
              alt="SECR Infrastructure Map"
              draggable="false"
              style={{
                width: `${zoom}%`,
                height: `${zoom}%`,
                objectFit: 'contain',
                border: 'none',
                display: 'block'
              }}
            />
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
