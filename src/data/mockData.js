// Mock Database for Agro Heal Local Prototype (English & Marathi support)

export const cropDiseases = {
  cotton_blight: {
    id: "cotton_blight",
    crop: { en: "Cotton", mr: "कापूस" },
    name: { en: "Bacterial Leaf Blight", mr: "जिवाणूजन्य करपा रोग" },
    scientificName: "Xanthomonas citri pv. malvacearum",
    severity: "High",
    symptoms: {
      en: "Water-soaked angular spots on leaves, turning brown to black. Leaves may yellow and drop prematurely. Can cause black arm on stems and boll rot.",
      mr: "पानांवर कोनीय पाणीदार डाग पडतात, जे नंतर तपकिरी ते काळे होतात. पाने पिवळी पडून अकाली गळू शकतात. यामुळे फांद्या काळ्या पडणे आणि बोंड सडणे असे प्रकार होऊ शकतात."
    },
    organicRemedy: {
      en: "Spray copper oxychloride (3g/liter of water) mixed with streptocycline (1g/10 liters). Apply neem seed kernel extract (5%) as a preventive measure.",
      mr: "कॉपर ऑक्सीक्लोराईड (३ ग्रॅम/लीटर पाणी) आणि स्ट्रेप्टोसायक्लीन (१ ग्रॅम/१० लीटर पाणी) एकत्र करून फवारणी करा. प्रतिबंधात्मक उपाय म्हणून ५% निंबोळी अर्काची फवारणी करा."
    },
    chemicalRemedy: {
      en: "If infection is severe, spray bactericides containing Streptomycin sulphate and Tetracycline hydrochloride under agricultural officer guidance.",
      mr: "प्रादुर्भाव जास्त असल्यास, कृषी अधिकाऱ्यांच्या मार्गदर्शनाखाली स्ट्रेप्टोमायसिन सल्फेट आणि टेट्रासायक्लीन हायड्रोक्लोराईड घटक असलेल्या जंतुनाशकाची फवारणी करा."
    },
    prevention: {
      en: "Use certified disease-free seeds. Avoid overhead irrigation. Destroy crop debris after harvest to prevent winter survival.",
      mr: "प्रमाणित रोगमुक्त बियाणे वापरा. तुषार सिंचन टाळा. हिवाळ्यात रोग पसरू नये म्हणून काढणीनंतर पिकाचे अवशेष नष्ट करा."
    },
    products: [
      {
        id: "prod_copper_oxychloride",
        name: { en: "Syngenta Blue Copper Fungicide", mr: "सिंजेंटा ब्लू कॉपर बुरशीनाशक" },
        brand: "Syngenta",
        price: 420,
        size: "500 g",
        dosage: { en: "2.5 g per Liter of water", mr: "२.५ ग्रॅम प्रति लीटर पाणी" },
        imageCode: "copper"
      },
      {
        id: "prod_streptocycline",
        name: { en: "Tata Blitox Fights Blight", mr: "टाटा ब्लायटॉक्स नियंत्रण" },
        brand: "Tata Rallis",
        price: 380,
        size: "500 g",
        dosage: { en: "3 g per Liter of water", mr: "३ ग्रॅम प्रति लीटर पाणी" },
        imageCode: "blitox"
      }
    ]
  },
  cotton_curl: {
    id: "cotton_curl",
    crop: { en: "Cotton", mr: "कापूस" },
    name: { en: "Leaf Curl Virus (CLCuV)", mr: "पाने आकसणारा व्हायरस (पर्णगुच्छ)" },
    scientificName: "Begomovirus",
    severity: "Critical",
    symptoms: {
      en: "Upward or downward curling of leaf margins, thickening of veins, and leaf-like enations on the underside of leaves. Severe stunting of plants.",
      mr: "पानांच्या कडा वरच्या किंवा खालच्या बाजूला वळतात, शिरा जाड होतात आणि पानाच्या मागील बाजूला कपसारखी वाढ दिसून येते. झाडांची वाढ खुंटते."
    },
    organicRemedy: {
      en: "Control whiteflies (the vector) by spraying neem oil (10,000 ppm) at 2-3 ml/liter. Install yellow sticky traps (10-15 per acre) to catch adult insects.",
      mr: "व्हायरस पसरवणाऱ्या पांढऱ्या माशीवर नियंत्रण ठेवण्यासाठी १०,००० ppm निंबोळी तेलाची २-३ मिली/लीटर पाण्यात मिसळून फवारणी करा. एकरी १०-१५ पिवळे चिकट सापळे लावा."
    },
    chemicalRemedy: {
      en: "Spray systemic insecticides like Imidacloprid (0.3 ml/liter) or Acetamiprid (0.2g/liter) to manage the whitefly population early in the season.",
      mr: "पांढऱ्या माशीच्या नियंत्रणासाठी सुरुवातीच्या काळात इमिडाक्लोप्रिड (०.३ मिली/लीटर) किंवा ॲसिटामिप्रीड (०.२ ग्रॅम/लीटर) या आंतरप्रवाही कीटकनाशकाची फवारणी करा."
    },
    prevention: {
      en: "Grow resistant cultivars. Keep the fields and borders free from weeds that host the whitefly and virus. Avoid late sowing.",
      mr: "रोगप्रतिकारक वाणांची लागवड करा. शेतातील आणि बांधावरील तण नष्ट करा कारण ते पांढऱ्या माशी आणि व्हायरसला आश्रय देतात. उशिरा पेरणी टाळा."
    },
    products: [
      {
        id: "prod_confidor",
        name: { en: "Bayer Confidor Insecticide", mr: "बायर कॉन्फिडॉर कीटकनाशक" },
        brand: "Bayer CropScience",
        price: 290,
        size: "100 ml",
        dosage: { en: "0.3 ml per Liter of water", mr: "०.३ मिली प्रति लीटर पाणी" },
        imageCode: "confidor"
      },
      {
        id: "prod_tafgor",
        name: { en: "Tata Tafgor (Dimethoate 30% EC)", mr: "टाटा टॅफगोर (डायमेथोएट ३०% ईसी)" },
        brand: "Tata Rallis",
        price: 310,
        size: "250 ml",
        dosage: { en: "2 ml per Liter of water", mr: "२ मिली प्रति लीटर पाणी" },
        imageCode: "tafgor"
      }
    ]
  },
  cotton_healthy: {
    id: "cotton_healthy",
    crop: { en: "Cotton", mr: "कापूस" },
    name: { en: "Healthy Crop", mr: "निरोगी पीक" },
    symptoms: {
      en: "No symptoms of infection or pest damage observed. Leaves are vibrant green and veins are clear. Bolls are developing well.",
      mr: "कोणत्याही रोगाची किंवा कीड प्रादुर्भावाची लक्षणे दिसत नाहीत. पाने गडद हिरवी असून शिरा स्पष्ट आहेत. बोंडे उत्तम प्रकारे वाढत आहेत."
    },
    organicRemedy: {
      en: "Apply balanced organic fertilizers (Compost, Vermicompost). Continue routine monitoring and clean weeding.",
      mr: "संतुलित सेंद्रिय खतांचा (कंपोस्ट, गांडूळ खत) वापर करा. नियमित पाहणी आणि वेळोवेळी खुरपणी चालू ठेवा."
    },
    chemicalRemedy: {
      en: "No chemical application needed. Monitor weather forecasts for humidity rises which could trigger fungal growth.",
      mr: "कोणत्याही रासायनिक फवारणीची गरज नाही. बुरशीजन्य रोग टाळण्यासाठी हवेतील आर्द्रतेच्या अंदाजावर लक्ष ठेवा."
    },
    prevention: {
      en: "Maintain proper spacing. Ensure adequate irrigation without waterlogging. Keep tools clean.",
      mr: "झाडांमध्ये योग्य अंतर ठेवा. पाणी साचू न देता योग्य सिंचन करा. शेतीची अवजारे स्वच्छ ठेवा."
    },
    products: []
  },
  corn_rust: {
    id: "corn_rust",
    crop: { en: "Corn (Maize)", mr: "मका" },
    name: { en: "Common Rust", mr: "तांबेरा रोग (रस्ट)" },
    scientificName: "Puccinia sorghi",
    severity: "Medium",
    symptoms: {
      en: "Golden-brown to reddish-orange powdery pustules on both upper and lower surfaces of leaves. Heavily infected leaves turn yellow and dry up.",
      mr: "पानांच्या दोन्ही बाजूंवर सोनेरी-तपकिरी ते लालसर-नारंगी रंगाचे पावडरसारखे फोड येतात. तीव्र प्रादुर्भावामुळे पाने पिवळी पडून वाळून जातात."
    },
    organicRemedy: {
      en: "Apply sulphur dust (3g/liter) or spray diluted sour buttermilk (50ml/liter) as a traditional antifungal treatment. Ensure wider plant spacing.",
      mr: "गंधकाची (३ ग्रॅम/लीटर) फवारणी करा किंवा जुने आंबट ताक (५० मिली/लीटर पाण्यात) फवारणी करा. झाडांमध्ये योग्य अंतर ठेवा जेणेकरून हवा खेळती राहील."
    },
    chemicalRemedy: {
      en: "Spray fungicides like Mancozeb (2g/liter) or Tebuconazole (1 ml/liter) as soon as the first pustules appear.",
      mr: "तांबेराची सुरुवातीची लक्षणे दिसताच मॅन्कोझेब (२ ग्रॅम/लीटर) किंवा टेब्युकोनॅझोल (१ मिली/लीटर) या बुरशीनाशकाची फवारणी करा."
    },
    prevention: {
      en: "Rotate crops with non-cereal crops. Clean tillage after harvest. Plant rust-resistant hybrids recommended for Maharashtra.",
      mr: "पिकांची फेरपालट करा (तृणधान्य नसलेली पिके घ्या). काढणीनंतर शेताची चांगली नांगरणी करा. महाराष्ट्रासाठी शिफारस केलेले रोगप्रतिकारक संकरित वाण पेरा."
    },
    products: [
      {
        id: "prod_nativo",
        name: { en: "Bayer Nativo Fungicide", mr: "बायर नेटीव्हो बुरशीनाशक" },
        brand: "Bayer CropScience",
        price: 760,
        size: "100 g",
        dosage: { en: "1 g per Liter of water", mr: "१ ग्रॅम प्रति लीटर पाणी" },
        imageCode: "nativo"
      },
      {
        id: "prod_amistar",
        name: { en: "Syngenta Amistar Fungicide", mr: "सिंजेंटा अमिस्टार बुरशीनाशक" },
        brand: "Syngenta",
        price: 950,
        size: "200 ml",
        dosage: { en: "1 ml per Liter of water", mr: "१ मिली प्रति लीटर पाणी" },
        imageCode: "amistar"
      }
    ]
  },
  corn_healthy: {
    id: "corn_healthy",
    crop: { en: "Corn (Maize)", mr: "मका" },
    name: { en: "Healthy Crop", mr: "निरोगी पीक" },
    symptoms: {
      en: "Broad, thick leaves with solid green pigmentation. Stalk is sturdy and ears are forming uniformly with well-developed silk.",
      mr: "रुंद, जाड आणि पूर्ण हिरवी पाने आहेत. खोड मजबूत असून कणसे एकसमान आकारात आणि चांगल्या केसाळ तंतूंसह वाढत आहेत."
    },
    organicRemedy: {
      en: "Provide nitrogen-rich organic mulches or liquid seaweed extract to sustain high growth and optimal kernel filling.",
      mr: "पिकाच्या जोमदार वाढीसाठी आणि दाणे भरण्यासाठी नत्रयुक्त सेंद्रिय आच्छादन किंवा द्रव स्वरूपातील शेवाळ अर्काचा वापर करा."
    },
    chemicalRemedy: {
      en: "No chemical sprays required. Maintain regular top-dressing of Urea if practicing conventional farming.",
      mr: "रासायनिक फवारणीची गरज नाही. पारंपारिक शेती करत असल्यास युरियाचा पहिला हप्ता वेळेवर द्या."
    },
    prevention: {
      en: "Ensure good drainage. Monitor for early signs of fall armyworm in the whorl.",
      mr: "शेतात पाण्याचा उत्तम निचरा ठेवा. पोंग्यातील लष्करी अळीच्या सुरुवातीच्या प्रादुर्भावावर बारकाईने लक्ष ठेवा."
    },
    products: []
  }
};

