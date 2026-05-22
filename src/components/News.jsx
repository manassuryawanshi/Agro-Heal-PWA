import React, { useState, useEffect } from 'react';
import { Share2, BookOpen, AlertCircle, Award, ChevronDown, ChevronUp, Sparkles, TrendingUp, Loader, Rss } from 'lucide-react';
import { newsArticles as mockNewsArticles } from '../data/mockData';

// --- HTML Cleaning & Paragraph Extraction helper ---
const cleanHtml = (html) => {
  if (!html) return '';
  if (typeof html !== 'string') return String(html);
  
  // Clean up CDATA blocks
  let text = html.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
  
  // Replace paragraph endings and breaks with line break tokens
  text = text
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<li>/gi, '• ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n\n');
    
  // Strip all other HTML tags
  text = text.replace(/<[^>]+>/g, '');
  
  // Replace multiple duplicate spaces/tabs
  text = text.replace(/[ \t]+/g, ' ');
  
  // Unescape standard HTML entities
  text = text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&mdash;/gi, '—')
    .replace(/&ndash;/gi, '–')
    .replace(/&rsquo;/gi, "'")
    .replace(/&ldquo;/gi, '"')
    .replace(/&rdquo;/gi, '"');
    
  // Split, trim, and filter out empty paragraph lines
  const paragraphs = text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
    
  return paragraphs.join('\n\n');
};

// --- Client-side news classification engine ---
const classifyArticle = (title, content) => {
  const text = (title + ' ' + content).toLowerCase();
  const categories = [];
  
  // 1. Weather Alert (हवामान व पाऊस)
  if (/हवामान|पाऊस|तापमान|थंडी|उष्णता|मान्सून|अवकाळी|गारा|weather|rain|forecast|monsoon|temp/i.test(text)) {
    categories.push({ id: 'weather', name: { en: 'Weather', mr: 'हवामान' }, emoji: '🌧️' });
  }
  
  // 2. Mandi Rates (बाजारभाव व भाव)
  if (/बाजारभाव|बाजार भाव|बाजार समिती|कांदा दर|सोयाबीन दर|दर वाढले|दर घसरले|mandi|rate|price|apmc|market/i.test(text)) {
    categories.push({ id: 'rates', name: { en: 'Rates', mr: 'बाजारभाव' }, emoji: '📈' });
  }
  
  // 3. Government Subsidy & Schemes (योजना व अनुदान)
  if (/योजना|अनुदान|कर्जमाफी|कर्ज|पीएम किसान|नमो शेतकरी|scheme|subsidy|loan|sarkar|government|शासन/i.test(text)) {
    categories.push({ id: 'subsidy', name: { en: 'Schemes', mr: 'योजना' }, emoji: '🪙' });
  }
  
  // 4. Pest Control (कीड व रोग)
  if (/कीड|रोग|अळी|लष्करी|बोंडअळी|फवारणी|नाशक|औषध|pest|disease|spray|pesticide|infest/i.test(text)) {
    categories.push({ id: 'pest', name: { en: 'Pests', mr: 'कीड व रोग' }, emoji: '🐛' });
  }
  
  // 5. Livestock / Dairy (पशुपालन)
  if (/गाई|गाय|म्हशी|म्हैस|दूध|डेअरी|शेळी|मेंढी|पशुपालन|कुक्कुटपालन|कोंबड्या|livestock|dairy|cow|goat|veterinary/i.test(text)) {
    categories.push({ id: 'livestock', name: { en: 'Livestock', mr: 'पशुपालन' }, emoji: '🐄' });
  }
  
  // 6. Default general crop advisory (कृषी सल्ला)
  if (categories.length === 0) {
    categories.push({ id: 'crop', name: { en: 'Advisory', mr: 'कृषी सल्ला' }, emoji: '🌿' });
  }
  
  return categories;
};

