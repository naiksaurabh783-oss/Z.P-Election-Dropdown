import React from 'react';
import {
  BarChart3,
  Building2,
  Users,
  MapPin,
  AlertTriangle,
  Scale,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';
import { SAVNER_HIERARCHY, PanchayatSamitiHierarchy, getHierarchyStats, getFlatRecords } from '../data/savnerData';
import { flattenHierarchy } from '../services/googleSheets';

interface AnalyticsViewProps {
  language: 'mr' | 'en' | 'bilingual';
  data?: PanchayatSamitiHierarchy;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  language,
  data = SAVNER_HIERARCHY,
}) => {
  const flat = flattenHierarchy(data);
  const totalDivisions = data.divisions.length;
  let totalGana = 0;
  let totalGps = 0;
  let totalVillages = flat.length;

  data.divisions.forEach((div) => {
    totalGana += div.gana.length;
    div.gana.forEach((gan) => {
      totalGps += gan.gramPanchayats.length;
    });
  });

  const stats = { totalDivisions, totalGana, totalGps, totalVillages };

  const getLabel = (mr: string, en: string) => {
    if (language === 'mr') return mr;
    if (language === 'en') return en;
    return `${mr} (${en})`;
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
            <span className="text-xs font-medium">
              {language === 'mr' ? 'जि.प. निवडणूक विभाग' : 'Z.P. Divisions'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <Building2 size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-900 dark:text-white">
            {stats.totalDivisions}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            {language === 'mr' ? 'जिल्हा परिषद (जि.प.) प्रभाग' : 'Zilla Parishad (Z.P.) divisions'}
          </p>
        </div>

        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
            <span className="text-xs font-medium">
              {language === 'mr' ? 'पं.स. निर्वाचक गण' : 'P.S. Gana'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
              <BarChart3 size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-900 dark:text-white">
            {stats.totalGana}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            {language === 'mr' ? 'पंचायत समिती (पं.स.) मतदारसंघ' : 'Panchayat Samiti (P.S.) constituencies'}
          </p>
        </div>

        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
            <span className="text-xs font-medium">
              {language === 'mr' ? 'ग्रामपंचायती' : 'Gram Panchayats'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-900 dark:text-white">
            {stats.totalGps}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            {language === 'mr' ? 'स्थानिक स्वराज्य संस्था' : 'Local panchayats'}
          </p>
        </div>

        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
            <span className="text-xs font-medium">
              {language === 'mr' ? 'समाविष्ट गावे/क्षेत्रे' : 'Villages & Areas'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <MapPin size={16} />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-900 dark:text-white">
            {stats.totalVillages}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            {language === 'mr' ? 'गावे, वस्त्या, तांडे व वार्ड' : 'Habitations, tande & wards'}
          </p>
        </div>
      </div>

      {/* Breakdown per Gan */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-purple-600" />
          <span>{language === 'mr' ? 'प्रत्येक पं.स. गणातील ग्रामपंचायत व गावे वितरण' : 'Distribution of GPs and Villages by P.S. Gan'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.divisions.flatMap((d) =>
            d.gana.map((g) => {
              let vCount = 0;
              g.gramPanchayats.forEach((gp) => (vCount += gp.villages.length));
              return (
                <div
                  key={g.id}
                  className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-center text-[11px]">
                      {g.number}
                    </span>
                    <div>
                      <div className="font-semibold text-stone-800 dark:text-stone-200">
                        {getLabel(g.code, g.nameEn)}
                      </div>
                      <div className="text-[10px] text-stone-400">
                        {language === 'mr' ? 'विभाग:' : 'Division:'} {getLabel(d.code, d.nameEn)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 px-2 py-0.5 rounded-md font-medium text-[11px]">
                      {g.gramPanchayats.length} {language === 'mr' ? 'ग्रा.पं.' : 'GPs'}
                    </span>
                    <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md font-medium text-[11px]">
                      {vCount} {language === 'mr' ? 'गावे' : 'Villages'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Special Highlights & Legal Order Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Special Areas in Gazette */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>{language === 'mr' ? 'विशेष समाविष्ट क्षेत्रे व नोंदी' : 'Special Gazette Designations'}</span>
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 rounded-xl">
              <strong className="text-blue-900 dark:text-blue-200 block mb-1">
                🌊 {language === 'mr' ? 'पाण्याखालील गावे (Submerged Villages):' : 'Submerged Villages:'}
              </strong>
              <ul className="list-disc list-inside text-blue-800 dark:text-blue-300 space-y-0.5">
                <li>
                  <strong>१५. राजेगाव (पाण्याखाली)</strong> - गण १. बडेगाव, ग्रा.पं. सोनपूर
                </li>
                <li>
                  <strong>११. जुनेवानी (पाण्याखाली)</strong> - गण ६. नांदागोमुख, ग्रा.पं. तेलंगखेडी
                </li>
              </ul>
            </div>

            <div className="p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/40 rounded-xl">
              <strong className="text-purple-900 dark:text-purple-200 block mb-1">
                🏙️ {language === 'mr' ? 'वार्ड विभागणी (Ward Distribution):' : 'Ward Distribution:'}
              </strong>
              <p className="text-purple-800 dark:text-purple-300 leading-relaxed">
                चिचोली गाव दोन वेगवेगळ्या गणात विभागले आहे:
                <br />
                • <strong>गण १३-चिचोली</strong> मध्ये चिचोली वार्ड क्रं. १,२,३,४
                <br />
                • <strong>गण १४-भानेगाव</strong> मध्ये चिचोली वार्ड क्रं. ५,६
              </p>
            </div>

            <div className="p-3 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-xl">
              <strong className="text-stone-800 dark:text-stone-200 block mb-1">
                🏷️ {language === 'mr' ? 'विस्तारित व पुनर्वसन क्षेत्रे (Re./Bk./Kh.):' : 'Settlement Suffixes:'}
              </strong>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                (री.) = रैय्यतवारी / पुनर्वसित (उदा. पोपळा, चारगाव, उमरी, भोजापूर, पोहणा, जाखेवाडा).
                <br />
                (बु.) = बुद्रुक (मोठे गाव), (खु.) = खुर्द (लहान गाव).
              </p>
            </div>
          </div>
        </div>

        {/* Legal Context & Authority */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-600" />
            <span>{language === 'mr' ? 'प्रशासकीय व कायदेशीर संदर्भ' : 'Legal & Administrative Framework'}</span>
          </h3>

          <div className="space-y-2.5 text-xs text-stone-600 dark:text-stone-400">
            <div className="flex items-start gap-2">
              <FileCheck size={14} className="mt-0.5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-semibold text-stone-800 dark:text-stone-200">
                  {language === 'mr' ? 'शासन अधिसूचना:' : 'Govt Notification:'}
                </span>{' '}
                {data.notificationNumber || 'जिपनि-२०२५/प्र.क्र.३६/पं.रा.२'}
              </div>
            </div>

            <div className="flex items-start gap-2">
              <FileCheck size={14} className="mt-0.5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-semibold text-stone-800 dark:text-stone-200">
                  {language === 'mr' ? 'जिल्हाधिकारी आदेश क्रमांक:' : 'Collector Order No:'}
                </span>{' '}
                {data.orderNumber} ({data.orderDateMr})
              </div>
            </div>

            <div className="flex items-start gap-2">
              <FileCheck size={14} className="mt-0.5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-semibold text-stone-800 dark:text-stone-200">
                  {language === 'mr' ? 'सक्षम प्राधिकारी:' : 'Competent Authority:'}
                </span>{' '}
                {data.issuingAuthorityMr} ({data.issuingAuthorityEn})
              </div>
            </div>

            <div className="flex items-start gap-2">
              <FileCheck size={14} className="mt-0.5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-semibold text-stone-800 dark:text-stone-200">
                  {language === 'mr' ? 'अधिनियम व तरतूद:' : 'Governing Act:'}
                </span>{' '}
                महाराष्ट्र जिल्हा परिषद व पंचायत समिती अधिनियम, १९६१ चे कलम ५८(१)(अ) व कलम १२(१)
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-600" />
              <span>
                {language === 'mr'
                  ? 'या अंतिम प्रभाग रचनेनुसार सावनेर तालुक्याची पुढील सार्वत्रिक निवडणुकांसाठी ७ जिल्हा परिषद विभाग व १४ पंचायत समिती निर्वाचक गणांमध्ये पुनर्रचना करण्यात आलेली आहे.'
                  : 'As per this final order, Savner Taluka is structured into 7 ZP divisions and 14 Panchayat Samiti electoral gana for upcoming general elections.'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
