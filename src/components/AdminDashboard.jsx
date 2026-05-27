import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Users, MapPin, Sprout, Loader2, RefreshCw, Cpu, Trash2, Settings, Key, UserCheck, UserMinus, Database } from 'lucide-react';

export default function AdminDashboard({ 
  onClose, 
  apiKey, 
  setApiKey, 
  simulatedMode, 
  setSimulatedMode, 
  logs, 
  clearLogs, 
  resetFarmerProfile, 
  farmerProfile 
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [farmers, setFarmers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('database'); // 'database' | 'console'

  const SECRET_PASSWORD = '123'; // Super simple for portfolio

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === SECRET_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
      fetchFarmers();
    } else {
      setError('Incorrect password');
    }
  };

  const fetchFarmers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('farmers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFarmers(data || []);
    } catch (err) {
      console.error('Error fetching farmers:', err);
      setError('Failed to load data. Is Supabase configured correctly?');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '20px', background: 'var(--surface)', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ marginBottom: '20px', color: 'var(--text)' }}>Admin Access</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%', maxWidth: '300px' }}>
          <input
            type="password"
            placeholder="Enter Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface-sunken)', color: 'var(--text)' }}
          />
          {error && <p style={{ color: '#ff4757', fontSize: '14px', textAlign: 'center' }}>{error}</p>}
          <button type="submit" className="primary-btn" style={{ background: 'var(--primary)', color: 'white', padding: '12px', borderRadius: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
            Login
          </button>
          <button type="button" onClick={onClose} style={{ padding: '12px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            Cancel
          </button>
        </form>
      </div>
    );
  }

  // Calculate metrics
  const totalFarmers = farmers.length;
  const districts = [...new Set(farmers.map(f => f.district))].length;
  
  return (
    <div style={{ padding: '20px', background: 'var(--surface)', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={24} color="var(--primary)" />
          <h2 style={{ color: 'var(--text)', margin: 0 }}>Agro Heal Admin Portal</h2>
        </div>
        <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface-sunken)', color: 'var(--text)', fontWeight: 'bold', cursor: 'pointer' }}>
          Close
        </button>
      </div>

      {/* Tabs System */}
      <div style={{ display: 'flex', background: 'var(--surface-sunken)', borderRadius: '12px', padding: '4px', gap: '4px' }}>
        <button 
          onClick={() => { setActiveTab('database'); fetchFarmers(); }}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px',
            borderRadius: '9px',
            border: 'none',
            fontFamily: 'inherit',
            fontWeight: '700',
            fontSize: '13px',
            cursor: 'pointer',
            background: activeTab === 'database' ? 'var(--surface)' : 'transparent',
            color: activeTab === 'database' ? 'var(--primary)' : 'var(--text-muted)',
            boxShadow: activeTab === 'database' ? 'var(--s1)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          <Database size={16} />
          <span>Farmers Database</span>
        </button>

        <button 
          onClick={() => setActiveTab('console')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px',
            borderRadius: '9px',
            border: 'none',
            fontFamily: 'inherit',
            fontWeight: '700',
            fontSize: '13px',
            cursor: 'pointer',
            background: activeTab === 'console' ? 'var(--surface)' : 'transparent',
            color: activeTab === 'console' ? 'var(--primary)' : 'var(--text-muted)',
            boxShadow: activeTab === 'console' ? 'var(--s1)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          <Cpu size={16} />
          <span>Dev Engine Console</span>
        </button>
      </div>

      {/* Tab 1: Farmers List */}
      {activeTab === 'database' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div style={{ background: 'var(--primary)', padding: '15px', borderRadius: '16px', color: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', opacity: 0.9 }}>
                <Users size={16} /> Total Farmers
              </div>
              <div style={{ fontSize: '32px', fontWeight: '800' }}>{isLoading ? '-' : totalFarmers}</div>
            </div>
            <div style={{ background: 'var(--surface-sunken)', border: '1px solid var(--border)', padding: '15px', borderRadius: '16px', color: 'var(--text)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-muted)' }}>
                <MapPin size={16} /> Districts
              </div>
              <div style={{ fontSize: '32px', fontWeight: '800' }}>{isLoading ? '-' : districts}</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'bold' }}>Supabase Table Records</span>
            <button onClick={fetchFarmers} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-sunken)', color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <RefreshCw size={14} className={isLoading ? 'spinner' : ''} />
            </button>
          </div>

          {isLoading && farmers.length === 0 ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
              <Loader2 className="spinner" size={32} color="var(--primary)" />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {farmers.map((farmer) => (
                <div key={farmer.id} style={{ background: 'var(--surface-sunken)', border: '1px solid var(--border)', padding: '15px', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text)' }}>{farmer.name}</h3>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {new Date(farmer.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    <MapPin size={14} /> {farmer.district}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    <Sprout size={14} /> {farmer.crop}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text)', fontWeight: 'bold', marginTop: '10px' }}>
                    📱 {farmer.phone}
                  </div>
                </div>
              ))}
              {farmers.length === 0 && !isLoading && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>No users found.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Retro Dev Console & Logs */}
      {activeTab === 'console' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Engine Mode Toggle */}
          <div style={{ background: 'var(--surface-sunken)', border: '1px solid var(--border)', borderRadius: '12px', padding: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Settings size={16} color="var(--primary)" />
                <h4 style={{ margin: 0, color: 'var(--text)' }}>
                  App Engine Mode: <span style={{ color: simulatedMode ? '#fbc02d' : '#2ed573' }}>{simulatedMode ? 'Demo Simulator' : 'Live Cloud API'}</span>
                </h4>
              </div>
              <button 
                onClick={() => setSimulatedMode(!simulatedMode)}
                style={{
                  background: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Toggle Mode
              </button>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>
              {simulatedMode 
                ? 'Offline pre-compiled diagnostics are active (instant response, zero cost).' 
                : 'Live Cloud interfaces active (connects directly to Gemini AI and Google Cloud).'}
            </p>
          </div>

          {/* Gemini API Key */}
          <div style={{ background: 'var(--surface-sunken)', border: '1px solid var(--border)', borderRadius: '12px', padding: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Key size={16} color="var(--primary)" />
              <h4 style={{ margin: 0, color: 'var(--text)' }}>Gemini API Integration</h4>
            </div>
            <input 
              type="password" 
              placeholder="VITE_GEMINI_API_KEY (AIzaSy...)" 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text)',
                fontSize: '13px',
                fontFamily: 'monospace'
              }}
            />
          </div>

          {/* Farmer Profile Reset Simulator */}
          <div style={{ background: 'var(--surface-sunken)', border: '1px solid var(--border)', borderRadius: '12px', padding: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCheck size={16} color="var(--primary)" />
                <h4 style={{ margin: 0, color: 'var(--text)' }}>Local Onboarding Session</h4>
              </div>
              <button 
                onClick={() => {
                  if(window.confirm("This will clear your local active session and take you back to login. Continue?")) {
                    resetFarmerProfile();
                  }
                }}
                style={{
                  background: '#ff4757',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <UserMinus size={12} />
                Reset Session
              </button>
            </div>
          </div>

          {/* Real-time System Debug Logs Console */}
          <div style={{ background: 'var(--surface-sunken)', border: '1px solid var(--border)', borderRadius: '12px', padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Cpu size={14} color="var(--primary)" />
                <span>System Engine Debug Logs</span>
              </h4>
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
                  fontSize: '12px',
                  fontWeight: '700'
                }}
              >
                <Trash2 size={12} />
                Clear
              </button>
            </div>

            {/* Dark Retro Console Terminal */}
            <div style={{
              background: '#0c0f0d',
              borderRadius: '8px',
              padding: '12px',
              fontFamily: 'monospace',
              fontSize: '12px',
              height: '240px',
              overflowY: 'auto',
              border: '1.5px solid #1a231d',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              {logs.length === 0 ? (
                <div style={{ color: '#4a5d51', fontStyle: 'italic' }}>
                  Waiting for user interactions to capture system events...
                </div>
              ) : (
                logs.map((log, index) => {
                  let color = '#a4b8ab'; // default info color
                  if (log.level === 'success') color = '#2ed573';
                  if (log.level === 'warning') color = '#ffbc00';
                  if (log.level === 'error') color = '#ff4757';
                  
                  return (
                    <div key={index} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', lineHeight: '1.4' }}>
                      <span style={{ color: '#4a5d51' }}>[{log.time}]</span>
                      <span style={{ color: color }}>{log.text}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
