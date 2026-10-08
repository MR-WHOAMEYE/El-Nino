import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { getRiskBand } from '../components/common/ScoreBadge';
import { DataMetadataFooter } from '../components/common/DataMetadataFooter';
import {
  Droplets,
  Thermometer,
  Heart,
  Navigation,
  Phone,
  Globe,
  Share2,
  Check,
  Copy,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Sun,
  Wind,
  CheckCircle2,
  MapPin,
  Flame,
  Radio,
  HelpCircle,
  Activity
} from 'lucide-react';

interface CoolingCenter {
  id: string;
  name: string;
  tamilName: string;
  distance: string;
  address: string;
  hours: string;
  capacity: string;
  features: string[];
  isOpen: boolean;
}

interface TankerSlot {
  id: string;
  truckId: string;
  location: string;
  eta: string;
  capacityLiters: number;
  status: 'In Transit' | 'Arrived' | 'Scheduled';
}

export const CitizenDashboard: React.FC = () => {
  const { selectedRegion, language, setLanguage } = useAppStore();
  const [copiedSMS, setCopiedSMS] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'cooling' | 'water' | 'triage'>('overview');
  const [filterFeature, setFilterFeature] = useState<string>('all');

  const riskBand = getRiskBand(selectedRegion.overall_impact);
  const isCritical = riskBand === 'CRITICAL';

  // Cooling Centers Data
  const coolingCenters: CoolingCenter[] = [
    {
      id: 'cc-1',
      name: 'Tondiarpet Community Hall & Cooling Haven',
      tamilName: 'தண்டையார்பேட்டை சமுதாய நலக்கூடம்',
      distance: '0.4 km',
      address: '42 High Road, Tondiarpet Zone 4',
      hours: '08:00 - 20:00 IST',
      capacity: '48 / 120 Persons',
      features: ['Air-Conditioned', 'Free ORS Drinks', 'Mobile Charging', 'Paramedic on Duty'],
      isOpen: true,
    },
    {
      id: 'cc-2',
      name: 'Perambur Municipal Stadium Shaded Pavilion',
      tamilName: 'பெரம்பூர் நகராட்சி நிழல் மையம்',
      distance: '0.9 km',
      address: 'Station Road, Perambur',
      hours: '09:00 - 19:00 IST',
      capacity: '32 / 80 Persons',
      features: ['High-Power Misting Fans', 'Free Cold Water', 'Rest Cots'],
      isOpen: true,
    },
    {
      id: 'cc-3',
      name: 'Royapettah Urban Health Post Shaded Refuge',
      tamilName: 'ராயப்பேட்டை நகர்ப்புற நல நிழலகம்',
      distance: '1.4 km',
      address: 'Near Old Bus Terminus, Zone 5',
      hours: '24 Hours Open',
      capacity: '18 / 40 Persons',
      features: ['Medical Triage', 'IV Rehydration', 'Cold Compress'],
      isOpen: true,
    },
    {
      id: 'cc-4',
      name: 'Vyasarpadi Community Library Cooling Lounge',
      tamilName: 'வியாசர்பாடி பொது நூலக குளிர் மையம்',
      distance: '1.8 km',
      address: '15 Nehru Nagar, Vyasarpadi',
      hours: '08:30 - 18:30 IST',
      capacity: '60 / 75 Persons',
      features: ['Air-Conditioned', 'Filtered Water', 'Wi-Fi Access'],
      isOpen: true,
    },
  ];

  // Water Tanker Deliveries Data
  const tankerSlots: TankerSlot[] = [
    {
      id: 't-1',
      truckId: 'CMWSSB-TN04-9841',
      location: 'Ward 32 Market Street Standpost',
      eta: '18 Mins',
      capacityLiters: 9000,
      status: 'In Transit',
    },
    {
      id: 't-2',
      truckId: 'CMWSSB-TN04-5120',
      location: 'Perambur Barracks Cross Road',
      eta: 'On Site (Filling)',
      capacityLiters: 6000,
      status: 'Arrived',
    },
    {
      id: 't-3',
      truckId: 'CMWSSB-TN04-3319',
      location: 'Vyasarpadi Jeeva Station Junction',
      eta: '14:30 IST (~1h 20m)',
      capacityLiters: 12000,
      status: 'Scheduled',
    },
  ];

  // Symptom triage evaluation
  const symptomsList = [
    { id: 'sweat', en: 'Profuse sweating & clammy skin', ta: 'அதிக வியர்வை மற்றும் தோல் குளிர்ச்சி', severe: false },
    { id: 'thirst', en: 'Extreme thirst & dry mouth', ta: 'கடுமையான தாகம் மற்றும் வறண்ட வாய்', severe: false },
    { id: 'dizzy', en: 'Dizziness, lightheadedness or vertigo', ta: 'மயக்கம், தலைசுற்றல்', severe: false },
    { id: 'nausea', en: 'Nausea, vomiting or muscle cramps', ta: 'குமட்டல், வாந்தி அல்லது தசைப்பிடிப்பு', severe: false },
    { id: 'faint', en: 'Fainting or loss of consciousness', ta: 'நினைவிழப்பு அல்லது சுயநினைவின்மை', severe: true },
    { id: 'nosweat', en: 'Hot, red, completely dry skin (no sweat)', ta: 'சூடான, சிவந்த, வியர்வை இல்லாத உலர்ந்த தோல்', severe: true },
    { id: 'confuse', en: 'Severe confusion, slurred speech or seizure', ta: 'கடும் குழப்பம், தெளிவற்ற பேச்சு, வலிப்பு', severe: true },
  ];

  const hasSevereSymptom = selectedSymptoms.some(
    (sId) => symptomsList.find((s) => s.id === sId)?.severe
  );

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // SMS Card Content (English & Tamil)
  const smsContent = language === 'en'
    ? `[CLIMA-SHIELD ADVISORY • ${selectedRegion.name.toUpperCase()}]\nStatus: ${riskBand} (Heat: ${selectedRegion.heat_risk}/100 | Water: ${selectedRegion.water_stress}/100)\nActive Alert: Wet-bulb heat advisory in effect. Avoid sun 11:30 AM - 4:00 PM.\nNearest Cooling Haven: Tondiarpet Community Hall (0.4 km, AC + Free ORS).\nNext Water Tanker: Ward 32 Standpost in 18 mins.\nEmergency Ambulance: Dial 108 | GCC Hotline: 1913.`
    : `[க்ளைமா-ஷீல்ட் எச்சரிக்கை • ${selectedRegion.name}]\nநிலை: ${riskBand === 'CRITICAL' ? 'ஆபத்தானது' : 'அதிக வெப்பம்'} (வெப்பம்: ${selectedRegion.heat_risk} | குடிநீர் பற்றாக்குறை: ${selectedRegion.water_stress})\nநேரடி வெயிலைத் தவிர்க்கவும் (காலை 11:30 - மாலை 4:00).\nஅருகில் உள்ள குளிர்விப்பு மையம்: தண்டையார்பேட்டை சமுதாய நலக்கூடம் (0.4 கி.மீ, ஏசி + இலவச ORS).\nகுடிநீர் டேங்கர்: வார்டு 32 பகுதியில் 18 நிமிடங்களில் வரும்.\nஅவசர ஆம்புலன்ஸ்: 108 | மாநகராட்சி உதவி: 1913.`;

  const handleCopySMS = () => {
    navigator.clipboard.writeText(smsContent);
    setCopiedSMS(true);
    setTimeout(() => setCopiedSMS(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Banner Card */}
      <div className="card-curvy p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[var(--border)] gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface-raised)] border border-[var(--border)] text-xs font-semibold text-[var(--brand)]">
              <Radio size={13} className="text-[var(--heat)] animate-pulse" />
              <span>{language === 'en' ? 'LOCAL RESIDENT EARLY WARNING' : 'பொதுமக்கள் நேரடி முன்னெச்சரிக்கை'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text)] mt-2">
              {language === 'en' ? `${selectedRegion.name} Climate Advisory` : `${selectedRegion.name} காலநிலை வழிகாட்டல்`}
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              {language === 'en'
                ? 'Hyperlocal wet-bulb thermal telemetry, verified cooling shelters, and municipal water tanker tracking.'
                : 'உங்கள் பகுதிக்கான நேரடி வெப்ப நிலை, குளிர்விப்பு மையங்கள் மற்றும் குடிநீர் டேங்கர் கண்காணிப்பு.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--surface-raised)] hover:bg-[var(--surface)] text-xs font-semibold text-[var(--text)] transition-colors cursor-pointer"
            >
              <Globe size={14} className="text-[var(--brand)]" />
              <span>{language === 'en' ? 'தமிழில் பார்க்கவும்' : 'Switch to English'}</span>
            </button>
          </div>
        </div>

        {/* Current Ambient Conditions Overview Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)]">
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <Thermometer size={15} className="text-[var(--heat)]" />
              <span>{language === 'en' ? 'Feels Like Temp' : 'உணரப்படும் வெப்பம்'}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono-numbers text-[var(--heat)] mt-1">
              42.8°C
            </div>
            <div className="text-[11px] text-[var(--text-muted)] mt-1">
              {language === 'en' ? 'Wet-bulb: 30.2°C (Caution)' : 'ஈரக்குமிழ்: 30.2°C'}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)]">
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <Sun size={15} className="text-[var(--heat)]" />
              <span>{language === 'en' ? 'UV Exposure Index' : 'புற ஊதா கதிர்வீச்சு'}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono-numbers text-[var(--text)] mt-1">
              11.2 <span className="text-xs font-semibold text-[var(--critical)] uppercase">Extreme</span>
            </div>
            <div className="text-[11px] text-[var(--text-muted)] mt-1">
              {language === 'en' ? 'Sun protection required' : 'நேரடி வெயிலைத் தவிர்க்கவும்'}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)]">
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <Droplets size={15} className="text-[var(--water)]" />
              <span>{language === 'en' ? 'Drinking Water Stress' : 'குடிநீர் பற்றாக்குறை'}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono-numbers text-[var(--water)] mt-1">
              {selectedRegion.water_stress} <span className="text-xs font-normal text-[var(--text-muted)]">/ 100</span>
            </div>
            <div className="text-[11px] text-[var(--text-muted)] mt-1">
              {language === 'en' ? 'Tanker frequency enhanced' : 'டேங்கர் விநியோகம் அதிகரிப்பு'}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)]">
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <Clock size={15} className="text-[var(--brand)]" />
              <span>{language === 'en' ? 'Peak Danger Window' : 'ஆபத்தான நேரம்'}</span>
            </div>
            <div className="text-lg sm:text-xl font-bold font-mono-numbers text-[var(--critical)] mt-1">
              11:30 - 16:00
            </div>
            <div className="text-[11px] text-[var(--text-muted)] mt-1">
              {language === 'en' ? 'Stay indoors / under shade' : 'நிழலில் இருக்கவும்'}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs for Easy Exploration */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-5 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-[var(--brand)] text-[var(--bg)] shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-raised)]'
          }`}
        >
          {language === 'en' ? 'Advisory & Action' : 'பொது எச்சரிக்கை'}
        </button>

        <button
          onClick={() => setActiveTab('cooling')}
          className={`px-5 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'cooling'
              ? 'bg-[var(--brand)] text-[var(--bg)] shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-raised)]'
          }`}
        >
          {language === 'en' ? 'Cooling Havens (4)' : 'குளிர்விப்பு மையங்கள் (4)'}
        </button>

        <button
          onClick={() => setActiveTab('water')}
          className={`px-5 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'water'
              ? 'bg-[var(--brand)] text-[var(--bg)] shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-raised)]'
          }`}
        >
          {language === 'en' ? 'Water Tanker Live Schedule' : 'குடிநீர் டேங்கர் விநியோகம்'}
        </button>

        <button
          onClick={() => setActiveTab('triage')}
          className={`px-5 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'triage'
              ? 'bg-[var(--brand)] text-[var(--bg)] shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-raised)]'
          }`}
        >
          {language === 'en' ? 'Heat Health Symptom Checker' : 'உடல்நல பரிசோதனை'}
        </button>
      </div>

      {/* TAB 1: OVERVIEW & IMMEDIATE COMMUNITY ACTION */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Direct One-Tap Emergency Facility Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => setActiveTab('cooling')}
              className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand)] text-left cursor-pointer transition-all shadow-sm group"
            >
              <div className="flex items-center justify-between">
                <span className="p-3 rounded-xl bg-[var(--brand-mint)]/30 text-[var(--brand)]">
                  <Navigation size={18} />
                </span>
                <span className="text-[11px] font-mono-numbers text-[var(--brand)] font-semibold">0.4 km</span>
              </div>
              <div className="mt-3 text-sm font-bold text-[var(--text)] group-hover:text-[var(--brand)] transition-colors">
                {language === 'en' ? 'Nearest Cooling Center' : 'அருகில் உள்ள குளிர்விப்பு மையம்'}
              </div>
              <div className="text-xs text-[var(--text-muted)] mt-1">
                Tondiarpet Community Hall (AC + Free Water)
              </div>
            </button>

            <button
              onClick={() => setActiveTab('water')}
              className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--water)] text-left cursor-pointer transition-all shadow-sm group"
            >
              <div className="flex items-center justify-between">
                <span className="p-3 rounded-xl bg-[var(--water)]/10 text-[var(--water)]">
                  <Droplets size={18} />
                </span>
                <span className="text-[11px] font-mono-numbers text-[var(--water)] font-semibold">ETA 18m</span>
              </div>
              <div className="mt-3 text-sm font-bold text-[var(--text)] group-hover:text-[var(--water)] transition-colors">
                {language === 'en' ? 'Water Standpost Tanker' : 'குடிநீர் டேங்கர் வாகனம்'}
              </div>
              <div className="text-xs text-[var(--text-muted)] mt-1">
                Ward 32 Market Junction (9,000 L)
              </div>
            </button>

            <button
              onClick={() => setActiveTab('triage')}
              className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--heat)] text-left cursor-pointer transition-all shadow-sm group"
            >
              <div className="flex items-center justify-between">
                <span className="p-3 rounded-xl bg-[var(--heat)]/10 text-[var(--heat)]">
                  <Heart size={18} />
                </span>
                <span className="text-[11px] font-mono-numbers text-[var(--heat)] font-semibold">Self-Check</span>
              </div>
              <div className="mt-3 text-sm font-bold text-[var(--text)] group-hover:text-[var(--heat)] transition-colors">
                {language === 'en' ? 'Heat Stroke Symptom Triage' : 'வெப்ப பக்கவாதம் பரிசோதனை'}
              </div>
              <div className="text-xs text-[var(--text-muted)] mt-1">
                Instant guidance: Mild, Moderate, or Call 108
              </div>
            </button>

            <a
              href="tel:108"
              className="p-5 rounded-2xl border border-[var(--critical)]/40 bg-[var(--surface)] hover:bg-[var(--surface-raised)] text-left cursor-pointer transition-all shadow-sm block group"
            >
              <div className="flex items-center justify-between">
                <span className="p-3 rounded-xl bg-[var(--critical)]/10 text-[var(--critical)]">
                  <Phone size={18} />
                </span>
                <span className="text-[11px] font-mono-numbers text-[var(--critical)] font-bold">Free Dial</span>
              </div>
              <div className="mt-3 text-sm font-bold text-[var(--critical)]">
                {language === 'en' ? 'Emergency 108 Helpline' : 'அவசர உதவி எண் 108'}
              </div>
              <div className="text-xs text-[var(--text-muted)] mt-1">
                Medical emergency ambulance & triage
              </div>
            </a>
          </div>

          {/* Shareable SMS & WhatsApp Emergency Broadcast Card */}
          <div className="card-clean p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-[var(--text)]">
                  {language === 'en' ? 'Broadcast SMS / WhatsApp Community Alert' : 'சமூக வாட்ஸ்அப் / எஸ்எம்எஸ் செய்தி'}
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  {language === 'en'
                    ? 'Offline-ready formatted text ready to forward to family groups and neighborhood watch lists.'
                    : 'உங்கள் குடும்பத்தினர் மற்றும் நண்பர்களுக்கு பகிரக்கூடிய உடனடி செய்தி.'}
                </p>
              </div>

              <button
                onClick={handleCopySMS}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)] text-xs font-semibold cursor-pointer transition-colors shadow-sm self-start sm:self-center"
              >
                {copiedSMS ? <Check size={14} /> : <Copy size={14} />}
                <span>
                  {copiedSMS
                    ? (language === 'en' ? 'Copied to Clipboard' : 'நகலெடுக்கப்பட்டது')
                    : (language === 'en' ? 'Copy Text Message' : 'செய்தியை நகலெடு')}
                </span>
              </button>
            </div>

            <div className="p-4 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] font-mono-numbers text-xs text-[var(--text)] whitespace-pre-line leading-relaxed">
              {smsContent}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DETAILED COOLING CENTERS DIRECTORY */}
      {activeTab === 'cooling' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
            <div>
              <h2 className="text-base font-bold text-[var(--text)]">
                {language === 'en' ? 'Verified Cooling Centers in Your Ward' : 'உங்கள் பகுதிக்கான குளிர்விப்பு மையங்கள்'}
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                {language === 'en'
                  ? 'All centers provide free clean drinking water, shaded seating, and first-aid hydration supplies.'
                  : 'அனைத்து மையங்களிலும் இலவச குடிநீர், நிழல் வசதி மற்றும் முதலுதவி வசதிகள் உள்ளன.'}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[var(--text-muted)]">Status:</span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[var(--brand-mint)]/30 text-[var(--brand)] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)]" />
                <span>All 4 Open Today</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coolingCenters.map((center) => (
              <div
                key={center.id}
                className="p-5 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand)] transition-all shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text)]">
                      {language === 'en' ? center.name : center.tamilName}
                    </h3>
                    <div className="text-xs text-[var(--text-muted)] flex items-center gap-1.5 mt-1 font-mono-numbers">
                      <MapPin size={12} className="text-[var(--brand)]" />
                      <span>{center.address}</span>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded bg-[var(--surface-raised)] border border-[var(--border)] text-xs font-mono-numbers font-bold text-[var(--brand)] shrink-0">
                    {center.distance}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border)] text-[11px]">
                  <span className="text-[var(--text-muted)] font-mono-numbers">Hours: <strong>{center.hours}</strong></span>
                  <span className="text-[var(--border)]">•</span>
                  <span className="text-[var(--text-muted)] font-mono-numbers">Occupancy: <strong>{center.capacity}</strong></span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {center.features.map((feat) => (
                    <span
                      key={feat}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-muted)]"
                    >
                      {feat}
                    </span>
                  ))}
                </div>

                <div className="pt-2">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(center.address + ' Chennai')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--brand)] hover:text-[var(--brand-hover)] transition-colors"
                  >
                    <Navigation size={13} />
                    <span>{language === 'en' ? 'Get Walking Directions' : 'வழித்தடத்தை பார்க்க'}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: WATER TANKER TRACKER & STANDPOST */}
      {activeTab === 'water' && (
        <div className="space-y-6">
          <div className="card-clean p-6 space-y-4">
            <div>
              <h2 className="text-base font-bold text-[var(--text)]">
                {language === 'en' ? 'Municipal Drinking Water Tanker Dispatch' : 'குடிநீர் டேங்கர் லாரி வருகை விவரம்'}
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {language === 'en'
                  ? 'Real-time schedule of Chennai Metrowater (CMWSSB) emergency tankers delivering to your ward.'
                  : 'உங்கள் பகுதிக்கு வரும் குடிநீர் லாரிகளின் நேரடி நிலை.'}
              </p>
            </div>

            <div className="space-y-3">
              {tankerSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="p-4 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono-numbers font-bold text-[var(--text)]">
                        {slot.truckId}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                          slot.status === 'Arrived'
                            ? 'bg-[var(--brand-mint)]/40 text-[var(--brand)]'
                            : slot.status === 'In Transit'
                            ? 'bg-[var(--water)]/10 text-[var(--water)]'
                            : 'bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)]'
                        }`}
                      >
                        {slot.status}
                      </span>
                    </div>
                    <div className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
                      <MapPin size={12} className="text-[var(--water)]" />
                      <span>{slot.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 font-mono-numbers self-end sm:self-center">
                    <div className="text-right">
                      <div className="text-[11px] text-[var(--text-muted)]">Capacity</div>
                      <div className="text-xs font-bold text-[var(--text)]">
                        {slot.capacityLiters.toLocaleString()} L
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-[var(--text-muted)]">Expected Delivery</div>
                      <div className="text-xs font-bold text-[var(--water)]">{slot.eta}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[var(--text-muted)] border-t border-[var(--border)]">
              <span>Standard Allocation: <strong>20 Litres per family daily</strong> without charge</span>
              <a
                href="tel:1913"
                className="inline-flex items-center gap-1.5 font-bold text-[var(--brand)] hover:underline"
              >
                <Phone size={13} />
                <span>Call 1913 to request emergency tanker</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: HEAT HEALTH SELF-TRIAGE CHECKER */}
      {activeTab === 'triage' && (
        <div className="card-clean p-6 sm:p-8 space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--heat)]">
              <Activity size={14} />
              <span>{language === 'en' ? 'Interactive Clinical Self-Triage' : 'சுய உடல்நல பரிசோதனை'}</span>
            </div>
            <h2 className="text-xl font-bold text-[var(--text)] mt-1">
              {language === 'en' ? 'Heat Exhaustion vs Heat Stroke Checker' : 'வெப்ப பக்கவாதம் கண்டறிதல்'}
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {language === 'en'
                ? 'Select any symptoms currently experienced by you or a family member to receive immediate clinical action steps.'
                : 'உங்களுக்கு ஏற்படும் அறிகுறிகளை தேர்வு செய்து தகுந்த முதலுதவி ஆலோசனையைப் பெறுங்கள்.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {symptomsList.map((sym) => {
              const isChecked = selectedSymptoms.includes(sym.id);
              return (
                <div
                  key={sym.id}
                  onClick={() => toggleSymptom(sym.id)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                    isChecked
                      ? sym.severe
                        ? 'border-[var(--critical)] bg-[var(--critical)]/5 font-semibold'
                        : 'border-[var(--brand)] bg-[var(--brand-mint)]/20 font-semibold'
                      : 'border-[var(--border)] bg-[var(--surface-raised)] hover:border-[var(--brand)]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 border ${
                      isChecked
                        ? sym.severe
                          ? 'border-[var(--critical)] bg-[var(--critical)] text-white'
                          : 'border-[var(--brand)] bg-[var(--brand)] text-white'
                        : 'border-[var(--border)] bg-[var(--surface)]'
                    }`}
                  >
                    {isChecked && <Check size={12} />}
                  </div>
                  <div>
                    <div className="text-xs text-[var(--text)] leading-snug">
                      {language === 'en' ? sym.en : sym.ta}
                    </div>
                    {sym.severe && (
                      <span className="text-[10px] text-[var(--critical)] font-bold mt-1 inline-block uppercase">
                        {language === 'en' ? '• High Emergency Sign' : '• தீவிர ஆபத்து அறிகுறி'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Triage Evaluation Result Box */}
          <div className="pt-4 border-t border-[var(--border)]">
            {selectedSymptoms.length === 0 ? (
              <div className="p-4 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] text-center text-xs text-[var(--text-muted)]">
                {language === 'en'
                  ? 'No symptoms selected. Click any symptoms above to evaluate urgency.'
                  : 'அறிகுறிகளை மேலே தேர்ந்தெடுத்து அவசரநிலையை சரிபார்க்கவும்.'}
              </div>
            ) : hasSevereSymptom ? (
              <div className="p-5 rounded-lg bg-[var(--critical)]/10 border-2 border-[var(--critical)] space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-[var(--critical)]">
                  <AlertTriangle size={18} />
                  <span>
                    {language === 'en'
                      ? 'CRITICAL EMERGENCY: PROBABLE HEAT STROKE'
                      : 'அவசர நிலை: வெப்ப பக்கவாத ஆபத்து'}
                  </span>
                </div>
                <p className="text-xs text-[var(--text)] leading-relaxed">
                  {language === 'en'
                    ? 'Heat stroke is a life-threatening medical emergency. The human body is failing to regulate core temperature.'
                    : 'இது உயிருக்கு ஆபத்தான நிலை. உடனடியாக மருத்துவ உதவி தேவை.'}
                </p>
                <div className="p-3 bg-[var(--surface)] rounded border border-[var(--border)] text-xs text-[var(--text)] space-y-1">
                  <div>1. <strong>Call 108 immediately</strong> for an ambulance.</div>
                  <div>2. Move the person to an air-conditioned room or cool shade.</div>
                  <div>3. Cool the body rapidly with cold water or ice packs under armpits & neck.</div>
                  <div>4. <strong>Do NOT</strong> force fluids if the person is semi-conscious.</div>
                </div>
                <a
                  href="tel:108"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded bg-[var(--critical)] text-white text-xs font-bold hover:opacity-90"
                >
                  <Phone size={14} />
                  <span>{language === 'en' ? 'Call 108 Ambulance Now' : '108 ஆம்புலன்ஸை அழைக்க'}</span>
                </a>
              </div>
            ) : (
              <div className="p-5 rounded-lg bg-[var(--brand-mint)]/20 border border-[var(--brand)] space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-[var(--brand)]">
                  <ShieldCheck size={18} />
                  <span>
                    {language === 'en'
                      ? 'MODERATE HEAT EXHAUSTION / DEHYDRATION'
                      : 'மிதமான வெப்ப சோர்வு / நீரிழப்பு'}
                  </span>
                </div>
                <p className="text-xs text-[var(--text)] leading-relaxed">
                  {language === 'en'
                    ? 'Symptoms indicate heat exhaustion. If untreated within 30 minutes, it can escalate to heat stroke.'
                    : 'உடனடியாக நிழலில் ஓய்வெடுத்து நீர் அருந்தவும்.'}
                </p>
                <div className="p-3 bg-[var(--surface)] rounded border border-[var(--border)] text-xs text-[var(--text)] space-y-1">
                  <div>• Rest in the nearest shaded or air-conditioned haven.</div>
                  <div>• Sip 500ml cold water mixed with an ORS electrolyte packet.</div>
                  <div>• Loosen tight clothing and sponge skin with cool water.</div>
                  <div>• If vomiting prevents drinking for 30 minutes, proceed to clinic.</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <DataMetadataFooter
        source="IMD Wet-Bulb Monitoring, Greater Chennai Corporation & CMWSSB"
        model="Citizen Mobile Advisory Service v2.0"
        confidence="high"
      />
    </div>
  );
};