export const livestockSickness = {
  cow: [
    {
      id: "lumpy_skin",
      name: { en: "Lumpy Skin Disease (LSD)", mr: "लम्पी त्वचा रोग (LSD)" },
      severity: "High",
      matchKeywords: ["nodule", "fever", "skin", "lump", "blister", "गाठ", "ताप", "त्वचा", "फोड", "जखम"],
      symptoms: {
        en: "High fever, discharge from eyes and nose, salivation, and characteristic hard, round nodules (2-5 cm) all over the skin. Loss of appetite and reduced milk yield.",
        mr: "तीव्र ताप, डोळे आणि नाकातून पाणी येणे, तोंडावाटे लाळ गळणे, आणि संपूर्ण शरीरावर गोल व कडक गाठी (२ ते ५ सेंमी) येणे. भूक मंदावणे आणि दूध देण्याची क्षमता कमी होणे."
      },
      firstAid: {
        en: "Strictly isolate the infected animal. Apply neem paste with turmeric on ruptured skin lesions. Keep cowshed vector-free (flies, mosquitoes, ticks) using neem smoke.",
        mr: "बाधित जनावराला तात्काळ वेगळे (क्वारंटाईन) करा. फुटलेल्या गाठींवर हळद आणि कडुनिंबाची पेस्ट लावा. कडुनिंबाचा धूर करून गोठ्यातील माश्या, डास आणि गोचीड नष्ट करा."
      },
      isolationSteps: {
        en: "Quarantine immediately for minimum 28 days. Restrict movement of personnel entering cowshed. Disinfect feed troughs with 2-3% sodium hypochlorite.",
        mr: "कमीत कमी २८ दिवस जनावराला इतर जनावरांपासून दूर ठेवा. गोठ्यात बाहेरच्या माणसांच्या येण्या-जाण्यावर बंदी घाला. जनावरांचे गोठे २-३% सोडिअम हायपोक्लोराईटने निर्जंतुक करा."
      },
      prescription: {
        en: "Give paracetamol (bolus) for fever control. Contact local government veterinary clinic for Lumpy Skin Goat Pox vaccination of healthy animals in 5km radius.",
        mr: "ताप कमी करण्यासाठी पॅरासिटामॉल गोळी (बोलस) द्या. ५ किमी परिसरातील निरोगी जनावरांना 'गोट पॉक्स' लस देण्यासाठी स्थानिक शासकीय पशुवैद्यकीय दवाखान्याशी संपर्क साधा."
      }
    },
    {
      id: "mastitis",
      name: { en: "Mastitis", mr: "स्तनदाह (मस्टायटीस / दगडी)" },
      severity: "Medium",
      matchKeywords: ["udder", "milk", "swelling", "teat", "blood in milk", "आचळ", "दूध", "सूज", "सड", "रक्त"],
      symptoms: {
        en: "Swollen, painful, and warm udder/teats. Milk becomes watery, yellowish, clotted, or contains flakes and traces of blood. Hardness of the udder.",
        mr: "सड किंवा आचळ सुजणे, गरम होणे आणि दुखणे. दुधाचा रंग बदलून ते पातळ, पिवळसर किंवा गुठळ्या असलेले होते. कधीकधी दुधातून रक्त येते. आचळ कडक (दगडासारखे) होते."
      },
      firstAid: {
        en: "Wash the udder with potassium permanganate solution before and after milking. Completely strip out milk from infected quarter frequently. Apply ice packs to reduce swelling.",
        mr: "दूध काढण्यापूर्वी व काढल्यानंतर सड पोटॅशियम परमँगनेटच्या पाण्याने स्वच्छ धुवा. बाधित सडातून वारंवार पूर्ण दूध पिळून घ्या. सूज कमी करण्यासाठी बर्फाने शेका."
      },
      isolationSteps: {
        en: "Always milk the diseased cow last to prevent spreading to other cows. Disinfect milker's hands and tools.",
        mr: "इतर जनावरांना संसर्ग होऊ नये म्हणून आजारी गाईचे दूध सर्वात शेवटी काढा. दूध काढणाऱ्या व्यक्तीचे हात आणि भांडी निर्जंतुक करा."
      },
      prescription: {
        en: "Consult a vet for intramammary infusion of antibiotics. Administer anti-inflammatory medicines (Meloxicam) to ease pain.",
        mr: "तातडीने पशुवैद्यकीय डॉक्टरांच्या सल्ल्याने सडामध्ये सोडण्याची प्रतिजैविके (Intramammary tubes) आणि वेदनाशामक औषधे (Meloxicam) द्या."
      }
    }
  ],
  goat: [
    {
      id: "ppr",
      name: { en: "Peste des Petits Ruminants (PPR / Goat Plague)", mr: "पीपीआर (शेळ्यांमधील देवी किंवा न्यूमोनिया)" },
      severity: "Critical",
      matchKeywords: ["diarrhea", "nasal discharge", "cough", "mouth sores", "शेळी", "ताप", "जुलाब", "नाकातून पाणी", "खोकला", "तोंड येत आहे"],
      symptoms: {
        en: "Sudden onset of high fever, watery eyes, heavy foul-smelling nasal discharge, coughing, sores in the mouth making eating painful, followed by severe, foul diarrhea.",
        mr: "अचानक तीव्र ताप येणे, डोळ्यातून पाणी येणे, नाकातून दुर्गंधीयुक्त दाट स्त्राव वाहणे, खोकला येणे, तोंडात व्रण व फोड येऊन चारा न खाणे, आणि नंतर तीव्र दुर्गंधीयुक्त जुलाब होणे."
      },
      firstAid: {
        en: "Isolate immediately. Provide soft, lukewarm, easily digestible food (gruel). Clean mouth sores with saline or potassium permanganate solution and apply glycerin mixed with borax.",
        mr: "तात्काळ शेळीला कळपापासून वेगळे करा. कोमट, मऊ आणि पचायला हलका चारा (पेज/कणकेची लापशी) द्या. शेळीचे तोंड मिठाच्या किंवा पोटॅशियम परमँगनेटच्या पाण्याने धुवून ग्लिसरीन आणि बोरॅक्सचे मिश्रण लावा."
      },
      isolationSteps: {
        en: "Strict quarantine. Do not allow goats to graze in common pastures. Bury dung and bedding materials deep in soil.",
        mr: "कडक अलगीकरण ठेवा. बाधित शेळ्यांना सार्वजनिक कुरणात चरण्यासाठी सोडू नका. विष्ठा आणि गोठ्यातील कचरा मातीत खोलवर पुरून टाका."
      },
      prescription: {
        en: "Primary supportive therapy with broad-spectrum antibiotics (to prevent secondary bacterial pneumonia) and fluid therapy if dehydrated. Vaccination is critical for healthy herds.",
        mr: "न्यूमोनिया टाळण्यासाठी पशुवैद्यांच्या सल्ल्याने अँटीबायोटिक्सचे इंजेक्शन आणि जुलाबांमुळे अशक्तपणा आल्यास सलाईन द्या. निरोगी शेळ्यांना पीपीआर प्रतिबंधात्मक लस टोचून घ्या."
      }
    }
  ],
  chicken: [
    {
      id: "ranikhet",
      name: { en: "Ranikhet (Newcastle Disease)", mr: "राणीखेत रोग (न्यूकॅसल डिसीज)" },
      severity: "Critical",
      matchKeywords: ["gasping", "green droppings", "twisting neck", "mortality", "कोंबडी", "श्वास", "हिरवी हगवण", "मान फिरणे", "मृत्यू"],
      symptoms: {
        en: "Gasping for breath, coughing, greenish-yellow watery droppings, wing paralysis, nervous signs like twisting of neck (torticollis), rapid drop in egg production, and up to 100% mortality.",
        mr: "कोंबडीने मान वर करून हापापणे (दम लागणे), खोकणे, पिवळसर-हिरवे जुलाब, पंख लुळे पडणे, मान वाकडी होणे (गोल फिरणे), अंड्यांचे उत्पादन अचानक थांबणे आणि कोंबड्या मोठ्या संख्येने मरणे."
      },
      firstAid: {
        en: "No effective cure once affected. Isolate the sick birds instantly. Add electrolytes and multi-vitamins (Vimerol) in clean drinking water for the rest of the flock.",
        mr: "हा रोग आल्यावर ठोस उपचार नाही. बाधित कोंबड्यांना लगेच वेगळे करा. निरोगी पक्षांच्या पिण्याच्या पाण्यात इलेक्ट्रोलाईट्स आणि जीवनसत्त्वे (उदा. विमिरॉल) मिसळून द्या."
      },
      isolationSteps: {
        en: "Complete quarantine of poultry shed. Burn and bury dead birds deep with lime. Restrict entry of visitors to the farm.",
        mr: "कुक्कुटपालन शेड पूर्णपणे क्वारंटाईन करा. मृत पक्षांना चुन्याच्या पावडरसह जमिनीत खोल पुरा किंवा जाळून टाका. शेडमध्ये बाहेरच्या व्यक्तींच्या प्रवेशावर पूर्ण बंदी घाला."
      },
      prescription: {
        en: "Vaccination is the only shield. Ensure early age vaccination schedules: Lasota strain at 5-7 days and R2B strain at 8-9 weeks of age under vet supervision.",
        mr: "लसीकरण हाच एकमेव पर्याय आहे. पशुवैद्यकीय सल्ल्यानुसार कोंबडीच्या ५-७ व्या दिवशी 'लासोटा' (Lasota) आणि ८-९ व्या आठवड्यात 'R2B' लस नक्की टोचून घ्या."
      }
    }
  ]
};

