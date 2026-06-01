import React, { useState, useEffect, useRef } from 'react';
import AppLayout from './components/AppLayout';
import Dashboard from './components/Dashboard';
import WeatherMetrics from './components/WeatherMetrics';
import Crops from './components/Crops';
import Livestock from './components/Livestock';
import RateChart from './components/RateChart';
import News from './components/News';
import Onboarding from './components/Onboarding';
import AdminDashboard from './components/AdminDashboard';
import { maharashtraDistricts } from './data/mockData';
import { User, MapPin, Leaf, X, CheckCircle, Check } from 'lucide-react';
import { supabase } from './lib/supabase';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

// In App.jsx, we just define string keys for icons so they serialize cleanly, 
// or render them directly if we don't need them in localStorage
const cropOptions = [
  { id: 'Cotton',    nameEn: 'Cotton',    nameMr: 'कापूस',   img: '/crops/cotton.png' },
  { id: 'Soybean',   nameEn: 'Soybean',   nameMr: 'सोयाबीन', img: '/crops/soybean.png' },
  { id: 'Maize',     nameEn: 'Maize',     nameMr: 'मका',     img: '/crops/maize.png' },
  { id: 'Wheat',     nameEn: 'Wheat',     nameMr: 'गहू',     img: '/crops/wheat.png' },
  { id: 'Chickpeas', nameEn: 'Chickpeas', nameMr: 'हरभरा',  img: '/crops/chickpeas.png' },
  { id: 'Onion',     nameEn: 'Onion',     nameMr: 'कांदा',   img: '/crops/onion.png' },
  { id: 'Sugarcane', nameEn: 'Sugarcane', nameMr: 'ऊस',     img: '/crops/sugarcane.png' },
  { id: 'Turmeric',  nameEn: 'Turmeric',  nameMr: 'हळद',    img: '/crops/turmeric.png' },
];

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [language, setLanguage] = useState('en'); // 'en' or 'mr'
  const envApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  const [apiKey, setApiKey] = useState(envApiKey);
  const [simulatedMode, setSimulatedMode] = useState(!envApiKey);
  const [logs, setLogs] = useState([]);
  const [farmerProfile, setFarmerProfile] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  // Edit profile temp state
  const [editName, setEditName] = useState('');
  const [editDistrict, setEditDistrict] = useState('');
  const [editCrops, setEditCrops] = useState([]); // multi-select
  const [editSaved, setEditSaved] = useState(false);

  // Weather integration states (lifted up)
  const [selectedDistrictId, setSelectedDistrictId] = useState('Akola');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);

  // Initialize and check local storage & Supabase Auth session
  useEffect(() => {
    addLog('System Initialization Successful.', 'success');
    addLog('Agro Heal engine successfully initialized on Port 5174.', 'info');
    
    // Listen for Auth changes in Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        addLog(`[Auth] Active session verified for: ${session.user.email}`, 'success');
        
        // Try loading profile corresponding to this Supabase user ID
        const storedProfileKey = `farmerProfile_${session.user.id}`;
        const existingProfile = localStorage.getItem(storedProfileKey);
        
        if (existingProfile) {
          try {
            const parsed = JSON.parse(existingProfile);
            setFarmerProfile(parsed);
            localStorage.setItem('farmerProfile', JSON.stringify(parsed));
            if (parsed.language) setLanguage(parsed.language);
          } catch (e) {
            setFarmerProfile(null);
          }
        } else {
          // If no local record, check Supabase 'farmers' table
          try {
            const { data, error } = await supabase
              .from('farmers')
              .select('*')
              .eq('phone', session.user.id)
              .maybeSingle();
              
            if (data) {
              const profile = {
                id: data.id,
                name: data.name,
                phone: session.user.id,
                district: data.district,
                crop: data.crop,
                crops: [data.crop],
                language: data.language
              };
              localStorage.setItem(storedProfileKey, JSON.stringify(profile));
              localStorage.setItem('farmerProfile', JSON.stringify(profile));
              setFarmerProfile(profile);
            } else {
              // Redirect to profile setup
              setFarmerProfile(null);
            }
          } catch (err) {
            setFarmerProfile(null);
          }
        }
      } else {
        // Fallback for mock accounts / local storage
        const storedProfile = localStorage.getItem('farmerProfile');
        if (storedProfile) {
          try {
            const parsed = JSON.parse(storedProfile);
            setFarmerProfile(parsed);
            if (parsed.language) setLanguage(parsed.language);
          } catch (e) {
            localStorage.removeItem('farmerProfile');
            setFarmerProfile(null);
          }
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // System log append helper
  const addLog = (text, level = 'info') => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    setLogs(prev => [{ time: timeStr, text, level }, ...prev]);
  };

  // Interactive Tutorial
  const tourLaunched = useRef(false);
  const currentStepRef = useRef(-1);
  const activeDriverRef = useRef(null);

  useEffect(() => {
    // Sync ref when session is cleared
    if (!farmerProfile) {
      tourLaunched.current = false;
      currentStepRef.current = -1;
      activeDriverRef.current = null;
    }

    if (farmerProfile && !isEditingProfile && currentTab === 'dashboard') {
      const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
      if (!hasSeenTutorial && !tourLaunched.current) {
        tourLaunched.current = true; // Lock further re-triggers during this session
        const isDesktop = window.innerWidth > 768;
        
        // Dynamically align welcome steps with the language the farmer selected during onboarding
        const activeLang = farmerProfile.language || language;
        
        const d = driver({
          showProgress: true,
          animate: true,
          steps: [
            {
              element: '.user-profile',
              popover: {
                title: activeLang === 'en' ? 'Welcome to Agro Heal! 🌿' : 'Agro Heal मध्ये आपले स्वागत आहे! 🌿',
                description: activeLang === 'en' ? 'Let me show you around your new smart farming assistant.' : 'मी तुम्हाला तुमच्या नवीन स्मार्ट फार्मिंग असिस्टंटची ओळख करून देतो.',
                side: "bottom", align: 'start'
              }
            },
            {
              element: '.lang-switcher-pill',
              popover: {
                title: activeLang === 'en' ? 'Bilingual Support' : 'द्विभाषिक समर्थन',
                description: activeLang === 'en' ? 'Tap here to instantly switch between English and Marathi.' : 'इंग्रजी आणि मराठी दरम्यान त्वरित बदलण्यासाठी येथे टॅप करा.',
                side: "bottom", align: 'end'
              }
            },
            {
              element: isDesktop ? '.sidebar-nav' : '.mobile-bottom-nav',
              popover: {
                title: activeLang === 'en' ? 'Navigation Menu' : 'नेव्हिगेशन मेनू',
                description: activeLang === 'en' ? 'Use these tabs to check APMC Rates, Live Weather, and read the latest Farming News.' : 'APMC दर, थेट हवामान तपासण्यासाठी आणि ताज्या शेतीच्या बातम्या वाचण्यासाठी या टॅबचा वापर करा.',
                side: isDesktop ? "right" : "top"
              }
            },
            {
              element: isDesktop ? '.sidebar-scan-btn' : '.nav-fab-wrapper',
              popover: {
                title: activeLang === 'en' ? 'Smart AI Scanner 📸' : 'स्मार्ट AI स्कॅनर 📸',
                description: activeLang === 'en' ? 'This is the most powerful tool! Tap here to scan crops for diseases or consult the AI Livestock Vet.' : 'हे सर्वात शक्तिशाली साधन आहे! रोगांसाठी पिके स्कॅन करण्यासाठी किंवा AI पशूवैद्याचा सल्ला घेण्यासाठी येथे टॅप करा.',
                side: isDesktop ? "right" : "top"
              }
            }
          ],
          onHighlightStarted: (element, step, { activeIndex }) => {
            currentStepRef.current = activeIndex;
          },
          onDestroyed: () => {
            if (currentStepRef.current === 3) {
              localStorage.setItem('hasSeenTutorial', 'true');
              addLog('[Tour Engine] Interactive tutorial completed and saved.', 'success');
            }
            currentStepRef.current = -1;
            activeDriverRef.current = null;
          }
        });
        
        activeDriverRef.current = d;
        
        setTimeout(() => {
          try {
            addLog('[Tour Engine] Launching interactive tutorial...', 'info');
            d.drive();
          } catch (err) {
            addLog(`[Tour Engine Error] Failed to launch tour: ${err.message}`, 'error');
            console.error("Driver.js error:", err);
          }
        }, 1200); // 1.2s delay to ensure full layout rendering
      }
    }
  }, [farmerProfile, isEditingProfile, currentTab]);

  // Handle real-time dynamic tour translation mid-step on language toggle!
  useEffect(() => {
    if (farmerProfile && currentStepRef.current !== -1 && activeDriverRef.current) {
      const activeIndex = currentStepRef.current;
      activeDriverRef.current.destroy();

      const isDesktop = window.innerWidth > 768;

      const d = driver({
        showProgress: true,
        animate: true,
        steps: [
          {
            element: '.user-profile',
            popover: {
              title: language === 'en' ? 'Welcome to Agro Heal! 🌿' : 'Agro Heal मध्ये आपले स्वागत आहे! 🌿',
              description: language === 'en' ? 'Let me show you around your new smart farming assistant.' : 'मी तुम्हाला तुमच्या नवीन स्मार्ट फार्मिंग असिस्टंटची ओळख करून देतो.',
              side: "bottom", align: 'start'
            }
          },
          {
            element: '.lang-switcher-pill',
            popover: {
              title: language === 'en' ? 'Bilingual Support' : 'द्विभाषिक समर्थन',
              description: language === 'en' ? 'Tap here to instantly switch between English and Marathi.' : 'इंग्रजी आणि मराठी दरम्यान त्वरित बदलण्यासाठी येथे टॅप करा.',
              side: "bottom", align: 'end'
            }
          },
          {
            element: isDesktop ? '.sidebar-nav' : '.mobile-bottom-nav',
            popover: {
              title: language === 'en' ? 'Navigation Menu' : 'नेव्हिगेशन मेनू',
              description: language === 'en' ? 'Use these tabs to check APMC Rates, Live Weather, and read the latest Farming News.' : 'APMC दर, थेट हवामान तपासण्यासाठी आणि ताज्या शेतीच्या बातम्या वाचण्यासाठी या टॅबचा वापर करा.',
              side: isDesktop ? "right" : "top"
            }
          },
          {
            element: isDesktop ? '.sidebar-scan-btn' : '.nav-fab-wrapper',
            popover: {
              title: language === 'en' ? 'Smart AI Scanner 📸' : 'स्मार्ट AI स्कॅनर 📸',
              description: language === 'en' ? 'This is the most powerful tool! Tap here to scan crops for diseases or consult the AI Livestock Vet.' : 'हे सर्वात शक्तिशाली साधन आहे! रोगांसाठी पिके स्कॅन करण्यासाठी किंवा AI पशूवैद्याचा सल्ला घेण्यासाठी येथे टॅप करा.',
              side: isDesktop ? "right" : "top"
            }
          }
        ],
        onHighlightStarted: (element, step, { activeIndex }) => {
          currentStepRef.current = activeIndex;
        },
        onDestroyed: () => {
          if (currentStepRef.current === 3) {
            localStorage.setItem('hasSeenTutorial', 'true');
            addLog('[Tour Engine] Interactive tutorial completed and saved.', 'success');
          }
          currentStepRef.current = -1;
          activeDriverRef.current = null;
        }
      });

      activeDriverRef.current = d;

      setTimeout(() => {
        d.drive(activeIndex);
        addLog(`[Tour Engine] Dynamic tour translated instantly to: ${language.toUpperCase()}`, 'success');
      }, 100);
    }
  }, [language]);

  // Keep selectedDistrictId in sync with farmerProfile's district
  useEffect(() => {
    if (farmerProfile?.district) {
      setSelectedDistrictId(farmerProfile.district);
    }
  }, [farmerProfile?.district]);

  // Lifted Weather Fetch Effect
  useEffect(() => {
    if (!selectedDistrictId) return;
    
    const fetchWeatherAndForecast = async () => {
      setWeatherLoading(true);
      setWeatherError(null);
      
      const activeDistrict = maharashtraDistricts.find(d => d.id === selectedDistrictId) || maharashtraDistricts[0];
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
        setWeatherError(err.message);
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchWeatherAndForecast();
  }, [selectedDistrictId]);

  const clearLogs = () => {
    setLogs([]);
    addLog('Developer console logs cleared.', 'info');
  };

  // Complete onboarding wizard
  const handleOnboardingComplete = (profile) => {
    setFarmerProfile(profile);
    if (profile.language) {
      setLanguage(profile.language);
    }
    setCurrentTab('dashboard');
    addLog(`[Profile Engine] Onboarding completed for ${profile.name} (District: ${profile.district}, Crop: ${profile.crop}).`, 'success');
  };

  // Reset/Clear profile for demo testing
  const resetFarmerProfile = async () => {
    localStorage.removeItem('farmerProfile');
    localStorage.removeItem('hasSeenTutorial'); // Clear tutorial history so it triggers on next login!
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Supabase signout failed:", e);
    }
    setFarmerProfile(null);
    setCurrentTab('dashboard');
    addLog('[Profile Engine] Farmer profile has been reset. Returning to Onboarding...', 'warning');
  };

  // Open profile edit modal pre-filled with current values
  const openEditProfile = () => {
    if (!farmerProfile) return;
    setEditName(farmerProfile.name);
    setEditDistrict(farmerProfile.district);
    // Support both old single-crop and new multi-crop profiles
    setEditCrops(farmerProfile.crops || (farmerProfile.crop ? [farmerProfile.crop] : []));
    setEditSaved(false);
    setIsEditingProfile(true);
    addLog('[Profile Engine] Profile edit modal opened.', 'info');
  };

  // Save profile edits
  const handleSaveProfile = async () => {
    if (!editName.trim() || !editDistrict || editCrops.length === 0) return;
    const selectedDistObj = maharashtraDistricts.find(d => d.id === editDistrict);
    const primaryCrop = editCrops[0];
    const updated = {
      ...farmerProfile,
      name: editName.trim(),
      district: editDistrict,
      districtMr: selectedDistObj ? selectedDistObj.nameMr : editDistrict,
      region: selectedDistObj ? selectedDistObj.region : farmerProfile.region,
      regionMr: selectedDistObj ? selectedDistObj.regionMr : farmerProfile.regionMr,
      crop: primaryCrop,
      cropMr: cropOptions.find(c => c.id === primaryCrop)?.nameMr || primaryCrop,
      crops: editCrops,
      cropsData: editCrops.map(id => ({
        id,
        nameMr: cropOptions.find(c => c.id === id)?.nameMr || id
      }))
    };

    if (updated.id && updated.id !== 'local-only') {
      try {
        await supabase
          .from('farmers')
          .update({
            name: updated.name,
            district: updated.district,
            crop: updated.crop,
            language: updated.language
          })
          .eq('id', updated.id);
      } catch (err) {
        console.error("Supabase update error:", err);
      }
    }

    localStorage.setItem('farmerProfile', JSON.stringify(updated));
    setFarmerProfile(updated);
    setEditSaved(true);
    addLog(`[Profile Engine] Profile updated: ${updated.name}, ${updated.district}, ${updated.crops.join(', ')}`, 'success');
    setTimeout(() => setIsEditingProfile(false), 1200);
  };

  // Safe wrapper for rendering active tab screen inside phone content panel
  const renderScreen = () => {
    if (!farmerProfile) {
      return <Onboarding onComplete={handleOnboardingComplete} />;
    }

    switch (currentTab) {
      case 'dashboard':
        return (
          <Dashboard 
            setCurrentTab={setCurrentTab} 
            language={language} 
            farmerProfile={farmerProfile} 
            weatherData={weatherData} 
            weatherLoading={weatherLoading} 
          />
        );
      case 'weather':
        return (
          <WeatherMetrics 
            language={language} 
            addLog={addLog} 
            farmerProfile={farmerProfile} 
            selectedDistrictId={selectedDistrictId}
            setSelectedDistrictId={setSelectedDistrictId}
            weatherData={weatherData}
            forecastData={forecastData}
            weatherLoading={weatherLoading}
            weatherError={weatherError}
          />
        );
      case 'crops':
        return <Crops language={language} apiKey={apiKey} simulatedMode={simulatedMode} addLog={addLog} farmerProfile={farmerProfile} />;
      case 'livestock':
        return <Livestock language={language} apiKey={apiKey} simulatedMode={simulatedMode} addLog={addLog} farmerProfile={farmerProfile} />;
      case 'rates':
        return <RateChart language={language} addLog={addLog} farmerProfile={farmerProfile} />;
      case 'news':
        return <News language={language} apiKey={apiKey} addLog={addLog} farmerProfile={farmerProfile} />;
      case 'admin':
        return (
          <AdminDashboard 
            onClose={() => setCurrentTab('dashboard')} 
            apiKey={apiKey}
            setApiKey={setApiKey}
            simulatedMode={simulatedMode}
            setSimulatedMode={setSimulatedMode}
            logs={logs}
            clearLogs={clearLogs}
            resetFarmerProfile={resetFarmerProfile}
            farmerProfile={farmerProfile}
          />
        );
      default:
        return (
          <Dashboard 
            setCurrentTab={setCurrentTab} 
            language={language} 
            farmerProfile={farmerProfile} 
            weatherData={weatherData} 
            weatherLoading={weatherLoading} 
          />
        );
    }
  };

  return (
    <>
      <AppLayout
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          addLog(`[Nav Engine] User navigated to tab: ${tab.toUpperCase()}`, 'info');
        }}
        language={language}
        setLanguage={(lang) => {
          setLanguage(lang);
          if (farmerProfile) {
            const updated = { ...farmerProfile, language: lang };
            setFarmerProfile(updated);
            localStorage.setItem('farmerProfile', JSON.stringify(updated));
          }
          addLog(`[Localization Engine] Language switched to: ${lang === 'en' ? 'ENGLISH' : 'MARATHI (मराठी)'}`, 'success');
        }}
        farmerProfile={farmerProfile}
        onEditProfile={openEditProfile}
        onSecretUnlock={() => {
          setCurrentTab('admin');
          addLog('[Admin] Secret unlock triggered', 'warning');
        }}
      >
        {renderScreen()}
      </AppLayout>

      {/* Profile Edit Modal Overlay */}
        {isEditingProfile && (
          <div className="profile-edit-overlay">
            <div className="profile-edit-modal">
              <div className="profile-edit-header">
                <h3>{language === 'en' ? 'Edit Profile' : 'प्रोफाईल संपादित करा'}</h3>
                <button className="profile-edit-close" onClick={() => setIsEditingProfile(false)}>
                  <X size={16} />
                </button>
              </div>

              {editSaved ? (
                <div className="profile-edit-success">
                  <CheckCircle size={32} color="var(--color-success)" />
                  <p>{language === 'en' ? 'Profile Updated!' : 'प्रोफाईल अपडेट झाले!'}</p>
                </div>
              ) : (
                <div className="profile-edit-body">
                  <div className="profile-edit-field">
                    <label><User size={12} /><span>{language === 'en' ? 'Your Name' : 'तुमचे नाव'}</span></label>
                    <input
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      placeholder={language === 'en' ? 'Full name' : 'पूर्ण नाव'}
                    />
                  </div>

                  <div className="profile-edit-field">
                    <label><MapPin size={12} /><span>{language === 'en' ? 'District' : 'जिल्हा'}</span></label>
                    <select value={editDistrict} onChange={e => setEditDistrict(e.target.value)}>
                      <option value="">{language === 'en' ? '-- Select District --' : '-- जिल्हा निवडा --'}</option>
                      {maharashtraDistricts.map(d => (
                        <option key={d.id} value={d.id}>
                          {language === 'en' ? `${d.name} (${d.region})` : `${d.nameMr} (${d.regionMr})`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="profile-edit-field">
                    <label>
                      <Leaf size={12} />
                      <span>
                        {language === 'en' ? 'Your Crops' : 'तुमची पिके'}
                        {editCrops.length > 0 && (
                          <span style={{ marginLeft: '6px', background: 'var(--primary)', color: '#fff', borderRadius: '10px', padding: '1px 7px', fontSize: '10px', fontWeight: '800' }}>
                            {editCrops.length}
                          </span>
                        )}
                      </span>
                    </label>
                    <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      {language === 'en' ? 'First selected = primary crop' : 'पहिले निवडलेले = मुख्य पीक'}
                    </p>
                    <div className="crop-selection-grid">
                      {cropOptions.map(c => {
                        const isSelected = editCrops.includes(c.id);
                        return (
                          <button
                            key={c.id}
                            type="button"
                            className={`crop-option-card ${isSelected ? 'selected' : ''}`}
                            onClick={() => setEditCrops(prev =>
                              prev.includes(c.id) ? prev.filter(x => x !== c.id) : [...prev, c.id]
                            )}
                          >
                            {isSelected && (
                              <div className="crop-check-badge">
                                <Check size={9} strokeWidth={3} />
                              </div>
                            )}
                            <img src={c.img} alt={c.nameEn} className="crop-icon-img" />
                            <span className="crop-name">{language === 'en' ? c.nameEn : c.nameMr}</span>
                            {isSelected && editCrops[0] === c.id && (
                              <span className="primary-badge">{language === 'en' ? 'Main' : 'मुख्य'}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <button
                      className="profile-edit-save-btn"
                      onClick={handleSaveProfile}
                      disabled={!editName.trim() || !editDistrict || editCrops.length === 0}
                      style={{ flex: 1 }}
                    >
                      {language === 'en' ? 'Save Changes' : 'बदल जतन करा'}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(language === 'en' ? 'Are you sure you want to log out?' : 'तुम्हाला नक्की लॉग आउट करायचे आहे का?')) {
                          setIsEditingProfile(false);
                          resetFarmerProfile();
                        }
                      }}
                      style={{
                        padding: '12px',
                        background: 'transparent',
                        color: '#ff4757',
                        border: '1px solid #ff4757',
                        borderRadius: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {language === 'en' ? 'Log Out' : 'लॉग आउट'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
    </>
  );
}
