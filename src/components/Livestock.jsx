import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send, Camera, Image as ImageIcon, Sparkles, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { livestockSickness } from '../data/mockData';

const animalSampleDiagnoses = {
  cow_lumpy: 'lumpy_skin',
  cow_mastitis: 'mastitis',
  goat_ppr: 'ppr',
  chicken_ranikhet: 'ranikhet',
};

const animalSamples = {
  cow: [
    { key: 'cow_lumpy', label: { en: 'Cow – Lumpy Skin', mr: 'गाय – लम्पी रोग' }, emoji: '🐄' },
    { key: 'cow_mastitis', label: { en: 'Cow – Mastitis', mr: 'गाय – स्तनदाह' }, emoji: '🐄' },
  ],
  goat: [
    { key: 'goat_ppr', label: { en: 'Goat – PPR Plague', mr: 'शेळी – पीपीआर रोग' }, emoji: '🐐' },
  ],
  chicken: [
    { key: 'chicken_ranikhet', label: { en: 'Chicken – Ranikhet', mr: 'कोंबडी – राणीखेत' }, emoji: '🐓' },
  ],
};

export default function Livestock({ language, apiKey, simulatedMode, addLog }) {
  const [activeTab, setActiveTab] = useState('scanner'); // 'scanner' | 'chat'
  const [selectedAnimal, setSelectedAnimal] = useState('cow');

  // --- Scanner state ---
  const [isImageScanning, setIsImageScanning] = useState(false);
  const [scannedImage, setScannedImage] = useState(null);
  const [scanResult, setScanResult] = useState(null);

  // --- Chat state ---
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Welcome message when chat tab or animal changes
  useEffect(() => {
    const defaultWelcome = {
      cow: {
        en: "Hello! I am your AI Livestock Veterinarian. Describe your cow's symptoms (e.g., 'fever and skin bumps', 'swollen udder', 'blood in milk').",
        mr: "नमस्कार! मी आपला कृत्रिम बुद्धिमत्ता पशुवैद्य आहे. गाईची लक्षणे सांगा (उदा. 'ताप व गाठी', 'आचळ सुजणे', 'दुधातून रक्त')."
      },
      goat: {
        en: "Hello! Describe your goat's symptoms (e.g., 'heavy coughing', 'nasal discharge', 'foul diarrhea').",
        mr: "नमस्कार! शेळीची लक्षणे लिहा (उदा. 'खूप खोकला', 'नाकातून पाणी', 'दुर्गंधीयुक्त जुलाब')."
      },
      chicken: {
        en: "Hello! Describe your chicken's symptoms (e.g., 'gasping for breath', 'green droppings', 'neck twisting').",
        mr: "नमस्कार! कोंबडीची लक्षणे सांगा (उदा. 'मान वर करून श्वास', 'हिरवे जुलाब', 'मान वाकडी')."
      }
    };
    setMessages([{ sender: 'bot', text: language === 'en' ? defaultWelcome[selectedAnimal].en : defaultWelcome[selectedAnimal].mr }]);
  }, [selectedAnimal, language]);

  // Reset scanner when animal changes
  useEffect(() => {
    setScanResult(null);
    setScannedImage(null);
    setIsImageScanning(false);
  }, [selectedAnimal]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // ---- PHOTO SCANNER ----
  const runImageDiagnosis = (diseaseKey) => {
    const animalDiseases = livestockSickness[selectedAnimal] || [];
    const matched = animalDiseases.find(d => d.id === diseaseKey);
    if (matched) {
      setScanResult(matched);
      addLog(`[Livestock Photo] Image scan matched: ${matched.name.en}`, 'success');
    } else {
      setScanResult(null);
      addLog(`[Livestock Photo] No match found in local DB.`, 'warning');
    }
  };

  const handleSamplePhotoClick = (sampleKey) => {
    const diseaseKey = animalSampleDiagnoses[sampleKey];
    setScannedImage(sampleKey);
    setScanResult(null);
    setIsImageScanning(true);
    addLog(`[Livestock Photo] Sample "${sampleKey}" selected. Scanning...`, 'info');
    setTimeout(() => {
      setIsImageScanning(false);
      runImageDiagnosis(diseaseKey);
    }, 2200);
  };

  const handlePhotoFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsImageScanning(true);
    setScanResult(null);
    setScannedImage(file.name);
    addLog(`[Livestock Photo] User uploaded: ${file.name}. Scanning...`, 'info');

    if (!simulatedMode && apiKey) {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
          const base64Data = reader.result.split(',')[1];
          const prompt = `You are a livestock veterinarian. Analyze this ${selectedAnimal} photo. Output ONLY JSON: {"name":{"en":"","mr":""},"severity":"High/Medium/Low","symptoms":{"en":"","mr":""},"firstAid":{"en":"","mr":""},"isolationSteps":{"en":"","mr":""},"prescription":{"en":"","mr":""}}.`;
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType: file.type, data: base64Data } }] }] }) }
          );
          if (!response.ok) throw new Error('API fail');
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const parsed = JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
          setScanResult(parsed);
          addLog(`[Livestock Gemini Photo] Diagnosed: ${parsed.name.en}`, 'success');
        };
      } catch (err) {
        addLog(`[Livestock Photo] Gemini error: ${err.message}`, 'error');
        const animalDiseases = livestockSickness[selectedAnimal] || [];
        if (animalDiseases[0]) setScanResult(animalDiseases[0]);
      } finally {
        setIsImageScanning(false);
      }
    } else {
      setTimeout(() => {
        const animalDiseases = livestockSickness[selectedAnimal] || [];
        const randomDisease = animalDiseases[Math.floor(Math.random() * animalDiseases.length)];
        setIsImageScanning(false);
        if (randomDisease) {
          setScanResult(randomDisease);
          addLog(`[Livestock Photo] Simulated scan. Output: ${randomDisease.name.en}`, 'success');
        }
      }, 2000);
    }
  };

  // ---- CHAT ----
  const handleMicClick = () => {
    setIsRecording(true);
    addLog(`[Livestock Speech] Activating microphone...`, 'info');
    setTimeout(() => {
      let voiceText = '';
      if (selectedAnimal === 'cow') {
        voiceText = language === 'en' ? "My cow has a high fever and hard round lumps on her skin." : "माझ्या गाईला खूप ताप आला आहे आणि त्वचेवर कडक गोल गाठी दिसत आहेत.";
      } else if (selectedAnimal === 'goat') {
        voiceText = language === 'en' ? "Goat has high fever and foul-smelling diarrhea." : "शेळीला खूप ताप आहे आणि दुर्गंधीयुक्त जुलाब होत आहेत.";
      } else {
        voiceText = language === 'en' ? "Chickens are gasping for breath and neck is twisting." : "कोंबड्या श्वास घ्यायला त्रास होत असून मान वाकडी करून फिरत आहेत.";
      }
      setInputText(voiceText);
      setIsRecording(false);
      addLog(`[Livestock Speech] Voice input: "${voiceText}"`, 'success');
    }, 2500);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const userMsg = inputText.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInputText('');
    setLoading(true);
    addLog(`[Livestock AI] Analyzing: "${userMsg}"...`, 'info');

    const textLower = userMsg.toLowerCase();
    const animalDiseases = livestockSickness[selectedAnimal] || [];
    let matchedDisease = null;
    for (let disease of animalDiseases) {
      if (disease.matchKeywords.some(kw => textLower.includes(kw.toLowerCase()))) {
        matchedDisease = disease;
        break;
      }
    }

    if (matchedDisease) {
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'bot', type: 'diagnosis', disease: matchedDisease }]);
        setLoading(false);
        addLog(`[Livestock AI] Found: ${matchedDisease.name.en}`, 'success');
      }, 1500);
      return;
    }

    if (simulatedMode || !apiKey) {
      setTimeout(() => {
        const fallback = language === 'en'
          ? `Couldn't identify the exact disease from symptoms. Try describing specific signs like "skin nodules", "udder swelling", or "neck twisting". Add a Gemini API key for live vet diagnosis.`
          : `लक्षणांवरून अचूक आजार सापडला नाही. "त्वचेवर गाठी", "आचळ सूज" किंवा "मान वाकडी" अशी स्पष्ट लक्षणे सांगा. Gemini API Key टाकल्यास थेट निदान मिळेल.`;
        setMessages(prev => [...prev, { sender: 'bot', text: fallback }]);
        setLoading(false);
      }, 1500);
      return;
    }

    try {
      const prompt = `You are a professional veterinary doctor. A farmer reports their ${selectedAnimal} has: "${userMsg}". Output ONLY JSON: {"name":{"en":"","mr":""},"severity":"High/Medium/Low","symptoms":{"en":"","mr":""},"firstAid":{"en":"","mr":""},"isolationSteps":{"en":"","mr":""},"prescription":{"en":"","mr":""}}.`;
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) }
      );
      if (!response.ok) throw new Error('Gemini API call failed');
      const data = await response.json();
      const parsedResult = JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text?.replace(/```json/g, '').replace(/```/g, '').trim() || '{}');
      setMessages(prev => [...prev, { sender: 'bot', type: 'diagnosis', disease: parsedResult }]);
      addLog(`[Livestock Gemini] Diagnosed: ${parsedResult.name.en}`, 'success');
    } catch (error) {
      const errorFallback = language === 'en' ? "Network error. Keep the animal isolated, provide soft fodder, and contact your local vet." : "नेटवर्क त्रुटी. प्राण्याला वेगळे करा, मऊ चारा द्या आणि स्थानिक डॉक्टरांशी संपर्क साधा.";
      setMessages(prev => [...prev, { sender: 'bot', text: errorFallback }]);
      addLog(`[Livestock Gemini] Error occurred.`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Render a diagnosis result card (shared between scanner result + chat)
  const DiagnosisCard = ({ disease, fromPhoto }) => (
    <div className={`result-card severity-${(disease.severity || 'low').toLowerCase()}`} style={{ borderLeftWidth: '4px', padding: '12px' }}>
      {fromPhoto && (
        <div style={{ fontSize: '9px', fontWeight: '800', color: 'var(--primary)', background: 'var(--accent-light)', padding: '2px 7px', borderRadius: '8px', marginBottom: '6px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
          <Camera size={9} /> {language === 'en' ? 'PHOTO DIAGNOSIS' : 'फोटो निदान'}
        </div>
      )}
      <div className="result-badge" style={{ fontSize: '9px', padding: '2px 6px' }}>
        ⚠️ {language === 'en' ? (disease.severity || 'LOW').toUpperCase() : disease.severity === 'High' ? 'तीव्र' : disease.severity === 'Medium' ? 'मध्यम' : 'सौम्य'}
      </div>
      <h4 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px' }}>
        {language === 'en' ? disease.name?.en : disease.name?.mr}
      </h4>
      <div style={{ fontSize: '11px', lineHeight: '1.5', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-dark)' }}>
        <p><strong>{language === 'en' ? 'Symptoms: ' : 'लक्षणे: '}</strong>{language === 'en' ? disease.symptoms?.en : disease.symptoms?.mr}</p>
        <p style={{ background: '#fffbe6', padding: '6px', borderRadius: '4px', borderLeft: '3px solid #ffe58f' }}>
          <strong>{language === 'en' ? 'First Aid: ' : 'प्रथमोपचार: '}</strong>{language === 'en' ? disease.firstAid?.en : disease.firstAid?.mr}
        </p>
        <p style={{ background: '#f0f5ff', padding: '6px', borderRadius: '4px', borderLeft: '3px solid #adc6ff' }}>
          <strong>{language === 'en' ? 'Isolation: ' : 'क्वारंटाईन: '}</strong>{language === 'en' ? disease.isolationSteps?.en : disease.isolationSteps?.mr}
        </p>
        <p><strong>{language === 'en' ? 'Vet Advisory: ' : 'वैद्यकीय सल्ला: '}</strong>{language === 'en' ? disease.prescription?.en : disease.prescription?.mr}</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Screen Title */}
      <div className="screen-header" style={{ paddingBottom: '4px' }}>
        <h2>{language === 'en' ? 'Livestock AI Health Desk' : 'पशूधन आरोग्य सल्ला कक्ष'}</h2>
      </div>

      {/* Segmented Tab Bar (same style as Crops) */}
      <div className="segment-control">
        <button
          className={`segment-btn ${activeTab === 'scanner' ? 'active' : ''}`}
          onClick={() => setActiveTab('scanner')}
        >
          <Camera size={13} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
          {language === 'en' ? 'Photo Diagnosis' : 'फोटो निदान'}
        </button>
        <button
          className={`segment-btn ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          <MessageCircle size={13} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
          {language === 'en' ? 'Vet AI Chat' : 'पशुवैद्य AI चॅट'}
        </button>
      </div>

      {/* Animal Selection Tabs (shown in both tabs) */}
      <div className="livestock-animal-grid" style={{ marginBottom: 20 }}>
        {['cow', 'goat', 'chicken'].map((animal) => (
          <button
            key={animal}
            className={`animal-btn ${selectedAnimal === animal ? 'active' : ''}`}
            onClick={() => setSelectedAnimal(animal)}
          >
            <span style={{ fontSize: '24px' }}>
              {animal === 'cow' ? '🐄' : animal === 'goat' ? '🐐' : '🐓'}
            </span>
            <span>
              {animal === 'cow' ? (language === 'en' ? 'Cow' : 'गाय') :
               animal === 'goat' ? (language === 'en' ? 'Goat' : 'शेळी') :
               (language === 'en' ? 'Chicken' : 'कोंबडी')}
            </span>
          </button>
        ))}
      </div>

      {/* ===== PHOTO SCANNER TAB ===== */}
      {activeTab === 'scanner' && (
        <>
          {/* Upload card */}
          <label className="upload-zone" style={{ cursor:'pointer' }}>
            <input type="file" accept="image/*" onChange={handlePhotoFileChange} style={{ display: 'none' }} />
            <div className="upload-zone-icon"><Camera size={28} color="#fff" strokeWidth={1.8} /></div>
            <h4>{language === 'en' ? 'Take Photo or Upload Animal Image' : 'जनावराचा फोटो काढा किंवा अपलोड करा'}</h4>
            <div className="upload-zone-meta">
              <span>JPG</span><span className="dot" /><span>PNG</span><span className="dot" /><span>WEBP</span>
            </div>
            {scannedImage && (
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary)', backgroundColor: '#edf2ea', padding: '4px 8px', borderRadius: '4px' }}>
                📎 {scannedImage}
              </div>
            )}
          </label>

          {/* Sample disease thumbnails */}
          <p className="samples-section-label" style={{ marginTop: 16 }}>
            <Sparkles size={11} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            {language === 'en' ? 'Click sample sick animals to diagnose' : 'नमुना आजारी जनावर निवडा'}
          </p>
          <div className="samples-grid">
            {(animalSamples[selectedAnimal] || []).map(sample => (
              <button
                key={sample.key}
                className={`sample-thumb ${scannedImage === sample.key ? 'active-thumb' : ''}`}
                onClick={() => handleSamplePhotoClick(sample.key)}
                disabled={isImageScanning}
                style={{
                  borderColor: scannedImage === sample.key ? 'var(--primary)' : 'var(--border-light)',
                  background: scannedImage === sample.key ? 'var(--accent-light)' : '#fff',
                }}
              >
                <div className="sample-thumb-icon" style={{ fontSize: '24px', background: 'transparent' }}>{sample.emoji}</div>
                <span>{language === 'en' ? sample.label.en : sample.label.mr}</span>
              </button>
            ))}
          </div>

          {/* Scanning Progress */}
          {isImageScanning && (
            <div className="scan-progress" style={{ marginTop: '24px' }}>
              <div className="scan-progress-icon"><Camera size={26} /></div>
              <h4>
                {language === 'en' ? 'AI scanning animal image...' : 'AI जनावराचा फोटो तपासत आहे...'}
              </h4>
              <p>{language === 'en' ? 'Analyzing symptoms and matching with veterinary records' : 'लक्षणे तपासत आहे आणि पशुवैद्यकीय रेकॉर्डशी जुळवत आहे'}</p>
              <div className="progress-track">
                <div className="progress-fill" />
              </div>
            </div>
          )}

          {/* Scan Result */}
          {scanResult && !isImageScanning && (
            <DiagnosisCard disease={scanResult} fromPhoto={true} />
          )}

          {!scanResult && !isImageScanning && (
            <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontSize: '11px', background: 'var(--accent-light)', borderRadius: '12px' }}>
              {language === 'en'
                ? '👆 Upload a photo or click a sample animal above to get an instant AI diagnosis'
                : '👆 फोटो अपलोड करा किंवा वरील नमुना जनावर निवडा'}
            </div>
          )}
        </>
      )}

      {/* ===== VET AI CHAT TAB ===== */}
      {activeTab === 'chat' && (
        <div className="crop-chat-wrapper">
          <div className="chat-hint-bar">
            <Sparkles size={12} style={{ flexShrink: 0 }} />
            <span>
              {language === 'en'
                ? "Describe your animal's symptoms for an instant diagnosis"
                : 'जनावराची लक्षणे सांगा आणि तात्काळ निदान मिळवा'}
            </span>
          </div>
          <div className="chat-console-wrap">
            <div className="chat-history">
              {messages.map((msg, index) => (
                <div key={index} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  {msg.sender === 'user' ? (
                    <div className="chat-bubble user">{msg.text}</div>
                  ) : msg.type === 'diagnosis' ? (
                    <div style={{ alignSelf: 'flex-start', maxWidth: '95%', width: '100%', margin: '4px 0' }}>
                      <DiagnosisCard disease={msg.disease} fromPhoto={false} />
                    </div>
                  ) : (
                    <div className="chat-bubble bot">{msg.text}</div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="chat-bubble bot" style={{ display: 'flex', gap: '4px', padding: '12px 16px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', display: 'inline-block', animation: 'micPulse 1s infinite' }} />
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', display: 'inline-block', animation: 'micPulse 1s infinite', animationDelay: '0.2s' }} />
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', display: 'inline-block', animation: 'micPulse 1s infinite', animationDelay: '0.4s' }} />
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="chat-input-row">
              <button type="button" className={`chat-mic-btn ${isRecording ? 'recording' : ''}`} onClick={handleMicClick} disabled={loading}>
                <Mic size={16} />
              </button>
              <input
                type="text"
                placeholder={language === 'en' ? "Describe symptoms..." : "प्राण्याची लक्षणे सांगा..."}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={loading}
              />
              <button type="submit" className="chat-send-btn" disabled={loading || !inputText.trim()}>
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