export const apmcRates = [
  { 
    district: "Akola", 
    districtMr: "अकोला", 
    crop: "Cotton", 
    cropMr: "कापूस", 
    minPrice: 6800, 
    maxPrice: 7650, 
    modalPrice: 7400, 
    trend: "up", 
    trendReason: {
      en: "High domestic ginning demand and lower physical market arrivals.",
      mr: "जिनींग कारखान्यांकडून वाढती स्थानिक मागणी आणि बाजारातील आवक मर्यादित."
    }
  },
  { 
    district: "Akola", 
    districtMr: "अकोला", 
    crop: "Soybean", 
    cropMr: "सोयाबीन", 
    minPrice: 4200, 
    maxPrice: 4750, 
    modalPrice: 4500, 
    trend: "down", 
    trendReason: {
      en: "Peak harvest season arrivals in Vidarbha pressing prices downwards.",
      mr: "विदर्भातील मुख्य काढणीच्या हंगामामुळे बाजारात सोयाबीनची भरपूर आवक."
    }
  },
  { 
    district: "Akola", 
    districtMr: "अकोला", 
    crop: "Maize", 
    cropMr: "मका", 
    minPrice: 1900, 
    maxPrice: 2200, 
    modalPrice: 2050, 
    trend: "stable", 
    trendReason: {
      en: "Steady procurement from regional poultry feed manufacturers.",
      mr: "प्रादेशिक कुक्कुटपालन खाद्य उत्पादकांकडून स्थिर दराने खरेदी सुरू."
    }
  },
  
  { 
    district: "Nagpur", 
    districtMr: "नागपूर", 
    crop: "Cotton", 
    cropMr: "कापूस", 
    minPrice: 6900, 
    maxPrice: 7700, 
    modalPrice: 7450, 
    trend: "up", 
    trendReason: {
      en: "Strong export queries and demand from textile spinning mills in South India.",
      mr: "दक्षिण भारतातील स्पिनिंग मिल आणि कापड गिरण्यांकडून मोठी निर्यात मागणी."
    }
  },
  { 
    district: "Nagpur", 
    districtMr: "नागपूर", 
    crop: "Soybean", 
    cropMr: "सोयाबीन", 
    minPrice: 4150, 
    maxPrice: 4800, 
    modalPrice: 4550, 
    trend: "down", 
    trendReason: {
      en: "High moisture content in newly harvested crop leading to discounted bidding.",
      mr: "नवीन मालामध्ये ओल किंवा दमटपणाचे प्रमाण जास्त असल्याने कमी बोली."
    }
  },
  { 
    district: "Nagpur", 
    districtMr: "नागपूर", 
    crop: "Wheat", 
    cropMr: "गहू", 
    minPrice: 2400, 
    maxPrice: 2850, 
    modalPrice: 2600, 
    trend: "stable", 
    trendReason: {
      en: "Adequate buffer stock allocations from FCI balancing the market.",
      mr: "भारतीय अन्न महामंडळामार्फत गव्हाचे वितरण सुरळीत असल्याने दर स्थिर."
    }
  },

  { 
    district: "Pune", 
    districtMr: "पुणे", 
    crop: "Maize", 
    cropMr: "मका", 
    minPrice: 1950, 
    maxPrice: 2300, 
    modalPrice: 2150, 
    trend: "up", 
    trendReason: {
      en: "Starch manufacturers and bio-ethanol processing units bidding higher rates.",
      mr: "स्टार्च उत्पादक आणि बायो-इथेनॉल प्रक्रिया प्रकल्पांकडून जादा दराने खरेदी."
    }
  },
  { 
    district: "Pune", 
    districtMr: "पुणे", 
    crop: "Wheat", 
    cropMr: "गहू", 
    minPrice: 2500, 
    maxPrice: 3100, 
    modalPrice: 2800, 
    trend: "stable", 
    trendReason: {
      en: "Premium Lokwan and Sharbati quality grain arrivals keeping local demand steady.",
      mr: "प्रीमियम लोकवान व शरबती गव्हाला स्थानिक बाजारात चांगली आणि स्थिर मागणी."
    }
  },
  { 
    district: "Pune", 
    districtMr: "पुणे", 
    crop: "Chickpeas", 
    cropMr: "हरभरा", 
    minPrice: 5100, 
    maxPrice: 5700, 
    modalPrice: 5400, 
    trend: "up", 
    trendReason: {
      en: "Festive season demand spike paired with lower import arrivals from global channels.",
      mr: "सणासुदीच्या खरेदीमुळे आणि परदेशातून होणाऱ्या आयातीत घट झाल्याने भाव तेजीत."
    }
  },

  { 
    district: "Solapur", 
    districtMr: "सोलापूर", 
    crop: "Maize", 
    cropMr: "मका", 
    minPrice: 1800, 
    maxPrice: 2150, 
    modalPrice: 2000, 
    trend: "down", 
    trendReason: {
      en: "Heavy inflows of low-cost feed maize from border districts of Karnataka.",
      mr: "कर्नाटकच्या सीमावर्ती भागातून कमी किमतीच्या मक्याची आवक वाढल्याने घसरण."
    }
  },
  { 
    district: "Solapur", 
    districtMr: "सोलापूर", 
    crop: "Chickpeas", 
    cropMr: "हरभरा", 
    minPrice: 5000, 
    maxPrice: 5600, 
    modalPrice: 5350, 
    trend: "stable", 
    trendReason: {
      en: "Stock limit controls implemented by wholesale retail distribution channels.",
      mr: "घाऊक व किरकोळ बाजारात मर्यादित साठा असल्यामुळे किंमती एका पातळीवर स्थिर."
    }
  },

  { 
    district: "Nashik", 
    districtMr: "नाशिक", 
    crop: "Soybean", 
    cropMr: "सोयाबीन", 
    minPrice: 4300, 
    maxPrice: 4700, 
    modalPrice: 4520, 
    trend: "down", 
    trendReason: {
      en: "Subdued global oilseed complex futures weighing on domestic market valuations.",
      mr: "जागतिक खाद्यतेल बाजारातील मंदीचा भारतीय स्थानिक बाजारभावांवर दबाव."
    }
  },
  { 
    district: "Nashik", 
    districtMr: "नाशिक", 
    crop: "Wheat", 
    cropMr: "गहू", 
    minPrice: 2450, 
    maxPrice: 2900, 
    modalPrice: 2700, 
    trend: "stable", 
    trendReason: {
      en: "Local mills consuming consistent daily volumes of high-gluten grinding grain.",
      mr: "स्थानिक मैद्याच्या गिरण्यांकडून गव्हाची रोजची खरेदी स्थिर प्रमाणात सुरू."
    }
  },
  { 
    district: "Nashik", 
    districtMr: "नाशिक", 
    crop: "Maize", 
    cropMr: "मका", 
    minPrice: 1900, 
    maxPrice: 2250, 
    modalPrice: 2100, 
    trend: "up", 
    trendReason: {
      en: "Silo storages accumulating stocks ahead of expected monsoon transport disruptions.",
      mr: "पावसाळ्यातील वाहतूक अडथळे लक्षात घेता सायलो साठवणुकीसाठी अधिक मागणी."
    }
  },

  { 
    district: "Jalgaon", 
    districtMr: "जळगाव", 
    crop: "Cotton", 
    cropMr: "कापूस", 
    minPrice: 6750, 
    maxPrice: 7550, 
    modalPrice: 7300, 
    trend: "stable", 
    trendReason: {
      en: "Ginning mills buying hand-to-mouth as final spinning off-take remains low.",
      mr: "सध्या सुताच्या मागणीत मंदी असल्याने जिनींग मिलचालकांकडून गरजेपुरती खरेदी."
    }
  },
  { 
    district: "Jalgaon", 
    districtMr: "जळगाव", 
    crop: "Maize", 
    cropMr: "मका", 
    minPrice: 1920, 
    maxPrice: 2280, 
    modalPrice: 2120, 
    trend: "up", 
    trendReason: {
      en: "Fodder shortage in Khandesh region elevating dual-use grain pricing bids.",
      mr: "खानदेशात चाऱ्याच्या टंचाईमुळे जनावरांच्या आहारासाठी मक्याला वाढीव मागणी."
    }
  }
];

