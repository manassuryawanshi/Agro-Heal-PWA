import React, { useState, useEffect } from 'react';
import { CloudSun, Thermometer, Droplets, Wind, AlertTriangle, Info, Calendar, Map, CloudRain, MapPin } from 'lucide-react';
import { maharashtraDistricts, regionalAdvisories } from '../data/mockData';

export default function WeatherMetrics({ language, addLog, farmerProfile }) {
  // Use farmer's profile district as initial state fallback to Akola
  const [selectedDistrictId, setSelectedDistrictId] = useState(farmerProfile?.district || 'Akola');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [activeParamTab, setActiveParamTab] = useState('temp'); // 'temp' | 'rain' | 'wind'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Find currently selected district details
  const activeDistrict = maharashtraDistricts.find(d => d.id === selectedDistrictId) || maharashtraDistricts[0];

  useEffect(() => {
    const fetchWeatherAndForecast = async () => {
      setLoading(true);
      setError(null);
      addLog(`[Weather API] Initiating live weather & 7-day forecast fetch for ${activeDistrict.name}...`, 'info');
      
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${activeDistrict.lat}&longitude=${activeDistrict.lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&hourly=soil_temperature_6cm,soil_moisture_3_to_9cm&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&timezone=auto`;
        
        const res = await fetch(url);
        if (!res.ok) throw new Error('API response error');
        
        const data = await res.json();
        
        // Grab current and soil values
        const current = data.current;
        const soilTemp = data.hourly?.soil_temperature_6cm?.[0] || (current.temperature_2m - 1.5);
        const soilMoist = data.hourly?.soil_moisture_3_to_9cm?.[0] || 0.28;

        setWeatherData({
          temp: Math.round(current.temperature_2m),
          humidity: Math.round(current.relative_humidity_2m),
          rain: current.precipitation,
          windSpeed: Math.round(current.wind_speed_10m),
          soilTemp: Math.round(soilTemp),
          soilMoisture: Math.round(soilMoist * 100) // Convert to percentage
        });

        // Parse daily forecast data
        const daily = data.daily;
        const formattedForecast = daily.time.map((timeStr, index) => ({
          date: timeStr,
          tempMax: Math.round(daily.temperature_2m_max[index]),
          tempMin: Math.round(daily.temperature_2m_min[index]),
          rainSum: daily.precipitation_sum[index],
          windMax: Math.round(daily.wind_speed_10m_max[index])
        }));

        setForecastData(formattedForecast);
        addLog(`[Weather API] Loaded current conditions & 7-day forecast successfully!`, 'success');
      } catch (err) {
        addLog(`[Weather API] Fetch failed. Reverting to high-fidelity simulated fallback.`, 'warning');
        // Simulated local fallback on network failure
        setWeatherData({
          temp: 36,
          humidity: 58,
          rain: 0,
          windSpeed: 9,
          soilTemp: 32,
          soilMoisture: 33
        });

        // 7-day realistic summer/monsoon projection for Maharashtra
        const today = new Date();
        const fallbackForecast = Array.from({ length: 7 }).map((_, idx) => {
          const nextDate = new Date(today);
          nextDate.setDate(today.getDate() + idx);
          const dateString = nextDate.toISOString().split('T')[0];
          
          return {
            date: dateString,
            tempMax: 35 + Math.floor(Math.sin(idx) * 3),
            tempMin: 25 + Math.floor(Math.cos(idx) * 2),
            rainSum: idx === 3 ? 12 : idx === 4 ? 6 : 0, // Mock rainfall on day 4 & 5
            windMax: 10 + Math.floor(Math.sin(idx) * 6)
          };
        });
        
        setForecastData(fallbackForecast);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherAndForecast();
  }, [selectedDistrictId]);

  // Date formatter helper supporting English and Marathi
  const formatDate = (dateStr, lang) => {
    const d = new Date(dateStr);
    if (lang === 'en') {
      return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    } else {
      const weekdaysMr = ['रवि', 'सोम', 'मंगळ', 'बुध', 'गुरु', 'शुक्र', 'शनी'];
      const monthsMr = ['जाने', 'फेब्रु', 'मार्च', 'एप्रिल', 'मे', 'जून', 'जुलै', 'ऑगस्ट', 'सप्टें', 'ऑक्टो', 'नोव्हें', 'डिसें'];
      return `${weekdaysMr[d.getDay()]}, ${d.getDate()} ${monthsMr[d.getMonth()]}`;
    }
  };

  // Get Pesticide Spray advice based on parameters
  const getSprayAdvisory = () => {
    if (!weatherData) return { status: 'loading', text: { en: 'Loading...', mr: 'लोड होत आहे...' } };
    if (weatherData.windSpeed > 15) {
      return {
        status: 'unsafe',
        text: { en: 'Unsafe: Winds too strong. Spray will drift away.', mr: 'धोकादायक: वारा खूप वेगवान आहे. औषध हवेत उडून वाया जाईल.' }
      };
    }
    if (weatherData.rain > 0.2) {
      return {
        status: 'unsafe',
        text: { en: 'Unsafe: Rain detected. Spray will wash off leaves.', mr: 'धोकादायक: पाऊस सुरू आहे. औषध पानांवरून धुऊन जाईल.' }
      };
    }
    if (weatherData.windSpeed > 10) {
      return {
        status: 'warning',
        text: { en: 'Caution: Moderate wind. Use drift-reduction nozzles.', mr: 'सावधानता: वारा मध्यम आहे. कमी दाबाच्या नोझलने काळजीपूर्वक फवारणी करा.' }
      };
    }
    return {
      status: 'safe',
      text: { en: 'Safe: Perfect wind speed and dry weather conditions.', mr: 'सुरक्षित फवारणी: वारा मंद असून औषध फवारणीसाठी हवामान आदर्श आहे.' }
    };
  };

  // Get Sowing suitability based on soil parameters
  const getSowingAdvisory = () => {
    if (!weatherData) return { status: 'loading', text: { en: 'Loading...', mr: 'लोड होत आहे...' } };
    if (weatherData.soilMoisture < 20) {
      return {
        status: 'unsafe',
        text: { en: 'Dry Soil: Moisture too low. Delay sowing to avoid seed desiccation.', mr: 'कोरडी जमीन: मातीचा ओलावा खूप कमी आहे. बियाणे सुकण्यापासून वाचवण्यासाठी पेरणी लांबणीवर टाका.' }
      };
    }
    if (weatherData.soilMoisture > 75) {
      return {
        status: 'warning',
        text: { en: 'Waterlogged: High moisture risk. Seeds might suffocate and rot.', mr: 'अति-दलदल: ओलावा खूप जास्त आहे. बियाणे सडण्याचा धोका असल्याने वाफसा याण्याची वाट पहा.' }
      };
    }
    return {
      status: 'safe',
      text: { en: 'Optimal Soil Moisture: High success rate. Seeds will germinate ideally.', mr: 'उत्तम ओलावा: जमीन पेरणीसाठी परिपूर्ण आहे. बियाणे अतिशय वेगाने आणि निरोगी उगवेल.' }
    };
  };

  // Custom advice tag for daily forecasts
  const getDailyAdvice = (day, param) => {
    if (param === 'temp') {
      if (day.tempMax > 38) {
        return {
          en: "⚠️ High heat stress! Increase irrigation frequency.",
          mr: "⚠️ तीव्र उष्णता! पिकाला पाणी देण्याची वारंवारता वाढवा."
        };
      }
      return {
        en: "✅ Favorable temp for crop transpiration.",
        mr: "✅ पिकांच्या वाढीसाठी तापमान पोषक आहे."
      };
    } else if (param === 'rain') {
      if (day.rainSum > 5) {
        return {
          en: "🌧️ Heavy rain forecast. Suspend pesticide spraying.",
          mr: "🌧️ जोरदार पावसाची शक्यता. औषध फवारणी पूर्णपणे थांबवा."
        };
      }
      return {
        en: "☀️ Dry weather. Safe for harvest & fertilizer spreads.",
        mr: "☀️ कोरडे हवामान. मळणी व खत व्यवस्थापनासाठी योग्य वेळ."
      };
    } else {
      if (day.windMax > 14) {
        return {
          en: "⚠️ High wind drift! Postpone herbicide spraying.",
          mr: "⚠️ जोरदार वारा! तणनाशक फवारणी आज पुढे ढकला."
        };
      }
      return {
        en: "✅ Mild winds. Ideal for drone or foliar spraying.",
        mr: "✅ मंद वारे. फवारणीसाठी हवामान अत्यंत सुरक्षित."
      };
    }
  };

  const sprayAdv = getSprayAdvisory();
  const sowingAdv = getSowingAdvisory();
  const regionalAdvice = regionalAdvisories[activeDistrict.region] || regionalAdvisories['Vidarbha'];

  // Coordinates centered embed radar map from Windy.com
  const windyEmbedUrl = `https://embed.windy.com/embed2.html?lat=${activeDistrict.lat}&lon=${activeDistrict.lon}&zoom=6&level=surface&overlay=rain&product=radar&menu=&message=true&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=`;

  return (
    <>
      {/* Screen Title */}
      <div className="screen-header" style={{ marginBottom: '16px' }}>
        <h2>{language === 'en' ? 'Weather Hub & Radar' : 'हवामान आणि रडार केंद्र'}</h2>
        <p style={{ color: 'var(--t3)', fontSize: '13px' }}>
          {language === 'en' ? 'Live regional climate and smart agronomy forecasting' : 'थेट हवामान अंदाज, रडार नकाशा आणि शास्त्रीय शेती सल्ला'}
        </p>
      </div>

      {/* Maharashtra District Selector */}
      <div className="district-selector-container" style={{
        position: 'relative',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        background: '#fff',
        borderRadius: 'var(--r-md)',
        border: '1px solid var(--sep-sm)',
        padding: '2px 14px',
        boxShadow: 'var(--s0)',
        transition: 'all 0.2s ease',
      }}>
        <MapPin size={16} color="var(--brand)" style={{ marginRight: '8px', flexShrink: 0 }} />
        <select 
          className="district-selector" 
          value={selectedDistrictId}
          onChange={(e) => setSelectedDistrictId(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 24px 12px 0',
            border: 'none',
            backgroundColor: 'transparent',
            fontWeight: '700',
            color: 'var(--text-dark)',
            fontSize: '14px',
            outline: 'none',
            cursor: 'pointer',
            appearance: 'none',
            WebkitAppearance: 'none'
          }}
        >
          {maharashtraDistricts.map(d => (
            <option key={d.id} value={d.id}>
              {language === 'en' ? `${d.name} (${d.region})` : `${d.nameMr} (${d.regionMr})`}
            </option>
          ))}
        </select>
        <div style={{
          position: 'absolute',
          right: '16px',
          pointerEvents: 'none',
          color: 'var(--t3)',
          fontWeight: 'bold',
          fontSize: '10px'
        }}>▼</div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
          {/* Hero Skeleton */}
          <div className="skeleton" style={{ height: '180px', width: '100%', borderRadius: 'var(--r-xl)' }}></div>
          {/* Metrics Skeleton */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px' }}>
            <div className="skeleton" style={{ height: '75px', width: '100%', borderRadius: 'var(--r-lg)' }}></div>
            <div className="skeleton" style={{ height: '75px', width: '100%', borderRadius: 'var(--r-lg)' }}></div>
            <div className="skeleton" style={{ height: '75px', width: '100%', borderRadius: 'var(--r-lg)' }}></div>
            <div className="skeleton" style={{ height: '75px', width: '100%', borderRadius: 'var(--r-lg)' }}></div>
          </div>
          {/* Advisories Skeleton */}
          <div className="skeleton" style={{ height: '90px', width: '100%', borderRadius: 'var(--r-lg)' }}></div>
          <div className="skeleton" style={{ height: '90px', width: '100%', borderRadius: 'var(--r-lg)' }}></div>
        </div>
      ) : (
        <>
          {/* Main Weather Card */}
          <div className="weather-hero">
            <div className="weather-hero-left">
              <h1 className="weather-hero-temp">{weatherData ? `${weatherData.temp}°C` : '--°C'}</h1>
              <p className="weather-hero-status">
                {language === 'en' 
                  ? (weatherData && weatherData.rain > 0 ? 'Rainy Showers' : 'Mostly Sunny')
                  : (weatherData && weatherData.rain > 0 ? 'पावसाळी सरी' : 'मुख्यतः स्वच्छ ऊन')}
              </p>
              <p className="weather-hero-loc">
                <MapPin size={10} style={{ marginRight: 3, display: 'inline', verticalAlign: 'middle' }} />
                {language === 'en' ? `${activeDistrict.name}, ${activeDistrict.region} Region` : `${activeDistrict.nameMr}, ${activeDistrict.regionMr} विभाग`}
              </p>
            </div>
            <div className="weather-hero-icon" style={{ animation: 'pulse 3s infinite ease-in-out' }}>
              {weatherData && weatherData.rain > 0 ? (
                <CloudRain size={56} color="#fff" strokeWidth={1.5} />
              ) : (
                <CloudSun size={56} color="#fff" strokeWidth={1.5} />
              )}
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="weather-metrics-grid">
            {/* Soil Temp Card */}
            <div className="weather-metric-card" style={{
              background: 'linear-gradient(135deg, #fff, #fff5eb)',
              borderColor: 'rgba(255, 159, 67, 0.15)'
            }}>
              <div className="weather-metric-label" style={{ color: '#d97706' }}>
                <Thermometer size={13} style={{ strokeWidth: 2 }} />
                <span>{language === 'en' ? 'Soil Temp' : 'माती तापमान'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '4px' }}>
                <span className="weather-metric-value">{weatherData ? weatherData.soilTemp : '--'}</span>
                <span className="weather-metric-unit" style={{ color: '#d97706' }}>°C</span>
              </div>
            </div>

            {/* Soil Moisture Card */}
            <div className="weather-metric-card" style={{
              background: 'linear-gradient(135deg, #fff, #f0f8ff)',
              borderColor: 'rgba(41, 128, 185, 0.15)'
            }}>
              <div className="weather-metric-label" style={{ color: '#1d4ed8' }}>
                <Droplets size={13} style={{ strokeWidth: 2 }} />
                <span>{language === 'en' ? 'Soil Moisture' : 'माती ओलावा'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '4px' }}>
                <span className="weather-metric-value">{weatherData ? weatherData.soilMoisture : '--'}</span>
                <span className="weather-metric-unit" style={{ color: '#1d4ed8' }}>%</span>
              </div>
            </div>

            {/* Wind Speed Card */}
            <div className="weather-metric-card" style={{
              background: 'linear-gradient(135deg, #fff, #f4fbf7)',
              borderColor: 'rgba(27, 94, 55, 0.15)'
            }}>
              <div className="weather-metric-label" style={{ color: 'var(--brand)' }}>
                <Wind size={13} style={{ strokeWidth: 2 }} />
                <span>{language === 'en' ? 'Wind Speed' : 'हवेचा वेग'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '4px' }}>
                <span className="weather-metric-value">{weatherData ? weatherData.windSpeed : '--'}</span>
                <span className="weather-metric-unit" style={{ color: 'var(--brand)' }}>km/h</span>
              </div>
            </div>

            {/* Air Humidity Card */}
            <div className="weather-metric-card" style={{
              background: 'linear-gradient(135deg, #fff, #faf5ff)',
              borderColor: 'rgba(142, 68, 173, 0.15)'
            }}>
              <div className="weather-metric-label" style={{ color: '#6b21a8' }}>
                <Droplets size={13} style={{ strokeWidth: 2 }} />
                <span>{language === 'en' ? 'Air Humidity' : 'हवेतील दमटपणा'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '4px' }}>
                <span className="weather-metric-value">{weatherData ? weatherData.humidity : '--'}</span>
                <span className="weather-metric-unit" style={{ color: '#6b21a8' }}>%</span>
              </div>
            </div>
          </div>

          {/* Sowing & Spraying Advisories Panel */}
          <div className="advisory-list" style={{ marginBottom: '20px' }}>
            {/* Spray Indicator */}
            <div className="advisory-item" style={{
              borderColor: sprayAdv.status === 'safe' ? 'rgba(52, 199, 89, 0.15)' : sprayAdv.status === 'warning' ? 'rgba(255, 149, 0, 0.15)' : 'rgba(255, 59, 48, 0.15)'
            }}>
              <div className="advisory-item-icon" style={{
                background: sprayAdv.status === 'safe' ? 'var(--color-success-bg)' : sprayAdv.status === 'warning' ? 'var(--color-warning-bg)' : 'var(--color-danger-bg)',
                color: sprayAdv.status === 'safe' ? 'var(--color-success)' : sprayAdv.status === 'warning' ? 'var(--color-warning)' : 'var(--color-danger)'
              }}>
                <Wind size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{language === 'en' ? 'Pesticide Spray Advisory' : 'फवारणी सुरक्षा सल्ला'}</span>
                  <span className={`advisory-status-badge`} style={{
                    fontSize: '9px',
                    fontWeight: '800',
                    padding: '2px 8px',
                    borderRadius: 'var(--r-pill)',
                    background: sprayAdv.status === 'safe' ? 'var(--color-success-bg)' : sprayAdv.status === 'warning' ? 'var(--color-warning-bg)' : 'var(--color-danger-bg)',
                    color: sprayAdv.status === 'safe' ? 'var(--color-success)' : sprayAdv.status === 'warning' ? 'var(--color-warning)' : 'var(--color-danger)'
                  }}>
                    {sprayAdv.status === 'safe' ? (language === 'en' ? 'SAFE' : 'सुरक्षित') : 
                     sprayAdv.status === 'warning' ? (language === 'en' ? 'CAUTION' : 'सावधान') :
                     (language === 'en' ? 'UNSAFE' : 'धोकादायक')}
                  </span>
                </h4>
                <p style={{ marginTop: '4px' }}>{language === 'en' ? sprayAdv.text.en : sprayAdv.text.mr}</p>
              </div>
            </div>

            {/* Sowing Indicator */}
            <div className="advisory-item" style={{
              borderColor: sowingAdv.status === 'safe' ? 'rgba(52, 199, 89, 0.15)' : sowingAdv.status === 'warning' ? 'rgba(255, 149, 0, 0.15)' : 'rgba(255, 59, 48, 0.15)'
            }}>
              <div className="advisory-item-icon" style={{
                background: sowingAdv.status === 'safe' ? 'var(--color-success-bg)' : sowingAdv.status === 'warning' ? 'var(--color-warning-bg)' : 'var(--color-danger-bg)',
                color: sowingAdv.status === 'safe' ? 'var(--color-success)' : sowingAdv.status === 'warning' ? 'var(--color-warning)' : 'var(--color-danger)'
              }}>
                <Thermometer size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{language === 'en' ? 'Crop Sowing Window' : 'पेरणी ओलावा सल्ला'}</span>
                  <span className={`advisory-status-badge`} style={{
                    fontSize: '9px',
                    fontWeight: '800',
                    padding: '2px 8px',
                    borderRadius: 'var(--r-pill)',
                    background: sowingAdv.status === 'safe' ? 'var(--color-success-bg)' : sowingAdv.status === 'warning' ? 'var(--color-warning-bg)' : 'var(--color-danger-bg)',
                    color: sowingAdv.status === 'safe' ? 'var(--color-success)' : sowingAdv.status === 'warning' ? 'var(--color-warning)' : 'var(--color-danger)'
                  }}>
                    {sowingAdv.status === 'safe' ? (language === 'en' ? 'IDEAL' : 'योग्य वेळ') : 
                     sowingAdv.status === 'warning' ? (language === 'en' ? 'CAUTION' : 'सावधान') :
                     (language === 'en' ? 'DELAY' : 'पेरणी थांबवा')}
                  </span>
                </h4>
                <p style={{ marginTop: '4px' }}>{language === 'en' ? sowingAdv.text.en : sowingAdv.text.mr}</p>
              </div>
            </div>
          </div>

          {/* Radar Viewport */}
          <div className="radar-viewport-container" style={{
            background: '#fff',
            border: '1px solid var(--sep-sm)',
            borderRadius: 'var(--r-lg)',
            padding: '16px',
            boxShadow: 'var(--s1)',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Map size={16} color="var(--brand)" />
              <h5 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                {language === 'en' ? 'Live Doppler Rain Radar (Maharashtra)' : 'थेट मान्सून उपग्रह आणि पाऊस रडार'}
              </h5>
            </div>
            <div className="radar-iframe-wrapper" style={{ position: 'relative', width: '100%', height: '180px', borderRadius: 'var(--r-md)', overflow: 'hidden', backgroundColor: '#e2e8f0', boxShadow: 'var(--inset)' }}>
              <iframe
                title="Windy Weather Radar"
                src={windyEmbedUrl}
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 'none' }}
              />
            </div>
            <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'center', fontStyle: 'italic' }}>
              ℹ️ {language === 'en' ? 'Interactive radar map. Zoom and drag to track clouds.' : 'परस्परसंवादी रडार नकाशा. ढगांचा मागोवा घेण्यासाठी झूम करा.'}
            </p>
          </div>

          {/* 7-Day Climate Projection Dashboard */}
          <div className="forecast-dashboard" style={{
            background: '#fff',
            border: '1px solid var(--sep-sm)',
            borderRadius: 'var(--r-lg)',
            padding: '16px',
            boxShadow: 'var(--s1)',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Calendar size={16} color="var(--brand)" />
              <h5 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-dark)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                {language === 'en' ? '7-Day Agronomy Forecast Projection' : '७-दिवसीय हवामान व शेती अंदाज'}
              </h5>
            </div>

            {/* Clickable parameter sub-tabs */}
            <div className="forecast-tab-row">
              <button 
                className={`forecast-tab ${activeParamTab === 'temp' ? 'active' : ''}`}
                onClick={() => setActiveParamTab('temp')}
              >
                🌡️ {language === 'en' ? 'Temp' : 'तापमान'}
              </button>
              <button 
                className={`forecast-tab ${activeParamTab === 'rain' ? 'active' : ''}`}
                onClick={() => setActiveParamTab('rain')}
              >
                🌧️ {language === 'en' ? 'Rain' : 'पाऊस'}
              </button>
              <button 
                className={`forecast-tab ${activeParamTab === 'wind' ? 'active' : ''}`}
                onClick={() => setActiveParamTab('wind')}
              >
                💨 {language === 'en' ? 'Wind' : 'वारा'}
              </button>
            </div>

            {/* Daily projections scrollable container */}
            <div className="forecast-scroll-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {forecastData.map((day, idx) => {
                const adv = getDailyAdvice(day, activeParamTab);
                const isAlarm = adv.en.includes('⚠️');

                return (
                  <div key={day.date} className="forecast-day" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '10px 12px',
                    background: isAlarm ? 'rgba(255, 149, 0, 0.04)' : '#fcfdfa',
                    border: '1px solid',
                    borderColor: isAlarm ? 'rgba(255, 149, 0, 0.15)' : '#f0f2ec',
                    borderRadius: 'var(--r-md)',
                    gap: '4px',
                    transition: 'all 0.15s ease'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--t1)' }}>
                        {formatDate(day.date, language)} {idx === 0 && `(${language === 'en' ? 'Today' : 'आज'})`}
                      </span>
                      
                      {/* Metric Values based on active tab */}
                      <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--brand)' }}>
                        {activeParamTab === 'temp' && `${day.tempMax}°C / ${day.tempMin}°C`}
                        {activeParamTab === 'rain' && `${day.rainSum} mm`}
                        {activeParamTab === 'wind' && `${day.windMax} km/h`}
                      </span>
                    </div>

                    {/* Agronomy Safety Flag text */}
                    <div style={{
                      fontSize: '11px',
                      color: isAlarm ? '#9a3412' : '#4a5d4e',
                      fontWeight: isAlarm ? '600' : '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 8px',
                      background: isAlarm ? 'rgba(255, 149, 0, 0.08)' : 'rgba(61, 170, 107, 0.06)',
                      borderRadius: 'var(--r-xs)'
                    }}>
                      {language === 'en' ? adv.en : adv.mr}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Regional Government Agronomy Warning Card */}
          <div className="regional-advisory-box" style={{
            background: 'linear-gradient(135deg, #fffcf5, #fff8eb)',
            border: '1px solid rgba(255, 149, 0, 0.25)',
            borderRadius: 'var(--r-lg)',
            padding: '16px',
            boxShadow: 'var(--s1)',
            marginBottom: '20px'
          }}>
            <h5 style={{
              fontSize: '13px',
              fontWeight: '800',
              color: '#9a3412',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '8px'
            }}>
              <AlertTriangle size={15} style={{ color: '#ff9500' }} />
              {language === 'en' ? `${activeDistrict.region} Regional Advisory` : `${activeDistrict.regionMr} विभागीय शेती सल्ला`}
            </h5>
            <p style={{ fontWeight: '700', color: 'var(--brand)', marginBottom: '6px', fontSize: '12px' }}>
              {language === 'en' ? `Recommended for: ${regionalAdvice.crop.en}` : `शिफारस पिके: ${regionalAdvice.crop.mr}`}
            </p>
            <p style={{ fontSize: '12px', lineHeight: '1.5', color: 'var(--t2)' }}>
              {language === 'en' ? regionalAdvice.advice.en : regionalAdvice.advice.mr}
            </p>
          </div>
        </>
      )}
    </>
  );
}
