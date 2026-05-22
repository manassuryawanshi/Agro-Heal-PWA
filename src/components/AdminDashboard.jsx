import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Users, MapPin, Sprout, Loader2, RefreshCw } from 'lucide-react';

export default function AdminDashboard({ onClose }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [farmers, setFarmers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
          <button type="submit" className="primary-btn" style={{ background: 'var(--primary)', color: 'white', padding: '12px', borderRadius: '12px', fontWeight: 'bold' }}>
            Login
          </button>
          <button type="button" onClick={onClose} style={{ padding: '12px', background: 'transparent', border: 'none', color: 'var(--text-muted)' }}>
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
    <div style={{ padding: '20px', background: 'var(--surface)', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: 'var(--text)', margin: 0 }}>Admin Dashboard</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={fetchFarmers} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-sunken)', color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <RefreshCw size={18} className={isLoading ? 'spinner' : ''} />
          </button>
          <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-sunken)', color: 'var(--text)', fontWeight: 'bold' }}>
            Close
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
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
  );
}
