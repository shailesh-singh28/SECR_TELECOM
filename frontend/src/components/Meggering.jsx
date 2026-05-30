import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function Meggering() {
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState({
    division: 'BSP',
    cableId: '',
    conductorNo: '',
    resistance: '',
    voltage: '500V',
    checkedBy: '',
    result: 'Pass'
  });

  const fetchRecords = async () => {
    try {
      const res = await fetch('/api/meggering');
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.cableId || !formData.conductorNo || !formData.resistance || !formData.checkedBy) {
      alert('Please fill out all fields');
      return;
    }
    try {
      const res = await fetch('/api/meggering', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormData({
          division: 'BSP',
          cableId: '',
          conductorNo: '',
          resistance: '',
          voltage: '500V',
          checkedBy: '',
          result: 'Pass'
        });
        fetchRecords();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <Activity size={18} className="color-blue" />
          Meggering (Insulation Resistance) Logging
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '14px', marginBottom: '16px', color: 'var(--accent-orange)' }}>Log Megger Insulation Test</h3>
        <div className="form-grid">
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
            <label>Cable Asset ID</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. BSP-R-OFC1-C1"
              value={formData.cableId} 
              onChange={e => setFormData({ ...formData, cableId: e.target.value })} 
            />
          </div>
          <div className="form-group">
            <label>Conductor / Core No.</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Pin 4"
              value={formData.conductorNo} 
              onChange={e => setFormData({ ...formData, conductorNo: e.target.value })} 
            />
          </div>
          <div className="form-group">
            <label>Insulation Resistance Value</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. 450 MΩ"
              value={formData.resistance} 
              onChange={e => setFormData({ ...formData, resistance: e.target.value })} 
            />
          </div>
          <div className="form-group">
            <label>Test Voltage</label>
            <select 
              className="form-control"
              value={formData.voltage}
              onChange={e => setFormData({ ...formData, voltage: e.target.value })}
            >
              <option value="100V">100V DC</option>
              <option value="250V">250V DC</option>
              <option value="500V">500V DC</option>
              <option value="1000V">1000V DC</option>
            </select>
          </div>
          <div className="form-group">
            <label>Checked By (Engineer/Tech)</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Amit Sharma"
              value={formData.checkedBy} 
              onChange={e => setFormData({ ...formData, checkedBy: e.target.value })} 
            />
          </div>
          <div className="form-group">
            <label>Test Verdict</label>
            <select 
              className="form-control"
              value={formData.result}
              onChange={e => setFormData({ ...formData, result: e.target.value })}
            >
              <option value="Pass">Pass (Insulation Stable)</option>
              <option value="Fail">Fail (Ground Leakage / Low IR)</option>
            </select>
          </div>
        </div>
        <button type="submit" className="btn-primary">Record Megger Measurement</button>
      </form>

      <div className="table-container">
        <h3 style={{ fontSize: '14px', marginBottom: '12px' }}>Megger Insulation Log Records</h3>
        <table className="table-secr">
          <thead>
            <tr>
              <th>Date</th>
              <th>Division</th>
              <th>Cable ID</th>
              <th>Conductor</th>
              <th>Resistance</th>
              <th>Voltage</th>
              <th>Verdict</th>
              <th>Checked By</th>
            </tr>
          </thead>
          <tbody>
            {records.map(r => (
              <tr key={r.id}>
                <td>{r.date}</td>
                <td>{r.division}</td>
                <td style={{ fontWeight: 'bold' }}>{r.cableId}</td>
                <td>{r.conductorNo}</td>
                <td style={{ color: r.result === 'Pass' ? 'var(--accent-green)' : 'var(--accent-red)' }}>{r.resistance}</td>
                <td>{r.voltage}</td>
                <td>
                  <span className={`status-indicator`} style={{ fontSize: '12px', fontWeight: 'bold' }}>
                    <span className={`status-dot ${r.result === 'Pass' ? 'bg-green' : 'bg-red'}`}></span>
                    <span className={r.result === 'Pass' ? 'color-green' : 'color-red'}>{r.result}</span>
                  </span>
                </td>
                <td>{r.checkedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
