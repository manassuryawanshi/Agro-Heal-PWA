import React, { useState, useEffect } from 'react';
import { User, MapPin, Leaf, Languages, Sparkles, Check, Loader2, Phone, KeyRound, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { maharashtraDistricts } from '../data/mockData';
import { supabase } from '../lib/supabase';

// Local storage helpers for simulated database
const getLocalAccounts = () => {
  try {
    return JSON.parse(localStorage.getItem('agroheal_accounts') || '{}');
  } catch (e) {
    return {};
  }
};

const saveLocalAccounts = (accounts) => {
  localStorage.setItem('agroheal_accounts', JSON.stringify(accounts));
};

export default function Onboarding({ onComplete }) {
  const [lang, setLang] = useState('en');
  const [step, setStep] = useState('auth'); // 'auth' | 'profile'
  const [authTab, setAuthTab] = useState('login'); // 'login' | 'signup'

  // Credentials State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Profile State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('');
  const [crops, setCrops] = useState([]); // multi-select array
  const [activeUser, setActiveUser] = useState(''); // Current logged-in username

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Auto-detect active Supabase session on mount (crucial for OAuth redirect success)
  useEffect(() => {
    const checkActiveSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setActiveUser(session.user.id);
          const storedProfileKey = `farmerProfile_${session.user.id}`;
          const existingProfile = localStorage.getItem(storedProfileKey);
          
          if (!existingProfile) {
            setStep('profile');
          }
        }
      } catch (err) {
        console.warn("Failed to retrieve OAuth session on mount:", err);
      }
    };
    checkActiveSession();
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError(lang === 'en' ? 'Please fill in all fields.' : 'कृपया सर्व फील्ड भरा.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      const accounts = getLocalAccounts();
      const storedPassword = accounts[username.toLowerCase().trim()];

      if (storedPassword && storedPassword === password) {
        setActiveUser(username.toLowerCase().trim());
        
        // Check if there is an existing profile for this user
        const storedProfileKey = `farmerProfile_${username.toLowerCase().trim()}`;
        const existingProfile = localStorage.getItem(storedProfileKey);

        if (existingProfile) {
          const parsed = JSON.parse(existingProfile);
          localStorage.setItem('farmerProfile', JSON.stringify(parsed));
          onComplete(parsed);
        } else {
          // If no profile setup is complete, prompt for setup
          setStep('profile');
        }
      } else {
        setError(lang === 'en' ? 'Invalid username or password.' : 'चुकीचे युझरनाव किंवा पासवर्ड.');
      }
    } catch (err) {
      console.error(err);
      setError(lang === 'en' ? 'Login failed. Please try again.' : 'लॉगिन अयशस्वी. पुन्हा प्रयत्न करा.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password || !confirmPassword) {
      setError(lang === 'en' ? 'Please fill in all fields.' : 'कृपया सर्व फील्ड भरा.');
      return;
    }
    if (password !== confirmPassword) {
      setError(lang === 'en' ? 'Passwords do not match.' : 'पासवर्ड जुळत नाहीत.');
      return;
    }
    if (password.length < 6) {
      setError(lang === 'en' ? 'Password must be at least 6 characters.' : 'पासवर्ड किमान ६ अक्षरी असावा.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const accounts = getLocalAccounts();
      const userKey = username.toLowerCase().trim();

      if (accounts[userKey]) {
        setError(lang === 'en' ? 'Username already exists.' : 'हे युझरनाव आधीपासूनच अस्तित्त्वात आहे.');
        return;
      }

      // Save credentials
      accounts[userKey] = password;
      saveLocalAccounts(accounts);
      setActiveUser(userKey);

      // Advance to profile setup
      setStep('profile');
    } catch (err) {
      console.error(err);
      setError(lang === 'en' ? 'Signup failed. Please try again.' : 'नोंदणी अयशस्वी. पुन्हा प्रयत्न करा.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialAuth = async (platform) => {
    setError('');
    setIsSubmitting(true);

    try {
      if (platform.toLowerCase() === 'apple') {
        // PREMIUM STUDENT SIMULATION: Bypasses the $99 fee for demo purposes
        await new Promise(resolve => setTimeout(resolve, 1200)); // Premium visual loader
        
        const simulatedUsername = 'sso_apple_user';
        const storedProfileKey = `farmerProfile_${simulatedUsername}`;
        const existingProfile = localStorage.getItem(storedProfileKey);

        if (existingProfile) {
          const parsed = JSON.parse(existingProfile);
          localStorage.setItem('farmerProfile', JSON.stringify(parsed));
          onComplete(parsed);
        } else {
          const ssoProfile = {
            name: 'Apple Farmer',
            phone: '9876543210',
            district: 'Nagpur',
            districtMr: 'नागपूर',
            region: 'Vidarbha',
            regionMr: 'विदर्भ',
            crop: 'Soybean',
            cropMr: 'सोयाबीन',
            crops: ['Soybean', 'Cotton'],
            cropsData: [
              { id: 'Soybean', nameMr: 'सोयाबीन', emoji: '🌾' },
              { id: 'Cotton', nameMr: 'कापूस', emoji: '🌾' }
            ],
            language: lang,
            id: 'sso-local-only'
          };
          
          localStorage.setItem(storedProfileKey, JSON.stringify(ssoProfile));
          localStorage.setItem('farmerProfile', JSON.stringify(ssoProfile));
          onComplete(ssoProfile);
        }
      } else {
        // REAL GOOGLE AUTHENTICATION
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin
          }
        });
        if (error) throw error;
      }
    } catch (err) {
      console.error(err);
      setError(lang === 'en' ? `Failed to log in with ${platform}.` : `${platform} द्वारे लॉगिन अयशस्वी.`);
      setIsSubmitting(false);
    }
  };

  const toggleCrop = (id) => {
    setError('');
    setCrops(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(lang === 'en' ? 'Please enter your name.' : 'कृपया आपले नाव टाका.');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setError(lang === 'en' ? 'Please enter a valid 10-digit mobile number.' : 'कृपया वैध १० अंकी मोबाईल नंबर टाका.');
      return;
    }
    if (!district) {
      setError(lang === 'en' ? 'Please select your district.' : 'कृपया आपला जिल्हा निवडा.');
      return;
    }
    if (crops.length === 0) {
      setError(lang === 'en' ? 'Please select at least one crop.' : 'कृपया किमान एक पीक निवडा.');
      return;
    }

    setIsSubmitting(true);
    const selectedDistObj = maharashtraDistricts.find(d => d.id === district);
    const primaryCrop = crops[0];

    const profile = {
      name: name.trim(),
      phone: phone.trim(),
      district,
      districtMr: selectedDistObj ? selectedDistObj.nameMr : district,
      region: selectedDistObj ? selectedDistObj.region : '',
      regionMr: selectedDistObj ? selectedDistObj.regionMr : '',
      crop: primaryCrop,
      cropMr: cropOptions.find(c => c.id === primaryCrop)?.nameMr || primaryCrop,
      crops: crops,
      cropsData: crops.map(id => ({
        id,
        nameMr: cropOptions.find(c => c.id === id)?.nameMr || id,
        emoji: cropOptions.find(c => c.id === id)?.emoji || '🌾'
      })),
      language: lang
    };

    try {
      const { data, error } = await supabase
        .from('farmers')
        .insert([
          {
            name: profile.name,
            phone: profile.phone,
            district: profile.district,
            crop: profile.crop,
            language: profile.language,
          }
        ])
        .select();

      if (error) throw error;
      profile.id = data[0].id;
    } catch (err) {
      console.error("Supabase insert error:", err);
      profile.id = 'local-only';
    } finally {
      setIsSubmitting(false);
    }

    const storedProfileKey = activeUser ? `farmerProfile_${activeUser}` : 'farmerProfile';
    localStorage.setItem(storedProfileKey, JSON.stringify(profile));
    localStorage.setItem('farmerProfile', JSON.stringify(profile));
    onComplete(profile);
  };

  return (
    <div className="onboarding-overlay animate-in">
      <div className="onboarding-card">
        {/* Language Selection Bar */}
        <div className="onboarding-lang-bar">
          <Languages size={16} color="var(--brand)" />
          <div className="lang-switcher">
            <button type="button" className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>English</button>
            <button type="button" className={lang === 'mr' ? 'active' : ''} onClick={() => setLang('mr')}>मराठी</button>
          </div>
        </div>

        {/* Branding */}
        <div className="onboarding-header">
          <div className="logo-badge">
            <Leaf size={28} className="logo-leaf" />
          </div>
          <h2>{lang === 'en' ? 'Agro Heal' : 'ॲग्रो हील'}</h2>
          <p className="subtitle">
            {lang === 'en' ? 'Personalized Smart Farming Assistant' : 'आपली वैयक्तिक प्रगत शेती सल्लागार प्रणाली'}
          </p>
        </div>

        {/* STEP 1: AUTH SCREEN */}
        {step === 'auth' && (
          <div>
            {/* Login / Signup Tabs */}
            <div className="auth-tabs">
              <button
                type="button"
                className={`auth-tab-btn ${authTab === 'login' ? 'active' : ''}`}
                onClick={() => { setAuthTab('login'); setError(''); }}
              >
                {lang === 'en' ? 'Log In' : 'लॉगिन करा'}
              </button>
              <button
                type="button"
                className={`auth-tab-btn ${authTab === 'signup' ? 'active' : ''}`}
                onClick={() => { setAuthTab('signup'); setError(''); }}
              >
                {lang === 'en' ? 'Sign Up' : 'नोंदणी करा'}
              </button>
            </div>

            {authTab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="onboarding-form animate-in">
                <div className="input-group">
                  <label>
                    <User size={14} />
                    <span>{lang === 'en' ? 'Username or Email' : 'युझरनाव किंवा ईमेल'}</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'en' ? 'Enter username or email' : 'युझरनाव किंवा ईमेल टाका'}
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setError(''); }}
                  />
                </div>

                <div className="input-group">
                  <label>
                    <Lock size={14} />
                    <span>{lang === 'en' ? 'Password' : 'पासवर्ड'}</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder={lang === 'en' ? 'Enter password' : 'पासवर्ड टाका'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(''); }}
                      style={{ paddingRight: '40px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--t3)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && <div className="onboarding-error">{error}</div>}

                <button type="submit" className="onboarding-submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 size={16} className="spinner" /> : <Sparkles size={16} />}
                  <span>{isSubmitting ? (lang === 'en' ? 'Logging in...' : 'लॉगिन करत आहे...') : (lang === 'en' ? 'Log In' : 'लॉगिन करा')}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit} className="onboarding-form animate-in">
                <div className="input-group">
                  <label>
                    <User size={14} />
                    <span>{lang === 'en' ? 'Username or Email' : 'युझरनाव किंवा ईमेल'}</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'en' ? 'Choose username or email' : 'युझरनाव किंवा ईमेल निवडा'}
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setError(''); }}
                  />
                </div>

                <div className="input-group">
                  <label>
                    <Lock size={14} />
                    <span>{lang === 'en' ? 'Choose Password' : 'पासवर्ड निवडा'}</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder={lang === 'en' ? 'Minimum 6 characters' : 'किमान ६ अक्षरे'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(''); }}
                      style={{ paddingRight: '40px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--t3)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="input-group">
                  <label>
                    <Lock size={14} />
                    <span>{lang === 'en' ? 'Confirm Password' : 'पासवर्डची पुष्टी करा'}</span>
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder={lang === 'en' ? 'Confirm password' : 'पासवर्ड पुन्हा टाका'}
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                  />
                </div>

                {error && <div className="onboarding-error">{error}</div>}

                <button type="submit" className="onboarding-submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 size={16} className="spinner" /> : <Check size={16} />}
                  <span>{isSubmitting ? (lang === 'en' ? 'Creating...' : 'तयार करत आहे...') : (lang === 'en' ? 'Create Account' : 'खाते तयार करा')}</span>
                </button>
              </form>
            )}

            {/* Social Authentication */}
            <div className="social-auth-divider">
              {lang === 'en' ? 'OR CONTINUE WITH' : 'किंवा याद्वारे सुरू ठेवा'}
            </div>

            <div className="social-auth-container">
              <button
                type="button"
                className="social-btn google"
                disabled={isSubmitting}
                onClick={() => handleSocialAuth('Google')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: '4px' }}>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{lang === 'en' ? 'Sign in with Google' : 'Google द्वारे लॉगिन करा'}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PROFILE SETUP (New Users Only) */}
        {step === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="onboarding-form animate-in">
            <div className="input-group">
              <label>
                <User size={14} />
                <span>{lang === 'en' ? 'What is your Name?' : 'आपले नाव काय आहे?'}</span>
              </label>
              <input
                type="text"
                placeholder={lang === 'en' ? 'Enter full name (e.g. Sachin Patil)' : 'पूर्ण नाव टाका (उदा. सचिन पाटील)'}
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); }}
              />
            </div>

            <div className="input-group">
              <label>
                <Phone size={14} />
                <span>{lang === 'en' ? 'Mobile Number' : 'मोबाईल नंबर'}</span>
              </label>
              <input
                type="tel"
                maxLength="10"
                placeholder={lang === 'en' ? 'Enter 10-digit mobile number' : '१० अंकी मोबाईल नंबर टाका'}
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setError(''); }}
              />
            </div>

            <div className="input-group">
              <label>
                <MapPin size={14} />
                <span>{lang === 'en' ? 'Select your Maharashtra District' : 'महाराष्ट्र राज्यातील आपला जिल्हा निवडा'}</span>
              </label>
              <select value={district} onChange={(e) => { setDistrict(e.target.value); setError(''); }}>
                <option value="">{lang === 'en' ? '-- Select District --' : '-- जिल्हा निवडा --'}</option>
                {maharashtraDistricts.map((dist) => (
                  <option key={dist.id} value={dist.id}>
                    {lang === 'en' ? `${dist.name} (${dist.region})` : `${dist.nameMr} (${dist.regionMr})`}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label>
                <Leaf size={14} />
                <span>
                  {lang === 'en' ? 'Select your Crops' : 'आपले पिके निवडा'}
                  {crops.length > 0 && (
                    <span style={{ marginLeft: '6px', background: 'var(--brand)', color: '#fff', borderRadius: '10px', padding: '1px 7px', fontSize: '10px', fontWeight: '800' }}>
                      {crops.length}
                    </span>
                  )}
                </span>
              </label>
              <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '-2px', marginBottom: '4px' }}>
                {lang === 'en' ? 'Select all that apply — first selected is your primary crop' : 'सर्व लागू पिके निवडा — पहिले निवडलेले मुख्य पीक असेल'}
              </p>
              <div className="crop-selection-grid">
                {cropOptions.map((item) => {
                  const isSelected = crops.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`crop-option-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleCrop(item.id)}
                    >
                      {isSelected && (
                        <div className="crop-check-badge">
                          <Check size={9} strokeWidth={3} />
                        </div>
                      )}
                      <img src={item.img} alt={item.nameEn} className="crop-icon-img" />
                      <span className="crop-name">
                        {lang === 'en' ? item.nameEn : item.nameMr}
                      </span>
                      {isSelected && crops[0] === item.id && (
                        <span className="primary-badge">{lang === 'en' ? 'Main' : 'मुख्य'}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {error && <div className="onboarding-error">{error}</div>}

            <button type="submit" className="onboarding-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 size={16} className="spinner" /> : <Sparkles size={16} />}
              <span>
                {isSubmitting 
                  ? (lang === 'en' ? 'Saving...' : 'जतन करत आहे...') 
                  : (lang === 'en' ? 'Create Account' : 'खाते तयार करा')}
              </span>
            </button>
          </form>
        )}

        <p className="footer-tag">
          {lang === 'en'
            ? 'Designed for Progressive Agriculture in Maharashtra'
            : 'महाराष्ट्रातील प्रगतीशील शेती व समृद्धीसाठी डिझाइन केलेले'}
        </p>
      </div>
    </div>
  );
}
