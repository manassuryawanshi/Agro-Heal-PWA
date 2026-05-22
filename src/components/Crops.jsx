import React, { useState, useRef, useEffect } from 'react';
import { Camera, CheckCircle, FlaskConical, Leaf, MessageCircle, Mic, Send, Volume2, Square, Sparkles, ShoppingCart, Microscope } from 'lucide-react';
import { cropDiseases, cropChatbotQna } from '../data/mockData';

export default function Crops({ language, apiKey, simulatedMode, addLog, farmerProfile }) {
  // --- Tab State ---
  const [activeTab, setActiveTab] = useState('scanner'); // 'scanner' | 'chat'

  // --- Scanner State ---
  const [selectedImage, setSelectedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  // --- Chat State ---
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [isMicRecording, setIsMicRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatEndRef = useRef(null);

  // Welcome message and language reset
  useEffect(() => {
    const welcome = language === 'en'
      ? `Hello${farmerProfile ? `, ${farmerProfile.name}` : ''}! I am your Crop Advisor AI. Ask me anything about fertilizers, watering, pest control, spacing, or composting for your crops.`
      : `नमस्कार${farmerProfile ? `, ${farmerProfile.name}` : ''}! मी तुमचा पीक सल्लागार AI आहे. खत, पाणी, कीड नियंत्रण, अंतर किंवा सेंद्रिय खतासंबंधी कोणताही प्रश्न विचारा.`;
    
    // Reset chat history when language changes so it doesn't mix languages
    if (activeTab === 'chat') {
      setChatMessages([{ sender: 'bot', text: welcome }]);
    }
  }, [activeTab, language]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatLoading]);

  // --- Sample crops list ---
  const sampleCrops = [
    { id: 'cotton_blight', label: { en: 'Cotton Blight', mr: 'कापूस करपा' }, key: 'cotton_blight' },
    { id: 'cotton_curl', label: { en: 'Cotton Leaf Curl', mr: 'कापूस पर्णगुच्छ' }, key: 'cotton_curl' },
    { id: 'corn_rust', label: { en: 'Corn Rust', mr: 'मका तांबेरा' }, key: 'corn_rust' }
  ];

  // Mock scan handler
  const handleSampleClick = (cropKey) => {
    setIsScanning(true);
    setSelectedImage(cropKey);
    setScanResult(null);
    addLog(`[Crops ML] Selected sample crop: ${cropKey}. Triggering vision analysis...`, 'info');
    setTimeout(() => {
      const result = cropDiseases[cropKey];
      setScanResult(result);
      setIsScanning(false);
      addLog(`[Crops ML] Scan complete. Found: ${result.name.en} (Severity: ${result.severity})`, 'success');
    }, 2000);
  };

  // Real Gemini Image API Handler
  const handleImageFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedImage(file.name);
    setScanResult(null);

    if (simulatedMode || !apiKey) {
      setIsScanning(true);
      addLog(`[Crops Engine] Image uploaded: ${file.name}. Simulated Mode active. Loading fallback...`, 'warning');
      setTimeout(() => {
        const keys = ['cotton_blight', 'cotton_curl', 'corn_rust'];
        const result = cropDiseases[keys[Math.floor(Math.random() * keys.length)]];
        setScanResult(result);
        setIsScanning(false);
        addLog(`[Crops ML] Simulated Scan complete. Output: ${result.name.en}`, 'success');
      }, 2000);
      return;
    }

    setIsScanning(true);
    addLog(`[Crops Engine] Uploading ${file.name} to Gemini Cloud Vision API...`, 'info');
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const img = new Image();
        img.onload = async () => {
          // Compress image to save 90% of Gemini tokens
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 512;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          const base64Data = compressedDataUrl.split(',')[1];
          
          try {
            const prompt = `Analyze crop leaf. Output ONLY valid JSON: {"name":{"en":"","mr":""},"scientificName":"","severity":"High|Medium|Low","symptoms":{"en":"","mr":""},"organicRemedy":{"en":"","mr":""},"chemicalRemedy":{"en":"","mr":""},"prevention":{"en":"","mr":""}}`;
            const response = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
              { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType: 'image/jpeg', data: base64Data } }] }] }) }
            );
            if (!response.ok) {
              const errData = await response.json();
              throw new Error(errData.error?.message || 'Gemini API call failed');
            }
            const data = await response.json();
            const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
            const parsedResult = JSON.parse(textResponse.replace(/```json/g, '').replace(/```/g, '').trim());
            parsedResult.products = [];
            setScanResult(parsedResult);
            addLog(`[Crops Gemini] Diagnostic generated: ${parsedResult.name.en}`, 'success');
          } catch (error) {
            addLog(`[Crops Gemini] Parsing failed. Reverting to local fallback. Error: ${error.message}`, 'error');
            setScanResult(cropDiseases['cotton_blight']);
          } finally {
            setIsScanning(false);
          }
        };
        img.src = reader.result;
      };
    } catch (e) {
      addLog(`[Crops Engine] Image load error: ${e.message}`, 'error');
      setIsScanning(false);
    }
  };



  // ---- CROP AI CHATBOT ----
  const getLocalAnswer = (question) => {
    const q = question.toLowerCase();
    if (q.includes('fertili') || q.includes('खत') || q.includes('npk')) return cropChatbotQna.fertilizer;
    if (q.includes('water') || q.includes('irrigat') || q.includes('पाणी') || q.includes('सिंचन')) return cropChatbotQna.water;
    if (q.includes('spacing') || q.includes('distance') || q.includes('अंतर') || q.includes('sowing')) return cropChatbotQna.spacing;
    if (q.includes('compost') || q.includes('organic') || q.includes('सेंद्रिय') || q.includes('खत खड्डा')) return cropChatbotQna.compost;
    if (q.includes('pest') || q.includes('insect') || q.includes('कीड') || q.includes('अळी')) return cropChatbotQna.pest;
    return null;
  };

  const handleChatSend = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setChatLoading(true);
    addLog(`[Crops Chatbot] User asked: "${userMsg}"`, 'info');

    // 1. Try local QnA
    const localAnswer = getLocalAnswer(userMsg);
    if (localAnswer) {
      setTimeout(() => {
        setChatMessages(prev => [...prev, { sender: 'bot', text: language === 'en' ? localAnswer.en : localAnswer.mr }]);
        setChatLoading(false);
        addLog(`[Crops Chatbot] Answered from local knowledge base.`, 'success');
      }, 1000);
      return;
    }

    // 2. Gemini API if key available
    if (!simulatedMode && apiKey) {
      try {
        const crop = farmerProfile?.crop || 'various crops';
        const district = farmerProfile?.district || 'Maharashtra';
        const farmerName = farmerProfile?.name || 'Farmer';
        const systemPrompt = `You are an expert Indian agricultural advisor specializing in Maharashtra farming. The farmer's name is ${farmerName} and they grow ${crop} in ${district}. Answer concisely and practically in ${language === 'en' ? 'English' : 'Marathi'}. Keep answers under 120 words. CRITICAL RULES: 1. Do NOT use any markdown formatting, asterisks, bolding, or special symbols. 2. ALWAYS keep the farmer's name (${farmerName}) in English letters, do not translate it. 3. Do NOT start every response with a greeting. Just answer the question directly.`;
        
        const historyContents = chatMessages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        }));
        historyContents.push({ role: 'user', parts: [{ text: userMsg }] });

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ 
              systemInstruction: { parts: [{ text: systemPrompt }] },
              contents: historyContents 
            }) 
          }
        );
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error?.message || 'API error');
        }
        const data = await response.json();
        const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        setChatMessages(prev => [...prev, { sender: 'bot', text: answer }]);
        addLog(`[Crops Chatbot] Gemini answered successfully.`, 'success');
      } catch (err) {
        addLog(`[Crops Chatbot] Gemini error: ${err.message}`, 'error');
        const fallback = language === 'en'
          ? "I couldn't connect to Gemini right now. Please try asking about fertilizers, water, spacing, compost, or pests — I can answer those offline!"
          : "आत्ता Gemini शी संपर्क होऊ शकला नाही. खत, पाणी, अंतर, कंपोस्ट किंवा कीड या विषयांवर प्रश्न विचारा — मी ऑफलाइन उत्तर देऊ शकतो!";
        setChatMessages(prev => [...prev, { sender: 'bot', text: fallback }]);
      } finally {
        setChatLoading(false);
      }
      return;
    }

    // 3. Simulated mode fallback
    setTimeout(() => {
      const simAnswer = language === 'en'
        ? `Good question! For ${farmerProfile?.crop || 'your crop'} in ${farmerProfile?.district || 'your region'}: Try asking about fertilizers, water management, pest control, plant spacing, or compost for a detailed offline answer. Or add your Gemini API key in the control panel for live AI responses!`
        : `चांगला प्रश्न! ${farmerProfile?.cropMr || 'तुमच्या पिकासाठी'} ${farmerProfile?.districtMr || 'तुमच्या जिल्ह्यात'}: खत, पाणी व्यवस्थापन, कीड नियंत्रण, अंतर किंवा सेंद्रिय खत याबद्दल विचारा. किंवा थेट AI उत्तरासाठी Gemini API Key टाका!`;
      setChatMessages(prev => [...prev, { sender: 'bot', text: simAnswer }]);
      setChatLoading(false);
      addLog(`[Crops Chatbot] Returned simulated response.`, 'warning');
    }, 1200);
  };

  const handleMicClick = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addLog('[Crops Chat Speech] Voice recognition not supported in this browser.', 'error');
      alert(language === 'en' ? 'Voice recognition is not supported in this browser.' : 'तुमच्या ब्राउझरमध्ये व्हॉइस टायपिंग समर्थित नाही.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'en' ? 'en-IN' : 'mr-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsMicRecording(true);
      addLog('[Crops Chat Speech] Listening...', 'info');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setChatInput(transcript);
      addLog(`[Crops Chat Speech] Recognized: "${transcript}"`, 'success');
    };

    recognition.onerror = (event) => {
      addLog(`[Crops Chat Speech] Error: ${event.error}`, 'error');
    };

    recognition.onend = () => {
      setIsMicRecording(false);
    };

    try {
      recognition.start();
    } catch (e) {
      setIsMicRecording(false);
    }
  };

  const handleSpeak = (text) => {
    if (!('speechSynthesis' in window)) {
      addLog('[Crops Chat Speech] Text-to-speech not supported.', 'error');
      return;
    }
    
    // If currently speaking, stop it.
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    
    // Strip markdown symbols, emojis, and weird characters for the audio reader
    const cleanText = text.replace(/[*#_`]/g, '').replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '').trim();
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Try to find a native voice (Marathi -> Hindi fallback for Devanagari)
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;
    if (language === 'mr') {
      selectedVoice = voices.find(v => v.lang.includes('mr')) || voices.find(v => v.lang.includes('hi'));
      utterance.lang = selectedVoice ? selectedVoice.lang : 'hi-IN'; // Default to hi-IN because mr-IN is often missing, and hi-IN reads Devanagari perfectly
    } else {
      selectedVoice = voices.find(v => v.lang.includes('en-IN')) || voices.find(v => v.lang.includes('en'));
      utterance.lang = selectedVoice ? selectedVoice.lang : 'en-IN';
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.rate = 0.9;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
    addLog('[Crops Chat Speech] Playing audio response...', 'info');
  };

  const L = (en, mr) => language === 'en' ? en : mr;

  return (
    <>
      {/* Page title */}
      <div className="screen-header" style={{ marginBottom: 12 }}>
        <div>
          <h2 style={{ display:'flex', alignItems:'center', gap:8 }}>
            <Microscope size={22} color="var(--brand)" />
            {L('Crop Intelligence', 'पीक बुद्धिमत्ता')}
          </h2>
          <p style={{ fontSize:13, color:'var(--t3)', marginTop:4 }}>
            {L('AI-powered disease diagnosis & expert crop advisor', 'AI निदान व तज्ज्ञ पीक सल्ला')}
          </p>
        </div>
      </div>

      {/* Segment Tabs */}
      <div className="segment-control">
        <button className={`segment-btn ${activeTab === 'scanner' ? 'active' : ''}`} onClick={() => setActiveTab('scanner')}>
          <Camera size={14} />{L('Photo Diagnosis', 'फोटो निदान')}
        </button>
        <button className={`segment-btn ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>
          <MessageCircle size={14} />{L('Crop Advisor AI', 'पीक सल्ला AI')}
        </button>
      </div>

      {/* ===== SCANNER TAB ===== */}
      {activeTab === 'scanner' && (
        <>
          {/* Upload Zone */}
          <label className="upload-zone" style={{ cursor:'pointer' }}>
            <input type="file" accept="image/*" onChange={handleImageFileChange} style={{ display:'none' }} />
            <div className="upload-zone-icon"><Camera size={28} color="#fff" strokeWidth={1.8} /></div>
            <h4>{L('Take a Photo or Upload Image', 'फोटो काढा किंवा उपलोड करा')}</h4>
            <p>{L('Point at any diseased leaf for an instant AI diagnosis', 'आजारी पानावर फोकस करा आणि AI तत्काल निदान करेल')}</p>
            <div className="upload-zone-meta">
              <span>JPG</span><span className="dot" /><span>PNG</span><span className="dot" /><span>WEBP</span>
            </div>
            {selectedImage && (
              <div style={{ fontSize:12, fontWeight:700, color:'var(--brand)', background:'var(--brand-tint)', padding:'4px 10px', borderRadius:'var(--r-pill)' }}>
                ✔ {selectedImage}
              </div>
            )}
          </label>

          {/* Sample shelf */}
          <p className="samples-section-label" style={{ marginTop:16 }}>
            <Sparkles size={11} />{L('Try a sample leaf to see how it works', 'नमुना पान निवडा आणि बघा निदान कसे काम करते')}
          </p>
          <div className="samples-grid">
            {sampleCrops.map((crop) => (
              <button key={crop.id} className={`sample-thumb ${selectedImage === crop.key ? 'active-thumb' : ''}`}
                onClick={() => handleSampleClick(crop.key)}>
                <div className="sample-thumb-icon"><Leaf size={18} /></div>
                <span>{language === 'en' ? crop.label.en : crop.label.mr}</span>
              </button>
            ))}
          </div>

          {/* Scanning Progress */}
          {isScanning && (
            <div className="scan-progress">
              <div className="scan-progress-icon"><Microscope size={26} /></div>
              <h4>{L('Reading leaf patterns…', 'पानातील रचना तपासत आहे…')}</h4>
              <p>{L('Our AI is analyzing the image for disease markers', 'AI रोग मार्कर ओळखत आहे')}</p>
              <div className="progress-track"><div className="progress-fill" /></div>
            </div>
          )}

          {/* Diagnostic Result */}
          {scanResult && !isScanning && (
            <div className={`result-card severity-${(scanResult.severity||'low').toLowerCase()}`} style={{ marginTop: '24px' }}>
              <div className="result-severity">
                {(scanResult.severity||'LOW').toUpperCase()} {L('SEVERITY','तीव्रता')}
              </div>
              <div>
                <div className="result-name">{L(scanResult.name.en, scanResult.name.mr)}</div>
                {scanResult.scientificName && <div className="result-sci">{scanResult.scientificName}</div>}
              </div>

              <div className="result-block">
                <div className="result-block-label"><Microscope size={12} />{L('Symptoms', 'लक्षणे')}</div>
                <p>{L(scanResult.symptoms.en, scanResult.symptoms.mr)}</p>
              </div>

              <div className="result-block">
                <div className="result-block-label"><Leaf size={12} />{L('Organic Remedy', 'सेंद्रिय उपाय')}</div>
                <p>{L(scanResult.organicRemedy.en, scanResult.organicRemedy.mr)}</p>
              </div>

              {scanResult.chemicalRemedy && (
                <div className="result-block">
                  <div className="result-block-label"><FlaskConical size={12} />{L('Chemical Control', 'रासायनिक नियंत्रण')}</div>
                  <p>{L(scanResult.chemicalRemedy.en, scanResult.chemicalRemedy.mr)}</p>
                </div>
              )}

              {scanResult.prevention && (
                <div className="result-block">
                  <div className="result-block-label" style={{ color:'#1565C0' }}>
                    <span style={{ fontSize:12 }}>🛡️</span>{L('Prevention', 'प्रतिबंध')}
                  </div>
                  <p>{L(scanResult.prevention.en, scanResult.prevention.mr)}</p>
                </div>
              )}

              {/* Products */}
              {scanResult.products?.length > 0 && (
                <div className="result-block">
                  <div className="result-block-label"><ShoppingCart size={12} />{L('Recommended Products', 'शिफारस उत्पादने')}</div>
                  {scanResult.products.map(prod => (
                    <div key={prod.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--sep-sm)' }}>
                      <div>
                        <div style={{ fontSize:11, fontWeight:800, color:'var(--t3)', textTransform:'uppercase' }}>{prod.brand}</div>
                        <div style={{ fontSize:13, fontWeight:700, color:'var(--t1)' }}>{L(prod.name.en, prod.name.mr)}</div>
                        <div style={{ fontSize:11, color:'var(--t3)' }}>{prod.size}</div>
                      </div>
                      <div style={{ textAlign:'right', display:'flex', flexDirection:'column', gap:4, alignItems:'flex-end' }}>
                        <div style={{ fontSize:15, fontWeight:800, color:'var(--brand)' }}>₹{prod.price}</div>
                        <a 
                          href={`https://www.amazon.in/s?k=${encodeURIComponent(prod.brand + ' ' + prod.name.en)}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ textDecoration: 'none', background:'var(--brand)', color:'#fff', border:'none', borderRadius:'var(--r-sm)', padding:'5px 10px', fontSize:11, fontWeight:700, cursor:'pointer', display: 'inline-block' }}>
                          {L('Buy on Amazon','Amazon वर खरेदी')}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ===== CHAT TAB ===== */}
      {activeTab === 'chat' && (
        <div className="crop-chat-wrapper">
          <div className="chat-hint-bar">
            <MessageCircle size={14} />
            <span>{L('Ask about fertilizers, irrigation, pests, spacing, or composting', 'खत, पाणी, कीड, अंतर किंवा सेंद्रिय खत याबद्दल विचारा')}</span>
          </div>
          <div className="chat-console-wrap">
            <div className="chat-history">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`chat-bubble ${msg.sender}`}>
                  <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                  {msg.sender === 'bot' && (
                    <button 
                      onClick={() => handleSpeak(msg.text)}
                      style={{ background: 'none', border: 'none', color: isSpeaking ? '#ff4757' : 'inherit', opacity: isSpeaking ? 1 : 0.6, cursor: 'pointer', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 'bold' }}
                    >
                      {isSpeaking ? (
                        <>
                          <Square size={10} fill="currentColor" /> {language === 'en' ? 'Stop' : 'थांबवा'}
                        </>
                      ) : (
                        <>
                          <Volume2 size={12} /> {language === 'en' ? 'Listen' : 'ऐका'}
                        </>
                      )}
                    </button>
                  )}
                </div>
              ))}
              {chatLoading && (
                <div className="chat-bubble bot" style={{ display: 'flex', gap: '4px', padding: '12px 16px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', display: 'inline-block', animation: 'micPulse 1s infinite' }} />
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', display: 'inline-block', animation: 'micPulse 1s infinite', animationDelay: '0.2s' }} />
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', display: 'inline-block', animation: 'micPulse 1s infinite', animationDelay: '0.4s' }} />
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleChatSend} className="chat-input-row">
              <button type="button" className={`chat-mic-btn ${isMicRecording ? 'recording' : ''}`} onClick={handleMicClick} disabled={chatLoading}>
                <Mic size={16} />
              </button>
              <input type="text" placeholder={L('Ask about your crop…','तुमच्या पिकाबद्दल विचारा…')} value={chatInput} onChange={e => setChatInput(e.target.value)} disabled={chatLoading} />
              <button type="submit" className="chat-send-btn" disabled={chatLoading || !chatInput.trim()}>
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