export const maharashtraDistricts = [
  { id: "Akola", name: "Akola", nameMr: "अकोला", region: "Vidarbha", regionMr: "विदर्भ", lat: 20.7002, lon: 77.0082 },
  { id: "Nagpur", name: "Nagpur", nameMr: "नागपूर", region: "Vidarbha", regionMr: "विदर्भ", lat: 21.1458, lon: 79.0882 },
  { id: "Pune", name: "Pune", nameMr: "पुणे", region: "Western Maharashtra", regionMr: "पश्चिम महाराष्ट्र", lat: 18.5204, lon: 73.8567 },
  { id: "Solapur", name: "Solapur", nameMr: "सोलापूर", region: "Western Maharashtra", regionMr: "पश्चिम महाराष्ट्र", lat: 17.6599, lon: 75.9064 },
  { id: "Nashik", name: "Nashik", nameMr: "नाशिक", region: "Khandesh (North MS)", regionMr: "खानदेश (उत्तर महाराष्ट्र)", lat: 19.9975, lon: 73.7898 },
  { id: "Jalgaon", name: "Jalgaon", nameMr: "जळगाव", region: "Khandesh (North MS)", regionMr: "खानदेश (उत्तर महाराष्ट्र)", lat: 21.0077, lon: 75.5626 },
  { id: "Aurangabad", name: "Aurangabad (Chh. Sambhajinagar)", nameMr: "छत्रपती संभाजीनगर", region: "Marathwada", regionMr: "मराठवाडा", lat: 19.8762, lon: 75.3433 },
  { id: "Ratnagiri", name: "Ratnagiri", nameMr: "रत्नागिरी", region: "Konkan", regionMr: "कोकण", lat: 16.9902, lon: 73.3120 }
];

