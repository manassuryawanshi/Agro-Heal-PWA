import React, { useState, useEffect, useRef } from 'react';
import { Home, CloudRain, TrendingUp, Newspaper, Globe, X, Scan, Sprout, PawPrint, Menu } from 'lucide-react';

const LONG_PRESS_MS = 300;

export default function AppLayout({ currentTab, setCurrentTab, language, setLanguage, farmerProfile, onEditProfile, onSecretUnlock, children }) {
  const [fabOpen, setFabOpen] = useState(false);
  const [lastFabTab, setLastFabTab] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile sidebar toggle if needed
  
  const [tapCount, setTapCount] = useState(0);
  const tapTimeout = useRef(null);

  const handleSecretTap = () => {
    setTapCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 5) {
        if (onSecretUnlock) onSecretUnlock();
        return 0;
      }
      return newCount;
    });

    if (tapTimeout.current) clearTimeout(tapTimeout.current);
    tapTimeout.current = setTimeout(() => {
      setTapCount(0);
    }, 1000);
  };

  const longPressTimer = useRef(null);
  const isLongPress    = useRef(false);
  const [pressing, setPressing] = useState(false);

  useEffect(() => {
    if (currentTab === 'crops' || currentTab === 'livestock') {
      setLastFabTab(currentTab);
    }
  }, [currentTab]);

  // ── FAB handlers ──
  const startPress = () => {
    isLongPress.current = false;
    setPressing(true);
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      setPressing(false);
      setFabOpen(true);
    }, LONG_PRESS_MS);
  };

  const cancelPress = () => {
    clearTimeout(longPressTimer.current);
    setPressing(false);
  };

  const handleFabClick = () => {
    if (isLongPress.current) {
      isLongPress.current = false;
      return;
    }
    if (lastFabTab === null) {
      setFabOpen(true);
    } else {
      setCurrentTab(lastFabTab);
    }
  };

  const handleSelect = (id) => {
    setLastFabTab(id);
    setCurrentTab(id);
    setFabOpen(false);
  };

  const getFabIcon = () => {
    if (fabOpen) return <X size={26} strokeWidth={2.5} color="#fff" />;
    const active = currentTab === 'crops' || currentTab === 'livestock' ? currentTab : lastFabTab;
    if (active === 'crops') return <Scan size={26} strokeWidth={2} color="#fff" />;
    if (active === 'livestock') return <Scan size={26} strokeWidth={2} color="#fff" />;
    return <Scan size={26} strokeWidth={2} color="#fff" />;
  };

  const getFabLabel = () => {
    const active = currentTab === 'crops' || currentTab === 'livestock' ? currentTab : lastFabTab;
    if (active === 'crops') return language === 'en' ? 'Scan Crop' : 'पीक स्कॅन';
    if (active === 'livestock') return language === 'en' ? 'Scan Animal' : 'पशू स्कॅन';
    return language === 'en' ? 'Smart Scan' : 'स्मार्ट स्कॅन';
  };

  const isFabActive = currentTab === 'crops' || currentTab === 'livestock';
  const hasProfile  = !!farmerProfile;
  const avatarLetter = (hasProfile && farmerProfile?.name) ? farmerProfile.name.charAt(0).toUpperCase() : '?';

  const navItems = [
    { id: 'dashboard', label: { en: 'Home', mr: 'मुख्य' }, icon: Home },
    { id: 'weather', label: { en: 'Weather', mr: 'हवामान' }, icon: CloudRain },
    { id: 'scan_divider' }, // placeholder for the scan button in mobile
    { id: 'rates', label: { en: 'Rates', mr: 'बाजार' }, icon: TrendingUp },
    { id: 'news', label: { en: 'News', mr: 'बातम्या' }, icon: Newspaper },
  ];

  return (
    <div className={`app-shell ${!hasProfile ? 'onboarding-active' : ''}`}>
      {/* ── DESKTOP SIDEBAR ── */}
      {hasProfile && (
        <aside className="desktop-sidebar">
          <div className="sidebar-brand" onClick={handleSecretTap} style={{ cursor: 'pointer' }}>
            <Sprout size={28} color="var(--primary)" />
            <h2>Agro Heal</h2>
          </div>
          
          <nav className="sidebar-nav">
            {navItems.map(item => {
              if (item.id === 'scan_divider') return null;
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button key={item.id} className={`sidebar-nav-item ${isActive ? 'active' : ''}`} onClick={() => setCurrentTab(item.id)}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{language === 'en' ? item.label.en : item.label.mr}</span>
                </button>
              );
            })}
          </nav>

          <div className="sidebar-bottom">
            <button className="sidebar-scan-btn" onClick={() => setFabOpen(true)}>
              <Scan size={20} color="#fff" />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
                <span style={{ lineHeight: '1.2' }}>{language === 'en' ? 'Smart AI Scan' : 'स्मार्ट AI स्कॅन'}</span>
                <span style={{ fontSize: '9px', opacity: 0.8, fontWeight: 'normal', lineHeight: '1' }}>
                  {language === 'en' ? '(Click to choose mode)' : '(मोड निवडण्यासाठी क्लिक करा)'}
                </span>
              </div>
            </button>
          </div>
        </aside>
      )}

      {/* ── MAIN CONTENT AREA ── */}
      <main className="app-main-content">
        {hasProfile && (
          <header className="app-top-header">
            <div className="user-profile" onClick={onEditProfile} style={{ cursor: onEditProfile ? 'pointer' : 'default' }}>
              <div className="user-avatar" onClick={(e) => { e.stopPropagation(); handleSecretTap(); }}>{avatarLetter}</div>
              <div className="user-meta">
                <h3>{language === 'en' ? `Hello, ${farmerProfile.name}` : `नमस्कार, ${farmerProfile.name}`}</h3>
                <p>{language === 'en' ? `${farmerProfile.district}, MH` : `${farmerProfile.districtMr}, महा.`}</p>
              </div>
            </div>
            <div className="lang-switcher-pill" style={{ display: 'flex', background: 'var(--sunken)', borderRadius: '20px', padding: '2px', gap: '2px' }}>
              <button 
                type="button" 
                onClick={() => setLanguage('en')}
                style={{
                  border: 'none',
                  background: language === 'en' ? 'var(--brand)' : 'transparent',
                  color: language === 'en' ? '#fff' : 'var(--t3)',
                  padding: '5px 12px',
                  borderRadius: '15px',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s ease',
                  boxShadow: language === 'en' ? 'var(--s0)' : 'none'
                }}
              >
                EN
              </button>
              <button 
                type="button" 
                onClick={() => setLanguage('mr')}
                style={{
                  border: 'none',
                  background: language === 'mr' ? 'var(--brand)' : 'transparent',
                  color: language === 'mr' ? '#fff' : 'var(--t3)',
                  padding: '5px 12px',
                  borderRadius: '15px',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s ease',
                  boxShadow: language === 'mr' ? 'var(--s0)' : 'none'
                }}
              >
                मराठी
              </button>
            </div>
          </header>
        )}
        
        <div className="app-scroll-container">
          {children}
        </div>
      </main>

      {/* ── SCAN CHOOSER OVERLAY ── */}
      {fabOpen && (
        <div className="fab-chooser-overlay" onClick={() => setFabOpen(false)}>
          <div className="fab-chooser-cards" onClick={e => e.stopPropagation()}>
            <p className="fab-chooser-hint">
              {language === 'en' ? 'What would you like to scan?' : 'तुम्हाला काय स्कॅन करायचे आहे?'}
            </p>

            <button className="fab-chooser-card crops-card" onClick={() => handleSelect('crops')}>
              <div className="fab-chooser-icon">
                <Sprout size={36} color="#fff" strokeWidth={1.8} />
              </div>
              <div className="fab-chooser-text">
                <h3>{language === 'en' ? 'Crop Scanner' : 'पीक स्कॅनर'}</h3>
                <p>{language === 'en' ? 'Scan diseases · AI Chat' : 'रोग तपासणी · AI सल्ला'}</p>
              </div>
            </button>

            <button className="fab-chooser-card livestock-card" onClick={() => handleSelect('livestock')}>
              <div className="fab-chooser-icon">
                <PawPrint size={36} color="#fff" strokeWidth={1.8} />
              </div>
              <div className="fab-chooser-text">
                <h3>{language === 'en' ? 'Livestock Scanner' : 'पशूधन स्कॅनर'}</h3>
                <p>{language === 'en' ? 'Photo diagnosis · Vet AI Chat' : 'फोटो निदान · पशुवैद्य AI चॅट'}</p>
              </div>
            </button>
            <button className="fab-chooser-close-hint" onClick={() => setFabOpen(false)}>
              {language === 'en' ? 'Tap anywhere to close' : 'बंद करण्यासाठी बाहेर टॅप करा'}
            </button>
          </div>
        </div>
      )}

      {/* ── MOBILE BOTTOM NAV ── */}
      {hasProfile && (
        <nav className="mobile-bottom-nav">
          {navItems.map((item, idx) => {
            if (item.id === 'scan_divider') {
              return (
                <div key="scan" className="nav-fab-wrapper">
                  {pressing && <div className="fab-press-ring" />}
                  <button
                    className={`nav-fab ${fabOpen ? 'fab-open' : ''} ${isFabActive ? 'fab-active-glow' : ''} ${pressing ? 'fab-pressing' : ''}`}
                    onMouseDown={startPress} onMouseUp={cancelPress} onMouseLeave={cancelPress}
                    onTouchStart={startPress} onTouchEnd={cancelPress}
                    onClick={handleFabClick}
                  >
                    {getFabIcon()}
                  </button>
                  <span className={`nav-fab-label ${isFabActive ? 'active' : ''}`}>
                    {getFabLabel()}
                  </span>
                </div>
              );
            }
            
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button key={item.id} className={`mobile-nav-item ${isActive ? 'active' : ''}`} onClick={() => setCurrentTab(item.id)}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span>{language === 'en' ? item.label.en : item.label.mr}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
