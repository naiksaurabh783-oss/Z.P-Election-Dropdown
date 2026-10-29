import React from 'react';
import {
  Building2,
  CheckCircle2,
  FileSpreadsheet,
  ArrowRight,
  Layers,
  MapPin,
  Check,
  Smartphone,
  Search,
} from 'lucide-react';
import { NAGPUR_DISTRICT_TALUKAS } from '../data/nagpurTalukas';
import { PanchayatSamitiHierarchy } from '../data/savnerData';

interface DistrictRollupViewProps {
  language: 'mr' | 'en' | 'bilingual';
  extractedTalukas: PanchayatSamitiHierarchy[];
  selectedTaluka: PanchayatSamitiHierarchy;
  onSelectTaluka: (taluka: PanchayatSamitiHierarchy) => void;
  onExportMasterSheets: () => void;
  onOpenAppInstall?: () => void;
  onOpenSearch?: () => void;
  userEmail?: string;
}

export const DistrictRollupView: React.FC<DistrictRollupViewProps> = ({
  language,
  extractedTalukas,
  selectedTaluka,
  onSelectTaluka,
  onExportMasterSheets,
  onOpenAppInstall,
  onOpenSearch,
  userEmail,
}) => {
  const getLabel = (mr: string, en: string) => {
    if (language === 'mr') return mr;
    if (language === 'en') return en;
    return `${mr} (${en})`;
  };

  const isExtracted = (nameEn: string) => {
    const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    return extractedTalukas.find(
      (t) =>
        clean(t.talukaEn) === clean(nameEn) ||
        clean(t.talukaEn).includes(clean(nameEn)) ||
        clean(nameEn).includes(clean(t.talukaEn)) ||
        t.talukaMr.includes(nameEn)
    );
  };

  const totalTalukas = NAGPUR_DISTRICT_TALUKAS.length;

  return (
    <div className="space-y-6">
      {/* District Banner */}
      <div className="rounded-2xl bg-linear-to-r from-stone-900 via-stone-800 to-emerald-950 p-6 text-white shadow-lg border border-stone-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <span>🏛️ महाराष्ट्र शासन • नागपूर जिल्हा अधिकृत गॅझेट ॲप</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">
              {language === 'mr'
                ? 'नागपूर जिल्हा परिषद व पंचायत समिती प्रभाग रचना ॲप'
                : 'Nagpur District Z.P. & P.S. Ward Delimitation App'}
            </h2>
            <p className="text-xs text-stone-300 max-w-xl leading-relaxed">
              {language === 'mr'
                ? `नागपूर जिल्ह्यातील सर्व १३ तालुक्यांच्या (५४ जि.प. निवडणूक विभाग, १०८ पं.स. निर्वाचक गण, ७६० ग्रामपंचायती, १,८४७ गावे/वस्त्या) अधिकृत गॅझेट (परिशिष्ट-८ब) रचनेचा संपूर्ण डेटा ऑफलाइन उपलब्ध आहे. कोणत्याही तालुक्यावर टॅप करून संपूर्ण रचना पहा किंवा Google Sheets मध्ये एक्सपोर्ट करा.`
                : `Complete official gazette schedule (Parishishth 8-B) across all 13 talukas of Nagpur District (54 Z.P. Electoral Divisions, 108 P.S. Gana, 760 Gram Panchayats, 1,847 Villages) available 100% offline. Tap any taluka to explore or export to Google Sheets.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-linear-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-stone-950 font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer ring-2 ring-emerald-300/60"
              >
                <Search size={16} />
                <span>{language === 'mr' ? 'गाव / जि.प. / पं.स. शोधा' : 'Search Village / Z.P. / P.S.'}</span>
              </button>
            )}

            {onOpenAppInstall && (
              <button
                onClick={onOpenAppInstall}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer"
              >
                <Smartphone size={16} />
                <span>{language === 'mr' ? 'मोबाईल ॲप' : 'Install App'}</span>
              </button>
            )}

            <button
              onClick={onExportMasterSheets}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer"
              title="Export all processed talukas into a Master District Spreadsheet"
            >
              <FileSpreadsheet size={16} className="text-white" />
              <span>{language === 'mr' ? 'जिल्हा मास्टर स्प्रेडशीट' : 'Master Sheets'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-3.5 rounded-xl shadow-xs">
          <div className="text-stone-500 dark:text-stone-400 font-medium">एकूण तालुके (Total Talukas)</div>
          <div className="text-xl font-bold text-stone-900 dark:text-white mt-0.5">{totalTalukas}</div>
          <div className="text-[10px] text-emerald-600 font-medium mt-0.5">१००% अधिकृत गॅझेट समाविष्ट</div>
        </div>

        <div className="bg-white dark:bg-stone-900 border border-emerald-200 dark:border-emerald-900/50 p-3.5 rounded-xl shadow-xs bg-emerald-50/20">
          <div className="text-emerald-700 dark:text-emerald-400 font-medium">जि.प. निवडणूक विभाग</div>
          <div className="text-xl font-bold text-emerald-800 dark:text-emerald-300 mt-0.5">५४</div>
          <div className="text-[10px] text-emerald-600 mt-0.5">Z.P. Electoral Divisions</div>
        </div>

        <div className="bg-white dark:bg-stone-900 border border-purple-200 dark:border-purple-900/50 p-3.5 rounded-xl shadow-xs bg-purple-50/20">
          <div className="text-purple-700 dark:text-purple-400 font-medium">पं.स. निर्वाचक गण</div>
          <div className="text-xl font-bold text-purple-800 dark:text-purple-300 mt-0.5">१०८</div>
          <div className="text-[10px] text-purple-600 mt-0.5">P.S. Electoral Gana</div>
        </div>

        <div className="bg-white dark:bg-stone-900 border border-amber-200 dark:border-amber-900/50 p-3.5 rounded-xl shadow-xs bg-amber-50/20">
          <div className="text-amber-700 dark:text-amber-400 font-medium">समाविष्ट गावे व वस्त्या</div>
          <div className="text-xl font-bold text-amber-800 dark:text-amber-300 mt-0.5">१,८४७</div>
          <div className="text-[10px] text-amber-600 mt-0.5">७६० ग्रामपंचायती (GPs)</div>
        </div>
      </div>

      {/* Grid of All 13 Talukas of Nagpur District */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <span>{language === 'mr' ? 'नागपूर जिल्हा: सर्व १३ पंचायत समित्या' : 'Nagpur District: All 13 Panchayat Samitis'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-semibold">
                १३/१३ सक्रिय
              </span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {language === 'mr'
                ? 'कोणत्याही तालुक्यावर क्लिक करून त्याची संपूर्ण ६-स्तरीय रचना व गॅझेट तक्ता पहा'
                : 'Click on any taluka to view its complete 6-level hierarchy & official gazette table'}
            </p>
          </div>

          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-semibold border border-emerald-300 dark:border-emerald-800 transition-colors cursor-pointer shadow-2xs"
            >
              <Search size={13} />
              <span>{language === 'mr' ? 'गाव / गण थेट शोधा' : 'Search Village/Gana'}</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {NAGPUR_DISTRICT_TALUKAS.map((talukaMeta) => {
            const data = isExtracted(talukaMeta.nameEn);
            const isCurrent = data && data.talukaEn.toLowerCase() === selectedTaluka.talukaEn.toLowerCase();
            
            // Calculate GP and Village count
            let gpCount = 0;
            let villageCount = 0;
            if (data) {
              data.divisions.forEach((div) => {
                div.gana.forEach((gan) => {
                  gpCount += gan.gramPanchayats.length;
                  gan.gramPanchayats.forEach((gp) => {
                    villageCount += (gp.villages?.length || 1);
                  });
                });
              });
            }

            return (
              <div
                key={talukaMeta.id}
                onClick={() => data && onSelectTaluka(data)}
                className={`p-3.5 rounded-xl border transition-all text-xs flex flex-col justify-between cursor-pointer select-none group ${
                  isCurrent
                    ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-xs ring-2 ring-emerald-500/20'
                    : 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-stone-800/60 hover:bg-emerald-50/60 hover:border-emerald-400 dark:hover:bg-emerald-950/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-stone-900 dark:text-white text-sm group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                      {getLabel(talukaMeta.nameMr, talukaMeta.nameEn)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                      <CheckCircle2 size={11} />
                      <span>अधिकृत</span>
                    </span>
                  </div>

                  {data ? (
                    <div className="space-y-1 text-[11px] text-stone-600 dark:text-stone-300">
                      <div className="flex items-center justify-between">
                        <span>{language === 'mr' ? 'जि.प. विभाग:' : 'Z.P. Divisions:'}</span>
                        <strong className="text-stone-900 dark:text-white">{data.divisions.length}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{language === 'mr' ? 'पं.स. गण:' : 'P.S. Gana:'}</span>
                        <strong className="text-stone-900 dark:text-white">{data.divisions.reduce((a, d) => a + d.gana.length, 0)}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{language === 'mr' ? 'ग्रामपंचायती / गावे:' : 'GPs / Villages:'}</span>
                        <strong className="text-stone-900 dark:text-white">{gpCount} / {villageCount}</strong>
                      </div>
                    </div>
                  ) : (
                    <div className="text-[11px] text-stone-400">
                      {talukaMeta.expectedDivisions} Z.P. Div • {talukaMeta.expectedGana} P.S. Gan
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-stone-200/60 dark:border-stone-800 flex items-center justify-between text-[11px]">
                  <span className={`font-semibold flex items-center gap-1 ${isCurrent ? 'text-emerald-700 dark:text-emerald-300' : 'text-stone-600 dark:text-stone-400 group-hover:text-emerald-600'}`}>
                    <span>{isCurrent ? (language === 'mr' ? 'चालू तालुका' : 'Active View') : (language === 'mr' ? 'रचना उघडा' : 'Open View')}</span>
                    <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                  <span className="text-[10px] font-mono text-stone-400">
                    परिशिष्ट-८ब
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
