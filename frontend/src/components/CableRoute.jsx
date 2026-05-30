import React, { useState, useEffect } from 'react';
import { Route, Plus, Server } from 'lucide-react';

export default function CableRoute() {
  const [routes, setRoutes] = useState([]);
  const [formData, setFormData] = useState({
    routeId: '',
    source: '',
    destination: '',
    length: '',
    fibers: '24',
    status: 'Active',
    loss: '0.22 dB/km'
  });

  const fetchRoutes = async () => {
    try {
      const res = await fetch('/api/routes');
      const data = await res.json();
      setRoutes(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.routeId || !formData.source || !formData.destination || !formData.length) {
      alert('Please fill out all fields');
      return;
    }
    try {
      const res = await fetch('/api/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormData({
          routeId: '',
          source: '',
          destination: '',
          length: '',
          fibers: '24',
          status: 'Active',
          loss: '0.22 dB/km'
        });
        fetchRoutes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <Route size={18} className="color-blue" />
          OFC Cable Route Operations
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '14px', marginBottom: '16px', color: 'var(--accent-orange)' }}>Register New OFC Route Link</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Route ID</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. BSP-R-OFC1"
              value={formData.routeId} 
              onChange={e => setFormData({ ...formData, routeId: e.target.value })} 
            />
          </div>
          <div className="form-group">
            <label>Source Station</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Bilaspur"
              value={formData.source} 
              onChange={e => setFormData({ ...formData, source: e.target.value })} 
            />
          </div>
          <div className="form-group">
            <label>Destination Station</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Raipur"
              value={formData.destination} 
              onChange={e => setFormData({ ...formData, destination: e.target.value })} 
            />
          </div>
          <div className="form-group">
            <label>Length (KM)</label>
            <input 
              type="number" 
              className="form-control" 
              placeholder="e.g. 110"
              value={formData.length} 
              onChange={e => setFormData({ ...formData, length: e.target.value })} 
            />
          </div>
          <div className="form-group">
            <label>No. of Fibers</label>
            <select 
              className="form-control"
              value={formData.fibers}
              onChange={e => setFormData({ ...formData, fibers: e.target.value })}
            >
              <option value="12">12 Fibers</option>
              <option value="24">24 Fibers</option>
              <option value="48">48 Fibers</option>
              <option value="96">96 Fibers</option>
            </select>
          </div>
          <div className="form-group">
            <label>Fiber Loss Coefficient</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. 0.22 dB/km"
              value={formData.loss} 
              onChange={e => setFormData({ ...formData, loss: e.target.value })} 
            />
          </div>
        </div>
        <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={16} /> Register Route
        </button>
      </form>

      <div className="table-container">
        <h3 style={{ fontSize: '14px', marginBottom: '12px' }}>Registered Transmission Routes</h3>
        <table className="table-secr">
          <thead>
            <tr>
              <th>Route ID</th>
              <th>Source</th>
              <th>Destination</th>
              <th>Length</th>
              <th>Fibers</th>
              <th>Loss Coefficient</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {routes.map(r => (
              <tr key={r.id}>
                <td style={{ fontWeight: 'bold', color: 'var(--accent-orange)' }}>{r.routeId}</td>
                <td>{r.source}</td>
                <td>{r.destination}</td>
                <td>{r.length} KM</td>
                <td>{r.fibers} F</td>
                <td>{r.loss}</td>
                <td>
                  <span className={`status-indicator`} style={{ fontSize: '12px' }}>
                    <span className={`status-dot ${r.status === 'Active' ? 'bg-green' : 'bg-red'}`}></span>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
