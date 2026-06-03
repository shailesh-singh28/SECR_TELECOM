const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory data store
let alertState = {
  active: false,
  message: '',
  timestamp: null,
  division: ''
};

let divisionStatus = {
  BSP: { name: 'Bilaspur Division', node: 'Bilaspur Node', uptime: 99.8, activeNodes: 12, totalNodes: 12, status: 'Active', code: 'B', routeLength: 1097 },
  R: { name: 'Raipur Division', node: 'Raipur Node', uptime: 100.0, activeNodes: 58, totalNodes: 58, status: 'Stable', code: 'R', routeLength: 435 },
  NGP: { name: 'Nagpur Division', node: 'Nagpur Node', uptime: 82.4, activeNodes: 13, totalNodes: 15, status: 'Warning', code: 'N', routeLength: 1005 }
};

let systemLogs = [
  { id: 1, time: '14:22:05', type: 'info', division: 'BSP', message: 'OFC Patch completed - Sec 14' },
  { id: 2, time: '13:45:12', type: 'error', division: 'NGP', message: 'NGP Repeater Fan Failure' },
  { id: 3, time: '12:10:55', type: 'success', division: 'R', message: 'Routine check - All systems green' },
  { id: 4, time: '09:30:00', type: 'info', division: 'R', message: 'Manual inspection logged by R-Div' }
];

let cableRoutes = [
  { id: 1, routeId: 'BSP-R-OFC1', source: 'Bilaspur', destination: 'Raipur', length: 110, fibers: 24, status: 'Active', loss: '0.22 dB/km' },
  { id: 2, routeId: 'R-NGP-OFC2', source: 'Raipur', destination: 'Nagpur', length: 300, fibers: 24, status: 'Degraded', loss: '0.35 dB/km' },
  { id: 3, routeId: 'BSP-NGP-ALT1', source: 'Bilaspur', destination: 'Nagpur', length: 412, fibers: 12, status: 'Active', loss: '0.24 dB/km' }
];

let patrollingLogs = [
  { id: 1, date: '2026-05-29', patroller: 'Ramesh Kumar', division: 'BSP', section: 'Sec-3 (Bilaspur-Bhatapara)', status: 'Clear', notes: 'No excavations near track. Cable marker repainted.' },
  { id: 2, date: '2026-05-28', patroller: 'S. K. Verma', division: 'NGP', section: 'Sec-9 (Nagpur-Bhandara)', status: 'Action Required', notes: 'Construction work near KM 845. Warned contractor to excavate manually.' }
];

let meggeringRecords = [
  { id: 1, date: '2026-05-25', division: 'BSP', cableId: 'BSP-R-OFC1-C1', conductorNo: 'Pin 4', resistance: '500 MΩ', voltage: '500V', checkedBy: 'Amit Sharma', result: 'Pass' },
  { id: 2, date: '2026-05-20', division: 'NGP', cableId: 'R-NGP-OFC2-C2', conductorNo: 'Pin 7', resistance: '2.5 MΩ', voltage: '250V', checkedBy: 'Amit Sharma', result: 'Fail' }
];

// Helper to format current time
const getFormattedTime = () => {
  const d = new Date();
  return d.toTimeString().split(' ')[0];
};

// API Endpoints
app.get('/api/status', (req, res) => {
  res.json({
    divisions: divisionStatus,
    alert: alertState,
    networkCapacity: 72
  });
});

app.get('/api/logs', (req, res) => {
  res.json(systemLogs);
});

app.post('/api/logs', (req, res) => {
  const { type, division, message } = req.body;
  const newLog = {
    id: systemLogs.length + 1,
    time: getFormattedTime(),
    type: type || 'info',
    division: division || 'Global',
    message
  };
  systemLogs.unshift(newLog);
  res.status(201).json(newLog);
});

app.get('/api/routes', (req, res) => {
  res.json(cableRoutes);
});

app.post('/api/routes', (req, res) => {
  const { routeId, source, destination, length, fibers, status, loss } = req.body;
  const newRoute = {
    id: cableRoutes.length + 1,
    routeId,
    source,
    destination,
    length: parseFloat(length),
    fibers: parseInt(fibers),
    status: status || 'Active',
    loss: loss || '0.25 dB/km'
  };
  cableRoutes.push(newRoute);
  
  // Also log it
  systemLogs.unshift({
    id: systemLogs.length + 1,
    time: getFormattedTime(),
    type: 'info',
    division: 'Global',
    message: `New Cable Route ${routeId} registered`
  });

  res.status(201).json(newRoute);
});

app.get('/api/patrolling', (req, res) => {
  res.json(patrollingLogs);
});

app.post('/api/patrolling', (req, res) => {
  const { patroller, division, section, status, notes } = req.body;
  const newPatrol = {
    id: patrollingLogs.length + 1,
    date: new Date().toISOString().split('T')[0],
    patroller,
    division,
    section,
    status,
    notes
  };
  patrollingLogs.unshift(newPatrol);

  // Auto-generate status warning or info
  if (status === 'Action Required' || status === 'Critical') {
    divisionStatus[division].uptime = Math.max(70, (divisionStatus[division].uptime - 2).toFixed(1));
    divisionStatus[division].status = 'Warning';
    
    systemLogs.unshift({
      id: systemLogs.length + 1,
      time: getFormattedTime(),
      type: 'error',
      division,
      message: `Patrolling Alert: ${section} reported with status [${status}]`
    });
  }

  res.status(201).json(newPatrol);
});

app.get('/api/meggering', (req, res) => {
  res.json(meggeringRecords);
});

app.post('/api/meggering', (req, res) => {
  const { division, cableId, conductorNo, resistance, voltage, checkedBy, result } = req.body;
  const newRecord = {
    id: meggeringRecords.length + 1,
    date: new Date().toISOString().split('T')[0],
    division,
    cableId,
    conductorNo,
    resistance,
    voltage,
    checkedBy,
    result
  };
  meggeringRecords.unshift(newRecord);

  // If fail, post a warning log
  if (result === 'Fail') {
    systemLogs.unshift({
      id: systemLogs.length + 1,
      time: getFormattedTime(),
      type: 'error',
      division,
      message: `Megger test failed for ${cableId} (${conductorNo}) - Resistance: ${resistance}`
    });
  } else {
    systemLogs.unshift({
      id: systemLogs.length + 1,
      time: getFormattedTime(),
      type: 'success',
      division,
      message: `Megger test passed for ${cableId}`
    });
  }

  res.status(201).json(newRecord);
});

app.post('/api/alert', (req, res) => {
  const { active, message, division } = req.body;
  if (active) {
    alertState = {
      active: true,
      message: message || 'EMERGENCY: OFC Fiber Cut detected!',
      timestamp: getFormattedTime(),
      division: division || 'Global'
    };
    systemLogs.unshift({
      id: systemLogs.length + 1,
      time: alertState.timestamp,
      type: 'error',
      division: alertState.division,
      message: alertState.message
    });
  } else {
    alertState = {
      active: false,
      message: '',
      timestamp: null,
      division: ''
    };
    systemLogs.unshift({
      id: systemLogs.length + 1,
      time: getFormattedTime(),
      type: 'info',
      division: 'Global',
      message: 'Emergency Alert status cleared.'
    });
  }
  res.json(alertState);
});

app.listen(PORT, () => {
  console.log(`SECR Telecom backend listening on port ${PORT}`);
});
