import React, { useState, useEffect } from 'react';
import { User, MapPin, Leaf, Languages, Sparkles, Check, Loader2, Phone, KeyRound } from 'lucide-react';
import { maharashtraDistricts } from '../data/mockData';
import { supabase } from '../lib/supabase';
import { auth } from '../lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

export default function Onboarding({ onComplete }) {
  const [lang, setLang] = useState('en');
  const [step, setStep] = useState('phone'); // 'phone' | 'otp' | 'profile'
  
  // Phone & OTP State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [verifiedPhone, setVerifiedPhone] = useState('');

  // Profile State
  const [name, setName] = useState('');
  const [district, setDistrict] = useState('');
  const [crops, setCrops] = useState([]); // multi-select array
  
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

  // Initialize Recaptcha (invisible) for Firebase
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: (response) => {
          // reCAPTCHA solved
        }
      });
    }
  }, []);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      setError(lang === 'en' ? 'Enter a valid 10-digit number.' : 'वैध 10 अंकी क्रमांक टाका.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    
    try {
      const formattedPhone = `+91${phoneNumber}`; 
      setVerifiedPhone(formattedPhone);
      
      // PORTFOLIO BYPASS: Skip Firebase OTP entirely for frictionless recruiter login
      const { data, error } = await supabase
        .from('farmers')
        .select('*')
        .eq('phone', formattedPhone);

      if (data && data.length > 0) {
        // Old User! Log them right in!
        const existingProfile = data[0];
        
        let parsedCrops = [];
        try { parsedCrops = JSON.parse(existingProfile.crops_raw || '[]'); } catch(e){}
        if (parsedCrops.length === 0 && existingProfile.crop) parsedCrops = [existingProfile.crop];

        const reconstructedProfile = {
          id: existingProfile.id,
          name: existingProfile.name,
          phone: existingProfile.phone,
          district: existingProfile.district,
          crop: existingProfile.crop,
          crops: parsedCrops,
          language: existingProfile.language,
          districtMr: maharashtraDistricts.find(d => d.id === existingProfile.district)?.nameMr || existingProfile.district,
          region: maharashtraDistricts.find(d => d.id === existingProfile.district)?.region || '',
          regionMr: maharashtraDistricts.find(d => d.id === existingProfile.district)?.regionMr || '',
          cropMr: cropOptions.find(c => c.id === existingProfile.crop)?.nameMr || existingProfile.crop,
          cropsData: parsedCrops.map(id => ({
            id,
            nameMr: cropOptions.find(c => c.id === id)?.nameMr || id,
            emoji: cropOptions.find(c => c.id === id)?.emoji || '🌾'
          }))
        };

        localStorage.setItem('farmerProfile', JSON.stringify(reconstructedProfile));
        onComplete(reconstructedProfile);
      } else {
        // New User! Move straight to Profile setup
        setStep('profile');
      }
    } catch (err) {
      console.error(err);
      setError(lang === 'en' ? 'Failed to login. Try again.' : 'लॉगिन त्रुटी. पुन्हा प्रयत्न करा.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // OTP Verification is bypassed in this portfolio build
  const handleVerifyOTP = async (e) => { e.preventDefault(); };

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
      phone: verifiedPhone,
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
            // You can optionally create a 'crops_raw' column in Supabase to save the JSON string
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

    localStorage.setItem('farmerProfile', JSON.stringify(profile));
    onComplete(profile);
  };

  return (
    <div className="onboarding-overlay">
      <div id="recaptcha-container"></div>
      
      <div className="onboarding-card">
        {/* Language Selection Bar */}
        <div className="onboarding-lang-bar">
          <Languages size={16} color="var(--primary)" />
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

        {/* STEP 1: PHONE NUMBER */}
        {step === 'phone' && (
          <form onSubmit={handleSendOTP} className="onboarding-form">
            <div className="input-group">
              <label>
                <Phone size={14} />
                <span>{lang === 'en' ? 'Phone Number' : 'मोबाईल नंबर'}</span>
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ padding: '12px', background: 'var(--surface-sunken)', borderRadius: '12px', fontWeight: 'bold' }}>
                  +91
                </div>
                <input
                  style={{ flex: 1 }}
                  type="tel"
                  maxLength="10"
                  placeholder={lang === 'en' ? '10-digit number' : '10 अंकी मोबाईल नंबर'}
                  value={phoneNumber}
                  onChange={(e) => { setPhoneNumber(e.target.value); setError(''); }}
                />
              </div>
            </div>
            
            {error && <div className="onboarding-error">{error}</div>}
            
            <button type="submit" className="onboarding-submit-btn" disabled={isSubmitting || phoneNumber.length < 10}>
              {isSubmitting ? <Loader2 size={16} className="spinner" /> : <Check size={16} />}
              <span>{isSubmitting ? (lang === 'en' ? 'Sending...' : 'पाठवत आहे...') : (lang === 'en' ? 'Send OTP' : 'OTP पाठवा')}</span>
            </button>
          </form>
        )}

        {/* STEP 2: VERIFY OTP */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOTP} className="onboarding-form">
            <div className="input-group">
              <label>
                <KeyRound size={14} />
                <span>{lang === 'en' ? 'Enter OTP' : 'OTP टाका'}</span>
              </label>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', marginTop: '-4px' }}>
                {lang === 'en' ? `Sent to +91 ${phoneNumber}` : `+91 ${phoneNumber} वर पाठवला आहे`}
              </p>
              <input
                type="number"
                maxLength="6"
                placeholder="000000"
                value={otp}
                onChange={(e) => { setOtp(e.target.value); setError(''); }}
                style={{ letterSpacing: '4px', fontSize: '18px', textAlign: 'center' }}
              />
            </div>
            
            {error && <div className="onboarding-error">{error}</div>}
            
            <button type="submit" className="onboarding-submit-btn" disabled={isSubmitting || otp.length < 6}>
              {isSubmitting ? <Loader2 size={16} className="spinner" /> : <Sparkles size={16} />}
              <span>{isSubmitting ? (lang === 'en' ? 'Verifying...' : 'तपासत आहे...') : (lang === 'en' ? 'Verify & Login' : 'तपासा आणि सुरू करा')}</span>
            </button>
          </form>
        )}

        {/* STEP 3: PROFILE SETUP (New Users Only) */}
        {step === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="onboarding-form">
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
                    <span style={{ marginLeft: '6px', background: 'var(--primary)', color: '#fff', borderRadius: '10px', padding: '1px 7px', fontSize: '10px', fontWeight: '800' }}>
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
