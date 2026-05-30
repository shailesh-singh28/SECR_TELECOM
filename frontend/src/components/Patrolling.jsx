import React, { useState, useEffect } from 'react';
import { Eye, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function Patrolling() {
  const [logs, setLogs] = useState([]);
  const [formData, setFormData] = useState({
    patroller: '',
    division: 'BSP',
    section: '',
    status: 'Clear',
    notes: ''
  });

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/patrolling');
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patroller || !formData.section) {
      alert('Please fill out patroller name and section details');
      return;
    }
    try {
      const res = await fetch('/api/patrolling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormData({
          patroller: '',
          division: 'BSP',
          section: '',
          status: 'Clear',
          notes: ''
        });
        fetchLogs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <Eye size={18} className="color-green" />
          OFC Path Patrolling Logs
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '14px', marginBottom: '16px', color: 'var(--accent-orange)' }}>Log Daily Patrolling Report</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Patroller Name</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Sunil Yadav"
              value={formData.patroller} 
              onChange={e => setFormData({ ...formData, patroller: e.target.value })} 
            />
          </div>
          <div className="form-group">
            <label>Division</label>
            <select 
              className="form-control"
              value={formData.division}
              onChange={e => setFormData({ ...formData, division: e.target.value })}
            >
              <option value="BSP">Bilaspur Division (BSP)</option>
              <option value="R">Raipur Division (R)</option>
              <option value="NGP">Nagpur Division (NGP)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Track Section / Location</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Sec-2 (Bilaspur-Uslapur)"
              value={formData.section} 
              onChange={e => setFormData({ ...formData, section: e.target.value })} 
            />
          </div>
          <div className="form-group">
            <label>Path Status</label>
            <select 
              className="form-control"
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Clear">Clear (Normal)</option>
              <option value="Action Required">Action Required</option>
              <option value="Critical">Critical Alert (Immediate Attention)</option>
            </select>
          </div>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label>Detailed Field Notes / Construction Warnings</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Excavation detected near track Km 720. Joint markers checked."
              value={formData.notes} 
              onChange={e => setFormData({ ...formData, notes: e.target.value })} 
            />
          </div>
        </div>
        <button type="submit" className="btn-primary">Submit Patrol Log</button>
      </form>

      <div className="table-container">
        <h3 style={{ fontSize: '14px', marginBottom: '12px' }}>Recent Patrol Log History</h3>
        <table className="table-secr">
          <thead>
            <tr>
              <th>Date</th>
              <th>Patroller</th>
              <th>Division</th>
              <th>Section Details</th>
              <th>Status</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(l => (
              <tr key={l.id}>
                <td>{l.date}</td>
                <td style={{ fontWeight: '600' }}>{l.patroller}</td>
                <td>{l.division}</td>
                <td>{l.section}</td>
                <td>
                  <span className={`status-indicator`} style={{ fontSize: '12px', fontWeight: 'bold' }}>
                    <span className={`status-dot ${l.status === 'Clear' ? 'bg-green' : 'bg-red'}`}></span>
                    <span className={l.status === 'Clear' ? 'color-green' : 'color-red'}>{l.status}</span>
                  </span>
                </td>
                <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{l.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
