import React, { useRef } from 'react';
import { Printer, AlertTriangle, CheckCircle } from 'lucide-react';
import { THEME_BG, COMMON_COUNTRIES, OTHER_COUNTRIES } from '../constants';
import { calculateIIT } from '../utils/taxCalculations';

const Step3Report = ({ data }) => {
  const reportRef = useRef();
  const days2024 = Number(data.residencyDays[2024]) || 0;
  const taxResult = calculateIIT(data.salary, data.labor, data.author, data.royalty, data.otherIncome, data.taxPaid);
  const isResident = days2024 >= 183;
  const formatNum = (val) => (Number(val) || 0).toLocaleString();
  const hasCRSRisk = data.crs_foreignBank || data.crs_insurance || data.crs_trust || data.crs_passiveNFE;
  
  const getCountryName = (code) => {
      const all = [...COMMON_COUNTRIES, ...OTHER_COUNTRIES];
      const found = all.find(c => c.code === code);
      return found ? found.name.split('(')[0].trim() : code;
  };

  const tieBreakerAnalysis = () => {
      if (!isResident) return null; 
      if (data.foreignStatuses.length > 0 || data.tieBreaker.hasForeignHome) {
          return (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded text-xs text-blue-800 font-serif">
                  <strong>双重税务居民风险提示 (Dual Residency Risk):</strong><br/>
                  虽然您在中国居住超过183天，但您同时拥有境外永久住所或身份。根据税收协定“加勒比规则”：
                  <ul className="list-disc list-inside mt-1 ml-2">
                      <li>永久性住所：{data.tieBreaker.hasChinaHome ? "中国有" : "中国无"} vs {data.tieBreaker.hasForeignHome ? "境外有" : "境外无"}</li>
                      <li>重要利益中心：家庭主要在 {data.tieBreaker.familyLocation === 'CN' ? "中国" : "境外"}, 经济主要在 {data.tieBreaker.economicCenter === 'CN' ? "中国" : "境外"}</li>
                  </ul>
                  <div className="mt-2 font-bold">AI 初步判定：{data.tieBreaker.familyLocation === 'CN' ? "倾向于中国税收居民" : "建议咨询专家进行协定待遇判定"}</div>
              </div>
          );
      }
      return null;
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-fade-in">
      <div className="flex justify-between items-center mb-6 no-print">
        <h2 className="text-xl font-bold text-gray-800">分析报告预览</h2>
        <div className="flex gap-3">
            <button onClick={() => window.location.reload()} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">重置</button>
            <button onClick={() => window.print()} className={`flex items-center px-4 py-2 ${THEME_BG} text-white rounded hover:opacity-90`}>
                <Printer className="w-4 h-4 mr-2" /> 打印 / 下载 PDF
            </button>
        </div>
      </div>

      <div ref={reportRef} className="bg-white shadow-lg mx-auto p-[50px] md:p-[80px] max-w-[210mm] min-h-[297mm] print:shadow-none print:max-w-full print:p-0">
        <div className="border-b-4 border-orange-600 pb-4 mb-8 flex justify-between items-end">
            <div>
                <h1 className="text-3xl font-serif font-bold text-gray-900">个人税务合规及规划报告</h1>
                <p className="text-gray-500 mt-2 text-sm">Personal Tax Compliance & Planning Report</p>
            </div>
            <div className="text-right">
                <div className="text-orange-600 font-bold text-xl mb-1">PwC Style AI</div>
                <div className="text-gray-400 text-xs">Generated: {new Date().toLocaleDateString()}</div>
            </div>
        </div>

        <section className="mb-8">
            <h3 className="text-lg font-bold text-orange-700 mb-3 uppercase border-b border-gray-200 pb-1">1. 客户基本信息概览 (Executive Summary)</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm font-serif">
                <div className="flex justify-between border-b border-dotted border-gray-300 pb-1">
                    <span className="text-gray-500">客户姓名</span>
                    <span className="font-semibold">{data.name}</span>
                </div>
                <div className="flex justify-between border-b border-dotted border-gray-300 pb-1">
                    <span className="text-gray-500">国籍</span>
                    <span className="font-semibold">{getCountryName(data.nationality)}</span>
                </div>
                <div className="flex justify-between border-b border-dotted border-gray-300 pb-1">
                    <span className="text-gray-500">纳税年度</span>
                    <span className="font-semibold">2024</span>
                </div>
                <div className="flex justify-between border-b border-dotted border-gray-300 pb-1">
                    <span className="text-gray-500">年度境内居住天数 (2024)</span>
                    <span className="font-semibold">{formatNum(days2024)} 天</span>
                </div>
            </div>
            {data.foreignStatuses.length > 0 && (
                <div className="mt-4">
                    <h5 className="text-sm font-bold text-gray-700 mb-2">申报的境外身份</h5>
                    <table className="w-full text-xs border border-gray-200">
                        <thead className="bg-gray-50"><tr><th className="p-2 border border-gray-200 text-left">国家/地区</th><th className="p-2 border border-gray-200 text-left">身份类型</th></tr></thead>
                        <tbody>
                            {data.foreignStatuses.map(s => (
                                <tr key={s.id}><td className="p-2 border border-gray-200">{getCountryName(s.country)}</td><td className="p-2 border border-gray-200">{s.type === 'PR' ? "绿卡/永久居留" : "护照/国籍"}</td></tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>

        <section className="mb-8">
            <h3 className="text-lg font-bold text-orange-700 mb-3 uppercase border-b border-gray-200 pb-1">2. 税收居民身份判定 (Residency Status)</h3>
            <div className="grid grid-cols-4 gap-2 mb-4 text-center text-xs bg-gray-50 p-3 rounded">
                {[2023, 2024, 2025, 2026].map(year => (
                    <div key={year} className={`p-2 rounded border ${year === 2024 ? 'border-orange-300 bg-orange-50' : 'border-gray-200'}`}>
                        <div className="font-bold text-gray-500">{year}</div>
                        <div className="text-lg font-serif">{data.residencyDays[year] || '-'} 天</div>
                        <div className="text-[10px] text-gray-400">{(data.residencyDays[year] || 0) >= 183 ? '居民' : '非居民'}</div>
                    </div>
                ))}
            </div>
            <div className={`p-4 rounded-lg border-l-4 ${isResident ? 'bg-orange-50 border-orange-500' : 'bg-blue-50 border-blue-500'}`}>
                <p className="font-serif text-justify leading-relaxed text-sm">
                    基于2024年数据判定：您在中国境内居住累计 <strong className="mx-1">{days2024}</strong> 天。
                    {isResident ? " 判定为中国税收居民。" : " 判定为非居民个人。"}
                </p>
            </div>
            {tieBreakerAnalysis()}
        </section>

        <section className="mb-8">
            <h3 className="text-lg font-bold text-orange-700 mb-3 uppercase border-b border-gray-200 pb-1">3. 纳税义务分析 (Tax Analysis)</h3>
            <table className="w-full text-sm border-collapse mb-4">
                <thead className="bg-gray-100"><tr><th className="p-2 border border-gray-300 text-left">所得项目</th><th className="p-2 border border-gray-300 text-right">收入金额 (RMB)</th><th className="p-2 border border-gray-300 text-right">预估税额 (RMB)</th></tr></thead>
                <tbody className="font-serif">
                    <tr><td className="p-2 border border-gray-300">综合所得</td><td className="p-2 border border-gray-300 text-right">{(Number(data.salary) + Number(data.labor) + Number(data.royalty) + Number(data.author)).toLocaleString()}</td><td className="p-2 border border-gray-300 text-right">{formatNum(taxResult.comprehensiveTax)}</td></tr>
                    <tr><td className="p-2 border border-gray-300">分类所得</td><td className="p-2 border border-gray-300 text-right">{formatNum(data.otherIncome)}</td><td className="p-2 border border-gray-300 text-right">{formatNum(taxResult.equityTax)}</td></tr>
                    <tr className="bg-orange-50 font-bold text-lg"><td className="p-2 border border-gray-300 text-orange-800">最终应补/退税额</td><td className="p-2 border border-gray-300 text-right"></td><td className="p-2 border border-gray-300 text-right text-orange-800">{formatNum(taxResult.finalTaxDue)}</td></tr>
                </tbody>
            </table>
        </section>

        <section className="mb-8">
            <h3 className="text-lg font-bold text-orange-700 mb-3 uppercase border-b border-gray-200 pb-1">4. CRS 风险评估 (CRS Assessment)</h3>
            {hasCRSRisk ? (
                <div className="space-y-3">
                    <div className="flex items-start space-x-3"><AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" /><div><h5 className="font-bold text-gray-800">检视到需关注的跨境架构</h5></div></div>
                    <ul className="list-disc list-inside text-sm font-serif text-gray-700 ml-10 space-y-2">
                        {data.crs_trust && <li><strong className="text-orange-800">海外信托：</strong> 需关注穿透申报。</li>}
                        {data.crs_passiveNFE && <li><strong className="text-orange-800">消极非金融机构 (Passive NFE)：</strong> 账户信息将被交换。</li>}
                        {data.crs_foreignBank && <li><strong className="text-orange-800">境外金融账户：</strong> 余额及收入将被交换。</li>}
                    </ul>
                </div>
            ) : (
                <div className="flex items-start space-x-3"><CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" /><div><h5 className="font-bold text-gray-800">标准风险等级</h5><p className="font-serif text-sm text-gray-700">当前未显示高风险境外资产。</p></div></div>
            )}
        </section>

        <section>
             <h3 className="text-lg font-bold text-orange-700 mb-3 uppercase border-b border-gray-200 pb-1">5. 客户自述与备注</h3>
             <div className="bg-gray-50 p-4 rounded border-l-4 border-gray-400 text-sm font-serif text-gray-800">{data.userComments || "（未填写）"}</div>
        </section>
      </div>
    </div>
  );
};

export default Step3Report;