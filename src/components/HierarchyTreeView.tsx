import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  MapPin,
  Building,
  Flag,
  ChevronsUpDown,
  CheckCircle,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { SAVNER_HIERARCHY, PanchayatSamitiHierarchy, ElectoralDivision, ElectoralGan, GramPanchayat } from '../data/savnerData';

interface HierarchyTreeViewProps {
  language: 'mr' | 'en' | 'bilingual';
  searchQuery: string;
  data?: PanchayatSamitiHierarchy;
}

export const HierarchyTreeView: React.FC<HierarchyTreeViewProps> = ({
  language,
  searchQuery,
  data = SAVNER_HIERARCHY,
}) => {
  // Track open state for divisions, gana, and GPs
  const [expandedDivs, setExpandedDivs] = useState<Record<string, boolean>>({
    'div-1': true,
    'div-2': true,
  });
  const [expandedGana, setExpandedGana] = useState<Record<string, boolean>>({
    'gan-1': true,
    'gan-2': true,
  });
  const [expandedGps, setExpandedGps] = useState<Record<string, boolean>>({
    'gp-1-1': true,
    'gp-1-2': true,
  });

  const toggleDiv = (id: string) => {
    setExpandedDivs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleGan = (id: string) => {
    setExpandedGana((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleGp = (id: string) => {
    setExpandedGps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const divs: Record<string, boolean> = {};
    const gana: Record<string, boolean> = {};
    const gps: Record<string, boolean> = {};
    data.divisions.forEach((d) => {
      divs[d.id] = true;
      d.gana.forEach((g) => {
        gana[g.id] = true;
        g.gramPanchayats.forEach((gp) => {
          gps[gp.id] = true;
        });
      });
    });
    setExpandedDivs(divs);
    setExpandedGana(gana);
    setExpandedGps(gps);
  };

  const collapseAll = () => {
    setExpandedDivs({});
    setExpandedGana({});
    setExpandedGps({});
  };

  const query = searchQuery.trim().toLowerCase();

  const filterDivision = (div: ElectoralDivision) => {
    if (!query) return true;
    const matchDiv =
      div.nameMr.toLowerCase().includes(query) ||
      div.nameEn.toLowerCase().includes(query) ||
      div.code.toLowerCase().includes(query);
    if (matchDiv) return true;

    return div.gana.some((gan) => filterGan(gan));
  };

  const filterGan = (gan: ElectoralGan) => {
    if (!query) return true;
    const matchGan =
      gan.nameMr.toLowerCase().includes(query) ||
      gan.nameEn.toLowerCase().includes(query) ||
      gan.code.toLowerCase().includes(query);
    if (matchGan) return true;

    return gan.gramPanchayats.some((gp) => filterGp(gp));
  };

  const filterGp = (gp: GramPanchayat) => {
    if (!query) return true;
    const matchGp =
      gp.nameMr.toLowerCase().includes(query) ||
      gp.nameEn.toLowerCase().includes(query);
    if (matchGp) return true;

    return gp.villages.some(
      (v) =>
        v.nameMr.toLowerCase().includes(query) ||
        v.nameEn.toLowerCase().includes(query) ||
        (v.notes && v.notes.toLowerCase().includes(query))
    );
  };

  const getLabel = (mr: string, en: string) => {
    if (language === 'mr') return mr;
    if (language === 'en') return en;
    return `${mr} (${en})`;
  };

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-100/70 dark:bg-stone-800/50 p-3 rounded-xl border border-stone-200/80 dark:border-stone-700/60 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-stone-700 dark:text-stone-300">
            {language === 'mr' ? 'रचना स्तर:' : 'Hierarchy Levels:'}
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-medium">
            L1: तालुका (Savner)
          </span>
          <span className="text-stone-400">›</span>
          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-medium">
            L2: विभाग (7)
          </span>
          <span className="text-stone-400">›</span>
          <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-medium">
            L3: गण (14)
          </span>
          <span className="text-stone-400">›</span>
          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-medium">
            L4: ग्रामपंचायत (61)
          </span>
          <span className="text-stone-400">›</span>
          <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-medium">
            L5: गावे/क्षेत्रे (94)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="px-2.5 py-1 bg-white dark:bg-stone-700 text-stone-700 dark:text-stone-200 rounded-lg border border-stone-300 dark:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-600 transition-colors cursor-pointer font-medium"
          >
            {language === 'mr' ? 'सर्व उघडा' : 'Expand All'}
          </button>
          <button
            onClick={collapseAll}
            className="px-2.5 py-1 bg-white dark:bg-stone-700 text-stone-700 dark:text-stone-200 rounded-lg border border-stone-300 dark:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-600 transition-colors cursor-pointer font-medium"
          >
            {language === 'mr' ? 'सर्व बंद करा' : 'Collapse All'}
          </button>
        </div>
      </div>

      {/* Root Node: Taluka Savner */}
      <div className="border border-stone-200 dark:border-stone-800 rounded-2xl bg-white dark:bg-stone-900 shadow-xs overflow-hidden">
        {/* Taluka Header */}
        <div className="px-5 py-4 bg-linear-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center font-bold text-lg border border-white/20">
              🏛️
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-emerald-200 font-semibold">
                {language === 'mr' ? 'तालुका व पंचायत समिती' : 'Taluka & Panchayat Samiti'}
              </div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span>{getLabel(data.talukaMr, data.talukaEn)}</span>
                <span className="text-xs font-normal bg-emerald-700/80 px-2 py-0.5 rounded-full border border-emerald-500/50">
                  {language === 'mr' ? `जिल्हा: ${data.districtMr}` : `District: ${data.districtEn}`}
                </span>
              </h2>
            </div>
          </div>

          <div className="text-right text-xs text-emerald-100 hidden sm:block">
            <div className="font-medium">
              {data.divisions.length} {language === 'mr' ? 'जि.प. विभाग' : 'Z.P. Divisions'} • {data.divisions.reduce((a, d) => a + d.gana.length, 0)} {language === 'mr' ? 'पं.स. गण' : 'P.S. Gana'}
            </div>
            <div className="text-emerald-300 text-[11px]">
              {data.divisions.reduce((a, d) => a + d.gana.reduce((ga, g) => ga + g.gramPanchayats.length, 0), 0)} {language === 'mr' ? 'ग्रामपंचायती' : 'GPs'}
            </div>
          </div>
        </div>

        {/* Divisions List */}
        <div className="p-4 md:p-6 space-y-4">
          {data.divisions
            .filter((div) => filterDivision(div))
            .map((division) => {
              const isDivOpen = expandedDivs[division.id] ?? false;
              const ganCount = division.gana.length;
              let villageCount = 0;
              let gpCount = 0;
              division.gana.forEach((g) => {
                gpCount += g.gramPanchayats.length;
                g.gramPanchayats.forEach((gp) => (villageCount += gp.villages.length));
              });

              return (
                <div
                  key={division.id}
                  className="border border-blue-200 dark:border-blue-900/50 rounded-xl overflow-hidden bg-stone-50/50 dark:bg-stone-900/70 shadow-xs"
                >
                  {/* Division Header */}
                  <div
                    onClick={() => toggleDiv(division.id)}
                    className="px-4 py-3 bg-linear-to-r from-blue-50 to-indigo-50/50 dark:from-blue-950/40 dark:to-indigo-950/20 flex items-center justify-between cursor-pointer hover:bg-blue-100/50 dark:hover:bg-blue-900/40 transition-colors select-none"
                  >
                    <div className="flex items-center gap-3">
                      <button className="text-blue-700 dark:text-blue-400 p-1">
                        {isDivOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      </button>
                      <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                        {division.number}
                      </div>
                      <div>
                        <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">
                          {language === 'mr' ? 'जि.प. (जिल्हा परिषद) विभाग क्र. ' + division.number : `Z.P. Division ${division.number}`}
                        </div>
                        <h3 className="text-base font-bold text-stone-900 dark:text-white">
                          {getLabel(division.code, `${division.number}-${division.nameEn}`)}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-medium px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                        {ganCount} {language === 'mr' ? 'पं.स. गण' : 'P.S. Gana'}
                      </span>
                      <span className="text-xs bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-2 py-1 rounded-full hidden sm:inline">
                        {gpCount} {language === 'mr' ? 'ग्रा.पं.' : 'GPs'} • {villageCount} {language === 'mr' ? 'गावे' : 'Villages'}
                      </span>
                    </div>
                  </div>

                  {/* Gana Container */}
                  {isDivOpen && (
                    <div className="p-3 md:p-4 space-y-3 bg-white dark:bg-stone-900/90 border-t border-blue-100 dark:border-blue-900/40">
                      {division.gana
                        .filter((g) => filterGan(g))
                        .map((gan) => {
                          const isGanOpen = expandedGana[gan.id] ?? false;
                          let ganVillageCount = 0;
                          gan.gramPanchayats.forEach((gp) => (ganVillageCount += gp.villages.length));

                          return (
                            <div
                              key={gan.id}
                              className="border border-purple-200 dark:border-purple-900/40 rounded-xl overflow-hidden bg-white dark:bg-stone-800/40"
                            >
                              {/* Gan Header */}
                              <div
                                onClick={() => toggleGan(gan.id)}
                                className="px-4 py-2.5 bg-purple-50/70 dark:bg-purple-950/30 flex items-center justify-between cursor-pointer hover:bg-purple-100/50 dark:hover:bg-purple-900/30 transition-colors select-none"
                              >
                                <div className="flex items-center gap-2.5">
                                  <button className="text-purple-700 dark:text-purple-400 p-0.5">
                                    {isGanOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                  </button>
                                  <span className="px-2 py-0.5 rounded-md bg-purple-200 dark:bg-purple-900/70 text-purple-900 dark:text-purple-200 font-bold text-xs">
                                    {language === 'mr' ? 'पं.स. गण ' + gan.number : `P.S. Gan ${gan.number}`}
                                  </span>
                                  <h4 className="text-sm font-semibold text-stone-900 dark:text-white">
                                    {getLabel(gan.code, `${gan.number}. ${gan.nameEn}`)}
                                  </h4>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-medium px-2 py-0.5 rounded-full">
                                    {gan.gramPanchayats.length} {language === 'mr' ? 'ग्रामपंचायती' : 'GPs'}
                                  </span>
                                  <span className="text-[11px] bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 px-2 py-0.5 rounded-full">
                                    {ganVillageCount} {language === 'mr' ? 'गावे/क्षेत्र' : 'Areas'}
                                  </span>
                                </div>
                              </div>

                              {/* Gram Panchayats Container */}
                              {isGanOpen && (
                                <div className="p-3 space-y-2 bg-stone-50/40 dark:bg-stone-900/60 border-t border-purple-100 dark:border-purple-900/30">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                    {gan.gramPanchayats
                                      .filter((gp) => filterGp(gp))
                                      .map((gp) => {
                                        const isGpOpen = expandedGps[gp.id] ?? false;

                                        return (
                                          <div
                                            key={gp.id}
                                            className="border border-stone-200 dark:border-stone-700 rounded-lg overflow-hidden bg-white dark:bg-stone-800/80 shadow-2xs"
                                          >
                                            {/* GP Header */}
                                            <div
                                              onClick={() => toggleGp(gp.id)}
                                              className="px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-stone-100/70 dark:hover:bg-stone-700/50 transition-colors select-none text-xs"
                                            >
                                              <div className="flex items-center gap-2">
                                                <button className="text-stone-500">
                                                  {isGpOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                                </button>
                                                <span className="font-mono text-[10px] text-stone-400 font-bold">
                                                  #{gp.serialNo}
                                                </span>
                                                <span className="font-semibold text-stone-800 dark:text-stone-200">
                                                  {getLabel(gp.nameMr, gp.nameEn)}
                                                </span>
                                              </div>
                                              <span className="text-[10px] bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-medium px-1.5 py-0.5 rounded">
                                                {gp.villages.length} {language === 'mr' ? 'क्षेत्र' : 'villages'}
                                              </span>
                                            </div>

                                            {/* Villages List */}
                                            {isGpOpen && (
                                              <div className="px-3 py-2 bg-stone-50 dark:bg-stone-900/90 border-t border-stone-200 dark:border-stone-700/60 space-y-1">
                                                {gp.villages.map((v) => (
                                                  <div
                                                    key={v.id}
                                                    className="flex items-center justify-between text-xs py-1 px-2 rounded hover:bg-stone-100 dark:hover:bg-stone-800/60"
                                                  >
                                                    <div className="flex items-center gap-2">
                                                      <span className="text-[11px] text-stone-400 font-mono w-5">
                                                        {v.serialNo}.
                                                      </span>
                                                      <span className="text-stone-700 dark:text-stone-300 font-medium">
                                                        {getLabel(v.nameMr, v.nameEn)}
                                                      </span>
                                                    </div>
                                                    {v.notes && (
                                                      <span className="text-[10px] bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 px-1.5 py-0.5 rounded font-medium">
                                                        {v.notes}
                                                      </span>
                                                    )}
                                                  </div>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