// --- Process / enrich raw news feed schema ---
const processArticles = (rawArticles) => {
  return rawArticles.map((art, index) => {
    const titleEn = art.title?.en || art.title || '';
    const titleMr = art.title?.mr || art.title || '';
    const contentEn = art.content?.en || art.content || art.description || '';
    const contentMr = art.content?.mr || art.content || art.description || '';
    const summaryEn = art.summary?.en || art.summary || art.description || '';
    const summaryMr = art.summary?.mr || art.summary || art.description || '';
    
    const cleanContentEn = cleanHtml(contentEn);
    const cleanContentMr = cleanHtml(contentMr);
    const cleanSummaryEn = cleanHtml(summaryEn).slice(0, 120) + '...';
    const cleanSummaryMr = cleanHtml(summaryMr).slice(0, 120) + '...';
    
    // Categorize
    const cats = classifyArticle(titleMr + ' ' + titleEn, cleanContentMr + ' ' + cleanContentEn);
    
    // Tag based on primary category
    let tag = art.tag || { en: 'Agri News', mr: 'कृषी बातमी' };
    if (cats.length > 0) {
      tag = { en: cats[0].name.en, mr: cats[0].name.mr };
    }
    
    return {
      ...art,
      id: art.id || `processed_${index}`,
      tag,
      date: art.date || new Date().toLocaleDateString(),
      readTime: art.readTime || { en: '5 min read', mr: '५ मिनिटे' },
      title: { en: titleEn, mr: titleMr },
      summary: { en: cleanSummaryEn, mr: cleanSummaryMr },
      content: { en: cleanContentEn, mr: cleanContentMr },
      categories: cats.map(c => c.id),
      categoryDetails: cats,
      crop: art.crop || 'all',
      district: art.district || 'all'
    };
  });
};

