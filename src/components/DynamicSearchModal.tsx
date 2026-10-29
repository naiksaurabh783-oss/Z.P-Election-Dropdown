import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  X,
  MapPin,
  Building2,
  Layers,
  Table as TableIcon,
  Copy,
  Check,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info,
  Compass,
} from 'lucide-react';
import { PanchayatSamitiHierarchy } from '../data/savnerData';
import {
  buildDistrictSearchIndex,
  searchDistrictIndex,
  SearchResultItem,
  SearchItemType,
} from '../services/districtSearchIndex';

interface DynamicSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  allTalukas: PanchayatSamitiHierarchy[];
  language: 'mr' | 'en' | 'bilingual';
  onNavigateToItem: (
    talukaEn: string,
    targetTab: 'tree' | 'table',
    searchQuery: string
  ) => void;
}

export const DynamicSearchModal: React.FC<DynamicSearchModalProps> = ({
  isOpen,
  onClose,
  allTalukas,
  language,
  onNavigateToItem,
}) => {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<SearchItemType | 'all'>('all');
  const [talukaFilter, setTalukaFilter] = useState<string>('all');
  const [selectedResult, setSelectedResult] = useState<SearchResultItem | null>(null);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Build the index once
  const searchIndex = useMemo(() => buildDistrictSearchIndex(allTalukas), [allTalukas]);

  // Execute search
  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchDistrictIndex(searchIndex, query, {
      typeFilter,
      talukaFilter,
      limit: 60,
    });
  }, [searchIndex, query, typeFilter, talukaFilter]);

  // Auto-focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      if (results.length > 0 && !selectedResult) {
        setSelectedResult(results[0]);
      }
    }
  }, [isOpen]);

  // Update selected item when results change
  useEffect(() => {
    if (results.length > 0) {
      // If current selection is in results, keep it, else pick first
      const stillThere = results.find((r) => r.id === selectedResult?.id);
      if (!stillThere) {
        setSelectedResult(results[0]);
      }
    } else {
      setSelectedResult(null);
    }
  }, [results]);

  // Keyboard navigation & close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyDetails = (item: SearchResultItem) => {
    const lines = [
      `🏛️ नागपूर जिल्हा परिषद व पंचायत समिती प्रभाग माहिती`,
      `तालुका: ${item.talukaMr} (${item.talukaEn})`,
      item.divisionNumber ? `जि.प. विभाग क्र.: ${item.divisionCode || `${item.divisionNumber}-${item.divisionNameMr}`} (${item.divisionNameEn})` : null,
      item.ganNumber ? `पं.स. गण क्र.: ${item.ganCode || `${item.ganNumber}-${item.ganNameMr}`} (${item.ganNameEn})` : null,
      item.gpNameMr ? `ग्रामपंचायत: ${item.gpSerial ? `${item.gpSerial}. ` : ''}${item.gpNameMr} (${item.gpNameEn})` : null,
      item.villageNameMr ? `गाव / क्षेत्र: ${item.villageNameMr} (${item.villageNameEn})${item.notes ? ` [${item.notes}]` : ''}` : null,
    ].filter(Boolean);

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTypeColor = (type: SearchItemType) => {
    switch (type) {
      case 'village':
        return 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'gp':
        return 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      case 'gana':
        return 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800';
      case 'division':
        return 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800';
      case 'taluka':
        return 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800';
    }
  };

  const getLabel = (mr: string, en: string) => {
    if (language === 'mr') return mr;
    if (language === 'en') return en;
    return `${mr} (${en})`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-2 sm:p-4 md:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 rounded-2xl w-full max-w-4xl shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col max-h-[92vh] overflow-hidden mt-4 sm:mt-8">
        {/* Top Search Input Bar */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center gap-3 bg-stone-50/80 dark:bg-stone-850">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Search size={20} />
          </div>

          <div className="relative grow">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                language === 'mr'
                  ? 'गावाचे नाव, जि.प. विभाग किंवा पं.स. गण शोधा (उदा. बडेगाव, पाटणसावंगी, हिंगणा...)'
                  : 'Search village, Z.P. division or P.S. gana (e.g. Badegaon, Patansawangi, Hingna...)'
              }
              className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl px-4 py-2.5 text-sm sm:text-base text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1 rounded-md"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-2 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors shrink-0"
            title="Close (Esc)"
          >
            <X size={20} />
          </button>
        </div>

        {/* Filter Controls Row */}
        <div className="px-4 py-2.5 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Type filters */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-2.5 py-1 rounded-full font-medium transition-all cursor-pointer ${
                typeFilter === 'all'
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-2xs font-semibold'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              {language === 'mr' ? 'सर्व (All)' : 'All Results'}
            </button>
            <button
              onClick={() => setTypeFilter('village')}
              className={`px-2.5 py-1 rounded-full font-medium transition-all cursor-pointer ${
                typeFilter === 'village'
                  ? 'bg-amber-600 text-white font-semibold shadow-2xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              🏡 {language === 'mr' ? 'गावे/वस्त्या' : 'Villages'}
            </button>
            <button
              onClick={() => setTypeFilter('gana')}
              className={`px-2.5 py-1 rounded-full font-medium transition-all cursor-pointer ${
                typeFilter === 'gana'
                  ? 'bg-purple-600 text-white font-semibold shadow-2xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              🗳️ {language === 'mr' ? 'पं.स. गण' : 'P.S. Gana'}
            </button>
            <button
              onClick={() => setTypeFilter('division')}
              className={`px-2.5 py-1 rounded-full font-medium transition-all cursor-pointer ${
                typeFilter === 'division'
                  ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              🏛️ {language === 'mr' ? 'जि.प. विभाग' : 'Z.P. Divisions'}
            </button>
            <button
              onClick={() => setTypeFilter('gp')}
              className={`px-2.5 py-1 rounded-full font-medium transition-all cursor-pointer ${
                typeFilter === 'gp'
                  ? 'bg-emerald-600 text-white font-semibold shadow-2xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              📋 {language === 'mr' ? 'ग्रामपंचायत' : 'GPs'}
            </button>
          </div>

          {/* Taluka Selector Filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-stone-500 text-[11px] font-medium hidden sm:inline">
              {language === 'mr' ? 'तालुका:' : 'Taluka:'}
            </span>
            <select
              value={talukaFilter}
              onChange={(e) => setTalukaFilter(e.target.value)}
              className="text-xs bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 px-2.5 py-1 rounded-lg border border-stone-300 dark:border-stone-700 font-medium cursor-pointer"
            >
              <option value="all">
                {language === 'mr' ? 'सर्व १३ तालुके (All 13 Talukas)' : 'All 13 Talukas'}
              </option>
              {allTalukas.map((t) => (
                <option key={t.talukaEn} value={t.talukaEn}>
                  {t.talukaMr} ({t.talukaEn})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Results Body */}
        <div className="grow overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-stone-200 dark:divide-stone-800">
          {/* Left Column: Results List */}
          <div className="w-full md:w-1/2 overflow-y-auto p-3 space-y-1.5 max-h-[48vh] md:max-h-[58vh]">
            {!query.trim() ? (
              <div className="py-6 px-3 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                  <Compass size={24} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200">
                    {language === 'mr' ? 'नागपूर जिल्हा शोध यंत्रणा' : 'Nagpur District Instant Search'}
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-1 max-w-sm mx-auto leading-relaxed">
                    {language === 'mr'
                      ? 'कोणत्याही गावाचे नाव, जि.प. निवडणूक विभाग किंवा पं.स. गणाचे नाव टाईप करून त्याची संपूर्ण माहिती तत्काळ मिळवा.'
                      : 'Type any village name, Z.P. electoral division, or P.S. gana to instantly retrieve its full administrative hierarchy.'}
                  </p>
                </div>

                {/* Popular Quick-Search Suggestions */}
                <div className="pt-2 text-left">
                  <div className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-2 flex items-center gap-1">
                    <Sparkles size={12} className="text-amber-500" />
                    <span>{language === 'mr' ? 'लोकप्रिय जलद शोध (Click to test):' : 'Suggested Searches:'}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['बडेगाव', 'पाटणसावंगी', 'खापा', 'हिंगणा', 'केळवद', 'दहेगाव', 'टेमुरर्डा', 'कोदामेंढी', 'गुमगाव', 'बेला', 'वाघोडा', 'नांद', 'भिवापूर', 'कुही', 'मौदा', 'रामटेक', 'पारशिवनी'].map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-emerald-100 dark:hover:bg-emerald-950 hover:text-emerald-800 dark:hover:text-emerald-300 text-[11px] font-medium text-stone-700 dark:text-stone-300 transition-colors cursor-pointer border border-stone-200 dark:border-stone-700"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="py-10 text-center space-y-2">
                <div className="text-2xl">🔍</div>
                <div className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  {language === 'mr' ? `"${query}" साठी कोणतीही नोंद आढळली नाही` : `No results found for "${query}"`}
                </div>
                <p className="text-[11px] text-stone-500 max-w-xs mx-auto">
                  {language === 'mr'
                    ? 'कृपया स्पेलिंग तपासा किंवा वेगळा शब्द शोधून पहा (उदा. गाव किंवा गण नाव).'
                    : 'Please check your spelling or search by another keyword (village, GP, or Gan name).'}
                </p>
              </div>
            ) : (
              <div>
                <div className="text-[10px] text-stone-400 font-semibold px-2 py-1 uppercase tracking-wider">
                  {language === 'mr'
                    ? `${results.length} निकाल सापडले`
                    : `${results.length} records found`}
                </div>
                {results.map((item) => {
                  const isSelected = selectedResult?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedResult(item)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer text-xs select-none flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 shadow-xs ring-1 ring-emerald-500/30'
                          : 'border-stone-200/80 dark:border-stone-800 bg-white dark:bg-stone-850 hover:bg-stone-50 dark:hover:bg-stone-800'
                      }`}
                    >
                      <div className="grow min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${getTypeColor(
                              item.type
                            )}`}
                          >
                            {language === 'mr' ? item.badgeMr : item.badgeEn}
                          </span>
                          <span className="text-[10px] text-stone-500 font-semibold truncate">
                            {item.talukaMr} ({item.talukaEn})
                          </span>
                        </div>
                        <div className="font-bold text-stone-900 dark:text-stone-100 truncate text-sm">
                          {getLabel(item.titleMr, item.titleEn)}
                        </div>
                        <div className="text-[10px] text-stone-500 dark:text-stone-400 truncate mt-0.5">
                          {item.divisionCode || (item.divisionNumber ? `जि.प.: ${item.divisionNameMr}` : '')}
                          {item.ganCode ? ` • पं.स. गण: ${item.ganCode}` : ''}
                          {item.gpNameMr ? ` • ग्रा.पं.: ${item.gpNameMr}` : ''}
                        </div>
                      </div>

                      <ChevronRight
                        size={16}
                        className={`shrink-0 transition-transform ${
                          isSelected ? 'text-emerald-600 translate-x-0.5' : 'text-stone-300 dark:text-stone-600'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Full Information Card */}
          <div className="w-full md:w-1/2 p-4 bg-stone-50/60 dark:bg-stone-900/60 overflow-y-auto max-h-[48vh] md:max-h-[58vh]">
            {selectedResult ? (
              <div className="space-y-4 text-xs">
                {/* Header Card */}
                <div className="p-3.5 rounded-xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-xs">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getTypeColor(
                        selectedResult.type
                      )}`}
                    >
                      {language === 'mr' ? selectedResult.badgeMr : selectedResult.badgeEn}
                    </span>
                    <button
                      onClick={() => handleCopyDetails(selectedResult)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-600 dark:text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                      title="Copy complete information"
                    >
                      {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                      <span>{copied ? 'कॉपी झाले!' : 'माहिती कॉपी'}</span>
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 dark:text-white leading-tight">
                    {getLabel(selectedResult.titleMr, selectedResult.titleEn)}
                  </h3>
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                    <Building2 size={12} />
                    <span>नागपूर जिल्हा • {selectedResult.talukaMr} ({selectedResult.talukaEn}) पंचायत समिती</span>
                  </div>
                </div>

                {/* Hierarchical Breakdown Card */}
                <div className="p-3.5 rounded-xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2.5">
                  <div className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5 border-b border-stone-100 dark:border-stone-800 pb-2">
                    <Layers size={13} className="text-emerald-600" />
                    <span>{language === 'mr' ? 'प्रशासन व प्रभाग रचना तपशील:' : 'Administrative Lineage:'}</span>
                  </div>

                  <div className="space-y-2 text-[11px]">
                    {/* District */}
                    <div className="flex items-center justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                      <span className="text-stone-500">{language === 'mr' ? 'जिल्हा (District):' : 'District:'}</span>
                      <strong className="text-stone-900 dark:text-stone-100">नागपूर (Nagpur)</strong>
                    </div>

                    {/* Taluka */}
                    <div className="flex items-center justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                      <span className="text-stone-500">{language === 'mr' ? 'तालुका / पं.स.:' : 'Taluka / P.S.:'}</span>
                      <strong className="text-stone-900 dark:text-stone-100">
                        {selectedResult.talukaMr} ({selectedResult.talukaEn})
                      </strong>
                    </div>

                    {/* Z.P. Electoral Division */}
                    {selectedResult.divisionNameMr && (
                      <div className="flex items-center justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                        <span className="text-stone-500">{language === 'mr' ? 'जि.प. निवडणूक विभाग:' : 'Z.P. Division:'}</span>
                        <strong className="text-blue-700 dark:text-blue-400">
                          {selectedResult.divisionCode || `${selectedResult.divisionNumber}-${selectedResult.divisionNameMr}`}
                        </strong>
                      </div>
                    )}

                    {/* P.S. Electoral Gana */}
                    {selectedResult.ganNameMr && (
                      <div className="flex items-center justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                        <span className="text-stone-500">{language === 'mr' ? 'पं.स. निर्वाचक गण:' : 'P.S. Electoral Gana:'}</span>
                        <strong className="text-purple-700 dark:text-purple-400">
                          {selectedResult.ganCode || `${selectedResult.ganNumber}-${selectedResult.ganNameMr}`}
                        </strong>
                      </div>
                    )}

                    {/* Gram Panchayat */}
                    {selectedResult.gpNameMr && (
                      <div className="flex items-center justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                        <span className="text-stone-500">{language === 'mr' ? 'ग्रामपंचायत:' : 'Gram Panchayat:'}</span>
                        <strong className="text-emerald-700 dark:text-emerald-400">
                          {selectedResult.gpSerial ? `${selectedResult.gpSerial}. ` : ''}
                          {selectedResult.gpNameMr} ({selectedResult.gpNameEn})
                        </strong>
                      </div>
                    )}

                    {/* Village / Area */}
                    {selectedResult.villageNameMr && (
                      <div className="flex items-center justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                        <span className="text-stone-500">{language === 'mr' ? 'गाव / समाविष्ट क्षेत्र:' : 'Village / Area:'}</span>
                        <strong className="text-amber-800 dark:text-amber-300">
                          {selectedResult.villageNameMr} ({selectedResult.villageNameEn})
                        </strong>
                      </div>
                    )}

                    {/* Notes if any */}
                    {selectedResult.notes && (
                      <div className="flex items-center justify-between py-1 text-stone-600 dark:text-stone-400 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-lg border border-amber-200 dark:border-amber-900">
                        <span>{language === 'mr' ? 'विशेष शेरा / टीप:' : 'Special Note:'}</span>
                        <strong className="text-amber-900 dark:text-amber-200">{selectedResult.notes}</strong>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sibling Villages in GP if available */}
                {selectedResult.siblingVillages && selectedResult.siblingVillages.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-xs space-y-2">
                    <div className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center justify-between">
                      <span>
                        {language === 'mr'
                          ? `या ग्रामपंचायतीमधील गावे (${selectedResult.siblingVillages.length}):`
                          : `Villages in this GP (${selectedResult.siblingVillages.length}):`}
                      </span>
                      <span className="text-[10px] text-stone-400 font-normal">
                        अनुसूची परिशिष्ट-८ब
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                      {selectedResult.siblingVillages.map((v) => {
                        const isThisVillage = v.serialNo === selectedResult.villageSerial;
                        return (
                          <div
                            key={v.serialNo}
                            className={`p-1.5 rounded-lg border text-[11px] flex items-center justify-between ${
                              isThisVillage
                                ? 'bg-amber-100/80 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 font-bold text-amber-900 dark:text-amber-200'
                                : 'bg-stone-50 dark:bg-stone-800/50 border-stone-200/80 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                            }`}
                          >
                            <span className="truncate">
                              {v.serialNo}. {getLabel(v.nameMr, v.nameEn)}
                            </span>
                            {v.notes && (
                              <span className="text-[9px] px-1 py-0.2 rounded bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200 shrink-0 ml-1">
                                {v.notes}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Actions / Jump to View */}
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-[11px] font-semibold text-emerald-950 dark:text-emerald-200">
                    {language === 'mr' ? 'थेट ॲपमध्ये उघडा:' : 'Open in App View:'}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onNavigateToItem(
                          selectedResult.talukaEn,
                          'tree',
                          selectedResult.villageNameMr || selectedResult.gpNameMr || selectedResult.ganNameMr || selectedResult.divisionNameMr || selectedResult.titleMr
                        );
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer transition-colors"
                    >
                      <Layers size={13} />
                      <span>{language === 'mr' ? 'रचना वृक्षात पहा' : 'View in Tree'}</span>
                    </button>

                    <button
                      onClick={() => {
                        onNavigateToItem(
                          selectedResult.talukaEn,
                          'table',
                          selectedResult.villageNameMr || selectedResult.gpNameMr || selectedResult.ganNameMr || selectedResult.divisionNameMr || selectedResult.titleMr
                        );
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                    >
                      <TableIcon size={13} />
                      <span>{language === 'mr' ? 'तक्त्यात पहा' : 'View Table'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
                <Info size={32} className="mb-2 opacity-50" />
                <p className="text-xs">
                  {language === 'mr'
                    ? 'डाव्या बाजूच्या यादीमधून कोणत्याही नोंदीवर क्लिक करून त्याची सविस्तर माहिती येथे पहा.'
                    : 'Select any record on the left to inspect its detailed administrative information.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/80 dark:bg-stone-850 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>
              {language === 'mr'
                ? `नागपूर जिल्हा • सर्व १३ तालुके • १,८४७ गावे शोध कक्षेत`
                : `Nagpur District • 13 Talukas • 1,847 Villages indexed`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-stone-400 font-mono text-[10px]">
              ESC to close
            </span>
            <button
              onClick={onClose}
              className="px-3 py-1 rounded-lg bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-medium transition-colors cursor-pointer"
            >
              {language === 'mr' ? 'बंद करा' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
