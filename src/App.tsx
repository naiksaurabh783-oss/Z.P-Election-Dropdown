import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  FileSpreadsheet,
  FileText,
  Download,
  Share2,
  Search,
  Layers,
  Table as TableIcon,
  BarChart3,
  ExternalLink,
  Check,
  Globe,
  Sparkles,
  Info,
  Building2,
  ChevronDown,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';
import { SAVNER_HIERARCHY, PanchayatSamitiHierarchy, getHierarchyStats } from './data/savnerData';
import { INITIAL_NAGPUR_TALUKAS } from './data/allDistrictData';
import { flattenHierarchy } from './services/googleSheets';
import { initAuth, googleSignIn, logout, getAccessToken } from './services/firebaseAuth';
import { GoogleSignInButton } from './components/GoogleSignInButton';
import { ExportModal } from './components/ExportModal';
import { PdfViewerModal } from './components/PdfViewerModal';
import { DistrictRollupView } from './components/DistrictRollupView';
import { HierarchyTreeView } from './components/HierarchyTreeView';
import { GazetteTableView } from './components/GazetteTableView';
import { AnalyticsView } from './components/AnalyticsView';
import { PWAInstallModal } from './components/PWAInstallModal';
import { DataSourceModal } from './components/DataSourceModal';
import { DynamicSearchModal } from './components/DynamicSearchModal';
import { usePWAInstall } from './hooks/usePWAInstall';

