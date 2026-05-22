import React from 'react';
import { Key, Settings, RefreshCw, Trash2, Cpu, UserCheck, UserMinus } from 'lucide-react';

export default function ControlPanel({ 
  apiKey, 
  setApiKey, 
  simulatedMode, 
  setSimulatedMode, 
  logs, 
  clearLogs, 
  resetFarmerProfile, 
  farmerProfile 
}) {
  return (
    <div className="control-pane">
      {/* Header Panel */}
      <div className="control-header">
        <h1>
          <Cpu size={20} color="#2ed573" />
          <span>Agro Heal Dev Console</span>
        </h1>
        <p>Real-time API Engine Monitoring & Logs</p>
      </div>

      {/* Body Panel */}
      <div className="control-body">
        {/* API Key Configuration Card */}
        <div className="control-section">
          <h3>
            <Key size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Gemini API Integration
          </h3>
          <p style={{ fontSize: '11px', color: '#a4b8ab', marginBottom: '8px' }}>
            Paste a Gemini API key to enable live multimodal diagnoses for custom crop photos and livestock symptoms.
          </p>
          <div className="api-key-input-wrapper">
            <input
              type="password"
              placeholder="Enter Gemini API Key (AIzaSy...)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
        </div>

        {/* Operating Engine Mode Selector */}
        <div className="control-section">
          <h3>
            <Settings size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            App Engine Config
          </h3>
          <div className="mode-card">
            <div className="mode-header">
              <h4>{simulatedMode ? 'Demo Simulator Mode' : 'Live Cloud API Mode'}</h4>
              <button
                onClick={() => setSimulatedMode(!simulatedMode)}
                style={{
                  background: '#2ed573',
                  color: '#121814',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '4px 10px',
                  fontSize: '10px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <RefreshCw size={10} />
                Toggle
              </button>
            </div>
            <p className="mode-desc">
              {simulatedMode
                ? 'Using local pre-compiled datasets. Instant response, perfectly consistent, zero cost, completely offline.'
                : 'Connecting to real-time cloud interfaces. Uses Gemini for custom image diagnosis and livestock prompts.'}
            </p>
          </div>
        </div>

        {/* Farmer Profile Simulation Control Card */}
        <div className="control-section">
          <h3>
            <UserCheck size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Farmer Profile Simulator
          </h3>
          <div className="mode-card" style={{ background: '#252f28', border: '1px solid #36493b' }}>
            {farmerProfile ? (
              <div style={{ fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#a4b8ab' }}>Farmer Name:</span>
                  <strong style={{ color: '#fff' }}>{farmerProfile.name}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#a4b8ab' }}>District:</span>
                  <strong style={{ color: '#fff' }}>{farmerProfile.district} ({farmerProfile.region})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#a4b8ab' }}>Primary Crop:</span>
                  <strong style={{ color: '#2ed573' }}>{farmerProfile.crop}</strong>
                </div>
                <button
                  onClick={resetFarmerProfile}
                  style={{
                    width: '100%',
                    background: '#ff4757',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    marginTop: '4px',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.opacity = '0.9')}
                  onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  <UserMinus size={12} />
                  Reset Profile (Re-Onboard)
                </button>
              </div>
            ) : (
              <div style={{ fontSize: '12px', textAlign: 'center', padding: '6px 0', color: '#ffc107' }}>
                🌾 Onboarding Wizard Active...
                <p style={{ fontSize: '10px', color: '#a4b8ab', marginTop: '4px' }}>
                  Please complete the onboarding form inside the smartphone screen to unlock the simulator controls.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Real-time System Debug Logs Console */}
        <div className="control-section" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <h3 style={{ margin: 0 }}>System Logs</h3>
            <button
              onClick={clearLogs}
              style={{
                background: 'none',
                border: 'none',
                color: '#ff4757',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: '600'
              }}
            >
              <Trash2 size={12} />
              Clear
            </button>
          </div>
          
          <div className="console-box">
            {logs.length === 0 ? (
              <div style={{ color: '#53645a', fontStyle: 'italic', padding: '10px 0' }}>
                Waiting for system interactions...
              </div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className={`log-entry ${log.level}`}>
                  <span className="log-timestamp">[{log.time}]</span>
                  <span className="log-text">{log.text}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
