"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "hi" | "mr";

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    home: "Home",
    reportIssue: "Report Issue",
    beta: "Public Beta Now Live",
    heroTitle: "Report civic issues in",
    heroHighlight: "seconds.",
    heroSub: "AI-powered reporting for faster action and transparency. Help keep your city clean, safe, and efficient.",
    reportAction: "Report an Issue",
    aboutTitle: "About CivicPulse",
    aboutDesc: "CivicPulse is an AI-powered civic issue reporting platform that transforms citizen complaints into structured, actionable reports with location intelligence.",
    problemTitle: "The Problem",
    problem1: "Citizens don't know where to report issues",
    problem2: "Complaints are unstructured and ignored",
    problem3: "No transparency or tracking",
    solutionTitle: "Our Solution",
    solution1: "AI detects issue from image",
    solution2: "Generates formal complaint",
    solution3: "Adds location automatically",
    solution4: "Enables tracking",
    howItWorks: "How CivicPulse Works",
    stepSub: "Three simple steps to better civic infrastructure.",
    step1Title: "1. Upload Image",
    step1Desc: "Snap a photo of the civic issue.",
    step2Title: "2. AI Analysis",
    step2Desc: "Our AI automatically detects and generates a formal complaint.",
    step3Title: "3. Track Status",
    step3Desc: "Follow your report from submission to resolution.",
    impactTitle: "Real-world Impact",
    impact1: "Faster civic issue resolution",
    impact2: "Increased accountability",
    impact3: "Community-driven improvement",
    faqTitle: "Frequently Asked Questions",
    faq1Q: "Is this connected to government systems?",
    faq1A: "We generate formatted reports that can be directly routed to appropriate municipal departments.",
    faq2Q: "How accurate is AI detection?",
    faq2A: "Our AI is trained on thousands of civic issues and maintains a 95%+ accuracy rate for common infrastructure problems.",
    faq3Q: "Can I track my complaint?",
    faq3A: "Yes, once submitted, you receive a tracking ID to monitor the status.",
    faq4Q: "Is my data secure?",
    faq4A: "All location data and images are handled securely with strict privacy protocols.",
    finalCtaTitle: "Start Reporting Civic Issues Today",
    reportHeader: "Report an Issue",
    reportSub: "Upload a clear photo of the issue. Our AI will automatically classify and write the report.",
    photoEvidence: "Photo Evidence",
    additionalDetails: "Additional Details (Optional)",
    placeholderDetails: "Any specific landmarks or context?",
    processing: "Analyzing image...",
    submitReport: "Submit Report",
    analysisComplete: "Analysis Complete",
    analysisSub: "Here are the details generated from your report.",
    submitAnother: "Submit another report",
    language: "Language",
    accessibility: "Accessibility",
    fontSize: "Font Size",
    highContrast: "High Contrast",
    footerCopy: "CivicPulse. All rights reserved.",
    privacy: "Privacy Policy",
    terms: "Terms of Service"
  },

  hi: {
    home: "होम",
    reportIssue: "समस्या दर्ज करें",
    beta: "सार्वजनिक बीटा अब लाइव है",
    heroTitle: "नागरिक समस्याओं की रिपोर्ट करें",
    heroHighlight: "सेकंड में।",
    heroSub: "त्वरित कार्रवाई और पारदर्शिता के लिए एआई-संचालित रिपोर्टिंग। अपने शहर को स्वच्छ, सुरक्षित और कुशल बनाए रखने में मदद करें।",
    reportAction: "समस्या दर्ज करें",
    aboutTitle: "CivicPulse के बारे में",
    aboutDesc: "CivicPulse एक एआई-संचालित नागरिक समस्या रिपोर्टिंग प्लेटफॉर्म है जो नागरिकों की शिकायतों को लोकेशन इंटेलिजेंस के साथ संरचित, कार्रवाई योग्य रिपोर्ट में बदल देता है।",
    problemTitle: "समस्या",
    problem1: "नागरिकों को नहीं पता कि समस्या कहां दर्ज करनी है",
    problem2: "शिकायतें असंरचित हैं और उन्हें नजरअंदाज कर दिया जाता है",
    problem3: "कोई पारदर्शिता या ट्रैकिंग नहीं",
    solutionTitle: "हमारा समाधान",
    solution1: "एआई छवि से समस्या का पता लगाता है",
    solution2: "औपचारिक शिकायत उत्पन्न करता है",
    solution3: "स्वचालित रूप से स्थान जोड़ता है",
    solution4: "ट्रैकिंग सक्षम करता है",
    howItWorks: "CivicPulse कैसे काम करता है",
    stepSub: "बेहतर नागरिक बुनियादी ढांचे के लिए तीन सरल कदम।",
    step1Title: "1. छवि अपलोड करें",
    step1Desc: "नागरिक समस्या की एक तस्वीर लें।",
    step2Title: "2. एआई विश्लेषण",
    step2Desc: "हमारा एआई स्वचालित रूप से पता लगाता है और एक औपचारिक शिकायत उत्पन्न करता है।",
    step3Title: "3. स्थिति ट्रैक करें",
    step3Desc: "सबमिट करने से लेकर समाधान तक अपनी रिपोर्ट का पालन करें।",
    impactTitle: "वास्तविक प्रभाव",
    impact1: "नागरिक समस्याओं का तेजी से समाधान",
    impact2: "जवाबदेही में वृद्धि",
    impact3: "समुदाय-संचालित सुधार",
    faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
    faq1Q: "क्या यह सरकारी प्रणालियों से जुड़ा है?",
    faq1A: "हम स्वरूपित रिपोर्ट तैयार करते हैं जिन्हें सीधे संबंधित नगरपालिका विभागों को भेजा जा सकता है।",
    faq2Q: "एआई पहचान कितनी सटीक है?",
    faq2A: "हमारा एआई हजारों नागरिक समस्याओं पर प्रशिक्षित है और 95%+ सटीकता बनाए रखता है।",
    faq3Q: "क्या मैं अपनी शिकायत को ट्रैक कर सकता हूं?",
    faq3A: "हां, एक बार सबमिट हो जाने पर, आप स्थिति की निगरानी कर सकते हैं।",
    faq4Q: "क्या मेरा डेटा सुरक्षित है?",
    faq4A: "सभी स्थान डेटा और छवियों को सख्त गोपनीयता प्रोटोकॉल के साथ सुरक्षित रूप से नियंत्रित किया जाता है।",
    finalCtaTitle: "आज ही नागरिक समस्याओं की रिपोर्टिंग शुरू करें",
    reportHeader: "समस्या दर्ज करें",
    reportSub: "समस्या की स्पष्ट तस्वीर अपलोड करें। हमारा एआई स्वचालित रूप से वर्गीकृत करेगा और रिपोर्ट लिखेगा।",
    photoEvidence: "फोटो साक्ष्य",
    additionalDetails: "अतिरिक्त विवरण (वैकल्पिक)",
    placeholderDetails: "कोई विशिष्ट स्थलचिह्न या संदर्भ?",
    processing: "एआई विश्लेषण संसाधित किया जा रहा है...",
    submitReport: "रिपोर्ट सबमिट करें",
    analysisComplete: "विश्लेषण पूर्ण",
    analysisSub: "यहां आपकी रिपोर्ट से उत्पन्न विवरण दिए गए हैं।",
    submitAnother: "एक और रिपोर्ट सबमिट करें",
    language: "भाषा",
    accessibility: "पहुँच",
    fontSize: "फ़ॉन्ट का आकार",
    highContrast: "उच्च कंट्रास्ट",
    footerCopy: "CivicPulse. सभी अधिकार सुरक्षित।",
    privacy: "गोपनीयता नीति",
    terms: "सेवा की शर्तें"
  },
  mr: {
    home: "मुख्यपृष्ठ",
    reportIssue: "समस्या नोंदवा",
    beta: "सार्वजनिक बीटा आता लाइव्ह आहे",
    heroTitle: "नागरी समस्यांची नोंदणी करा",
    heroHighlight: "सेकंदांत.",
    heroSub: "जलद कृती आणि पारदर्शकतेसाठी एआय-शक्तीवर चालणारी रिपोर्टिंग. तुमचे शहर स्वच्छ, सुरक्षित ठेवण्यात मदत करा.",
    reportAction: "समस्या नोंदवा",
    aboutTitle: "CivicPulse बद्दल",
    aboutDesc: "CivicPulse हे एक एआय-शक्तीवर चालणारे नागरी समस्या नोंदणी प्लॅटफॉर्म आहे जे नागरिकांच्या तक्रारींना स्थान बुद्धिमत्तेसह संरचित, कृती करण्यायोग्य अहवालांमध्ये रूपांतरित करते.",
    problemTitle: "समस्या",
    problem1: "नागरिकांना समस्या कोठे नोंदवायची हे माहित नसते",
    problem2: "तक्रारी असंरचित असतात आणि त्याकडे दुर्लक्ष केले जाते",
    problem3: "कोणतीही पारदर्शकता किंवा ट्रॅकिंग नाही",
    solutionTitle: "आमचे उपाय",
    solution1: "एआय प्रतिमेवरून समस्या ओळखते",
    solution2: "औपचारिक तक्रार तयार करते",
    solution3: "स्वयंचलितपणे स्थान जोडते",
    solution4: "ट्रॅकिंग सक्षम करते",
    howItWorks: "CivicPulse कसे कार्य करते",
    stepSub: "उत्तम नागरी पायाभूत सुविधांसाठी तीन सोप्या पायऱ्या.",
    step1Title: "1. प्रतिमा अपलोड करा",
    step1Desc: "नागरी समस्येचा फोटो काढा.",
    step2Title: "2. एआय विश्लेषण",
    step2Desc: "आमचे एआय स्वयंचलितपणे शोधते आणि औपचारिक तक्रार तयार करते.",
    step3Title: "3. स्थितीचा मागोवा घ्या",
    step3Desc: "सबमिशनपासून रिझोल्यूशनपर्यंत आपल्या अहवालाचा मागोवा घ्या.",
    impactTitle: "वास्तविक प्रभाव",
    impact1: "नागरी समस्यांचे जलद निराकरण",
    impact2: "वाढलेली जबाबदारी",
    impact3: "समुदाय-चालित सुधारणा",
    faqTitle: "वारंवार विचारले जाणारे प्रश्न",
    faq1Q: "हे सरकारी प्रणालींशी जोडलेले आहे का?",
    faq1A: "आम्ही स्वरूपित अहवाल तयार करतो जे थेट संबंधित नगरपालिका विभागांना पाठवले जाऊ शकतात.",
    faq2Q: "एआय शोध किती अचूक आहे?",
    faq2A: "आमचे एआय हजारो नागरी समस्यांवर प्रशिक्षित आहे आणि 95%+ अचूकता दर राखते.",
    faq3Q: "मी माझ्या तक्रारीचा मागोवा घेऊ शकतो का?",
    faq3A: "होय, एकदा सबमिट केल्यावर स्थितीवर लक्ष ठेवण्यासाठी तुम्ही ट्रॅक करू शकता.",
    faq4Q: "माझा डेटा सुरक्षित आहे का?",
    faq4A: "सर्व स्थान डेटा आणि प्रतिमा सुरक्षिततेने आणि कडक गोपनीयता प्रोटोकॉलसह हाताळल्या जातात.",
    finalCtaTitle: "आजच नागरी समस्या नोंदविण्यास प्रारंभ करा",
    reportHeader: "समस्या नोंदवा",
    reportSub: "समस्येचा स्पष्ट फोटो अपलोड करा. आमचे एआय स्वयंचलितपणे वर्गीकृत करेल आणि अहवाल लिहेल.",
    photoEvidence: "फोटो पुरावे",
    additionalDetails: "अतिरिक्त तपशील (पर्यायी)",
    placeholderDetails: "कोणतेही विशिष्ट ठिकाण किंवा संदर्भ?",
    processing: "एआय विश्लेषण प्रक्रिया करत आहे...",
    submitReport: "अहवाल सबमिट करा",
    analysisComplete: "विश्लेषण पूर्ण",
    analysisSub: "येथे तुमच्या अहवालातून तयार केलेले तपशील आहेत.",
    submitAnother: "आणखी एक अहवाल सबमिट करा",
    language: "भाषा",
    accessibility: "प्रवेशयोग्यता",
    fontSize: "फॉन्ट आकार",
    highContrast: "उच्च कॉन्ट्रास्ट",
    footerCopy: "CivicPulse. सर्व हक्क राखीव.",
    privacy: "गोपनीयता धोरण",
    terms: "सेवेच्या अटी"
  }
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("civicpulse_lang") as Language;
    if (saved && ["en", "hi", "mr"].includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("civicpulse_lang", lang);
  };

  const t = (key: string): string => {
    if (!mounted) return translations["en"][key] || key;
    return translations[language][key] || translations["en"][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
