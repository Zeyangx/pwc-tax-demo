import React, { useRef } from 'react';
import { 
  Printer, AlertTriangle, CheckCircle, Calculator, ChevronRight, 
  BookOpen, Globe, ShieldAlert, FileText, Info, Briefcase
} from 'lucide-react';
import { THEME_BG, COMMON_COUNTRIES, OTHER_COUNTRIES } from '../constants';
import { calculateIIT } from '../utils/taxCalculations';
import PwCLogo from '../components/common/PwCLogo';

const Step3Report = ({ data }) => {
  const reportRef = useRef();
  
  // 核心计算
  const result = calculateIIT(data);
  const days2024 = Number(data.residencyDays[2024]) || 0;
  const isResident = days2024 >= 183;
  
  // 工具函数
  const formatNum = (val) => (Number(val) || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const getCountryName = (code) => {
      const all = [...COMMON_COUNTRIES, ...OTHER_COUNTRIES];
      const found = all.find(c => c.code === code);
      return found ? found.name.split('(')[0].trim() : code;
  };

  const hasCRSRisk = data.crs_foreignBank || data.crs_insurance || data.crs_trust || data.crs_passiveNFE;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 animate-fade-in">
      {/* 顶部工具栏 */}
      <div className="flex justify-between items-center mb-6 no-print">
        <h2 className="text-xl font-bold text-gray-800">税务全景分析报告</h2>
        <div className="flex gap-3">
            <button onClick={() => window.location.reload()} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded text-sm">重新开始</button>
            <button onClick={() => window.print()} className={`flex items-center px-4 py-2 ${THEME_BG} text-white rounded hover:opacity-90 shadow-sm text-sm font-medium`}>
                <Printer className="w-4 h-4 mr-2" /> 打印 / 导出 PDF
            </button>
        </div>
      </div>

      {/* 报告主体 (A4 纸张效果) */}
      <div ref={reportRef} className="bg-white shadow-xl mx-auto p-6 md:p-8 max-w-[210mm] min-h-[297mm] print:shadow-none print:max-w-full print:p-0 print:m-0 font-serif text-gray-800">
        
        {/* Header（压缩垂直间距） */}
        <div className="flex justify-between items-center border-b-2 border-gray-800 pb-2 mb-4">
            <div className="flex flex-col">
                <div className="inline-block transform scale-150 origin-left">
                  <PwCLogo />
                </div>
                <div className="mt-1 text-xs text-gray-500 uppercase tracking-widest">Private Client Services</div>
            </div>
            <div className="text-right">
                <h1 className="text-xl font-bold text-gray-900 leading-tight">2024年度个人所得税<br/>合规及风险评估报告</h1>
                <p className="text-gray-500 text-xs mt-1">Individual Income Tax Compliance & Risk Assessment Report</p>
                <p className="text-gray-400 text-[10px] mt-0.5">报告编号: CN-IIT-2024-{Date.now().toString().slice(-6)}</p>
            </div>
        </div>

        {/* 1. 客户基本信息概览 */}
        <section className="mb-10">
            <div className="flex items-center mb-4 border-l-4 border-orange-600 pl-3">
                <h3 className="text-md font-bold text-gray-900 uppercase tracking-wider">1. 客户基本信息概览 (Executive Summary)</h3>
            </div>
            <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm">
                <div className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="text-gray-500">纳税人姓名</span>
                    <span className="font-bold">{data.name}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="text-gray-500">国籍/地区</span>
                    <span>{getCountryName(data.nationality)}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="text-gray-500">纳税年度</span>
                    <span>2024</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="text-gray-500">申报的境外身份</span>
                    <span>
                        {data.foreignStatuses.length > 0 
                            ? data.foreignStatuses.map(s => `${getCountryName(s.country)}(${s.type})`).join(", ") 
                            : "无"}
                    </span>
                </div>
            </div>
            {/* 资产结构快照 */}
            <div className="mt-4 bg-gray-50 p-3 rounded text-xs text-gray-600 flex gap-4">
                <span className="font-bold text-gray-800">申报资产结构：</span>
                <span className={data.crs_foreignBank ? "text-orange-700" : "text-gray-400"}>[境外账户]</span>
                <span className={data.crs_trust ? "text-orange-700" : "text-gray-400"}>[海外信托]</span>
                <span className={data.crs_passiveNFE ? "text-orange-700" : "text-gray-400"}>[离岸公司]</span>
                <span className={data.propertyTransferIncome > 0 ? "text-orange-700" : "text-gray-400"}>[海外房产]</span>
            </div>
        </section>

        {/* 2. 税收居民身份判定 */}
        <section className="mb-10">
            <div className="flex items-center mb-4 border-l-4 border-orange-600 pl-3">
                <h3 className="text-md font-bold text-gray-900 uppercase tracking-wider">2. 税收居民身份判定 (Residency Determination)</h3>
            </div>
            
            <div className="flex gap-4">
                <div className="w-1/3 bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                    <div className="text-xs text-gray-500 mb-2">2024 境内居住</div>
                    <div className="text-3xl font-bold text-gray-800 mb-1">{days2024} <span className="text-sm font-normal">天</span></div>
                    <div className={`inline-block px-2 py-0.5 rounded text-xs text-white ${isResident ? 'bg-orange-600' : 'bg-blue-500'}`}>
                        {isResident ? "居民个人" : "非居民"}
                    </div>
                </div>
                <div className="w-2/3 text-sm text-gray-700 space-y-2">
                    <p>
                        <strong>法规依据：</strong>根据《中华人民共和国个人所得税法》第一条，在中国境内有住所，或者无住所而一个纳税年度内在中国境内居住累计满一百八十三天的个人，为居民个人。
                    </p>
                    <p className="bg-blue-50 p-2 rounded text-blue-800 text-xs">
                        <strong>判定结论：</strong>
                        您 2024 年度在华居住 <b>{days2024}</b> 天，
                        {isResident 
                         ? "判定为中国税收居民。您负有无限纳税义务，需就中国境内和境外取得的所得缴纳个人所得税。" 
                         : "判定为非居民个人。您仅需就来源于中国境内的所得缴纳个人所得税。"}
                    </p>
                </div>
            </div>
        </section>

        {/* 3. CRS 风险评估 */}
        <section className="mb-10">
            <div className="flex items-center mb-4 border-l-4 border-orange-600 pl-3">
                <h3 className="text-md font-bold text-gray-900 uppercase tracking-wider">3. CRS 风险评估 (CRS Risk Assessment)</h3>
            </div>
            
            {hasCRSRisk ? (
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        基于金融账户涉税信息自动交换标准 (CRS)，中国已与包括BVI、开曼、新加坡、香港等在内的100多个管辖区激活了交换关系。系统检测到以下高风险架构：
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.crs_passiveNFE && (
                            <div className="border border-red-200 bg-red-50 p-3 rounded-lg">
                                <div className="flex items-center text-red-800 font-bold text-sm mb-1"><ShieldAlert className="w-4 h-4 mr-2"/> 消极非金融机构 (Passive NFE)</div>
                                <p className="text-xs text-gray-700">您的BVI/开曼壳公司若主要收入为投资收益，金融机构将穿透识别其实际控制人（您），并将公司账户余额及收入信息直接交换给中国税务局。</p>
                            </div>
                        )}
                        {data.crs_trust && (
                            <div className="border border-red-200 bg-red-50 p-3 rounded-lg">
                                <div className="flex items-center text-red-800 font-bold text-sm mb-1"><ShieldAlert className="w-4 h-4 mr-2"/> 海外信托架构</div>
                                <p className="text-xs text-gray-700">作为信托的委托人或受益人，信托下的金融资产信息极大概率会被交换。即使资产未分配，税务局也可能依据反避税条款进行穿透征税。</p>
                            </div>
                        )}
                        {data.crs_foreignBank && (
                            <div className="border border-orange-200 bg-orange-50 p-3 rounded-lg">
                                <div className="flex items-center text-orange-800 font-bold text-sm mb-1"><Globe className="w-4 h-4 mr-2"/> 境外个人金融账户</div>
                                <p className="text-xs text-gray-700">您名下的海外银行存款、股票托管账户信息将被交换。需重点核对利息、股息收入是否已在国内申报。</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                    <CheckCircle className="w-5 h-5 mr-3"/>
                    本次评估未发现典型的高风险离岸避税架构。请继续保持资产透明化合规。
                </div>
            )}
        </section>

        {/* 4. 纳税义务分析 (这里恢复了最详细的测算表格) */}
        <section className="mb-10 page-break-inside-avoid">
            <div className="flex items-center mb-4 border-l-4 border-orange-600 pl-3">
                <h3 className="text-md font-bold text-gray-900 uppercase tracking-wider">4. 纳税义务分析 (Tax Liability Analysis)</h3>
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden text-sm font-serif">
                {/* 表头 */}
                <div className="bg-gray-100 p-2 border-b border-gray-200 font-bold text-center">综合所得 (Comprehensive Income)</div>
                
                {/* 收入明细 - 详细展开版 */}
                <div className="grid grid-cols-4 border-b border-gray-200 divide-x divide-gray-200 text-xs md:text-sm">
                    <div className="p-2 text-gray-500 bg-gray-50 font-medium">所得项目</div>
                    <div className="p-2 text-gray-500 text-right bg-gray-50 font-medium">原始收入</div>
                    <div className="p-2 text-gray-500 text-right bg-gray-50 font-medium">折算比例</div>
                    <div className="p-2 text-orange-900 text-right bg-orange-50 font-bold">计入综合所得</div>
                    
                    {/* 工资 */}
                    <div className="p-2">工资薪金</div>
                    <div className="p-2 text-right">{formatNum(data.salary)}</div>
                    <div className="p-2 text-right text-gray-400">100%</div>
                    <div className="p-2 text-right bg-orange-50 font-mono">{formatNum(result.salaryTaxable)}</div>

                    {/* 劳务 - 80% */}
                    <div className="p-2">劳务报酬</div>
                    <div className="p-2 text-right">{formatNum(data.labor)}</div>
                    <div className="p-2 text-right text-gray-400">80%</div>
                    <div className="p-2 text-right bg-orange-50 font-mono">{formatNum(result.laborTaxable)}</div>

                    {/* 稿酬 - 56% */}
                    <div className="p-2">稿酬所得</div>
                    <div className="p-2 text-right">{formatNum(data.author)}</div>
                    <div className="p-2 text-right text-gray-400">56% (70% × 80%)</div>
                    <div className="p-2 text-right bg-orange-50 font-mono">{formatNum(result.authorTaxable)}</div>

                    {/* 特许权 - 80% */}
                    <div className="p-2">特许权使用费</div>
                    <div className="p-2 text-right">{formatNum(data.royalty)}</div>
                    <div className="p-2 text-right text-gray-400">80%</div>
                    <div className="p-2 text-right bg-orange-50 font-mono">{formatNum(result.royaltyTaxable)}</div>
                </div>

                {/* 扣除项目 */}
                <div className="bg-gray-50 p-3 border-b border-gray-200 flex flex-wrap justify-between items-center text-xs">
                    <span className="font-bold text-gray-700">减：税前扣除项目</span>
                    <div className="flex gap-4">
                        <span>基本减除: {formatNum(result.standardDeduction)}</span>
                        <span>社保公积金(估): {formatNum(result.socialSecurity)}</span>
                        <span>专项附加(估): {formatNum(result.specialAdditionalDeduction)}</span>
                    </div>
                </div>

                {/* 应纳税所得额 */}
                <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-gray-100">
                    <span className="font-bold">综合所得应纳税所得额</span>
                    <span className="font-mono font-bold text-lg">{formatNum(result.taxableComprehensive)}</span>
                </div>

                {/* 税率计算 */}
                <div className="p-3 border-b border-gray-200 text-xs text-gray-600 flex justify-between items-center">
                    <span>
                        适用税率: <b>{result.compTaxRate}%</b> &nbsp;|&nbsp; 
                        速算扣除数: <b>{formatNum(result.quickDeduction)}</b>
                    </span>
                    <span className="font-bold text-gray-900">综合所得应纳税额: {formatNum(result.compTaxAmount)}</span>
                </div>
            </div>

            {/* 分类所得表格 */}
            <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden text-sm font-serif">
                <div className="bg-gray-100 p-2 border-b border-gray-200 font-bold text-center">分类所得 (Classified Income) - 税率 20%</div>
                <div className="p-3 flex justify-between text-xs items-center">
                    <div className="space-y-1 w-2/3">
                        <div className="flex justify-between"><span>利息股息红利:</span> <span>{formatNum(Number(data.interest) + Number(data.dividend))}</span></div>
                        <div className="flex justify-between"><span>财产转让所得:</span> <span>{formatNum(data.propertyTransferIncome)}</span></div>
                        <div className="flex justify-between text-gray-400 pl-4"><span>(减：财产原值及费用):</span> <span>- {formatNum(data.propertyTransferCost)}</span></div>
                    </div>
                    <div className="h-8 w-[1px] bg-gray-200 mx-4"></div>
                    <div className="text-right flex-1">
                        <div className="text-gray-500">分类所得应纳税额</div>
                        <div className="font-bold text-lg">{formatNum(result.classifiedTaxAmount)}</div>
                    </div>
                </div>
            </div>

            {/* 最终汇总 */}
            <div className="mt-6 flex justify-end">
                <div className="w-1/2 bg-orange-50 p-4 rounded-lg border border-orange-100">
                    <div className="flex justify-between mb-2 text-sm">
                        <span>全年应纳税额合计:</span>
                        <span>{formatNum(result.totalTaxLiability)}</span>
                    </div>
                    <div className="flex justify-between mb-2 text-sm text-green-700">
                        <span>减：境外已纳税额抵免:</span>
                        <span>- {formatNum(result.allowableCredit)}</span>
                    </div>
                    <div className="border-t border-orange-200 pt-2 flex justify-between items-center">
                        <span className="font-bold text-orange-900">应补 / (退) 税额:</span>
                        <span className="font-bold text-xl text-orange-600">
                            ¥ {formatNum(result.finalTaxDue)}
                        </span>
                    </div>
                    {result.finalTaxDue > 0 && (
                        <div className="text-[10px] text-orange-400 mt-2 text-right">
                            *请于 2025年6月30日 前完成补税
                        </div>
                    )}
                </div>
            </div>
        </section>

        {/* 5. 申报指引 */}
        <section className="mb-10 page-break-inside-avoid">
             <div className="flex items-center mb-4 border-l-4 border-orange-600 pl-3">
                <h3 className="text-md font-bold text-gray-900 uppercase tracking-wider">5. 申报指引 (Filing Guide)</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center text-blue-700 font-bold text-sm mb-2"><BookOpen className="w-4 h-4 mr-2"/> 申报时间</div>
                    <p className="text-xs text-gray-600">年度汇算清缴应在次年 <b>3月1日至6月30日</b> 内完成。境外所得由于计算复杂，建议预留充足时间。</p>
                </div>
                <div className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center text-blue-700 font-bold text-sm mb-2"><FileText className="w-4 h-4 mr-2"/> 申报渠道</div>
                    <p className="text-xs text-gray-600">推荐使用 <b>“个人所得税” APP</b>。涉及境外抵免或复杂商业投资所得，可能需要前往办税服务厅。</p>
                </div>
                <div className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center text-blue-700 font-bold text-sm mb-2"><Briefcase className="w-4 h-4 mr-2"/> 所需材料</div>
                    <p className="text-xs text-gray-600">1. 境外征税主体出具的完税证明原件。<br/>2. 完税证明的中文翻译件。<br/>3. 护照出入境记录。</p>
                </div>
            </div>
        </section>

        {/* 6. 税务风险提示 */}
        <section className="mb-10 page-break-inside-avoid">
             <div className="flex items-center mb-4 border-l-4 border-orange-600 pl-3">
                <h3 className="text-md font-bold text-gray-900 uppercase tracking-wider">6. 重要税务风险提示 (Risk Warning)</h3>
            </div>
            <ul className="space-y-3">
                <li className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5"/>
                    <div className="text-sm">
                        <strong className="text-gray-800">反避税条款 (General Anti-Avoidance Rule):</strong>
                        <p className="text-gray-600 text-xs mt-1">根据《个税法》第八条，个人利用离岸公司（如BVI）不合理留存利润不分配，税务机关有权按照“受控外国企业(CFC)”规则进行纳税调整，补征税款并加收利息。</p>
                    </div>
                </li>
                <li className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5"/>
                    <div className="text-sm">
                        <strong className="text-gray-800">滞纳金与罚款:</strong>
                        <p className="text-gray-600 text-xs mt-1">未按期办理汇算清缴，将面临每日万分之五的滞纳金，并可能被处以0.5倍至5倍罚款，且会记入个人纳税信用档案。</p>
                    </div>
                </li>
                <li className="flex items-start">
                    <Info className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5"/>
                    <div className="text-sm">
                        <strong className="text-gray-800">汇率折算风险:</strong>
                        <p className="text-gray-600 text-xs mt-0.5">境外所得应按照所得取得日或上月最后一日的人民币汇率中间价折算。汇率波动可能导致实际税负差异。</p>
                    </div>
                </li>
            </ul>
        </section>

        {/* 7. 附录 */}
        <section className="page-break-inside-avoid">
             <div className="flex items-center mb-4 border-l-4 border-orange-600 pl-3">
                <h3 className="text-md font-bold text-gray-900 uppercase tracking-wider">7. 附录 (Appendix)</h3>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded p-4 text-xs text-gray-500 font-mono">
                <p>附件清单：</p>
                <ul className="list-decimal list-inside mt-2 space-y-1">
                    <li>2024年度出入境记录明细 (Entry-Exit Record)</li>
                    <li>境外银行流水复印件 (Bank Statements - DBS/Citi)</li>
                    <li>境外完税凭证及翻译件 (Tax Certificates)</li>
                    <li>个税APP申报回执 (Filing Receipt)</li>
                </ul>
            </div>
        </section>

        {/* 页脚 */}
        <div className="mt-12 pt-6 border-t border-gray-300 text-center">
            <p className="text-[10px] text-gray-400">
                © 2025 PwC AI Empowered Tax Solutions. All Rights Reserved. <br/>
                This report is generated by AI for simulation purposes and does not constitute official tax advice.
            </p>
        </div>

      </div>
    </div>
  );
};

export default Step3Report;