import { apmcRates as fallbackApmcRates } from './mockData';

const DATA_GOV_API_KEY = '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';
const CACHE_KEY = 'agroheal_live_apmc_rates_v1';

// Basic english to marathi dictionary for common crops and districts
const translationMap = {
  // Crops
  'Cotton': 'कापूस',
  'Soybean': 'सोयाबीन',
  'Soyabean': 'सोयाबीन',
  'Maize': 'मका',
  'Wheat': 'गहू',
  'Chickpeas': 'हरभरा',
  'Bengal Gram(Gram)(Whole)': 'हरभरा',
  'Onion': 'कांदा',
  'Sugarcane': 'ऊस',
  'Turmeric': 'हळद',
  'Tomato': 'टोमॅटो',
  'Potato': 'बटाटा',
  'Green Chilli': 'हिरवी मिरची',
  'Pigeon Pea (Red Gram/Arhar)': 'तूर',
  'Black Gram (Urd Beans)(Whole)': 'उडीद',
  'Green Gram (Moong)(Whole)': 'मूग',
  'Groundnut': 'भुईमूग',
  
  // Districts
  'Akola': 'अकोला',
  'Nagpur': 'नागपूर',
  'Pune': 'पुणे',
  'Solapur': 'सोलापूर',
  'Nashik': 'नाशिक',
  'Jalgaon': 'जळगाव',
  'Aurangabad': 'छत्रपती संभाजीनगर',
  'Ratnagiri': 'रत्नागिरी',
  'Ahmednagar': 'अहमदनगर',
  'Amravati': 'अमरावती',
  'Buldhana': 'बुलढाणा',
  'Chandrapur': 'चंद्रपूर',
  'Dhule': 'धुळे',
  'Kolhapur': 'कोल्हापूर',
  'Latur': 'लातूर',
  'Nanded': 'नांदेड',
  'Osmanabad': 'धाराशिव',
  'Parbhani': 'परभणी',
  'Sangli': 'सांगली',
  'Satara': 'सातारा',
  'Wardha': 'वर्धा',
  'Washim': 'वाशीम',
  'Yavatmal': 'यवतमाळ'
};

const translate = (text) => translationMap[text] || text;

const isSupportedCrop = (cropName) => {
  return !!translationMap[cropName];
};

export const fetchLiveApmcRates = async (addLog = () => {}, forceRefresh = false) => {
  try {
    if (!forceRefresh) {
      const stored = localStorage.getItem(CACHE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Cache for 4 hours
        if (Date.now() - parsed.timestamp < 4 * 60 * 60 * 1000) {
          addLog('[APMC Engine] Loaded live rates from local cache.', 'success');
          return { data: parsed.data, isLive: true };
        }
      }
    }

    addLog('[APMC Engine] Fetching real-time market rates from data.gov.in...', 'info');
    
    // Fetch Maharashtra Data
    const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${DATA_GOV_API_KEY}&format=json&filters[state]=Maharashtra&limit=2000`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Network error: ${response.status}`);
    
    const json = await response.json();
    if (json.status !== 'ok') throw new Error('Data.gov.in API returned error');

    if (json.records && json.records.length > 0) {
      // Map API records to our internal format and filter out unsupported crops
      const liveData = json.records
        .map((record) => {
          const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '';
          const district = capitalize(record.district);
          const crop = capitalize(record.commodity);
          
          return {
            district: district,
            districtMr: translate(district),
            market: record.market,
            crop: crop,
            cropMr: translate(record.commodity), 
            minPrice: parseFloat(record.min_price) || 0,
            maxPrice: parseFloat(record.max_price) || 0,
            modalPrice: parseFloat(record.modal_price) || 0,
            arrivalDate: record.arrival_date,
            trend: 'stable',
            trendReason: {
              en: `Live data from ${record.market} Market.`,
              mr: `${record.market} बाजार समितीचा थेट डेटा.`
            },
            isLive: true,
            originalCropName: record.commodity
          };
        })
        .filter(record => isSupportedCrop(record.originalCropName) || isSupportedCrop(record.crop));

      if (liveData.length > 0) {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          timestamp: Date.now(),
          data: liveData
        }));

        addLog(`[APMC Engine] Successfully fetched ${liveData.length} live records for Maharashtra.`, 'success');
        return { data: liveData, isLive: true };
      }
    }
    
    addLog('[APMC Engine] No relevant live data available for Maharashtra today yet. Trying National data...', 'warning');
    
    // Fallback: Fetch national data if Maharashtra is empty
    const nationalUrl = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${DATA_GOV_API_KEY}&format=json&limit=2000`;
    const natResponse = await fetch(nationalUrl);
    if (natResponse.ok) {
      const natJson = await natResponse.json();
      if (natJson.records && natJson.records.length > 0) {
        const liveData = natJson.records
          .map((record) => {
            const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '';
            const district = `${capitalize(record.district)} (${capitalize(record.state)})`;
            const crop = capitalize(record.commodity);
            return {
              district: district,
              districtMr: district,
              market: record.market,
              crop: crop,
              cropMr: translate(record.commodity), 
              minPrice: parseFloat(record.min_price) || 0,
              maxPrice: parseFloat(record.max_price) || 0,
              modalPrice: parseFloat(record.modal_price) || 0,
              arrivalDate: record.arrival_date,
              trend: 'stable',
              trendReason: {
                en: `Live data from ${record.market} Market.`,
                mr: `${record.market} बाजार समितीचा थेट डेटा.`
              },
              isLive: true,
              originalCropName: record.commodity
            };
          })
          .filter(record => isSupportedCrop(record.originalCropName) || isSupportedCrop(record.crop));
        
        if (liveData.length > 0) {
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            timestamp: Date.now(),
            data: liveData
          }));
          
          addLog(`[APMC Engine] Successfully fetched ${liveData.length} relevant National live records.`, 'success');
          return { data: liveData, isLive: true };
        }
      }
    }
    
    addLog('[APMC Engine] Relevant national data also empty. Using offline historical data.', 'warning');
    return { data: fallbackApmcRates, isLive: false };
  } catch (error) {
    addLog(`[APMC Engine] Live API fetch failed: ${error.message}. Using offline data.`, 'error');
    return { data: fallbackApmcRates, isLive: false };
  }
};
