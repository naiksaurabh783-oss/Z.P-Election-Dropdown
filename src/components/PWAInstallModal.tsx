import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  Check,
  Copy,
  ExternalLink,
  X,
  Share2,
  Info,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'mr' | 'en' | 'bilingual';
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  onInstall: () => Promise<boolean>;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  language,
  isInstallable,
  isInstalled,
  isIOS,
  isAndroid,
  onInstall,
}) => {
  const [copied, setCopied] = useState(false);
  const appUrl = window.location.href;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl p-6 text-stone-900 dark:text-stone-100 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
            <Smartphone size={24} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold">
              {language === 'mr' ? 'मोबाईलमध्ये ॲप इंस्टॉल करा (APK / PWA)' : 'Install on Mobile Device (PWA / APK)'}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {language === 'mr'
                ? 'कोणत्याही ॲप स्टोअरशिवाय थेट मोबाईल स्क्रीनवर ॲपप्रमाणे चालवा'
                : 'Run as a standalone native app on Android & iOS without app stores'}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        {isInstalled ? (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <Check size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              {language === 'mr'
                ? 'हे ॲप आधीच आपल्या डिव्हाइसवर इन्स्टॉल केलेले आहे!'
                : 'This app is already running in standalone installed mode!'}
            </span>
          </div>
        ) : null}

        {/* Direct Install Button if browser supports beforeinstallprompt */}
        {isInstallable && !isInstalled && (
          <div className="mb-5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
            <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-200 mb-3">
              {language === 'mr'
                ? 'आपला ब्राउझर १-क्लिक डायरेक्ट इन्स्टॉलेशनला सपोर्ट करतो:'
                : 'Your browser is ready for instant 1-tap installation:'}
            </p>
            <button
              onClick={async () => {
                const ok = await onInstall();
                if (ok) onClose();
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer w-full"
            >
              <Download size={16} />
              <span>{language === 'mr' ? 'आता इन्स्टॉल करा (Install App)' : 'Install App Now'}</span>
            </button>
          </div>
        )}

        {/* Installation Guides for Mobile */}
        <div className="space-y-4 text-xs">
          {/* Method 1: Android Chrome */}
          <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40">
            <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-white mb-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">1</span>
              <span>
                {language === 'mr' ? 'Android मोबाईलवर इन्स्टॉल करण्याची पद्धत (सर्वोत्तम)' : 'Method 1: Direct Android Mobile Install (Recommended)'}
              </span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-stone-600 dark:text-stone-300 pl-1">
              <li>
                {language === 'mr' ? 'आपल्या Android मोबाईलच्या ' : 'Open this app in '}
                <strong>Chrome Browser</strong>
                {language === 'mr' ? ' मध्ये ही लिंक उघडा.' : ' on your Android phone.'}
              </li>
              <li>
                {language === 'mr' ? 'वर उजव्या कोपऱ्यातील ३ ठिपके ' : 'Tap the 3 dots menu '}
                <strong>(⋮ Menu)</strong>
                {language === 'mr' ? ' वर टॅप करा.' : ' at top right.'}
              </li>
              <li>
                <strong>"Install app"</strong> {language === 'mr' ? 'किंवा' : 'or'}{' '}
                <strong>"Add to Home screen" (होम स्क्रीनवर जोडा)</strong>
                {language === 'mr' ? ' वर क्लिक करा.' : '.'}
              </li>
              <li className="text-emerald-700 dark:text-emerald-400 font-medium">
                {language === 'mr'
                  ? 'आपल्या मोबाईलच्या स्क्रीनवर ॲपचे आयकॉन तयार होईल व ते अगदी APK प्रमाणे फुल-स्क्रीन चालेल (इंटरनेट नसतानाही कार्य करेल).'
                  : 'An app icon will appear on your phone home screen, running full-screen with offline support just like a native APK.'}
              </li>
            </ol>
          </div>

          {/* Method 2: iPhone / iPad */}
          <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40">
            <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-white mb-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">2</span>
              <span>{language === 'mr' ? 'iPhone / iOS साठी पद्धत' : 'Method 2: iPhone / iOS Safari'}</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-stone-600 dark:text-stone-300 pl-1">
              <li>Open in <strong>Safari</strong> browser.</li>
              <li>Tap the <strong>Share</strong> button (चौकोनात वर बाण असलेला आयकॉन) at bottom.</li>
              <li>Select <strong>"Add to Home Screen" (होम स्क्रीनवर जोडा)</strong>.</li>
            </ol>
          </div>

          {/* Method 3: Want an actual .APK file? */}
          <div className="p-3.5 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/20">
            <div className="flex items-center gap-2 font-bold text-purple-950 dark:text-purple-300 mb-1.5">
              <Sparkles size={16} className="text-purple-600 dark:text-purple-400" />
              <span>
                {language === 'mr' ? 'तुम्हाला प्रत्यक्ष .APK फाईल हवी असल्यास:' : 'Need a raw .APK file for sideloading?'}
              </span>
            </div>
            <p className="text-stone-600 dark:text-stone-300 mb-2 leading-relaxed">
              {language === 'mr'
                ? 'हे ॲप पूर्णपणे PWA कम्प्लायंट आहे. तुम्ही खालील लिंक मोफत '
                : 'This app is 100% PWA compliant. You can paste your app URL into '}
              <a
                href="https://www.pwabuilder.com"
                target="_blank"
                rel="noreferrer"
                className="text-purple-700 dark:text-purple-400 underline font-semibold inline-flex items-center gap-0.5"
              >
                PWABuilder.com <ExternalLink size={12} />
              </a>
              {language === 'mr'
                ? ' मध्ये टाकून १ मिनिटात थेट स्वाक्षरी केलेली Android APK / AAB फाईल जनरेट करू शकता.'
                : ' to package a signed Android APK package in under 1 minute.'}
            </p>

            {/* Copy App URL bar */}
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                readOnly
                value={appUrl}
                className="grow bg-white dark:bg-stone-900 px-2.5 py-1.5 rounded-lg border border-purple-300 dark:border-purple-800 text-[11px] font-mono text-stone-700 dark:text-stone-300 select-all"
              />
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            {language === 'mr' ? 'बंद करा' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