export default function App() {
  const [activeTab, setActiveTab] = useState<'district' | 'tree' | 'table' | 'analytics' | 'pdf'>('tree');
  const [language, setLanguage] = useState<'mr' | 'en' | 'bilingual'>('bilingual');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDataSourceModalOpen, setIsDataSourceModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Multi-Taluka state (Initialized with all 13 Talukas of Nagpur District from Official Gazette)
  const [allTalukas, setAllTalukas] = useState<PanchayatSamitiHierarchy[]>(() => {
    try {
      const version = localStorage.getItem('nagpur_data_version');
      if (version === 'v3_all_13_official_gazette') {
        const saved = localStorage.getItem('panchayat_samiti_talukas');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length >= 13) return parsed;
        }
      } else {
        localStorage.setItem('nagpur_data_version', 'v3_all_13_official_gazette');
        localStorage.setItem('panchayat_samiti_talukas', JSON.stringify(INITIAL_NAGPUR_TALUKAS));
      }
    } catch (e) {
      console.warn('Could not read saved talukas', e);
    }
    return INITIAL_NAGPUR_TALUKAS;
  });

  const [activeTaluka, setActiveTaluka] = useState<PanchayatSamitiHierarchy>(() => {
    return allTalukas[0] || SAVNER_HIERARCHY;
  });

  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Modals & PWA
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportModalMode, setExportModalMode] = useState<'current' | 'master'>('current');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // PWA Mobile Install Hook
  const { isInstallable, isInstalled, isIOS, isAndroid, install: installPWA } = usePWAInstall();

  // Initialize Firebase Auth
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAccessToken(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Global keyboard shortcut to open dynamic search (/ or Ctrl+K / Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'SELECT'
      ) {
        return;
      }
      if (e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Navigate directly to item from global dynamic search
  const handleNavigateFromSearch = (
    talukaEn: string,
    targetTab: 'tree' | 'table',
    matchedQuery: string
  ) => {
    const found = allTalukas.find(
      (t) => t.talukaEn.toLowerCase() === talukaEn.toLowerCase()
    );
    if (found) {
      setActiveTaluka(found);
    }
    setSearchQuery(matchedQuery);
    setActiveTab(targetTab);
  };

  const handleSignIn = async () => {
    try {
      setIsAuthLoading(true);
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setAccessToken(res.accessToken);
      }
    } catch (err) {
      console.error('Sign-in error:', err);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setUser(null);
    setAccessToken(null);
  };

  const handleOpenExportModal = (mode: 'current' | 'master' = 'current') => {
    setExportModalMode(mode);
    setIsExportModalOpen(true);
  };

  const handleDownloadCsv = () => {
    const flat = flattenHierarchy(activeTaluka);
    const headers = [
      'Sr No',
      'Taluka (Marathi)',
      'Taluka (English)',
      'Division No',
      'Division Code',
      'Division Name (Marathi)',
      'Division Name (English)',
      'Gan No',
      'Gan Code',
      'Gan Name (Marathi)',
      'Gan Name (English)',
      'Gram Panchayat Sr No',
      'Gram Panchayat (Marathi)',
      'Gram Panchayat (English)',
      'Village Sr No',
      'Village / Area (Marathi)',
      'Village / Area (English)',
      'Notes',
    ];

    const rows = flat.map((r, i) => [
      i + 1,
      `"${r.talukaMr}"`,
      `"${r.talukaEn}"`,
      r.divisionNumber,
      `"${r.divisionCode}"`,
      `"${r.divisionNameMr}"`,
      `"${r.divisionNameEn}"`,
      r.ganNumber,
      `"${r.ganCode}"`,
      `"${r.ganNameMr}"`,
      `"${r.ganNameEn}"`,
      r.gpSerialNo,
      `"${r.gpNameMr}"`,
      `"${r.gpNameEn}"`,
      r.villageSerialNo,
      `"${r.villageNameMr}"`,
      `"${r.villageNameEn}"`,
      `"${r.notes || ''}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${activeTaluka.talukaEn.toLowerCase()}_panchayat_samiti_hierarchy.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activeTaluka, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${activeTaluka.talukaEn.toLowerCase()}_hierarchy_extracted.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getLabel = (mr: string, en: string) => {
    if (language === 'mr') return mr;
    if (language === 'en') return en;
    return `${mr} (${en})`;
  };

  const currentFlat = flattenHierarchy(activeTaluka);
  const currentDivCount = activeTaluka.divisions.length;
  let currentGanCount = 0;
  let currentGpCount = 0;
  activeTaluka.divisions.forEach((d) => {
    currentGanCount += d.gana.length;
    d.gana.forEach((g) => (currentGpCount += g.gramPanchayats.length));
  });

  return (
    <div className="min-h-screen bg-stone-100/70 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans selection:bg-emerald-500/20">
      {/* Top Header */}
      <header className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 sticky top-0 z-40 backdrop-blur-md bg-white/90 dark:bg-stone-900/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-3 flex flex-wrap items-center justify-between gap-3">
            {/* Title & Taluka Switcher */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-bold text-lg shadow-sm border border-emerald-500/30">
                🏛️
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    महाराष्ट्र शासन • {activeTaluka.districtMr} जिल्हा
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono hidden md:inline">
                    परिशिष्ट - ८ (ब)
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <h1 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white leading-tight">
                    {getLabel(activeTaluka.talukaMr, activeTaluka.talukaEn)} पंचायत समिती
                  </h1>

                  {/* Taluka Selector Dropdown */}
                  <div className="relative">
                    <select
                      value={activeTaluka.talukaEn}
                      onChange={(e) => {
                        const found = allTalukas.find((t) => t.talukaEn === e.target.value);
                        if (found) setActiveTaluka(found);
                      }}
                      className="text-xs bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 px-2.5 py-1 rounded-lg border border-stone-300 dark:border-stone-700 font-semibold cursor-pointer shadow-2xs"
                    >
                      {allTalukas.map((t) => (
                        <option key={t.talukaEn} value={t.talukaEn}>
                          {t.talukaMr} ({t.talukaEn})
                        </option>
                      ))}
                    </select>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hidden sm:inline-flex items-center gap-1">
                    <Check size={10} />
                    <span>{language === 'mr' ? 'अधिकृत राजपत्र' : 'Gazette Verified'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions & Auth */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Dynamic District-Wide Search Button */}
              <button
                onClick={() => setIsSearchModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-linear-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-full text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer ring-1 ring-emerald-400/40 group"
                title="Search village, Z.P. division or P.S. gana (Press / or Ctrl+K)"
              >
                <Search size={14} className="text-emerald-100 group-hover:scale-110 transition-transform" />
                <span>{language === 'mr' ? 'गाव / जि.प. / पं.स. शोधा' : 'Search Village/Z.P./P.S.'}</span>
                <kbd className="hidden lg:inline-block text-[10px] bg-black/20 px-1.5 py-0.2 rounded text-emerald-100 font-mono">
                  /
                </kbd>
              </button>

              {/* Mobile App Install Button */}
              <button
                onClick={() => setIsPwaModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer ring-1 ring-blue-400/30"
                title="Install app on mobile device or get APK instructions"
              >
                <Smartphone size={14} className="text-blue-100" />
                <span>{language === 'mr' ? 'मोबाईल ॲप' : 'Install App'}</span>
              </button>

              {/* Data Source Transparency Button */}
              <button
                onClick={() => setIsDataSourceModalOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-full text-xs font-medium transition-all cursor-pointer border border-stone-200 dark:border-stone-700"
                title="View where the data came from & verification details"
              >
                <Info size={13} className="text-emerald-600 dark:text-emerald-400" />
                <span className="hidden md:inline">{language === 'mr' ? 'डेटा माहिती' : 'Data Info'}</span>
              </button>

              {/* Language Switch */}
              <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-0.5 rounded-full border border-stone-200 dark:border-stone-700 text-xs">
                <button
                  onClick={() => setLanguage('mr')}
                  className={`px-2.5 py-1 rounded-full font-medium transition-all cursor-pointer ${
                    language === 'mr'
                      ? 'bg-white dark:bg-stone-700 text-emerald-800 dark:text-emerald-300 shadow-2xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  मराठी
                </button>
                <button
                  onClick={() => setLanguage('bilingual')}
                  className={`px-2.5 py-1 rounded-full font-medium transition-all cursor-pointer ${
                    language === 'bilingual'
                      ? 'bg-white dark:bg-stone-700 text-emerald-800 dark:text-emerald-300 shadow-2xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  दोन्ही
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2.5 py-1 rounded-full font-medium transition-all cursor-pointer ${
                    language === 'en'
                      ? 'bg-white dark:bg-stone-700 text-emerald-800 dark:text-emerald-300 shadow-2xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  EN
                </button>
              </div>

              {/* Export to Google Sheets Button */}
              <button
                onClick={() => handleOpenExportModal('current')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer"
                title="Export directly to Google Sheets"
              >
                <FileSpreadsheet size={14} />
                <span className="hidden sm:inline">Sheets</span>
              </button>

              {/* Google Sign-in Chip */}
              <GoogleSignInButton
                user={user}
                onSignIn={handleSignIn}
                onSignOut={handleSignOut}
                isLoading={isAuthLoading}
              />
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex items-center justify-between border-t border-stone-200/60 dark:border-stone-800/80 pt-2 pb-1 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setActiveTab('district')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'district'
                    ? 'bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 font-semibold'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <Building2 size={14} className="text-emerald-600" />
                <span>{language === 'mr' ? 'नागपूर जिल्हा रोलअप (१३ तालुके)' : 'Nagpur District (13 Talukas)'}</span>
              </button>

              <button
                onClick={() => setActiveTab('tree')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'tree'
                    ? 'bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 font-semibold'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <Layers size={14} />
                <span>{language === 'mr' ? 'अनुक्रम रचना' : 'Hierarchical Tree'}</span>
              </button>

              <button
                onClick={() => setActiveTab('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'table'
                    ? 'bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 font-semibold'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <TableIcon size={14} />
                <span>{language === 'mr' ? 'परिशिष्ट-८ब तक्ता' : 'Gazette Table'}</span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === 'analytics'
                    ? 'bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 font-semibold'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <BarChart3 size={14} />
                <span>{language === 'mr' ? 'आकडेवारी' : 'Stats'}</span>
              </button>

              {/* Dynamic Search Pill in Tab Bar */}
              <button
                onClick={() => setIsSearchModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors cursor-pointer shadow-2xs ml-1"
                title="Search any village, Z.P. or P.S."
              >
                <Search size={13} className="text-amber-600 dark:text-amber-400" />
                <span>{language === 'mr' ? 'शोध यंत्रणा' : 'Search All'}</span>
              </button>

              {activeTaluka.talukaEn.toLowerCase() === 'savner' && (
                <button
                  onClick={() => setIsPdfModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  <FileText size={14} className="text-rose-600" />
                  <span>{language === 'mr' ? 'मूळ PDF' : 'PDF'}</span>
                </button>
              )}
            </div>

            {/* Quick Downloads */}
            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={handleDownloadCsv}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                title="Download as CSV"
              >
                <Download size={13} />
                <span className="hidden sm:inline">CSV</span>
              </button>

              <button
                onClick={handleDownloadJson}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
                title="Download JSON"
              >
                <Download size={13} />
                <span className="hidden sm:inline">JSON</span>
              </button>

              <button
                onClick={handleShare}
                className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                title="Copy share link"
              >
                {copiedLink ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 flex-1 w-full space-y-6">
        {/* Verification Status Banner */}
        {activeTab !== 'district' && (
          <div className="bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-300/80 dark:border-emerald-800 rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-2.5 text-xs shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">✓</span>
              <span className="text-emerald-900 dark:text-emerald-200">
                <strong>{language === 'mr' ? 'शासकीय राजपत्रातून अधिकृत संकलन:' : 'Official Gazette Delimitation Schedule:'}</strong>{' '}
                {language === 'mr'
                  ? `नागपूर जिल्हा परिशिष्ट-८ब अन्वये ${activeTaluka.talukaMr} पंचायत समिती प्रभाग रचना अधिकृतरीत्या संकलित आहे.`
                  : `Delimitation schedule for ${activeTaluka.talukaEn} Panchayat Samiti loaded from the Maharashtra Gazette.`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsDataSourceModalOpen(true)}
                className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:underline flex items-center gap-1 cursor-pointer bg-white/70 dark:bg-stone-800/80 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-700"
              >
                <ShieldCheck size={12} />
                <span>{language === 'mr' ? 'प्रमाणपत्र माहिती' : 'Gazette Info'}</span>
              </button>
              {activeTaluka.talukaEn.toLowerCase() === 'savner' && (
                <button
                  onClick={() => setIsPdfModalOpen(true)}
                  className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:underline flex items-center gap-1 cursor-pointer bg-white/70 dark:bg-stone-800/80 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-700"
                >
                  <FileText size={12} />
                  <span>{language === 'mr' ? 'मूळ गॅझेट' : 'View PDF'}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Quick Summary Pill Bar */}
        {activeTab !== 'district' && (
          <div className="bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 p-3.5 rounded-2xl shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-stone-700 dark:text-stone-300">
                {activeTaluka.talukaMr} ({activeTaluka.talukaEn}):
              </span>
              <span className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full font-medium border border-blue-200 dark:border-blue-900">
                {currentDivCount} {language === 'mr' ? 'जि.प. विभाग' : 'Z.P. Divisions'}
              </span>
              <span className="bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2.5 py-0.5 rounded-full font-medium border border-purple-200 dark:border-purple-900">
                {currentGanCount} {language === 'mr' ? 'पं.स. गण' : 'P.S. Gana'}
              </span>
              <span className="bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full font-medium border border-emerald-200 dark:border-emerald-900">
                {currentGpCount} {language === 'mr' ? 'ग्रामपंचायती' : 'GPs'}
              </span>
              <span className="bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 rounded-full font-medium border border-amber-200 dark:border-amber-900">
                {currentFlat.length} {language === 'mr' ? 'गावे/क्षेत्रे' : 'Villages/Areas'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('district')}
                className="text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Building2 size={12} />
                <span>{language === 'mr' ? 'सर्व १३ तालुके' : 'All 13 Talukas'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'district' && (
          <DistrictRollupView
            language={language}
            extractedTalukas={allTalukas}
            selectedTaluka={activeTaluka}
            onSelectTaluka={(taluka) => {
              setActiveTaluka(taluka);
              setActiveTab('tree');
            }}
            onExportMasterSheets={() => handleOpenExportModal('master')}
            onOpenAppInstall={() => setIsPwaModalOpen(true)}
            onOpenSearch={() => setIsSearchModalOpen(true)}
            userEmail={user?.email || undefined}
          />
        )}

        {activeTab === 'tree' && (
          <HierarchyTreeView
            language={language}
            searchQuery={searchQuery}
            data={activeTaluka}
          />
        )}

        {activeTab === 'table' && (
          <GazetteTableView
            language={language}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            data={activeTaluka}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView language={language} data={activeTaluka} />
        )}
      </main>

      {/* Mobile-Native Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 px-2 py-1.5 flex items-center justify-around shadow-lg safe-area-pb">
        <button
          onClick={() => setActiveTab('district')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-medium transition-colors cursor-pointer ${
            activeTab === 'district'
              ? 'text-emerald-700 dark:text-emerald-400 font-bold'
              : 'text-stone-500 hover:text-stone-900 dark:text-stone-400'
          }`}
        >
          <Building2 size={18} className={activeTab === 'district' ? 'text-emerald-600' : ''} />
          <span className="mt-0.5">{language === 'mr' ? 'जिल्हा' : 'District'}</span>
        </button>

        <button
          onClick={() => setActiveTab('tree')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-medium transition-colors cursor-pointer ${
            activeTab === 'tree'
              ? 'text-emerald-700 dark:text-emerald-400 font-bold'
              : 'text-stone-500 hover:text-stone-900 dark:text-stone-400'
          }`}
        >
          <Layers size={18} className={activeTab === 'tree' ? 'text-emerald-600' : ''} />
          <span className="mt-0.5">{language === 'mr' ? 'रचना' : 'Tree'}</span>
        </button>

        {/* Dynamic Search Centered Floating Action on Mobile */}
        <button
          onClick={() => setIsSearchModalOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold text-emerald-800 dark:text-emerald-300 transition-colors cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-linear-to-tr from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-md -mt-5 ring-4 ring-white dark:ring-stone-900 hover:scale-105 transition-transform">
            <Search size={18} />
          </div>
          <span className="mt-0.5 font-bold">{language === 'mr' ? 'शोधा' : 'Search'}</span>
        </button>

        <button
          onClick={() => setActiveTab('table')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-medium transition-colors cursor-pointer ${
            activeTab === 'table'
              ? 'text-emerald-700 dark:text-emerald-400 font-bold'
              : 'text-stone-500 hover:text-stone-900 dark:text-stone-400'
          }`}
        >
          <TableIcon size={18} className={activeTab === 'table' ? 'text-emerald-600' : ''} />
          <span className="mt-0.5">{language === 'mr' ? 'तक्ता' : 'Table'}</span>
        </button>

        <button
          onClick={() => setIsPwaModalOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold text-blue-600 dark:text-blue-400 transition-colors cursor-pointer"
        >
          <Smartphone size={18} />
          <span className="mt-0.5">{language === 'mr' ? 'ॲप' : 'App'}</span>
        </button>
      </nav>

      {/* Footer */}
      <footer className="bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 py-6 mb-14 md:mb-0 text-xs text-stone-500 dark:text-stone-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="font-semibold text-stone-700 dark:text-stone-300">
              महाराष्ट्र जिल्हा परिषद व पंचायत समिती अंतिम प्रभाग रचना (परिशिष्ट-८ ब)
            </div>
            <div className="text-[11px] mt-0.5">
              नागपूर जिल्हा • सर्व १३ पंचायत समित्या अधिकृत गॅझेट संकलन ॲप
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenExportModal('current')}
              className="text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <FileSpreadsheet size={13} />
              <span>Google Sheets Export</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsPwaModalOpen(true)}
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <Smartphone size={13} />
              <span>{language === 'mr' ? 'मोबाईल ॲप इन्स्टॉल करा' : 'Install Mobile App'}</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Export to Google Sheets Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        user={user}
        onPromptSignIn={handleSignIn}
        accessToken={accessToken}
        currentHierarchy={activeTaluka}
        allTalukas={allTalukas}
        defaultMode={exportModalMode}
      />

      {/* Original PDF Viewer Modal */}
      <PdfViewerModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        pdfPath="/assets/aistudio/savner_f59b02f5.pdf"
      />

      {/* PWA Mobile Installation Modal */}
      <PWAInstallModal
        isOpen={isPwaModalOpen}
        onClose={() => setIsPwaModalOpen(false)}
        language={language}
        isInstallable={isInstallable}
        isInstalled={isInstalled}
        isIOS={isIOS}
        isAndroid={isAndroid}
        onInstall={installPWA}
      />

      {/* Data Source Transparency Modal */}
      <DataSourceModal
        isOpen={isDataSourceModalOpen}
        onClose={() => setIsDataSourceModalOpen(false)}
        language={language}
      />

      {/* Dynamic Search Modal */}
      <DynamicSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        allTalukas={allTalukas}
        language={language}
        onNavigateToItem={handleNavigateFromSearch}
      />
    </div>
  );
}