export const regionalAdvisories = {
  Vidarbha: {
    crop: { en: "Cotton, Soybeans & Pulses", mr: "कापूस, सोयाबीन व कडधान्य" },
    advice: {
      en: "Protect early cotton sowings from sudden pre-monsoon heat shifts. Inspect for whitefly activity in early mornings. Maintain proper spacing between rows.",
      mr: "पूर्व-हंगामी कापूस पेरण्यांचे अचानक होणाऱ्या उष्णतेच्या बदलांपासून रक्षण करा. सकाळी पांढऱ्या माशीच्या प्रादुर्भावाचे निरीक्षण करा. ओळींमध्ये योग्य अंतर ठेवा."
    }
  },
  Marathwada: {
    crop: { en: "Soybean, Jowar & Sugarcane", mr: "सोयाबीन, ज्वारी व ऊस" },
    advice: {
      en: "Ensure adequate moisture levels in fields prior to sowing Soybeans. Prepare drains to avoid waterlogging during initial seed germination.",
      mr: "सोयाबीन पेरणीपूर्वी शेतात पुरेशी ओल असल्याची खात्री करा. बियाणे उगवताना शेतात पाणी साचणार नाही यासाठी पाण्याचा निचरा करणारे पाट तयार ठेवा."
    }
  },
  "Western Maharashtra": {
    crop: { en: "Sugarcane, Grapes, Pomegranate & Onions", mr: "ऊस, द्राक्षे, डाळिंब व कांदा" },
    advice: {
      en: "Perfect time for drip system checks and trellis repairs in vineyards. Control thrips in onion crops using organic formulations.",
      mr: "द्राक्षबागांमध्ये ठिबक सिंचन तपासणी व वेलींच्या मंडप दुरुस्तीची उत्तम वेळ. कांदा पिकावरील फुलकिडे (थ्रिप्स) नियंत्रणासाठी निंबोळी अर्काची फवारणी करा."
    }
  },
  "Khandesh (North MS)": {
    crop: { en: "Maize, Cotton & Banana", mr: "मका, कापूस व केळी" },
    advice: {
      en: "Keep field soil loose. Spray banana leaves against sunburn. In Maize, inspect central leaf whorls regularly for early-stage Fall Armyworm.",
      mr: "शेतातील माती मऊ व मोकळी ठेवा. केळीच्या पानांचे अतिउन्हापासून रक्षण करा. मका पिकात लष्करी अळीचा प्रादुर्भाव शोधण्यासाठी पोंग्याची नियमित पाहणी करा."
    }
  },
  Konkan: {
    crop: { en: "Rice, Cashew & Alphonso Mango", mr: "भात (तांदूळ), काजू व हापूस आंबा" },
    advice: {
      en: "Start nursery bed preparation for kharif rice. Protect mango orchards from high moisture molds. Apply organic mulches around cashew saplings.",
      mr: "खरीप भात रोपवाटिकेच्या (गादीवाफे) तयारीला सुरुवात करा. आंब्याला अति आर्द्रतेमुळे लागणाऱ्या बुरशीपासून वाचवण्यासाठी बुरशीनाशके फवारणी करा. काजू रोपांभोवती सेंद्रिय आच्छादन घाला."
    }
  }
};

