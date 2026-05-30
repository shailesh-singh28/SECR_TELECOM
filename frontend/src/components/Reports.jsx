import React, { useState } from 'react';
import { FileText, Download, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function Reports() {
  const [exportMessage, setExportMessage] = useState('');

  const triggerExport = (reportType) => {
    setExportMessage(`Exporting ${reportType} as CSV...`);
    setTimeout(() => {
      setExportMessage(`Successfully generated ${reportType}! File downloaded to local storage.`);
      setTimeout(() => setExportMessage(''), 3000);
    }, 1500);
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <FileText size={18} className="color-orange" />
          Telecom Operational Reports & Audits
        </div>
      </div>

      <div style={{ marginBottom: '24px', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
        <h3 style={{ fontSize: '15px', color: 'var(--accent-orange)', marginBottom: '8px' }}>Performance Summaries</h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          Monthly report containing overall uptime records, patrolling counts, cable damage repairs, and meggering logs for South East Central Railway.
        </p>
      </div>

      {exportMessage && (
        <div className="status-indicator color-green" style={{ marginBottom: '16px', padding: '10px', borderRadius: '4px', backgroundColor: 'rgba(60, 208, 112, 0.1)' }}>
          <CheckCircle2 size={16} /> {exportMessage}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        <div style={{ padding: '20px', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--bg-main)' }}>
          <h4 style={{ fontSize: '14px', marginBottom: '12px' }}>OFC Link Outages Summary</h4>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Includes mean time to repair (MTTR) and fiber loss logs.</p>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'center' }} onClick={() => triggerExport('Link Outages Summary')}>
            <Download size={14} /> Export Report
          </button>
        </div>

        <div style={{ padding: '20px', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--bg-main)' }}>
          <h4 style={{ fontSize: '14px', marginBottom: '12px' }}>Weekly Patrolling Audit</h4>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Total patrol counts and construction hazards list.</p>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'center' }} onClick={() => triggerExport('Weekly Patrolling Audit')}>
            <Download size={14} /> Export Report
          </button>
        </div>

        <div style={{ padding: '20px', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--bg-main)' }}>
          <h4 style={{ fontSize: '14px', marginBottom: '12px' }}>Megger Quality Sheet</h4>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Conductor insulation test passing history report.</p>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'center' }} onClick={() => triggerExport('Megger Quality Sheet')}>
            <Download size={14} /> Export Report
          </button>
        </div>
      </div>
    </div>
  );
}
