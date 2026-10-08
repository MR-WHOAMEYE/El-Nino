import { SupportedLanguage } from '../store/appStore';

export interface Translations {
  [key: string]: {
    en: string;
    hi: string;
    ta: string;
    te: string;
    kn: string;
    ml: string;
  };
}

export const translations: Translations = {
  // Brand & Slogan
  appName: {
    en: 'CLIMA-SHIELD',
    hi: 'क्लाइमा-शील्ड',
    ta: 'கிளைமா-ஷீல்ட்',
    te: 'క్లైమా-షీల్డ్',
    kn: 'ಕ್ಲೈಮಾ-ಶೀಲ್ಡ್',
    ml: 'ക്ലൈമ-ഷീൽഡ്',
  },
  tagline: {
    en: 'From Climate Signals to Community Action',
    hi: 'जलवायु संकेतों से सामुदायिक कार्रवाई तक',
    ta: 'பருவநிலை சிக்னல்களில் இருந்து சமூக நடவடிக்கை வரை',
    te: 'వాతావరణ సంకేతాల నుండి కమ్యూనిటీ చర్య వరకు',
    kn: 'ಹವಾಮಾನ ಸಂಕೇತಗಳಿಂದ ಸಮುದಾಯ ಕ್ರಿಯೆಯವರೆಗೆ',
    ml: 'കാലാവസ്ഥാ സിഗ്നലുകളിൽ നിന്ന് കമ്മ്യൂണിറ്റി പ്രവർത്തനത്തിലേക്ക്',
  },
  // Navigation
  commandCenter: {
    en: 'Command Center',
    hi: 'कमांड सेंटर',
    ta: 'கட்டளை மையம்',
    te: 'కమాండ్ సెంటర్',
    kn: 'ಕಮಾಂಡ್ ಸೆಂಟರ್',
    ml: 'കമാൻഡ് സെന്റർ',
  },
  impactMap: {
    en: 'Impact Map',
    hi: 'प्रभाव मानचित्र',
    ta: 'தாக்க வரைபடம்',
    te: 'ప్రభావ పటం',
    kn: 'ಪರಿಣಾಮ ನಕ್ಷೆ',
    ml: 'ഇംപാക്ട് മാപ്പ്',
  },
  vulnerability: {
    en: 'Vulnerability Index',
    hi: 'सुभेद्यता सूचकांक',
    ta: 'பாதிப்பு குறியீடு',
    te: 'దుర్బలత్వ సూచిక',
    kn: 'ದುರ್ಬಲತೆಯ ಸೂಚ್ಯಂಕ',
    ml: 'ദുർബലതാ സൂചിക',
  },
  consequenceGraph: {
    en: 'Consequence Graph',
    hi: 'परिणाम ग्राफ',
    ta: 'விளைவு வரைபடம்',
    te: 'పరిణామ గ్రాఫ్',
    kn: 'ಪರಿಣಾಮ ಗ್ರಾಫ್',
    ml: 'പരിണതഫല ഗ്രാഫ്',
  },
  invisiblePopulation: {
    en: 'Invisible Population',
    hi: 'अदृश्य जनसंख्या',
    ta: 'கண்ணுக்குத் தெரியாத மக்கள் தொகை',
    te: 'అదృశ్య జనాభా',
    kn: 'ಅದೃಶ್ಯ ಜನಸಂಖ್ಯೆ',
    ml: 'അദൃശ്യ ജനസംഖ്യ',
  },
  equityPriorities: {
    en: 'Equity Priorities',
    hi: 'समानता प्राथमिकताएं',
    ta: 'சமத்துவ முன்னுரிமைகள்',
    te: 'ఈక్విటీ ప్రాధాన్యతలు',
    kn: 'ಸಮಾನತೆಯ ಆದ್ಯತೆಗಳು',
    ml: 'തുല്യതാ മുൻഗണനകൾ',
  },
  scenarioLab: {
    en: 'Scenario Lab',
    hi: 'परिदृश्य प्रयोगशाला',
    ta: 'சூழ்நிலை ஆய்வகம்',
    te: 'సినారియో ల్యాబ్',
    kn: 'ಸನ್ನಿವೇಶ ಪ್ರಯೋಗಾಲಯ',
    ml: 'സിനാരിയോ ലാബ്',
  },
  resourceOptimizer: {
    en: 'Resource Optimizer',
    hi: 'संसाधन अनुकूलक',
    ta: 'வள உகப்பாக்கி',
    te: 'వనరుల ఆప్టిమైజర్',
    kn: 'ಸಂಪನ್ಮೂಲ ಆಪ್ಟಿಮೈಜರ್',
    ml: 'റിസോഴ്സ് ഒപ്റ്റിമൈസർ',
  },
  communityIntelligence: {
    en: 'Community Intelligence',
    hi: 'सामुदायिक आसूचना',
    ta: 'சமூக நுண்ணறிவு',
    te: 'కమ్యూనిటీ ఇంటెలిజెన్స్',
    kn: 'ಸಮುದಾಯ ಗುಪ್ತಚರ',
    ml: 'കമ്മ്യൂണിറ്റി ഇന്റലിജൻസ്',
  },
  resilienceLedger: {
    en: 'Resilience Ledger',
    hi: 'लचीलापन बहीखाता',
    ta: 'மீள்தன்மை கணக்கேடு',
    te: 'రెసిలెన్స్ లెడ్జర్',
    kn: 'ಸ್ಥಿತಿಸ್ಥಾಪಕತ್ವ ಲೆಡ್ಜರ್',
    ml: 'റെസിലിയൻസ് ലെഡ്ജർ',
  },
  settings: {
    en: 'Settings & Telemetry',
    hi: 'सेटिंग्स और टेलीमेट्री',
    ta: 'அமைப்புகள் மற்றும் தொலைநிலை அளவீடு',
    te: 'సెట్టింగ్‌లు & టెలిమెట్రీ',
    kn: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು & ಟೆಲಿಮೆಟ್ರಿ',
    ml: 'ക്രമീകരണങ്ങളും ടെലിമെട്രിയും',
  },
  // Core Metrics
  risk: {
    en: 'Climate Risk',
    hi: 'जलवायु जोखिम',
    ta: 'பருவநிலை அபாயம்',
    te: 'వాతావరణ ప్రమాదం',
    kn: 'ಹವಾಮಾನ ಅಪಾಯ',
    ml: 'കാലാവസ്ഥാ അപകടസാധ്യത',
  },
  resilience: {
    en: 'Resilience Capacity',
    hi: 'सहनशीलता क्षमता',
    ta: 'மீள்திறன் கொள்ளளவு',
    te: 'రెసిలెన్స్ సామర్థ్యం',
    kn: 'ಸ್ಥಿತಿಸ್ಥಾಪಕತ್ವ ಸಾಮರ್ಥ್ಯ',
    ml: 'റെസിലിയൻസ് ശേഷി',
  },
  confidence: {
    en: 'Model Confidence',
    hi: 'मॉडल विश्वास',
    ta: 'மாதிரி நம்பிக்கை',
    te: 'మోడల్ విశ్వాసం',
    kn: 'ಮಾದರಿ ವಿಶ್ವಾಸಾರ್ಹತೆ',
    ml: 'മോഡൽ ആത്മവിശ്വാസം',
  },
  vulnerablePopulation: {
    en: 'Vulnerable Population',
    hi: 'संवेदनशील आबादी',
    ta: 'பாதிக்கப்படக்கூடிய மக்கள்',
    te: 'దుర్బల జనాభా',
    kn: 'ದುರ್ಬಲ ಜನಸಂಖ್ಯೆ',
    ml: 'ദുർബലരായ ജനങ്ങൾ',
  },
};

export const t = (key: string, lang: SupportedLanguage = 'en'): string => {
  if (translations[key] && translations[key][lang]) {
    return translations[key][lang];
  }
  return key;
};