export const newsArticles = [
  {
    id: "news_1",
    title: {
      en: "PM Kusum Yojana: Get 90% Subsidy on Solar Pumps",
      mr: "पीएम कुसुम योजना: सौर पंपांवर ९०% पर्यंत सबसिडी मिळवा"
    },
    summary: {
      en: "Maharashtra government opens new registrations for solar agricultural pumps. Check eligibility and apply now.",
      mr: "महाराष्ट्र शासनाने शेतीसाठी सौर पंपांची नवीन नोंदणी सुरू केली आहे. पात्रता तपासा आणि आजच अर्ज करा."
    },
    content: {
      en: "Under the PM Kusum Scheme, the Government of India and the Government of Maharashtra are offering up to 90% subsidy for farmers to install solar water pumps. This reduces dependency on grid power and enables day-time irrigation. Apply through the MahaUrja portal with land records (7/12 extract) and Aadhar card.",
      mr: "पीएम कुसुम योजनेअंतर्गत, भारत सरकार आणि महाराष्ट्र शासन शेतकऱ्यांना सौर पाणी पंप बसवण्यासाठी ९०% पर्यंत सबसिडी देत आहेत. यामुळे विजेवरील अवलंबित्व कमी होते आणि दिवसा सिंचन करणे शक्य होते. महाऊर्जा पोर्टलवर ७/१२ उतारा आणि आधार कार्डसह अर्ज करा."
    },
    crop: "all",
    district: "all",
    tag: { en: "Subsidy", mr: "योजना" },
    date: "21 May 2026",
    readTime: { en: "3 min read", mr: "३ मि. वाचन" }
  },
  {
    id: "news_2",
    title: {
      en: "Cotton Alert: Pink Bollworm Control in Vidarbha",
      mr: "कापूस इशारा: विदर्भातील गुलाबी बोंडअळी नियंत्रण"
    },
    summary: {
      en: "Agronomy experts issue early guidelines for Pink Bollworm prevention in Akola, Nagpur, and Amravati districts.",
      mr: "कृषी तज्ज्ञांनी अकोला, नागपूर आणि अमरावती जिल्ह्यातील गुलाबी बोंडअळीच्या प्रतिबंधासाठी मार्गदर्शक तत्त्वे जारी केली आहेत."
    },
    content: {
      en: "With the early monsoons approaching Vidarbha, pink bollworm infestations are predicted in young cotton stands. Farmers are advised to install Pheromone Traps (5 per acre) for early monitoring. Avoid early chemical spraying; prioritize neem oil (10,000 ppm) or biological controls to protect beneficial predator insects.",
      mr: "विदर्भात मान्सूनपूर्व व मान्सूनच्या सुरुवातीच्या पावसानंतर कापूस पिकावर गुलाबी बोंडअळीचा प्रादुर्भाव होण्याची शक्यता आहे. शेतकऱ्यांनी एकरी ५ कामगंध सापळे (Pheromone Traps) लावण्याचा सल्ला दिला आहे. सुरुवातीलाच रासायनिक फवारणी टाळा; निंबोळी तेल किंवा जैविक नियंत्रणाला प्राधान्य द्या."
    },
    crop: "Cotton",
    district: "Akola",
    tag: { en: "Alert", mr: "इशारा" },
    date: "20 May 2026",
    readTime: { en: "4 min read", mr: "४ मि. वाचन" }
  },
  {
    id: "news_3",
    title: {
      en: "Drip Irrigation Subsidy Open for Western Maharashtra",
      mr: "पश्चिम महाराष्ट्रासाठी ठिबक सिंचन सबसिडी सुरू"
    },
    summary: {
      en: "80% subsidy for small and marginal farmers under the Per Drop More Crop scheme in Pune and Solapur.",
      mr: "पुणे आणि सोलापूर जिल्ह्यातील अल्प व अत्यल्प भूधारक शेतकऱ्यांसाठी ८०% सबसिडी खुली करण्यात आली आहे."
    },
    content: {
      en: "The Department of Agriculture, Maharashtra, is accepting applications on the MahaDBT portal for subsidies on drip and sprinkler systems. Small farmers receive 80% cost coverage, and big farmers receive 75%. Crucial for conserving groundwater in drought-prone areas of Marathwada and Western Maharashtra.",
      mr: "महाराष्ट्र कृषी विभाग महाडीबीटी (MahaDBT) पोर्टलवर ठिबक आणि तुषार सिंचन सिस्टीमच्या अनुदानासाठी अर्ज स्वीकारत आहे. लहान शेतकऱ्यांना ८०% आणि मोठ्या शेतकऱ्यांना ७५% खर्च मिळतो. सोलापूर व पुणे जिल्ह्यासाठी फायदेशीर."
    },
    crop: "all",
    district: "Solapur",
    tag: { en: "Subsidy", mr: "योजना" },
    date: "19 May 2026",
    readTime: { en: "3 min read", mr: "३ मि. वाचन" }
  },
  {
    id: "news_4",
    title: {
      en: "Soybean Rust Warning: Preventive Spraying Advised",
      mr: "सोयाबीन तांबेरा इशारा: प्रतिबंधात्मक फवारणीचा सल्ला"
    },
    summary: {
      en: "High humidity forecast in Nashik and Pune may trigger Soybean Rust. Early spraying protects yields by 25%.",
      mr: "नाशिक व पुणे भागात वाढत्या दमट वातावरणामुळे सोयाबीनवर तांबेरा रोग पसरण्याची भीती. वेळेवर फवारणी करा."
    },
    content: {
      en: "Weather forecasts indicate high relative humidity (>80%) and cloudy conditions over western Maharashtra next week, perfect for soybean rust (fungal infection). Agriculture officers advise a preventive spray of Tebuconazole or Hexaconazole. Keep checking the lower side of leaves for tiny yellow pustules.",
      mr: "हवामान अंदाजानुसार पुढील आठवड्यात पश्चिम महाराष्ट्रात आर्द्रता ८०% हून जास्त राहण्याची शक्यता आहे, जी सोयाबीन तांबेरा रोगासाठी पोषक आहे. कृषी अधिकाऱ्यांनी प्रतिबंधात्मक उपाय म्हणून टेब्युकोनॅझोल किंवा हेक्साकोनॅझोल फवारण्याचा सल्ला दिला आहे."
    },
    crop: "Soybean",
    district: "Nashik",
    tag: { en: "Alert", mr: "इशারা" },
    date: "18 May 2026",
    readTime: { en: "5 min read", mr: "५ मि. वाचन" }
  },
  {
    id: "news_5",
    title: {
      en: "MSP Rates Slashed or Increased? Central Government Announces Hikes",
      mr: "किमान आधारभूत किंमतीत (MSP) वाढ: केंद्र सरकारची मोठी घोषणा"
    },
    summary: {
      en: "Significant hike in Minimum Support Prices (MSP) announced for Kharif crops including Cotton and Soybean.",
      mr: "कापूस आणि सोयाबीनसह खरीप पिकांच्या किमान आधारभूत किंमतीत (MSP) लक्षणीय वाढ घोषित."
    },
    content: {
      en: "The Cabinet Committee on Economic Affairs has approved a substantial increase in Minimum Support Prices (MSP) for all mandated Kharif crops for Marketing Season 2026-27. Cotton (Medium Staple) MSP raised to ₹7,120 per quintal, while Soybean (Yellow) MSP is set at ₹4,890 per quintal. This aims to secure a minimum 50% margin of profit over cost of production for progressive farmers.",
      mr: "मंत्रिमंडळ समितीने २०२६-२७ विपणन हंगामासाठी सर्व खरीप पिकांच्या किमान आधारभूत किंमतीत (MSP) भरीव वाढ मंजूर केली आहे. कापूस (मध्यम धागा) MSP प्रति क्विंटल ₹७,१२० वर वाढवला आहे, तर सोयाबीन (पिवळा) MSP प्रति क्विंटल ₹४,८९० निश्चित केला आहे. यामुळे शेतकऱ्यांना उत्पादन खर्चावर किमान ५०% नफा सुनिश्चित होणार आहे."
    },
    crop: "all",
    district: "all",
    tag: { en: "Market Rate", mr: "बाजार भाव" },
    date: "21 May 2026",
    readTime: { en: "4 min read", mr: "४ मि. वाचन" }
  },
  {
    id: "news_6",
    title: {
      en: "Cotton Prices Expected to Touch ₹8,000 in Markets",
      mr: "बाजार समित्यांमध्ये कापसाचे भाव ₹८,००० पार जाण्याची शक्यता"
    },
    summary: {
      en: "Lower global cotton production and surging spinning mill demand to push Akola and Nagpur APMC rates upwards.",
      mr: "जागतिक कापूस उत्पादनात घट आणि स्पिनिंग मिलकडून प्रचंड मागणीमुळे अकोला व नागपूर बाजारात तेजीचा कल."
    },
    content: {
      en: "Market experts predict that wholesale cotton rates in major Maharashtra APMCs like Akola, Amravati, and Nagpur will touch ₹8,000 per quintal by next month. The current trading price sits between ₹7,400 to ₹7,650. Lower physical arrivals due to farmers holding back stocks for better pricing has squeezed supply, forcing ginning units to bid aggressively.",
      mr: "बाजार विश्लेषकांच्या मते, अकोला, अमरावती आणि नागपूर सारख्या महाराष्ट्रातील प्रमुख बाजार समित्यांमध्ये कापसाचे दर पुढील महिन्यापर्यंत ₹८,००० प्रति क्विंटलचा टप्पा ओलांडू शकतात. सध्या कापूस ₹७,४०० ते ₹७,६५० दरम्यान विकला जात आहे. अधिक दराच्या आशेने शेतकऱ्यांनी माल साठवून ठेवल्याने आवक कमी झाली असून खरेदीदारांमध्ये स्पर्धा वाढली आहे."
    },
    crop: "Cotton",
    district: "Akola",
    tag: { en: "Market Rate", mr: "बाजार भाव" },
    date: "20 May 2026",
    readTime: { en: "3 min read", mr: "३ मि. वाचन" }
  },
  {
    id: "news_7",
    title: {
      en: "Soybean Market Inflows Surge; Price Under Temporary Pressure",
      mr: "बाजारपेठेत सोयाबीनची विक्रमी आवक; भावावर तात्पुरता दबाव"
    },
    summary: {
      en: "Harvest peak in Marathwada and Khandesh leads to high market volumes, softening current market rates.",
      mr: "मराठवाडा व खानदेश भागात काढणीचा हंगाम तेजीत असल्याने आवक वाढली, त्यामुळे सोयाबीनचे दर काहीसे मऊ."
    },
    content: {
      en: "With peak harvest inflows arriving in Latur, Jalgaon, and Solapur markets, yellow soybean rates have experienced a minor correction, currently trading around ₹4,400 to ₹4,600 per quintal. Traders recommend farmers dry their produce to maintain moisture below 10% to secure the highest available bidding prices and avoid quality discounts.",
      mr: "लातूर, जळगाव आणि सोलापूर बाजारपेठेत काढणीच्या हंगामातील माल मोठ्या प्रमाणात दाखल होत असल्याने, पिवळ्या सोयाबीनच्या दरात किंचित घसरण झाली आहे. सध्या दर ₹४,४०० ते ₹४,६०० प्रति क्विंटल दरम्यान सुरू आहेत. व्यापाऱ्यांनी शेतकऱ्यांना मालातील ओलावा १०% पेक्षा कमी ठेवण्याचा सल्ला दिला आहे जेणेकरून चांगला भाव मिळेल."
    },
    crop: "Soybean",
    district: "Solapur",
    tag: { en: "Market Rate", mr: "बाजार भाव" },
    date: "19 May 2026",
    readTime: { en: "4 min read", mr: "४ मि. वाचन" }
  }
];

