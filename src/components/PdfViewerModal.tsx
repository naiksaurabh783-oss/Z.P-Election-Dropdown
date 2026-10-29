import React, { useState } from 'react';
import { X, FileText, ChevronLeft, ChevronRight, Download, Maximize2, ExternalLink } from 'lucide-react';

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfPath: string;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  onClose,
  pdfPath,
}) => {
  const [currentPage, setCurrentPage] = useState(2); // Start on page 2 where the table begins

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 rounded-2xl max-w-5xl w-full h-[90vh] shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="px-5 py-3.5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-100/90 dark:bg-stone-800/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-stone-900 dark:text-white flex items-center gap-2">
                <span>सावनेर पंचायत समिती - अंतिम प्रभाग रचना.pdf</span>
                <span className="text-[10px] bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 px-1.5 py-0.5 rounded font-mono">
                  Official Gazette
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Collector Office Nagpur | Notification जिपनि-२०२५/प्र.क्र.३६/पं.रा.२
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={pdfPath}
              target="_blank"
              rel="noopener noreferrer"
              download="savner_panchayat_samiti_ward_structure.pdf"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
              title="Download Original PDF"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Download</span>
            </a>
            <a
              href={pdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
              title="Open in new window"
            >
              <ExternalLink size={14} />
            </a>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-1.5 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors ml-1"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Page Jump Bar */}
        <div className="px-5 py-2 bg-stone-50 dark:bg-stone-800/40 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs text-stone-600 dark:text-stone-300">
          <div className="flex items-center gap-2">
            <span className="font-medium text-stone-500">Jump to Schedule Page:</span>
            {[
              { num: 1, label: 'Order / आदेश' },
              { num: 2, label: 'Page 1 (Gana 1-3)' },
              { num: 3, label: 'Page 2 (Gana 3-6)' },
              { num: 4, label: 'Page 3 (Gana 6-10)' },
              { num: 5, label: 'Page 4 (Gana 10-14)' },
            ].map((p) => (
              <button
                key={p.num}
                onClick={() => setCurrentPage(p.num)}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                  currentPage === p.num
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-600 border border-stone-200 dark:border-stone-600'
                }`}
              >
                {p.num}. {p.label}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-stone-400 hidden md:inline">
            Use the iframe below to scroll or zoom through all pages
          </span>
        </div>

        {/* PDF Viewer Body */}
        <div className="flex-1 bg-stone-200 dark:bg-stone-950 p-2 md:p-4 overflow-hidden relative">
          <iframe
            src={`${pdfPath}#page=${currentPage}`}
            title="Original Savner Panchayat Samiti PDF Gazette"
            className="w-full h-full rounded-xl bg-white shadow-inner border border-stone-300 dark:border-stone-800"
          />
        </div>
      </div>
    </div>
  );
};