export default function News({ language, addLog, farmerProfile }) {
  const [filter, setFilter] = useState('all');
  const [expandedArticleId, setExpandedArticleId] = useState(null);
  const [whatsappSharedId, setWhatsappSharedId] = useState(null);
  const [newsArticles, setNewsArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch Live RSS News
  const fetchLiveNews = async () => {
    setIsLoading(true);
    addLog('[News Engine] Fetching ultra-fast live Agrowon feed (0 AI tokens used)...', 'info');
    
    try {
      const rssUrl = 'https://www.agrowon.com/feed';
      const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
      
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error('Network error fetching RSS');
      
      const data = await response.json();
      if (data.status !== 'ok') throw new Error('RSS conversion failed');
      
      const liveArticles = processArticles(data.items);
      setNewsArticles(liveArticles);
      
      const now = Date.now();
      setLastUpdated(now);
      
      // Cache for 2 hours
      localStorage.setItem('agroheal_ai_news_v4', JSON.stringify({
        timestamp: now,
        articles: liveArticles
      }));
      
      addLog('[News Engine] Successfully loaded Live Agrowon Marathi News.', 'success');
    } catch (err) {
      addLog(`[News Engine] Live Agrowon fetch failed: ${err.message}. Reverting to offline data.`, 'error');
      const offlineArticles = processArticles(mockNewsArticles);
      setNewsArticles(offlineArticles);
    } finally {
      setIsLoading(false);
    }
  };

  // Load and refresh news feed on mount
  useEffect(() => {
    const stored = localStorage.getItem('agroheal_ai_news_v4');
    let cacheLoaded = false;
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.articles && parsed.articles.length > 0) {
          setNewsArticles(parsed.articles);
          setLastUpdated(parsed.timestamp);
          cacheLoaded = true;
          addLog('[News Engine] Loaded news instantly from local cache.', 'success');
        }
      } catch (err) {
        console.warn('Failed to parse cached news:', err);
      }
    }
    
    // Always query live feed in the background (or foreground if cache is empty)
    if (!cacheLoaded) {
      fetchLiveNews();
    } else {
      const fetchBg = async () => {
        try {
          const rssUrl = 'https://www.agrowon.com/feed';
          const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
          const response = await fetch(proxyUrl);
          if (!response.ok) return;
          const data = await response.json();
          if (data.status !== 'ok') return;
          
          const liveArticles = processArticles(data.items);
          setNewsArticles(liveArticles);
          const now = Date.now();
          setLastUpdated(now);
          localStorage.setItem('agroheal_ai_news_v4', JSON.stringify({
            timestamp: now,
            articles: liveArticles
          }));
          addLog('[News Engine] Background news refresh complete.', 'info');
        } catch (err) {
          console.warn('Background news refresh failed:', err);
        }
      };
      fetchBg();
    }
  }, []);

  // Compute active category tabs present in current day's articles
  const getDynamicCategories = () => {
    const foundIds = new Set();
    const cats = [];
    
    // Always include 'All' category first
    cats.push({ id: 'all', name: { en: 'All', mr: 'सर्व' }, emoji: '📰' });
    
    newsArticles.forEach(art => {
      if (art.categoryDetails) {
        art.categoryDetails.forEach(cat => {
          if (!foundIds.has(cat.id)) {
            foundIds.add(cat.id);
            cats.push(cat);
          }
        });
      }
    });
    
    return cats;
  };

  const activeCategories = getDynamicCategories();

  // Reset tab selection if current active tab is absent in new dynamic activeCategories
  useEffect(() => {
    if (newsArticles.length > 0) {
      const isCurrentFilterActive = activeCategories.some(c => c.id === filter);
      if (!isCurrentFilterActive) {
        setFilter('all');
      }
    }
  }, [newsArticles]);

  // Filtering logic
  const filteredArticles = newsArticles.filter((article) => {
    if (filter === 'all') return true;
    return article.categories && article.categories.includes(filter);
  });

  // Identify personalized matches for crop or district
  const recommendedArticle = farmerProfile
    ? newsArticles.find(art => 
        (art.crop && farmerProfile.crop && art.crop.toLowerCase() === farmerProfile.crop.toLowerCase()) || 
        (art.district && farmerProfile.district && art.district.toLowerCase() === farmerProfile.district.toLowerCase())
      )
    : null;

  const handleShareWhatsApp = (article) => {
    const title = language === 'en' ? article.title.en : article.title.mr;
    const summary = language === 'en' ? article.summary.en : article.summary.mr;
    const content = language === 'en' ? article.content.en : article.content.mr;
    const tag = language === 'en' ? article.tag.en : article.tag.mr;

    // WhatsApp uses * for bold, _ for italic
    const textToShare = `*${title}*
_${tag}_ | ${article.date}

*${language === 'en' ? 'Summary:' : 'थोडक्यात:'}*
${summary}

*${language === 'en' ? 'Detailed Article:' : 'सविस्तर बातमी:'}*
${content}

---
Shared via *Agro Heal* 🌾`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(textToShare)}`;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = whatsappUrl;
    } else {
      window.open(whatsappUrl, '_blank');
    }

    setWhatsappSharedId(article.id);
    addLog(`[Social Share] Shared to WhatsApp: ${article.title.en}`, 'success');
    setTimeout(() => {
      setWhatsappSharedId(null);
    }, 3000);
  };

  const toggleExpand = (id) => {
    setExpandedArticleId(expandedArticleId === id ? null : id);
  };

  return (
    <>
      {/* Screen Title */}
      <div className="screen-header" style={{ marginBottom: '16px' }}>
        <h2>{language === 'en' ? 'News & Schemes Feed' : 'बातम्या व सरकारी योजना'}</h2>
        <p style={{ color: 'var(--t3)', fontSize: '13px' }}>
          {language === 'en' ? 'Personalized subsidies, crop warnings & agricultural news' : 'तुमच्या पिकाशी संबंधित इशारे, अनुदान योजना आणि ताज्या कृषी घडामोडी'}
        </p>
      </div>

      {/* Dynamic Filter Tabs */}
      {newsArticles.length > 0 && (
        <div className="forecast-tab-row" style={{
          display: 'flex',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          background: 'var(--sunken)',
          padding: '4px',
          borderRadius: 'var(--r-md)',
          marginBottom: '16px',
          gap: '6px',
          scrollbarWidth: 'none'
        }}>
          {activeCategories.map((cat) => (
            <button
              key={cat.id}
              className={`forecast-tab ${filter === cat.id ? 'active' : ''}`}
              onClick={() => setFilter(cat.id)}
              style={{
                flex: '1 0 auto',
                padding: '8px 14px',
                whiteSpace: 'nowrap',
                fontSize: '12px',
                fontWeight: '700',
                border: 'none',
                borderRadius: '9px',
                background: filter === cat.id ? 'var(--card)' : 'none',
                color: filter === cat.id ? 'var(--brand)' : 'var(--t3)',
                boxShadow: filter === cat.id ? 'var(--s0)' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{cat.emoji}</span>
              <span>{language === 'en' ? cat.name.en : cat.name.mr}</span>
            </button>
          ))}
        </div>
      )}

      {/* Featured Personalized Recommendation Box */}
      {recommendedArticle && filter === 'all' && !isLoading && (
        <div
          className="promo-card"
          style={{
            background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
            border: '1px solid #81c784',
            borderRadius: '14px',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: 'var(--s1)',
            marginBottom: '16px'
          }}
          onClick={() => toggleExpand(recommendedArticle.id)}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '9px', fontWeight: '800', background: 'var(--primary)', color: '#fff', padding: '2px 8px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Sparkles size={9} />
              {language === 'en' ? 'RECOMMENDED FOR YOU' : 'तुमच्यासाठी शिफारस'}
            </span>
            <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--primary-dark)' }}>
              🎯 {language === 'en' ? `Matches Profile` : `प्रोफाईलनुसार`}
            </span>
          </div>
          <h4 style={{ fontSize: '14px', fontWeight: '850', color: 'var(--text-dark)', marginTop: '2px', lineHeight: '1.4' }}>
            {language === 'en' ? recommendedArticle.title.en : recommendedArticle.title.mr}
          </h4>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            {language === 'en' ? recommendedArticle.summary.en : recommendedArticle.summary.mr}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '11px', borderTop: '1px solid rgba(129,199,132,0.3)', paddingTop: '8px' }}>
            <span style={{ color: 'var(--primary-dark)', fontWeight: '700' }}>
              📖 {language === 'en' ? 'Click to read full details' : 'सविस्तर वाचण्यासाठी क्लिक करा'}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>
              {language === 'en' ? recommendedArticle.readTime.en : recommendedArticle.readTime.mr}
            </span>
          </div>
        </div>
      )}

      {/* Loading Skeleton State */}
      {isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '10px 4px' }}>
          {[1, 2, 3].map((n) => (
            <div key={n} className="news-article-card" style={{
              background: '#fff',
              border: '1px solid var(--border-light)',
              borderRadius: '14px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ width: '60px', height: '16px', borderRadius: '8px', background: '#f0f2ec', animation: 'pulse 1.5s infinite ease-in-out' }} />
                <div style={{ width: '80px', height: '12px', borderRadius: '6px', background: '#f0f2ec', animation: 'pulse 1.5s infinite ease-in-out' }} />
              </div>
              <div style={{ width: '85%', height: '18px', borderRadius: '4px', background: '#f0f2ec', animation: 'pulse 1.5s infinite ease-in-out', marginTop: '4px' }} />
              <div style={{ width: '100%', height: '14px', borderRadius: '4px', background: '#f0f2ec', animation: 'pulse 1.5s infinite ease-in-out' }} />
              <div style={{ width: '45%', height: '14px', borderRadius: '4px', background: '#f0f2ec', animation: 'pulse 1.5s infinite ease-in-out' }} />
            </div>
          ))}
        </div>
      )}

      {/* Main Articles Stack */}
      {!isLoading && (
        <div className="news-feed-stack" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredArticles.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontSize: '13px' }}>
              {language === 'en' ? 'No active articles in this category today.' : 'या प्रवर्गातील कोणतीही ताजी बातमी उपलब्ध नाही.'}
            </div>
          )}
          {filteredArticles.map((article) => {
            const isExpanded = expandedArticleId === article.id;
            const isShared = whatsappSharedId === article.id;
            
            // Highlight color based on category
            const isWeather = article.categories && article.categories.includes('weather');
            const isRates = article.categories && article.categories.includes('rates');
            const isPest = article.categories && article.categories.includes('pest');
            const isSubsidy = article.categories && article.categories.includes('subsidy');

            return (
              <div 
                key={article.id} 
                className="news-article-card"
                style={{
                  background: '#fff',
                  border: '1px solid var(--border-light)',
                  borderRadius: '14px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s ease',
                  borderColor: isExpanded ? 'var(--brand)' : 'var(--border-light)'
                }}
              >
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      fontSize: '9.5px',
                      fontWeight: '800',
                      padding: '3px 10px',
                      borderRadius: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px',
                      background: isWeather ? 'rgba(0,122,255,0.08)' : isRates ? '#e3f2fd' : isPest ? 'var(--color-danger-bg)' : isSubsidy ? 'var(--color-warning-bg)' : 'var(--brand-tint)',
                      color: isWeather ? 'var(--sys-blue)' : isRates ? '#1565c0' : isPest ? 'var(--color-danger)' : isSubsidy ? '#b45309' : 'var(--brand)'
                    }}
                  >
                    {language === 'en' ? article.tag.en : article.tag.mr}
                  </span>

                  <div style={{ display: 'flex', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{language === 'en' ? article.readTime.en : article.readTime.mr}</span>
                  </div>
                </div>

                {/* Title Section */}
                <h3 
                  onClick={() => toggleExpand(article.id)}
                  style={{
                    fontSize: '15px',
                    fontWeight: '800',
                    color: 'var(--text-dark)',
                    lineHeight: '1.45',
                    cursor: 'pointer',
                    transition: 'color 0.15s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--brand)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dark)'}
                >
                  {language === 'en' ? article.title.en : article.title.mr}
                </h3>

                {/* Summary */}
                {!isExpanded && (
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                    {language === 'en' ? article.summary.en : article.summary.mr}
                  </p>
                )}

                {/* Expanded Detailed Layout with properSpacing and paragraphs */}
                {isExpanded && (
                  <div 
                    style={{
                      padding: '16px',
                      background: '#fcfdfa',
                      borderLeft: '4px solid var(--brand)',
                      borderRadius: 'var(--r-md)',
                      fontSize: '14.5px',
                      lineHeight: '1.65',
                      color: 'var(--t2)',
                      marginTop: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      boxShadow: 'var(--inset)',
                      animation: 'fadeIn 0.25s ease'
                    }}
                  >
                    {(language === 'en' ? article.content.en : article.content.mr)
                      .split('\n\n')
                      .filter(p => p.trim().length > 0)
                      .map((para, pIdx) => (
                        <p key={pIdx} style={{ margin: 0, padding: 0 }}>
                          {para}
                        </p>
                      ))
                    }
                  </div>
                )}

                {/* Actions Footer */}
                <div 
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid #f4f6f3',
                    paddingTop: '10px',
                    marginTop: '6px'
                  }}
                >
                  {/* Read More Accordion */}
                  <button
                    onClick={() => toggleExpand(article.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--brand-mid)',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '2px 0'
                    }}
                  >
                    <BookOpen size={13} />
                    {isExpanded 
                      ? (language === 'en' ? 'Collapse Article' : 'कमी दाखवा') 
                      : (language === 'en' ? 'Read Full Article' : 'सविस्तर वाचा')}
                    {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>

                  {/* Share Button */}
                  <button
                    onClick={() => handleShareWhatsApp(article)}
                    style={{
                      background: isShared ? 'var(--color-success)' : '#25D366',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '20px',
                      padding: '6px 12px',
                      fontSize: '11px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                  >
                    <Share2 size={12} />
                    {isShared 
                      ? (language === 'en' ? 'Shared!' : 'शेअर झाले!') 
                      : (language === 'en' ? 'WhatsApp' : 'व्हॉट्सॲप')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer RSS Details */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center', margin: '20px 0 10px', opacity: 0.6 }}>
        <Rss size={13} color="var(--brand)" />
        <span style={{ fontSize: '10.5px', fontWeight: '700', color: 'var(--text-muted)' }}>
          {language === 'en' 
            ? `Agrowon Live • Fresh updates every 30m` 
            : `ॲग्रोवन थेट बुलेटिन • दर ३० मिनिटांनी अपडेट`}
        </span>
      </div>
    </>
  );
}