export const cropChatbotQna = {
  fertilizer: {
    en: "Recommended fertilizer dosage depends on soil testing. For Cotton: Apply N:P:K at 80:40:40 kg/hectare. Split Nitrogen into three applications (at sowing, 30 days, and 60 days). For Soybeans: Apply 20:60:40 kg/hectare N:P:K at sowing as it is a legume and fixes nitrogen naturally.",
    mr: "खत व्यवस्थापन माती परीक्षणावर आधारित असावे. कापूस पिकासाठी: ८०:४०:४० किलो नत्र:स्फुरद:पालाश प्रति हेक्टर द्यावे. नत्र खत ३ हप्त्यांमध्ये विभागून द्यावे (पेरणीवेळी, ३० दिवसांनी व ६० दिवसांनी). सोयाबीन पिकासाठी: पेरणीवेळी २०:६०:४० किलो नत्र:स्फुरद:पालाश द्यावे."
  },
  water: {
    en: "Irrigation schedules should adapt to growth stages. Cotton has critical watering stages at flowering and boll development (avoid water stress here). Maize requires watering at tasseling and silking stages. Always avoid waterlogging to prevent root rot.",
    mr: "पाणी व्यवस्थापन पिकाच्या वाढीच्या संवेदनशील टप्प्यांवर करावे. कापूस पिकासाठी: फुलकळी व बोंडे धरण्याच्या काळात पाण्याचा ताण पडू देऊ नये. मका पिकासाठी: तुरा व कणसे बाहेर पडताना पाणी देणे गरजेचे आहे. शेतात पाणी साचून राहू नये याची दक्षता घ्या."
  },
  spacing: {
    en: "Proper sowing spacing maximizes sunlight and reduces pest traps: \n- Cotton: 90 x 60 cm for rainfed, 120 x 60 cm for irrigated BT Cotton.\n- Soybean: 45 x 10 cm or 30 x 10 cm spacing.\n- Maize: 60 x 20 cm.",
    mr: "योग्य अंतर ठेवल्यास पिकाला पुरेसा सूर्यप्रकाश व हवा मिळते: \n- कापूस (बीटी): कोरडवाहूसाठी ९० x ६० सेंमी, बागायतीसाठी १२० x ६० सेंमी.\n- सोयाबीन: ४५ x १० सेंमी किंवा ३० x १० सेंमी.\n- मका: ६० x २० सेंमी."
  },
  compost: {
    en: "Prepare high-quality organic compost: Mix crop waste, animal dung, and green manure in a compost pit. Add Trichoderma fungi culture to accelerate decomposition and protect crops from soil-borne pathogens. Turn the pile every 15 days.",
    mr: "उत्कृष्ट सेंद्रिय खत निर्मिती: कंपोस्ट खड्ड्यात शेतातील काडीकचरा, शेणखत व हिरवळीचे खत थरावर थर रचून टाका. जलद कुजण्यासाठी व बुरशी नियंत्रणासाठी ट्रायकोडर्मा जिवाणू संवर्धन वापरा. प्रत्येक १५ दिवसांनी खत वर-खाली करा."
  },
  pest: {
    en: "Pest Management: Deploy yellow sticky traps (10 per acre) for sucking pests like whitefly/thrips. Spray Neem Seed Kernel Extract (5% NSKE) as an organic deterrent. For critical worm outbreaks, use Bacillus thuringiensis (Bt) formulation.",
    mr: "कीड नियंत्रण: पांढरी माशी व थ्रिप्स सारख्या रसशोषक किडींसाठी एकरी १० पिवळे चिकट सापळे लावा. प्रतिबंधात्मक उपाय म्हणून ५% निंबोळी अर्काची फवारणी करा. अळ्यांच्या प्रादुर्भावासाठी बॅसिलस थुरिंनजिएन्सिस (Bt) जैविक औषध वापरा."
  }
};
