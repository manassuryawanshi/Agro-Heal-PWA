import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, Minus, Info, ChevronDown, ChevronUp, MapPin, IndianRupee, SlidersHorizontal, RefreshCcw, Wifi, WifiOff } from 'lucide-react';
import { maharashtraDistricts } from '../data/mockData';
import { fetchLiveApmcRates } from '../data/api';

const L = (lang, en, mr) => lang === 'en' ? en : mr;

// Crop icon paths
const CROP_ICONS = {
  Cotton: '/crops/cotton.png', Soybean: '/crops/soybean.png',
  Maize: '/crops/maize.png', Wheat: '/crops/wheat.png',
  Chickpeas: '/crops/chickpeas.png', Onion: '/crops/onion.png',
};

export default function RateChart({ language, addLog, farmerProfile }) {
  const [selectedCrop,   setSelectedCrop]   = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [searchQuery,    setSearchQuery]    = useState('');
  const [expandedIdx,    setExpandedIdx]    = useState(null);
  
  // New States for API
  const [ratesData, setRatesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  // Fetch logic
  const loadRates = async (force = false) => {
    setIsLoading(true);
    const result = await fetchLiveApmcRates(addLog, force);
    setRatesData(result.data || []);
    setIsLive(result.isLive);
    setIsLoading(false);
  };

  useEffect(() => {
    loadRates();
  }, []);

  const crops = [
    { key:'All',       en:'All Crops', mr:'सर्व पिके'   },
    { key:'Cotton',    en:'Cotton',    mr:'कापूस'        },
    { key:'Soybean',   en:'Soybean',   mr:'सोयाबीन'     },
    { key:'Maize',     en:'Maize',     mr:'मका'          },
    { key:'Wheat',     en:'Wheat',     mr:'गहू'          },
    { key:'Chickpeas', en:'Chickpeas', mr:'हरभरा'        },
  ];
  const regions = [
    { key:'All',                     en:'All Regions', mr:'सर्व विभाग'    },
    { key:'Vidarbha',                en:'Vidarbha',    mr:'विदर्भ'         },
    { key:'Western Maharashtra',     en:'West MS',     mr:'पश्चिम महा.'   },
    { key:'Khandesh (North MS)',     en:'Khandesh',    mr:'खानदेश'        },
    { key:'Marathwada',              en:'Marathwada',  mr:'मराठवाडा'      },
  ];

  const getRegion = (dist) => {
    const d = maharashtraDistricts.find(x => x.id.toLowerCase() === dist.toLowerCase());
    return d ? d.region : 'Other';
  };

  const filtered = ratesData.filter(r => {
    const cropOk = selectedCrop === 'All' || r.crop === selectedCrop;
    const regOk  = selectedRegion === 'All' || getRegion(r.district) === selectedRegion;
    const q = searchQuery.toLowerCase();
    const searchOk = !q || r.district.toLowerCase().includes(q) || r.crop.toLowerCase().includes(q) || (r.districtMr && r.districtMr.includes(searchQuery));
    return cropOk && regOk && searchOk;
  });

  return (
    <>
      {/* Header */}
      <div className="screen-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ display:'flex', alignItems:'center', gap:8 }}>
            <IndianRupee size={22} color="var(--brand)" />
            {L(language, 'Market Rates', 'बाजार समिती भाव')}
          </h2>
          <p style={{ fontSize:13, color:'var(--t3)', marginTop:4, display: 'flex', alignItems: 'center', gap: 6 }}>
            {isLive ? <Wifi size={12} color="var(--brand)" /> : <WifiOff size={12} color="var(--t3)" />}
            {L(language, isLive ? 'Live wholesale prices' : 'Offline historical prices', isLive ? 'थेट बाजारभाव' : 'ऑफलाईन बाजारभाव')}
          </p>
        </div>
        <button 
          onClick={() => loadRates(true)}
          disabled={isLoading}
          style={{ 
            background: 'var(--brand-tint)', border: 'none', padding: '6px 12px', 
            borderRadius: '20px', display: 'flex', alignItems: 'center', gap: 6, 
            color: 'var(--brand)', fontWeight: 700, fontSize: 11, cursor: 'pointer',
            opacity: isLoading ? 0.5 : 1
          }}
        >
          <RefreshCcw size={12} className={isLoading ? 'spin-anim' : ''} />
          {L(language, 'Refresh', 'रिफ्रेश')}
        </button>
      </div>

      {/* Search */}
      <div className="search-container" style={{ marginTop: 12 }}>
        <Search size={16} color="var(--t4)" />
        <input
          type="text"
          placeholder={L(language, 'Search district or crop…', 'जिल्हा किंवा पीक शोधा…')}
          value={searchQuery}
          onChange={e => { setSearchQuery(e.target.value); setExpandedIdx(null); }}
        />
      </div>

      {/* Region Filter */}
      <div className="filter-section">
        <p className="filter-section-label">
          <MapPin size={11} />{L(language, 'Region', 'विभाग')}
        </p>
        <div className="chip-row">
          {regions.map(r => (
            <button key={r.key} className={`chip ${selectedRegion === r.key ? 'active' : ''}`}
              onClick={() => { setSelectedRegion(r.key); setExpandedIdx(null); }}>
              {L(language, r.en, r.mr)}
            </button>
          ))}
        </div>
      </div>

      {/* Crop Filter */}
      <div className="filter-section">
        <p className="filter-section-label">
          <SlidersHorizontal size={11} />{L(language, 'Crop', 'पीक')}
        </p>
        <div className="chip-row">
          {crops.map(c => (
            <button key={c.key} className={`chip ${selectedCrop === c.key ? 'active' : ''}`}
              onClick={() => { setSelectedCrop(c.key); setExpandedIdx(null); }}>
              {L(language, c.en, c.mr)}
            </button>
          ))}
        </div>
      </div>

      {/* Personalisation shortcuts */}
      {farmerProfile && (
        <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
          <button className="chip" style={{ borderColor:'rgba(27,94,55,0.3)', color:'var(--brand)' }}
            onClick={() => { setSelectedCrop(farmerProfile.crop); setSelectedRegion('All'); setSearchQuery(''); }}>
            {L(language, `My Crop — ${farmerProfile.crop}`, `माझे पीक — ${farmerProfile.cropMr}`)}
          </button>
          <button className="chip" style={{ borderColor:'rgba(27,94,55,0.3)', color:'var(--brand)' }}
            onClick={() => {
              const d = maharashtraDistricts.find(x => x.id === farmerProfile.district);
              setSelectedCrop('All');
              setSelectedRegion(d ? d.region : 'All');
              setSearchQuery(farmerProfile.district);
            }}>
            {L(language, `Near Me — ${farmerProfile.district}`, `जवळचे — ${farmerProfile.districtMr}`)}
          </button>
        </div>
      )}

      {/* Rate Cards */}
      <div className="rates-list">
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1,2,3].map(n => (
              <div key={n} style={{ height: 70, background: '#f5f7f5', borderRadius: 12, animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'32px 20px', background:'var(--card)', borderRadius:'var(--r-lg)', border:'1px solid var(--sep-sm)' }}>
            <p style={{ color:'var(--t3)', fontSize:14 }}>{L(language, 'No matching rates found.', 'कोणतेही बाजारभाव सापडले नाहीत.')}</p>
          </div>
        ) : filtered.map((rate, i) => {
          const trend = rate.trend || 'stable';
          const isUp    = trend === 'up';
          const isDown  = trend === 'down';
          const trendColor = isUp ? '#1E8449' : isDown ? 'var(--sys-red)' : 'var(--t3)';
          const TrendIcon  = isUp ? TrendingUp : isDown ? TrendingDown : Minus;
          const expanded = expandedIdx === i;

          return (
            <div key={i} className={`rate-card ${expanded ? 'expanded' : ''}`}
              onClick={() => { setExpandedIdx(expanded ? null : i); addLog(`[Rates] Expanded ${rate.crop} @ ${rate.district}`, 'info'); }}>

              <div className="rate-card-main">
                <div className="rate-card-left">
                  {/* Crop icon */}
                  <div style={{ width:40, height:40, borderRadius:10, overflow:'hidden', background:'rgba(27,94,55,0.06)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    {CROP_ICONS[rate.crop]
                      ? <img src={CROP_ICONS[rate.crop]} alt={rate.crop} style={{ width:'100%', height:'100%', objectFit:'contain' }} />
                      : <IndianRupee size={18} color="var(--brand)" />
                    }
                  </div>
                  <div>
                    <div className="rate-card-crop">{L(language, rate.crop, rate.cropMr)}</div>
                    <div className="rate-card-mandi">
                      <MapPin size={10} color="var(--t4)" />
                      {L(language, rate.district, rate.districtMr)}
                      {rate.market && ` (${rate.market})`}
                    </div>
                  </div>
                </div>

                <div className="rate-card-right">
                  <div>
                    <div className="rate-card-price" style={{ color: trendColor }}>₹{rate.modalPrice}</div>
                    <div className="rate-card-range">₹{rate.minPrice}–{rate.maxPrice} / Qtl</div>
                  </div>
                  {/* Trend badge */}
                  <div style={{ width:28, height:28, borderRadius:8, background: trendColor + '18', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <TrendIcon size={14} color={trendColor} />
                  </div>
                  {expanded ? <ChevronUp size={14} color="var(--t4)" /> : <ChevronDown size={14} color="var(--t4)" />}
                </div>
              </div>

              {/* Expanded Details */}
              {expanded && (
                <div className="rate-card-expanded">
                  <div className="rate-expanded-row">
                    <span className="rate-sentiment-tag" style={{ background: trendColor + '14', color: trendColor }}>
                      <TrendIcon size={11} />
                      {L(language,
                        isUp ? 'Upward Trend' : isDown ? 'Falling Trend' : 'Stable Market',
                        isUp ? 'वाढता कल'    : isDown ? 'घसरता कल'     : 'स्थिर बाजार'
                      )}
                    </span>
                    <span style={{ fontSize:11, color:'var(--t3)' }}>
                      {rate.arrivalDate 
                        ? `${L(language, 'Arrival Date:', 'आवक तारीख:')} ${rate.arrivalDate}`
                        : L(language, 'Updated today', 'आज अपडेट झाले')
                      }
                    </span>
                  </div>
                  <div className="rate-expanded-reason">
                    <span style={{ fontSize:11, fontWeight:700, color:'var(--t2)' }}>{L(language, 'Why: ', 'कारण: ')}</span>
                    {L(language, rate.trendReason?.en || 'Live data from Agmarknet.', rate.trendReason?.mr || 'कृषी उत्पन्न बाजार समितीचा थेट डेटा.')}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* MSAMB Disclaimer */}
      <div className="apmc-disclaimer" style={{ marginTop: 16 }}>
        <Info size={15} color="var(--brand)" style={{ flexShrink:0, marginTop:1 }} />
        <p>
          {L(language,
            isLive ? 'Live data sourced from Government of India (Data.gov.in / Agmarknet).' : 'Prices sourced from MSAMB. Showing offline historical data.',
            isLive ? 'भारत सरकारच्या अधिकृत पोर्टलवरून (Data.gov.in) थेट बाजारभाव.' : 'बाजार भाव MSAMB कडून. सध्या ऑफलाईन ऐतिहासिक डेटा.'
          )}
        </p>
      </div>
    </>
  );
}
