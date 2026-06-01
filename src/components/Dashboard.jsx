import React, { useState, useRef, useEffect } from 'react';
import {
  Search, MapPin, ChevronRight, Droplets, Wind, ThermometerSun,
  CloudRain, Microscope, Stethoscope, IndianRupee, Rss,
  Info, LineChart, X, TrendingUp, Zap, ShieldCheck, Eye, PawPrint, Leaf
} from 'lucide-react';
import { cropDiseases, newsArticles, maharashtraDistricts } from '../data/mockData';
import { fetchLiveApmcRates } from '../data/api';

const L = (lang, en, mr) => lang === 'en' ? en : mr;

export default function Dashboard({ setCurrentTab, language, farmerProfile, weatherData, weatherLoading }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showDrop, setShowDrop] = useState(false);
  const searchRef = useRef(null);
  
  const [ratesData, setRatesData] = useState([]);

  useEffect(() => {
    // Load rates in background for search
    fetchLiveApmcRates().then(res => setRatesData(res.data || []));
  }, []);

  const handleSearch = (e) => {
    const q = e.target.value;
    setQuery(q);
    if (!q.trim()) { setResults([]); setShowDrop(false); return; }
    setShowDrop(true);
    const ql = q.toLowerCase();
    const out = [];
    Object.values(cropDiseases).forEach(d => {
      if (d.name.en.toLowerCase().includes(ql) || d.crop.en.toLowerCase().includes(ql))
        out.push({ label: `${d.name.en} — ${d.crop.en}`, tab: 'crops', icon: <Microscope size={14} /> });
    });
    ratesData.forEach(r => {
      if (r.crop.toLowerCase().includes(ql) || r.district.toLowerCase().includes(ql))
        out.push({ label: `${r.crop} @ ${r.district} — ₹${r.modalPrice}/Qtl`, tab: 'rates', icon: <IndianRupee size={14} /> });
    });
    newsArticles?.forEach(a => {
      if (a.title.en.toLowerCase().includes(ql))
        out.push({ label: a.title.en, tab: 'news', icon: <Rss size={14} /> });
    });
    setResults(out.slice(0, 7));
  };

  useEffect(() => {
    const h = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setShowDrop(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const getCropAlert = (crop) => {
    const alerts = {
      Cotton:    { title: { en: 'Pink Bollworm Risk — Act Now', mr: 'गुलाबी बोंडअळी धोका' }, desc: { en: 'Moderate to high risk of pink bollworm in cotton. Install pheromone traps (5 per acre) immediately and monitor the central boll weekly.', mr: 'कापसात गुलाबी बोंडअळीचा मोठा धोका. तात्काळ एकरी ५ कामगंध सापळे लावा.' }, level: 'high' },
      Soybean:   { title: { en: 'Soybean Rust Alert', mr: 'सोयाबीन तांबेरा इशारा' }, desc: { en: 'High humidity levels may trigger soybean rust. Apply Hexaconazole (1 ml/L water) as a preventive spray before visible lesions appear.', mr: 'अति आर्द्रतेमुळे तांबेरा दिसण्याची शक्यता. हेक्साकोनॅझोल फवारणी करा.' }, level: 'high' },
      Maize:     { title: { en: 'Fall Armyworm — Monitor Closely', mr: 'लष्करी अळी — निरीक्षण करा' }, desc: { en: 'Early-stage maize is vulnerable to Fall Armyworm. Check the central leaf whorl for feeding damage. Apply Neem extract spray (5%) at first sign.', mr: 'मक्याच्या पोंग्यात लष्करी अळी शिरू शकते. निंबोळी अर्काची फवारणी करा.' }, level: 'medium' },
      Wheat:     { title: { en: 'Irrigate During Cool Hours', mr: 'थंड वेळी पाणी द्या' }, desc: { en: 'Temperatures are rising. Water wheat during early morning (5–8 AM) or evening (6–8 PM) to prevent floral abortion and improve grain fill.', mr: 'गव्हाला सकाळी किंवा संध्याकाळी थंड वातावरणात पाणी द्या.' }, level: 'medium' },
      Chickpeas: { title: { en: 'Pod Borer — High Season Alert', mr: 'घाटी अळी — हंगाम इशारा' }, desc: { en: 'Peak pod borer season. Install 20 T-shaped bird perches per acre and consider Bt-based spray (Bacillus thuringiensis) for eco-friendly control.', mr: 'शेतात एकरी २० पक्षी थांबे उभारा. Bt-आधारित फवारणी करा.' }, level: 'high' },
    };
    return alerts[crop] || null;
  };

  const alert = farmerProfile ? getCropAlert(farmerProfile.crop) : null;
  const today = new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'mr-IN', { weekday: 'long', month: 'short', day: 'numeric' });

  const activeDistrictObj = maharashtraDistricts.find(d => d.id === farmerProfile?.district) || { name: farmerProfile?.district || 'Maharashtra', nameMr: farmerProfile?.districtMr || 'महाराष्ट्र' };
  const districtName = L(language, activeDistrictObj.name, activeDistrictObj.nameMr);

  const quickActions = [
    { id: 'livestock', label: { en: 'Livestock', mr: 'पशूधन' }, icon: <PawPrint size={24} />, bg: 'rgba(124,45,18,0.08)', color: '#9A3412' },
    { id: 'rates',     label: { en: 'Market', mr: 'बाजार' },    icon: <IndianRupee size={24} />, bg: 'rgba(14,58,140,0.08)', color: '#1565C0' },
    { id: 'news',      label: { en: 'News', mr: 'बातम्या' },   icon: <Rss size={24} />,          bg: 'rgba(146,64,14,0.08)', color: '#92400E' },
    { id: 'crops',     label: { en: 'Crop', mr: 'पीक' },       icon: <Leaf size={24} />,   bg: 'rgba(27,94,55,0.08)', color: 'var(--brand)' },
  ];

  return (
    <>
      {/* Search */}
      <div ref={searchRef} style={{ position: 'relative', marginBottom: 20 }}>
        <div className="search-container" style={{ margin: 0 }}>
          <Search size={16} color="var(--t4)" />
          <input
            type="text" value={query} onChange={handleSearch}
            placeholder={L(language, 'Search crops, diseases, rates…', 'पिके, रोग, बाजारभाव शोधा…')}
          />
          {query && (
            <button onClick={() => { setQuery(''); setShowDrop(false); setResults([]); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t4)', display: 'flex', padding: 0 }}>
              <X size={14} />
            </button>
          )}
        </div>
        {showDrop && (
          <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: 'var(--card)', borderRadius: 'var(--r-lg)', boxShadow: 'var(--s3)', border: '1px solid var(--sep-sm)', overflow: 'hidden', zIndex: 200 }}>
            {results.length === 0
              ? <div style={{ padding: '14px 16px', fontSize: 13, color: 'var(--t3)', textAlign: 'center' }}>{L(language, 'No results found', 'काहीही सापडले नाही')}</div>
              : results.map((r, i) => (
                <button key={i} onClick={() => { setCurrentTab(r.tab); setQuery(''); setShowDrop(false); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'none', border: 'none', width: '100%', cursor: 'pointer', fontFamily: 'inherit', borderBottom: '1px solid var(--sep-sm)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--sunken)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <span style={{ color: 'var(--brand)' }}>{r.icon}</span>
                  <span style={{ flex: 1, fontSize: 14, color: 'var(--t1)', textAlign: 'left' }}>{r.label}</span>
                  <ChevronRight size={12} color="var(--t4)" />
                </button>
              ))}
          </div>
        )}
      </div>

      {/* 2-col grid on desktop */}
      <div className="dashboard-desktop-grid">

        {/* LEFT */}
        <div className="dashboard-col-left">

          {/* Weather Hero */}
          <div className="weather-widget" onClick={() => setCurrentTab('weather')}>
            <div className="weather-widget-header">
              <div>
                <MapPin size={12} color="rgba(255,255,255,0.65)" />
                <span>{districtName}</span>
              </div>
              <span className="weather-widget-date">{today}</span>
            </div>
            <div className="weather-widget-main">
              <div className="weather-temp">
                <ThermometerSun size={36} color="rgba(255,210,90,0.9)" strokeWidth={1.5} />
                {weatherLoading && !weatherData ? (
                  <div className="skeleton" style={{ width: 60, height: 44, borderRadius: 'var(--r-sm)', margin: '0 0 0 8px' }}></div>
                ) : (
                  <div>
                    <span className="temp-value">{weatherData ? weatherData.temp : '34'}</span>
                    <span className="temp-unit">°C</span>
                  </div>
                )}
              </div>
              <div className="weather-metrics-mini">
                {weatherLoading && !weatherData ? (
                  <>
                    <div className="skeleton" style={{ width: 70, height: 22, borderRadius: 'var(--r-pill)', marginBottom: 4 }}></div>
                    <div className="skeleton" style={{ width: 70, height: 22, borderRadius: 'var(--r-pill)', marginBottom: 4 }}></div>
                    <div className="skeleton" style={{ width: 70, height: 22, borderRadius: 'var(--r-pill)' }}></div>
                  </>
                ) : (
                  <>
                    <div className="metric-mini">
                      <Droplets size={11} />
                      <span>{weatherData ? `${weatherData.humidity}%` : '45%'}</span>
                    </div>
                    <div className="metric-mini">
                      <Wind size={11} />
                      <span>
                        {weatherData 
                          ? L(language, `${weatherData.windSpeed} km/h`, `${weatherData.windSpeed} किमी/तास`) 
                          : L(language, '12 km/h', '१२ किमी/तास')}
                      </span>
                    </div>
                    <div className="metric-mini">
                      <CloudRain size={11} />
                      <span>
                        {weatherData 
                          ? L(language, `${weatherData.rain} mm rain`, `${weatherData.rain} मिमी पाऊस`) 
                          : L(language, '0 mm rain', '० मिमी पाऊस')}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* AI Scan CTA */}
          <div className="crops-scan-card" onClick={() => setCurrentTab('crops')}>
            <div style={{ width: 68, height: 68, borderRadius: 22, background: 'linear-gradient(145deg,var(--brand-mid),var(--brand))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--sg)' }}>
              <Eye size={30} color="#fff" strokeWidth={1.8} />
            </div>
            <div>
              <h4>{L(language, 'Diagnose Your Crop', 'पिकाचे निदान करा')}</h4>
              <p style={{ marginTop: 4 }}>
                {L(language,
                  'Photograph a leaf and get an instant AI-powered disease report with organic & chemical remedies.',
                  'पानाचा फोटो घ्या आणि AI ने रोगाचे अचूक निदान व उपाय मिळवा.'
                )}
              </p>
            </div>
            <button className="btn-primary" style={{ marginTop: 4 }}>
              <Zap size={15} />{L(language, 'Open AI Scanner', 'AI स्कॅनर उघडा')}
            </button>
          </div>

        </div>

        {/* RIGHT */}
        <div className="dashboard-col-right">

          {/* Quick Actions */}
          <div>
            <p className="section-label">{L(language, 'Explore', 'एक्सप्लोर करा')}</p>
            <div className="actions-grid">
              {quickActions.map(a => (
                <button key={a.id} className="action-card" onClick={() => setCurrentTab(a.id)}>
                  <div className="action-icon-wrap" style={{ background: a.bg, color: a.color }}>{a.icon}</div>
                  <span className="action-label">{L(language, a.label.en, a.label.mr)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Today's Highlights */}
          <div>
            <p className="section-label" style={{ marginBottom: 10 }}>{L(language, "Today's Updates", 'आजची माहिती')}</p>
            <div className="promo-list">
              <div className="promo-card" onClick={() => setCurrentTab('rates')}>
                <div className="promo-icon" style={{ background: 'rgba(14,58,140,0.07)', color: '#1565C0' }}>
                  <IndianRupee size={20} />
                </div>
                <div className="promo-text">
                  <h4>{L(language, 'Market Rates Refreshed', 'बाजारभाव अपडेट झाले')}</h4>
                  <p>{L(language, `Today's APMC prices for ${farmerProfile?.crop || 'your crop'}`, `${farmerProfile?.cropMr || 'तुमच्या पिका'}साठी आजचे बाजारभाव`)}</p>
                </div>
                <ChevronRight size={14} color="var(--t4)" style={{ marginLeft: 'auto', flexShrink: 0 }} />
              </div>
              <div className="promo-card" onClick={() => setCurrentTab('news')}>
                <div className="promo-icon" style={{ background: 'rgba(146,64,14,0.07)', color: '#92400E' }}>
                  <Info size={20} />
                </div>
                <div className="promo-text">
                  <h4>{L(language, 'Scheme & Subsidy News', 'योजना आणि अनुदान')}</h4>
                  <p>{L(language, 'New government schemes available for your district.', 'तुमच्या जिल्ह्यातील नव्या सरकारी योजना.')}</p>
                </div>
                <ChevronRight size={14} color="var(--t4)" style={{ marginLeft: 'auto', flexShrink: 0 }} />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Crop-specific Alert */}
      {alert && (
        <div className={`advisory-card ${alert.level}`} style={{ marginTop: 16 }}>
          <div className="advisory-header">
            <ShieldCheck size={16} color={alert.level === 'high' ? 'var(--sys-red)' : 'var(--sys-orange)'} />
            <h4>{L(language, alert.title.en, alert.title.mr)}</h4>
          </div>
          <p className="advisory-desc">{L(language, alert.desc.en, alert.desc.mr)}</p>
          <p className="advisory-footer">
            {L(language, `Targeted for your ${farmerProfile?.crop} crop in ${farmerProfile?.district}`, `${farmerProfile?.cropMr} पिकासाठी ${farmerProfile?.districtMr} जिल्हा विशेष`)}
          </p>
        </div>
      )}

      {/* Farm Tools */}
      <div style={{ marginTop: 24 }}>
        <p className="section-label">{L(language, 'Farm Tools', 'शेती साधने')}</p>
        <div className="promo-list">
          <div className="promo-card" onClick={() => setCurrentTab('crops')}>
            <div className="promo-icon" style={{ background: 'rgba(27,94,55,0.07)', color: 'var(--brand)' }}><Leaf size={20} /></div>
            <div className="promo-text">
              <h4>{L(language, 'Leaf Disease Scanner', 'पान रोग तपासणी')}</h4>
              <p>{L(language, 'Photo + AI = instant disease name, severity score, and step-by-step remedy.', 'फोटो + AI = रोगाचे नाव, तीव्रता आणि संपूर्ण उपाययोजना.')}</p>
            </div>
          </div>
          <div className="promo-card" onClick={() => setCurrentTab('weather')}>
            <div className="promo-icon" style={{ background: 'rgba(0,122,255,0.07)', color: 'var(--sys-blue)' }}>
              <CloudRain size={20} />
            </div>
            <div className="promo-text">
              <h4>{L(language, '7-Day Weather & Spray Window', '७-दिवस हवामान व फवारणी सल्ला')}</h4>
              <p>{L(language, 'Regional forecast, soil moisture, wind speed — know the best day to spray.', 'हवेचा वेग, माती आणि पाऊस — फवारणीसाठी योग्य दिवस ओळखा.')}</p>
            </div>
          </div>
          <div className="promo-card" onClick={() => setCurrentTab('livestock')}>
            <div className="promo-icon" style={{ background: 'rgba(124,45,18,0.07)', color: '#9A3412' }}>
              <PawPrint size={20} />
            </div>
            <div className="promo-text">
              <h4>{L(language, 'Animal Health Advisor', 'पशू आरोग्य सल्लागार')}</h4>
              <p>{L(language, 'Describe symptoms for your cow, goat, or poultry and get first-aid guidance instantly.', 'गाय, शेळी किंवा कोंबडीच्या लक्षणांवर तात्काळ प्रथमोपचार सल्ला.')}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
