import React, { useState, useMemo } from 'react';
import { Search, Filter, Copy, Check, Info } from 'lucide-react';
import { SAVNER_HIERARCHY, PanchayatSamitiHierarchy, FlatRecord } from '../data/savnerData';
import { flattenHierarchy } from '../services/googleSheets';

interface GazetteTableViewProps {
  language: 'mr' | 'en' | 'bilingual';
  searchQuery: string;
  onSearchChange: (val: string) => void;
  data?: PanchayatSamitiHierarchy;
}

export const GazetteTableView: React.FC<GazetteTableViewProps> = ({
  language,
  searchQuery,
  onSearchChange,
  data = SAVNER_HIERARCHY,
}) => {
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [selectedGan, setSelectedGan] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const allRecords = useMemo(() => flattenHierarchy(data), [data]);

  // Filter divisions
  const filteredRecords = useMemo(() => {
    let result = allRecords;

    if (selectedDivision !== 'all') {
      result = result.filter((r) => r.divisionNumber.toString() === selectedDivision);
    }

    if (selectedGan !== 'all') {
      result = result.filter((r) => r.ganNumber.toString() === selectedGan);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.talukaMr.toLowerCase().includes(q) ||
          r.talukaEn.toLowerCase().includes(q) ||
          r.divisionNameMr.toLowerCase().includes(q) ||
          r.divisionNameEn.toLowerCase().includes(q) ||
          r.divisionCode.toLowerCase().includes(q) ||
          r.ganNameMr.toLowerCase().includes(q) ||
          r.ganNameEn.toLowerCase().includes(q) ||
          r.ganCode.toLowerCase().includes(q) ||
          r.gpNameMr.toLowerCase().includes(q) ||
          r.gpNameEn.toLowerCase().includes(q) ||
          r.villageNameMr.toLowerCase().includes(q) ||
          r.villageNameEn.toLowerCase().includes(q) ||
          (r.notes && r.notes.toLowerCase().includes(q))
      );
    }

    return result;
  }, [allRecords, selectedDivision, selectedGan, searchQuery]);

  const handleCopyRow = (r: FlatRecord) => {
    const text = `${r.talukaMr} | ${r.divisionCode} | ${r.ganCode} | ${r.gpSerialNo}. ${r.gpNameMr} | ${r.villageSerialNo}. ${r.villageNameMr} ${r.notes || ''}`;
    navigator.clipboard.writeText(text);
    setCopiedId(r.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getLabel = (mr: string, en: string) => {
    if (language === 'mr') return mr;
    if (language === 'en') return en;
    return `${mr} (${en})`;
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              language === 'mr'
                ? 'गाव, ग्रामपंचायत, गण किंवा विभाग शोधा...'
                : 'Search village, GP, gan or division...'
            }
            className="w-full pl-9 pr-4 py-2 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl text-xs text-stone-800 dark:text-stone-200 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Division Filter */}
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-stone-400" />
          <select
            value={selectedDivision}
            onChange={(e) => {
              setSelectedDivision(e.target.value);
              setSelectedGan('all');
            }}
            className="text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2 text-stone-700 dark:text-stone-300 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="all">
              {language === 'mr' ? `सर्व जि.प. विभाग (${data.divisions.length})` : `All Z.P. Divisions (${data.divisions.length})`}
            </option>
            {data.divisions.map((d) => (
              <option key={d.id} value={d.number.toString()}>
                {d.number}. {getLabel(d.nameMr, d.nameEn)}
              </option>
            ))}
          </select>

          {/* P.S. Gan Filter */}
          <select
            value={selectedGan}
            onChange={(e) => setSelectedGan(e.target.value)}
            className="text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2 text-stone-700 dark:text-stone-300 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="all">
              {language === 'mr' ? 'सर्व पं.स. गण' : 'All P.S. Gana'}
            </option>
            {data.divisions
              .filter(
                (d) => selectedDivision === 'all' || d.number.toString() === selectedDivision
              )
              .flatMap((d) => d.gana)
              .map((g) => (
                <option key={g.id} value={g.number.toString()}>
                  {g.number}. {getLabel(g.nameMr, g.nameEn)}
                </option>
              ))}
          </select>
        </div>

        <div className="text-xs text-stone-500 dark:text-stone-400 font-medium">
          {language === 'mr' ? 'दाखवत आहे:' : 'Showing:'}{' '}
          <span className="text-emerald-700 dark:text-emerald-400 font-bold">
            {filteredRecords.length}
          </span>{' '}
          / {allRecords.length} {language === 'mr' ? 'गावे/क्षेत्रे' : 'villages/areas'}
        </div>
      </div>

      {/* Official Table Format */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs overflow-hidden">
        <div className="px-4 py-3 bg-stone-100/80 dark:bg-stone-800/80 border-b border-stone-200 dark:border-stone-700 flex items-center justify-between text-xs">
          <div className="font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-2">
            <span>अनुसूची (परिशिष्ट-८ब) तक्ता - {getLabel(data.talukaMr, data.talukaEn)} पंचायत समिती</span>
            <span className="text-[10px] bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 px-2 py-0.5 rounded font-mono">
              Schedule Format
            </span>
          </div>
          <div className="text-stone-500 dark:text-stone-400 text-[11px] hidden sm:block">
            Click copy icon on any row to copy citation
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-semibold">
                <th className="py-3 px-3 w-10 text-center font-mono">#</th>
                <th className="py-3 px-3 border-r border-stone-200 dark:border-stone-700">
                  <div>तालुक्याचे नाव</div>
                  <div className="text-[10px] text-stone-400 font-normal">Taluka Name (Col 1)</div>
                </th>
                <th className="py-3 px-3 border-r border-stone-200 dark:border-stone-700">
                  <div>जि.प. (जिल्हा परिषद) निवडणूक विभाग</div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Z.P. Division (Col 2)</div>
                </th>
                <th className="py-3 px-3 border-r border-stone-200 dark:border-stone-700">
                  <div>पं.स. (पंचायत समिती) निर्वाचक गण</div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">P.S. Gan (Col 3)</div>
                </th>
                <th className="py-3 px-3 border-r border-stone-200 dark:border-stone-700">
                  <div>समाविष्ट ग्रामपंचायतींची नावे</div>
                  <div className="text-[10px] text-stone-400 font-normal">Gram Panchayat (Col 4)</div>
                </th>
                <th className="py-3 px-3 border-r border-stone-200 dark:border-stone-700">
                  <div>ग्रामपंचायतीच्या मर्यादेत समाविष्ट क्षेत्र</div>
                  <div className="text-[10px] text-stone-400 font-normal">Villages & Habitations (Col 5)</div>
                </th>
                <th className="py-3 px-2 text-center w-12">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-500 dark:text-stone-400">
                    No matching records found.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r, idx) => (
                  <tr
                    key={r.id}
                    className="hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-colors"
                  >
                    <td className="py-2.5 px-3 text-center font-mono text-[11px] text-stone-400">
                      {idx + 1}
                    </td>

                    <td className="py-2.5 px-3 border-r border-stone-100 dark:border-stone-800 font-medium text-stone-900 dark:text-white">
                      {getLabel(r.talukaMr, r.talukaEn)}
                    </td>

                    <td className="py-2.5 px-3 border-r border-stone-100 dark:border-stone-800">
                      <span className="font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded">
                        {getLabel(r.divisionCode, `${r.divisionNumber}-${r.divisionNameEn}`)}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 border-r border-stone-100 dark:border-stone-800">
                      <span className="font-semibold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 rounded">
                        {getLabel(r.ganCode, `${r.ganNumber}. ${r.ganNameEn}`)}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 border-r border-stone-100 dark:border-stone-800 text-stone-800 dark:text-stone-200">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-stone-400 text-[10px]">
                          {r.gpSerialNo}.
                        </span>
                        <span className="font-medium">
                          {getLabel(r.gpNameMr, r.gpNameEn)}
                        </span>
                      </div>
                    </td>

                    <td className="py-2.5 px-3 border-r border-stone-100 dark:border-stone-800 text-stone-900 dark:text-white">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold text-[11px]">
                            {r.villageSerialNo}.
                          </span>
                          <span className="font-medium">
                            {getLabel(r.villageNameMr, r.villageNameEn)}
                          </span>
                        </div>
                        {r.notes && (
                          <span className="text-[10px] bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 px-1.5 py-0.5 rounded font-medium shrink-0">
                            {r.notes}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-2.5 px-2 text-center">
                      <button
                        onClick={() => handleCopyRow(r)}
                        title="Copy citation"
                        className="text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 p-1 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                      >
                        {copiedId === r.id ? (
                          <Check size={14} className="text-emerald-600" />
                        ) : (
                          <Copy size={13} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
