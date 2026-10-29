import React, { useState } from 'react';
import { User } from 'firebase/auth';
import {
  FileSpreadsheet,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Table,
  Layers,
  FileCheck,
  Building2,
} from 'lucide-react';
import { exportToGoogleSheets, exportMasterDistrictSpreadsheet, ExportResult } from '../services/googleSheets';
import { PanchayatSamitiHierarchy } from '../data/savnerData';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onPromptSignIn: () => void;
  accessToken: string | null;
  currentHierarchy: PanchayatSamitiHierarchy;
  allTalukas?: PanchayatSamitiHierarchy[];
  defaultMode?: 'current' | 'master';
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  user,
  onPromptSignIn,
  accessToken,
  currentHierarchy,
  allTalukas = [currentHierarchy],
  defaultMode = 'current',
}) => {
  const [exportMode, setExportMode] = useState<'current' | 'master'>(defaultMode);
  const [isExporting, setIsExporting] = useState(false);
  const [exportResult, setExportResult] = useState<ExportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirmExport = async () => {
    if (!accessToken) {
      onPromptSignIn();
      return;
    }

    try {
      setIsExporting(true);
      setError(null);

      let result: ExportResult;
      if (exportMode === 'master' && allTalukas.length > 0) {
        result = await exportMasterDistrictSpreadsheet(accessToken, allTalukas);
      } else {
        result = await exportToGoogleSheets(accessToken, currentHierarchy);
      }

      setExportResult(result);
    } catch (err: any) {
      console.error('Export failed:', err);
      setError(err?.message || 'Failed to export spreadsheet. Please ensure access permissions.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleReset = () => {
    setExportResult(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/80 dark:bg-stone-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-stone-900 dark:text-white">
                Export to Google Sheets
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Panchayat Samiti Hierarchical Ward Structure
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {!exportResult ? (
            <>
              {/* Export Mode Toggle */}
              {allTalukas.length > 1 && (
                <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-xl text-xs font-medium">
                  <button
                    onClick={() => setExportMode('current')}
                    className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      exportMode === 'current'
                        ? 'bg-white dark:bg-stone-700 text-emerald-800 dark:text-emerald-300 shadow-2xs font-bold'
                        : 'text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    Current: {currentHierarchy.talukaMr} ({currentHierarchy.talukaEn})
                  </button>
                  <button
                    onClick={() => setExportMode('master')}
                    className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      exportMode === 'master'
                        ? 'bg-white dark:bg-stone-700 text-emerald-800 dark:text-emerald-300 shadow-2xs font-bold'
                        : 'text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    District Master ({allTalukas.length} Talukas)
                  </button>
                </div>
              )}

              <div className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                {exportMode === 'master'
                  ? `This will create a Master District Spreadsheet in your Google Drive with a Master Summary sheet and individual sheets for all ${allTalukas.length} extracted Panchayat Samitis:`
                  : `This will create a new, organized Google Spreadsheet for ${currentHierarchy.talukaMr} (${currentHierarchy.talukaEn}) with 4 dedicated sheets:`}
              </div>

              {/* Tabs preview */}
              <div className="space-y-2 bg-stone-50 dark:bg-stone-800/40 p-3.5 rounded-xl border border-stone-200/70 dark:border-stone-700/60 text-xs">
                {exportMode === 'master' ? (
                  <>
                    <div className="font-semibold text-stone-700 dark:text-stone-200 flex items-center gap-1.5 mb-1.5">
                      <Building2 size={14} className="text-emerald-600" />
                      <span>District Master Workbook Structure:</span>
                    </div>
                    <div className="text-stone-600 dark:text-stone-300">
                      • <strong>Sheet 1: जिल्हा सारांश (District Summary):</strong> Overall rollup of Z.P. divisions, P.S. gana, GPs, and village counts.
                    </div>
                    <div className="text-stone-600 dark:text-stone-300">
                      • <strong>Sheets 2-{allTalukas.length + 1}:</strong> Dedicated sheet for each taluka ({allTalukas.map((t) => t.talukaMr).join(', ')}).
                    </div>
                  </>
                ) : (
                  <>
                    <div className="font-semibold text-stone-700 dark:text-stone-200 flex items-center gap-1.5 mb-1.5">
                      <Layers size={14} className="text-emerald-600" />
                      <span>4 Dedicated Sheets:</span>
                    </div>
                    <div className="flex items-start gap-2 text-stone-600 dark:text-stone-400">
                      <Table size={13} className="mt-0.5 text-stone-400 shrink-0" />
                      <div>
                        <strong className="text-stone-700 dark:text-stone-300">१. संपूर्ण रचना (Full Hierarchy):</strong> All village rows with Taluka, Z.P. Division, P.S. Gan, GP & Notes.
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-stone-600 dark:text-stone-400">
                      <Table size={13} className="mt-0.5 text-stone-400 shrink-0" />
                      <div>
                        <strong className="text-stone-700 dark:text-stone-300">२. जि.प. विभाग व पं.स. गण (Z.P. & P.S.):</strong> Zilla Parishad (Z.P.) division & Panchayat Samiti (P.S.) gan statistics.
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-stone-600 dark:text-stone-400">
                      <Table size={13} className="mt-0.5 text-stone-400 shrink-0" />
                      <div>
                        <strong className="text-stone-700 dark:text-stone-300">३. ग्रामपंचायती (Gram Panchayats):</strong> Index of all Gram Panchayats with village rosters.
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-stone-600 dark:text-stone-400">
                      <FileCheck size={13} className="mt-0.5 text-stone-400 shrink-0" />
                      <div>
                        <strong className="text-stone-700 dark:text-stone-300">४. शासन आदेश तपशील (Metadata):</strong> Notification no., Order no. & Collector authority.
                      </div>
                    </div>
                  </>
                )}
              </div>

              {!user && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl flex items-center justify-between gap-3 text-xs text-amber-800 dark:text-amber-300">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="shrink-0 text-amber-600" />
                    <span>Please sign in with your Google account to create and write to your Google Sheets.</span>
                  </div>
                  <button
                    onClick={onPromptSignIn}
                    className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg shrink-0 transition-colors cursor-pointer"
                  >
                    Sign in
                  </button>
                </div>
              )}

              {user && (
                <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                  <span>
                    Authenticated as <strong>{user.email}</strong>. File will be created in your Google Drive.
                  </span>
                </div>
              )}

              {error && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl text-xs flex items-start gap-2">
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}
            </>
          ) : (
            <div className="py-4 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <h4 className="text-base font-semibold text-stone-900 dark:text-white">
                  Spreadsheet Created Successfully!
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto">
                  "{exportResult.title}" has been saved directly to your Google Drive account.
                </p>
              </div>

              <div className="pt-2">
                <a
                  href={exportResult.spreadsheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <FileSpreadsheet size={16} />
                  <span>Open in Google Sheets</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-stone-50/80 dark:bg-stone-800/50 border-t border-stone-100 dark:border-stone-800 flex items-center justify-end gap-3">
          {!exportResult ? (
            <>
              <button
                type="button"
                onClick={handleReset}
                disabled={isExporting}
                className="px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmExport}
                disabled={isExporting || !user}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-xs hover:shadow transition-all disabled:opacity-50 cursor-pointer"
              >
                {isExporting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Creating Spreadsheet...</span>
                  </>
                ) : (
                  <>
                    <FileSpreadsheet size={14} />
                    <span>Confirm & Export to Sheets</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
