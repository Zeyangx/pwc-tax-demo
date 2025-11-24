import React, { useRef } from 'react';
import { 
  Printer,
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Globe,
  ShieldAlert,
  FileText,
  Info,
  Briefcase,
  User,
  MapPin,
  CreditCard
} from 'lucide-react';

import { THEME_BG, COMMON_COUNTRIES, OTHER_COUNTRIES } from '../constants';
import { calculateIIT } from '../utils/taxCalculations';
import logoSrc from '../assets/PwC_2025_Logo.svg';

const Step3Report = ({ data }) => {
  const reportRef = useRef();

  // -------------------- 1. 计算与基础变量 --------------------
  const result = calculateIIT(data || {});
  const residency = data.taxResidency || {};
  const baseInfo = data.baseInfo || {};
  const incomeDomestic = data.incomeDomestic || {};
  const incomeForeign = data.incomeForeign || [];
  const foreignAccounts = data.foreignAccounts || [];
  const familyRelations = data.familyRelations || [];
  const crs = data.crsScan || {};
  const hasHukou = !!data.hasHukou;
  const foreignStatuses = data.foreignStatuses || [];

  const days2024 = Number(residency?.['2024']?.daysInChina) || 0;
  const isResident = days2024 >= 183;

  const formatNum = (val) =>
    (Number(val) || 0).toLocaleString('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const getCountryName = (code) => {
    if (!code) return '';
    const all = [...COMMON_COUNTRIES, ...OTHER_COUNTRIES];
    const found = all.find((c) => c.code === code);
    return found ? found.name.split('(')[0].trim() : code;
  };

  // 收入结构汇总（用于文字分析）
  const totalDomesticIncome = ['salary', 'labor', 'author', 'royalty'].reduce(
    (sum, k) => sum + (Number(incomeDomestic[k]) || 0),
    0
  );
  const totalDomesticTaxPaid = Number(incomeDomestic.taxPaid) || 0;

  const totalForeignSalaryLabor = incomeForeign.reduce(
    (sum, item) =>
      sum +
      (Number(item.salary) || 0) +
      (Number(item.labor) || 0),
    0
  );
  const totalForeignClassifiedIncome = incomeForeign.reduce(
    (sum, item) =>
      sum +
      (Number(item.dividend) || 0) +
      (Number(item.transfer) || 0) +
      (Number(item.rental) || 0),
    0
  );
  const totalForeignTaxPaid = incomeForeign.reduce(
    (sum, item) => sum + (Number(item.taxPaid) || 0),
    0
  );

  const totalOffshoreBalance2024 = foreignAccounts.reduce(
    (sum, acc) => sum + (Number(acc.balance?.['2024']) || 0),
    0
  );

  const passiveNFEAccounts = foreignAccounts.filter(
    (acc) => acc.isPassiveNFE
  );

  const hasCRSRisk =
    crs.trust?.checked ||
    crs.passiveNFE?.checked ||
    crs.cnResidentFlag?.checked ||
    crs.largeInsurance?.checked ||
    crs.multiResidency?.checked ||
    crs.otherRisk?.checked;

  const hasMultiResidencyRisk =
    crs.multiResidency?.checked || (isResident && foreignStatuses.length > 0);

  return (
    <div className="max-w-5xl mx-auto py-4 md:py-6 px-0 md:px-4 animate-fade-in">
      {/* 顶部工具栏 */}
      <div className="flex justify-between items-center mb-4 px-4 md:px-0 no-print">
        <h2 className="text-lg md:text-xl font-bold text-gray-800">
          税务全景分析报告
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded text-xs md:text-sm border border-gray-200 md:border-transparent"
          >
            重置
          </button>
          <button
            onClick={() => window.print()}
            className={`flex items-center px-3 py-1.5 ${THEME_BG} text-white rounded hover:opacity-90 shadow-sm text-xs md:text-sm font-medium`}
          >
            <Printer className="w-4 h-4 mr-1 md:mr-2" />{' '}
            <span className="hidden md:inline">打印 / 导出 PDF</span>
            <span className="md:hidden">PDF</span>
          </button>
        </div>
      </div>

      {/* 报告主体 */}
      <div
        ref={reportRef}
        className="bg-white shadow-none md:shadow-xl mx-auto p-5 md:p-10 w-full md:max-w-[210mm] md:min-h-[297mm] print:shadow-none print:max-w-full print:p-0 print:m-0 font-serif text-gray-800"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row print:flex-row justify-between items-start md:items-end print:items-end border-b-2 border-gray-800 pb-2 mb-6">
          <div className="flex flex-col mb-3 md:mb-0 print:mb-0">
            <img
              src={logoSrc}
              alt="PwC Logo"
              className="h-13 w-auto object-contain"
            />
            <div className="mt-1 text-[10px] md:text-xs text-gray-500 uppercase tracking-widest">
              Private Client Services
            </div>
          </div>
          <div className="text-left md:text-right print:text-right w-full md:w-auto print:w-auto">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
              2024年度个人所得税
              <br />
              合规及风险评估报告
            </h1>
            <p className="text-gray-500 text-[10px] md:text-xs mt-1">
              Individual Income Tax Compliance &amp; CRS Risk Assessment
            </p>
            <p className="text-gray-400 text-[10px] mt-0.5">
              报告编号: CN-IIT-2024-{Date.now().toString().slice(-6)}
            </p>
          </div>
        </div>

        {/* 1. 客户基本信息概览 */}
        <section className="mb-8">
          <div className="flex items-center mb-3 border-l-4 border-orange-600 pl-3">
            <h3 className="text-sm md:text-md font-bold text-gray-900 uppercase tracking-wider">
              1. 客户基本信息概览 (Executive Summary)
            </h3>
          </div>

          {/* 基本资料 */}
          <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-x-12 gap-y-2 md:gap-y-3 text-sm">
            <div className="flex justify-between border-b border-gray-100 pb-1">
              <span className="text-gray-500">纳税人姓名</span>
              <span className="font-bold">{baseInfo.name || '-'}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-1">
              <span className="text-gray-500">国籍/地区</span>
              <span>{getCountryName(baseInfo.nationality) || '-'}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-1">
              <span className="text-gray-500">证件类型</span>
              <span>{baseInfo.idType || '未填写'}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-1">
              <span className="text-gray-500">证件号码</span>
              <span>{baseInfo.idNumber || '未填写'}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-1">
              <span className="text-gray-500">主要受雇单位</span>
              <span className="text-right truncate max-w-[160px]">
                {baseInfo.employer || '未填写'}
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-1">
              <span className="text-gray-500">境外身份/长期签证</span>
              <span className="text-right truncate max-w-[160px]">
                {foreignStatuses.length > 0
                  ? foreignStatuses
                      .map(
                        (s) => `${getCountryName(s.country)}(${s.type})`
                      )
                      .join(', ')
                  : '无'}
              </span>
            </div>
          </div>

          {/* 职务 / 股权 & 全球家庭布局 */}
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs md:text-[11px]">
            <div className="bg-gray-50 p-3 rounded h-full">
              <div className="flex items-center mb-1 text-gray-700 font-bold">
                <User className="w-3 h-3 mr-1" />
                关键职务及股权结构
              </div>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {baseInfo.directorships &&
                baseInfo.directorships.length > 0 ? (
                  <li>
                    境外董事职务：
                    {baseInfo.directorships
                      .map((d) => d.company)
                      .join(' / ')}
                  </li>
                ) : (
                  <li>未申报境外董事职务。</li>
                )}
                {baseInfo.shareholdings &&
                baseInfo.shareholdings.length > 0 ? (
                  <li>
                    持股实体：
                    {baseInfo.shareholdings
                      .map(
                        (s) =>
                          `${s.company}${
                            s.ratio ? `（持股 ${s.ratio}）` : ''
                          }`
                      )
                      .join(' / ')}
                    ，与全球离岸结构及 CRS 穿透密切相关。
                  </li>
                ) : (
                  <li>暂未申报境外控股公司股权。</li>
                )}
              </ul>
            </div>

            <div className="bg-gray-50 p-3 rounded h-full">
              <div className="flex items-center mb-1 text-gray-700 font-bold">
                <MapPin className="w-3 h-3 mr-1" />
                全球家庭与身份布局
              </div>
              <div className="space-y-1 text-gray-600">
                <div>
                  <span className="font-semibold">中国户籍：</span>
                  {hasHukou ? '是（拥有中国户籍）' : '否 / 未勾选'}
                </div>
                <div>
                  <span className="font-semibold">主要家庭成员位置：</span>
                  {familyRelations.length === 0
                    ? '未填写'
                    : familyRelations
                        .map(
                          (f) =>
                            `${f.relation || '家庭成员'}@${getCountryName(
                              f.location
                            )}`
                        )
                        .join('，')}
                </div>
                <div className="mt-1 text-[11px] text-gray-500">
                  家庭所在地及经济利益中心是判断
                  <b>“重要利益中心”</b>、
                  <b>税收居民冲突（Dual Residency）</b>以及 CRS
                  税务居民信息申报的重要参考。
                </div>
              </div>
            </div>
          </div>

          {/* 资产结构快照 */}
          <div className="mt-3 bg-gray-50 p-3 rounded text-xs text-gray-600 flex flex-wrap gap-2 md:gap-4">
            <span className="font-bold text-gray-800 w-full md:w-auto print:w-auto">
              申报资产及结构要点：
            </span>
            <span
              className={
                foreignAccounts.length > 0
                  ? 'text-orange-700'
                  : 'text-gray-400'
              }
            >
              [境外金融账户 x{foreignAccounts.length}]
            </span>
            <span
              className={
                crs.trust?.checked ? 'text-orange-700' : 'text-gray-400'
              }
            >
              [海外信托结构]
            </span>
            <span
              className={
                crs.passiveNFE?.checked ? 'text-orange-700' : 'text-gray-400'
              }
            >
              [离岸公司 / Passive NFE]
            </span>
            <span
              className={
                crs.largeInsurance?.checked
                  ? 'text-orange-700'
                  : 'text-gray-400'
              }
            >
              [大额海外保单]
            </span>
            <span
              className={
                hasMultiResidencyRisk
                  ? 'text-orange-700'
                  : 'text-gray-400'
              }
            >
              [多重税收居民风险]
            </span>
          </div>
        </section>

        {/* 2. 居民身份判定 */}
        <section className="mb-8">
          <div className="flex items-center mb-3 border-l-4 border-orange-600 pl-3">
            <h3 className="text-sm md:text-md font-bold text-gray-900 uppercase tracking-wider">
              2. 税收居民身份判定 (Residency)
            </h3>
          </div>

          <div className="flex flex-col md:flex-row print:flex-row gap-4">
            <div className="w-full md:w-1/3 print:w-1/3 bg-gray-50 p-4 rounded-lg border border-gray-200 text-center flex flex-row md:flex-col print:flex-col justify-between md:justify-center items-center">
              <div className="text-left md:text-center print:text-center">
                <div className="text-xs text-gray-500 mb-0 md:mb-2 print:mb-2">
                  2024 境内居住天数
                </div>
                <div className="text-xl md:text-3xl font-bold text-gray-800 mb-0 md:mb-1 print:mb-1">
                  {days2024}{' '}
                  <span className="text-sm font-normal">天</span>
                </div>
              </div>
              <div
                className={`inline-block px-3 py-1 rounded text-xs text-white ${
                  isResident ? 'bg-orange-600' : 'bg-blue-500'
                }`}
              >
                {isResident ? '居民个人（无限纳税义务）' : '非居民个人'}
              </div>
            </div>

            <div className="w-full md:w-2/3 print:w-2/3 text-sm text-gray-700 space-y-2">
              <p className="text-xs md:text-sm">
                <strong>判定结论：</strong> 根据《个人所得税法》及其实施条例，您
                2024 年度在中国境内居住{' '}
                <b>{days2024}</b> 天，
                {isResident ? (
                  <>
                    判定为<b>中国税收居民</b>。您对
                    <b>全球所得（Global Income）</b>
                    承担无限纳税义务，应按中国税法就境内外综合所得及境外分类所得办理申报，并对境外已纳税额依照
                    <b>“抵免限额 + 分国分项”</b>
                    规则申请税收抵免。
                  </>
                ) : (
                  <>
                    判定为<b>非居民个人</b>。一般仅就
                    <b>中国境内来源所得</b>
                    承担纳税义务，境外纯属境外来源所得原则上无需在中国汇算清缴，但仍需关注
                    <b>实际管理机构、劳务发生地</b>
                    等“来源地”认定。
                  </>
                )}
              </p>

              {hasMultiResidencyRisk && (
                <div className="bg-blue-50 p-2 rounded text-blue-800 text-xs mt-2">
                  <strong>双重居民风险提示：</strong>
                  检测到您持有境外永久居留权/长期签证或勾选多重居民风险（如：
                  {crs.multiResidency?.remark || '多重居民'}）。如对方国家税法亦视您为税收居民，则需根据适用
                  <b>税收协定 Tie-Breaker Rule</b>
                  依次比较：
                  <b>永久性住所</b> &gt; <b>重要利益中心</b> &gt;{' '}
                  <b>习惯性居所</b> &gt; <b>国籍</b>，必要时建议取得书面居民身份证明并进行协定申诉。
                </div>
              )}

              {/* 三年对比表 */}
              <div className="mt-3 text-[11px] md:text-xs">
                <div className="font-bold mb-1 text-gray-700">
                  三年居住与利益中心对比
                </div>
                <div className="border border-gray-200 rounded overflow-hidden">
                  <div className="grid grid-cols-5 bg-gray-50 border-b border-gray-200 font-semibold">
                    <div className="p-1.5 text-center">年度</div>
                    <div className="p-1.5 text-center">在华天数</div>
                    <div className="p-1.5 text-center">183天以上所在国</div>
                    <div className="p-1.5 text-center">主要经济中心</div>
                    <div className="p-1.5 text-center">家庭所在地</div>
                  </div>
                  {['2022', '2023', '2024'].map((y) => {
                    const yr = residency?.[y] || {};
                    return (
                      <div
                        key={y}
                        className="grid grid-cols-5 border-b last:border-b-0 border-gray-200"
                      >
                        <div className="p-1.5 text-center">{y}</div>
                        <div className="p-1.5 text-center">
                          {yr.daysInChina || '-'}
                        </div>
                        <div className="p-1.5 text-center">
                          {getCountryName(yr.over183Country) || '-'}
                        </div>
                        <div className="p-1.5 text-center">
                          {yr.ecoCenter || '-'}
                        </div>
                        <div className="p-1.5 text-center">
                          {yr.familyLoc || '-'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 全球收入结构与税负分布 */}
        <section className="mb-8 page-break-inside-avoid">
          <div className="flex items-center mb-3 border-l-4 border-orange-600 pl-3">
            <h3 className="text-sm md:text-md font-bold text-gray-900 uppercase tracking-wider">
              3. 全球收入结构与税负分布 (Global Income Profile)
            </h3>
          </div>

          {/* 汇总卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs md:text-sm mb-4">
            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
              <div className="font-bold text-gray-700 mb-1">
                境内综合所得合计
              </div>
              <div className="text-lg font-mono">
                ¥ {formatNum(totalDomesticIncome)}
              </div>
              <div className="text-[11px] text-gray-500 mt-1">
                工资薪金 + 劳务报酬 + 稿酬 + 特许权使用费（人民币口径）。
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
              <div className="font-bold text-gray-700 mb-1">
                境外综合所得 &amp; 分类所得
              </div>
              <div className="text-xs">
                <div className="flex justify-between">
                  <span>境外综合型（工资/劳务）：</span>
                  <span className="font-mono">
                    ¥ {formatNum(totalForeignSalaryLabor)}
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>境外分类型（利息/股息/转让/租金）：</span>
                  <span className="font-mono">
                    ¥ {formatNum(totalForeignClassifiedIncome)}
                  </span>
                </div>
              </div>
              <div className="text-[11px] text-gray-500 mt-1">
                综合型收入原则上并入中国个人综合所得汇算；分类收入在中国按
                <b>20%</b> 计征，允许境外已纳税额抵免。
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
              <div className="font-bold text-gray-700 mb-1">
                境外已纳税额 &amp; 抵免视角
              </div>
              <div className="flex justify-between text-xs">
                <span>境外已纳税额合计：</span>
                <span className="font-mono">
                  ¥ {formatNum(totalForeignTaxPaid)}
                </span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>模拟可抵免税额：</span>
                <span className="font-mono">
                  ¥ {formatNum(result.allowableCredit)}
                </span>
              </div>
              <div className="text-[11px] text-gray-500 mt-1">
                抵免限额=境外所得折算后在中国应纳税额，超出部分不得结转，建议妥善规划入账时间及所得性质。
              </div>
            </div>
          </div>

          {/* 按国家/地区拆分 */}
          {incomeForeign.length > 0 && (
            <div className="border border-dashed border-gray-300 rounded-lg p-3 text-xs">
              <div className="font-bold text-gray-700 mb-2">
                境外收入按国家/地区拆分
              </div>
              <div className="grid grid-cols-6 bg-gray-50 border-b border-gray-200 font-semibold">
                <div className="p-2 text-center">国家/地区</div>
                <div className="p-2 text-center">工资/劳务</div>
                <div className="p-2 text-center">股息/利息</div>
                <div className="p-2 text-center">财产转让</div>
                <div className="p-2 text-center">租金</div>
                <div className="p-2 text-center">境外已纳税额</div>
              </div>
              {incomeForeign.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="grid grid-cols-6 border-b last:border-b-0 border-gray-200"
                >
                  <div className="p-2 text-center">
                    {getCountryName(item.country) || '-'}
                  </div>
                  <div className="p-2 text-right">
                    {formatNum(
                      (Number(item.salary) || 0) +
                        (Number(item.labor) || 0)
                    )}
                  </div>
                  <div className="p-2 text-right">
                    {formatNum(Number(item.dividend) || 0)}
                  </div>
                  <div className="p-2 text-right">
                    {formatNum(Number(item.transfer) || 0)}
                  </div>
                  <div className="p-2 text-right">
                    {formatNum(Number(item.rental) || 0)}
                  </div>
                  <div className="p-2 text-right">
                    {formatNum(Number(item.taxPaid) || 0)}
                  </div>
                </div>
              ))}
              <div className="mt-2 text-[11px] text-gray-500">
                说明：以上金额基于客户填报的年度数据，实际税务处理需结合各国/地区税法、协定条款以及银行/税局出具的正式凭证。
              </div>
            </div>
          )}
        </section>

        {/* 4. CRS 风险评估 */}
        <section className="mb-8">
          <div className="flex items-center mb-3 border-l-4 border-orange-600 pl-3">
            <h3 className="text-sm md:text-md font-bold text-gray-900 uppercase tracking-wider">
              4. CRS 风险评估 (CRS &amp; Structuring)
            </h3>
          </div>

          {hasCRSRisk ? (
            <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-3 mb-4">
              {crs.passiveNFE?.checked && (
                <div className="border border-red-200 bg-red-50 p-3 rounded-lg">
                  <div className="flex items-center text-red-800 font-bold text-sm mb-1">
                    <ShieldAlert className="w-4 h-4 mr-2" /> 消极非金融机构
                    (Passive NFE)
                  </div>
                  <p className="text-xs text-gray-700">
                    您申报存在离岸公司 /
                    Passive NFE 架构
                    {crs.passiveNFE?.remark
                      ? `（${crs.passiveNFE.remark}）`
                      : ''}。
                    按照 CRS 穿透规则，金融机构需识别其
                    <b>控权人（Controlling Person）</b>
                    的税收居民身份并向其居民国交换账户信息。
                  </p>
                </div>
              )}
              {crs.trust?.checked && (
                <div className="border border-red-200 bg-red-50 p-3 rounded-lg">
                  <div className="flex items-center text-red-800 font-bold text-sm mb-1">
                    <ShieldAlert className="w-4 h-4 mr-2" /> 海外信托架构
                  </div>
                  <p className="text-xs text-gray-700">
                    您关联海外信托
                    {crs.trust?.remark ? `（${crs.trust.remark}）` : ''}。
                    在 CRS
                    视角下，受托人通常被视为金融机构，信托委托人/受益人/保护人等均可能被视为
                    <b>控制人</b>
                    ，信托内金融资产信息极大概率将被自动交换。
                  </p>
                </div>
              )}
              {crs.cnResidentFlag?.checked && (
                <div className="border border-orange-200 bg-orange-50 p-3 rounded-lg">
                  <div className="flex items-center text-orange-800 font-bold text-sm mb-1">
                    <Globe className="w-4 h-4 mr-2" /> 中国居民登记信息
                  </div>
                  <p className="text-xs text-gray-700">
                    您在部分境外金融机构以中国护照/中国住址登记账户
                    {crs.cnResidentFlag?.remark
                      ? `（${crs.cnResidentFlag.remark}）`
                      : ''}。
                    该等账户余额、利息股息等信息将通过 CRS
                    机制自动交换至中国税务机关。
                  </p>
                </div>
              )}
              {crs.largeInsurance?.checked && (
                <div className="border border-orange-200 bg-orange-50 p-3 rounded-lg">
                  <div className="flex items-center text-orange-800 font-bold text-sm mb-1">
                    <Globe className="w-4 h-4 mr-2" /> 大额储蓄/投资型保单
                  </div>
                  <p className="text-xs text-gray-700">
                    您持有具有现金价值的海外保单
                    {crs.largeInsurance?.remark
                      ? `（${crs.largeInsurance.remark}）`
                      : ''}，
                    该类产品在 CRS 下通常被视为金融账户，其赎回收益在中国可能被认定为
                    <b>利息/投资收益</b>
                    ，需关注所得性质与申报口径。
                  </p>
                </div>
              )}
              {crs.multiResidency?.checked && (
                <div className="border border-orange-200 bg-orange-50 p-3 rounded-lg">
                  <div className="flex items-center text-orange-800 font-bold text-sm mb-1">
                    <Globe className="w-4 h-4 mr-2" /> 多重税收居民身份
                  </div>
                  <p className="text-xs text-gray-700">
                    {crs.multiResidency?.remark
                      ? `您备注：“${crs.multiResidency.remark}”。`
                      : '您勾选了多重居民身份风险。'}
                    多重居民身份可能导致同一笔收入在多个国家同时落入申报范围，需结合税收协定规划居民身份及抵免顺序。
                  </p>
                </div>
              )}
              {crs.otherRisk?.checked && (
                <div className="border border-orange-200 bg-orange-50 p-3 rounded-lg">
                  <div className="flex items-center text-orange-800 font-bold text-sm mb-1">
                    <ShieldAlert className="w-4 h-4 mr-2" /> 其他结构性风险
                  </div>
                  <p className="text-xs text-gray-700">
                    {crs.otherRisk?.remark ||
                      '您勾选了“其他风险”，建议线下进一步访谈以确认具体安排及潜在合规要求。'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm mb-4">
              <CheckCircle className="w-5 h-5 mr-3" />
              未发现典型的高风险离岸避税架构，现有结构在 CRS 维度下风险相对可控。
            </div>
          )}

          {/* 全球金融账户一览 */}
          {foreignAccounts.length > 0 && (
            <div className="text-xs mt-1">
              <div className="flex items-center mb-2 font-bold text-gray-700">
                <CreditCard className="w-4 h-4 mr-1" />
                境外金融账户概览（2024 年底）
              </div>
              <div className="border border-gray-200 rounded overflow-hidden">
                <div className="grid grid-cols-5 bg-gray-50 border-b border-gray-200 font-semibold">
                  <div className="p-2 text-center">序号</div>
                  <div className="p-2 text-center">机构 / 账户</div>
                  <div className="p-2 text-center">登记税务国</div>
                  <div className="p-2 text-center">账户性质</div>
                  <div className="p-2 text-center">2024 年末余额</div>
                </div>
                {foreignAccounts.map((acc, idx) => (
                  <div
                    key={acc.id || idx}
                    className="grid grid-cols-5 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="p-2 text-center">#{idx + 1}</div>
                    <div className="p-2 text-xs">
                      <div className="font-semibold text-gray-800 truncate">
                        {acc.name || acc.type || '未命名账户'}
                      </div>
                      <div className="text-[10px] text-gray-500 truncate">
                        {acc.type || ''}
                      </div>
                    </div>
                    <div className="p-2 text-center">
                      {acc.regInfo?.taxCountry
                        ? getCountryName(acc.regInfo.taxCountry)
                        : '-'}
                    </div>
                    <div className="p-2 text-center">
                      {acc.isPassiveNFE
                        ? '被动 NFE 账户'
                        : '个人 / 主动实体账户'}
                    </div>
                    <div className="p-2 text-right">
                      ¥ {formatNum(acc.balance?.['2024'])}
                    </div>
                  </div>
                ))}
                <div className="flex justify-between items-center bg-gray-50 px-3 py-2 text-[11px] border-t border-gray-200">
                  <span>2024 年境外账户余额合计：</span>
                  <span className="font-mono font-semibold">
                    ¥ {formatNum(totalOffshoreBalance2024)}
                  </span>
                </div>
              </div>
              {passiveNFEAccounts.length > 0 && (
                <div className="mt-2 text-[11px] text-red-700 bg-red-50 border border-red-100 rounded px-2 py-1">
                  提示：存在以被动非金融机构（Passive NFE）名义开立的账户
                  {passiveNFEAccounts.length} 个，上述账户的受益人信息在 CRS 框架下将被穿透至最终控权人。
                </div>
              )}
            </div>
          )}
        </section>

        {/* 5. 纳税义务分析 */}
        <section className="mb-8 page-break-inside-avoid">
          <div className="flex items-center mb-3 border-l-4 border-orange-600 pl-3">
            <h3 className="text-sm md:text-md font-bold text-gray-900 uppercase tracking-wider">
              5. 纳税义务分析 (Tax Calculation)
            </h3>
          </div>

          {/* 文字总括 */}
          <div className="mb-4 bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-700">
            <div className="flex items-center mb-1 font-bold text-gray-800">
              <Briefcase className="w-4 h-4 mr-1" />
              中国个人所得税计算框架（简要说明）
            </div>
            <p className="leading-relaxed">
              在本报告中，我们按照中国个税规则，将您的
              <b>工资薪金、劳务报酬、稿酬、特许权使用费</b>
              归入<b>综合所得</b>，全年汇总后按
              <b>3%–45% 累进税率</b>计税，同时考虑
              <b>基本减除费用、社保、公积金及专项附加扣除</b>等。境外来源的利息、股息红利、财产转让净收益、租金收入则按照
              <b>20% 的比例税率</b>
              进行<b>分类所得</b>计算。在此基础上，我们根据您填报的境外已纳税额，对境外所得尝试模拟
              <b>“分国分项 + 不得超过抵免限额”</b>的税收抵免。
            </p>
          </div>

          {/* 综合所得明细表 */}
          <div className="border border-gray-200 rounded-lg overflow-hidden text-sm font-serif overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="bg-gray-100 p-2 border-b border-gray-200 font-bold text-center">
                综合所得 (境内 + 境外) – 2024 年度
              </div>

              <div className="grid grid-cols-4 border-b border-gray-200 divide-x divide-gray-200 text-xs md:text-sm">
                <div className="p-2 text-gray-500 bg-gray-50 font-medium">
                  所得项目
                </div>
                <div className="p-2 text-gray-500 text-right bg-gray-50 font-medium">
                  全球总收入
                </div>
                <div className="p-2 text-gray-500 text-right bg-gray-50 font-medium">
                  折算比例
                </div>
                <div className="p-2 text-orange-900 text-right bg-orange-50 font-bold">
                  计入综合所得
                </div>

                <div className="p-2">工资薪金</div>
                <div className="p-2 text-right">
                  {formatNum(result.salary)}
                </div>
                <div className="p-2 text-right text-gray-400">100%</div>
                <div className="p-2 text-right bg-orange-50 font-mono">
                  {formatNum(result.salaryTaxable)}
                </div>

                <div className="p-2">劳务报酬</div>
                <div className="p-2 text-right">
                  {formatNum(result.labor)}
                </div>
                <div className="p-2 text-right text-gray-400">80%</div>
                <div className="p-2 text-right bg-orange-50 font-mono">
                  {formatNum(result.laborTaxable)}
                </div>

                <div className="p-2">稿酬所得</div>
                <div className="p-2 text-right">
                  {formatNum(result.author)}
                </div>
                <div className="p-2 text-right text-gray-400">
                  80% × (1 - 20%)
                </div>
                <div className="p-2 text-right bg-orange-50 font-mono">
                  {formatNum(result.authorTaxable)}
                </div>

                <div className="p-2">特许权使用费</div>
                <div className="p-2 text-right">
                  {formatNum(result.royalty)}
                </div>
                <div className="p-2 text-right text-gray-400">80%</div>
                <div className="p-2 text-right bg-orange-50 font-mono">
                  {formatNum(result.royaltyTaxable)}
                </div>
              </div>

              <div className="bg-gray-50 p-3 border-b border-gray-200 flex flex-wrap justify-between items-center text-xs">
                <span className="font-bold text-gray-700 w-full md:w-auto mb-1 md:mb-0">
                  减：税前扣除项目
                </span>
                <div className="flex gap-2 md:gap-4 flex-wrap">
                  <span>基本减除: {formatNum(result.standardDeduction)}</span>
                  <span>社保(估): {formatNum(result.socialSecurity)}</span>
                  <span>
                    专项附加(估):{' '}
                    {formatNum(result.specialAdditionalDeduction)}
                  </span>
                </div>
              </div>

              <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-gray-100">
                <span className="font-bold">综合所得应纳税所得额</span>
                <span className="font-mono font-bold text-lg">
                  {formatNum(result.taxableComprehensive)}
                </span>
              </div>

              <div className="p-3 border-b border-gray-200 text-xs text-gray-600 flex justify-between items-center">
                <span>
                  适用税率: <b>{result.compTaxRate}%</b> (速算扣除:{' '}
                  {formatNum(result.quickDeduction)})
                </span>
                <span className="font-bold text-gray-900">
                  综合所得应纳税额: {formatNum(result.compTaxAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* 分类所得 */}
          <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden text-sm font-serif">
            <div className="bg-gray-100 p-2 border-b border-gray-200 font-bold text-center">
              境外分类所得 (利息 / 股息 / 财产转让 / 租金等)
            </div>
            <div className="p-3 flex flex-col md:flex-row print:flex-row justify-between text-xs items-start md:items-center print:items-center">
              <div className="space-y-1 w-full md:w-2/3 print:w-2/3 mb-2 md:mb-0 print:mb-0">
                <div className="flex justify-between">
                  <span>境外分类收入总额:</span>{' '}
                  <span>{formatNum(result.forClassified)}</span>
                </div>
                <div className="text-gray-400 pl-2">
                  (含利息、股息红利、房产转让净收益、租金等。)
                </div>
              </div>
              <div className="hidden md:block print:block h-8 w-[1px] bg-gray-200 mx-4" />
              <div className="text-right w-full md:flex-1 print:flex-1 border-t border-gray-100 md:border-0 print:border-0 pt-2 md:pt-0 print:pt-0">
                <div className="text-gray-500">
                  分类所得应纳税额 (20% 试算)
                </div>
                <div className="font-bold text-lg">
                  {formatNum(result.classifiedTaxAmount)}
                </div>
              </div>
            </div>
          </div>

          {/* 汇总 */}
          <div className="mt-6 flex justify-end">
            <div className="w-full md:w-1/2 bg-orange-50 p-5 rounded-lg border border-orange-100">
              <div className="flex justify-between mb-2 text-sm">
                <span>全年应纳税额合计:</span>
                <span>{formatNum(result.totalTaxLiability)}</span>
              </div>
              <div className="flex justify-between mb-2 text-sm text-green-700">
                <span>减：境内已预缴:</span>
                <span>- {formatNum(result.domesticPrepaid)}</span>
              </div>
              <div className="flex justify-between mb-2 text-sm text-green-700">
                <span>减：境外已纳税额抵免(模拟):</span>
                <span>- {formatNum(result.allowableCredit)}</span>
              </div>
              <div className="border-t border-orange-200 pt-3 flex justify-between items-center">
                <span className="font-bold text-orange-900">
                  应补 / (退) 税额:
                </span>
                <span className="font-bold text-lg md:text-xl text-orange-600 break-all pl-2">
                  ¥ {formatNum(result.finalTaxDue)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 6. 申报指引 */}
        <section className="mb-8 page-break-inside-avoid">
          <div className="flex items-center mb-3 border-l-4 border-orange-600 pl-3">
            <h3 className="text-sm md:text-md font-bold text-gray-900 uppercase tracking-wider">
              6. 申报指引 (Filing Guide)
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 print:grid-cols-3 gap-4 text-xs md:text-sm">
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center text-blue-700 font-bold mb-1">
                <BookOpen className="w-4 h-4 mr-2" /> 申报时间
              </div>
              <p className="text-gray-600">
                居民个人综合所得年度汇算：次年 3 月 1 日 – 6 月 30 日。
              </p>
              {!isResident && (
                <p className="text-[11px] text-gray-500 mt-1">
                  如您当年为非居民但存在“由境外单位负担但在中国境内实际履职”的工资薪金，仍需结合实际判断是否由扣缴义务人或本人申报。
                </p>
              )}
            </div>
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center text-blue-700 font-bold mb-1">
                <FileText className="w-4 h-4 mr-2" /> 申报渠道
              </div>
              <p className="text-gray-600">
                推荐通过“个人所得税”APP 进行年度汇算，综合所得与境外分类所得可在同一账号下统一申报。
              </p>
              <p className="text-[11px] text-gray-500 mt-1">
                如涉及大额境外资本利得或复杂股权激励安排，建议在申报前与主管税务机关预沟通或委托专业机构代办。
              </p>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center text-blue-700 font-bold mb-1">
                <Briefcase className="w-4 h-4 mr-2" /> 核心支持材料
              </div>
              <p className="text-gray-600">
                境外完税证明、银行对账单、股权/房产交易合同、出入境记录、境外雇佣合同、股权激励计划文件等。
              </p>
              <p className="text-[11px] text-gray-500 mt-1">
                以上材料建议按国家/收入类型归档留存至少 10
                年，以备税务机关后续查询或 CRS 数据比对。
              </p>
            </div>
          </div>
        </section>

        {/* 7. 风险提示及筹划建议 */}
        <section className="mb-8 page-break-inside-avoid">
          <div className="flex items-center mb-3 border-l-4 border-orange-600 pl-3">
            <h3 className="text-sm md:text-md font-bold text-gray-900 uppercase tracking-wider">
              7. 风险提示及筹划建议 (Risk &amp; Planning)
            </h3>
          </div>
          <ul className="space-y-2 text-xs md:text-sm">
            <li className="flex items-start">
              <AlertTriangle className="w-4 h-4 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-gray-700">
                <strong>反避税与受控外国公司 (CFC)：</strong>
                如您持有低税负地区的离岸控股公司并长期不分配利润（或通过被动投资获得大量股息、利息），中国税务机关可能依据
                <b>受控外国公司规则</b>对未分配利润进行穿透征税。建议梳理离岸公司实际功能、人员与风险承担情况，评估是否具备实质经营。
              </div>
            </li>
            <li className="flex items-start">
              <AlertTriangle className="w-4 h-4 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-gray-700">
                <strong>双重居民及协定适用风险：</strong>
                您存在多重居民身份/境外永久居留安排，如不主动规划，可能导致
                <b>双重纳税</b>或协定待遇无法充分享受。建议在重大资产处置前，提前一年以上规划居住天数与家庭利益中心，并视情况申请
                <b>税收居民证明 / 协定判定</b>。
              </div>
            </li>
            {foreignAccounts.length > 0 && (
              <li className="flex items-start">
                <AlertTriangle className="w-4 h-4 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-gray-700">
                  <strong>CRS 信息比对与申报一致性：</strong>
                  您已申报的境外金融账户及保单未来将持续产生 CRS
                  自动信息交换。若账户上实际产生的利息、股息、资本利得未在中国申报，可能在税务机关进行
                  <b>CRS 数据比对</b>
                  时形成异常记录，建议确保申报口径与银行 CRS
                  报送口径一致。
                </div>
              </li>
            )}
            <li className="flex items-start">
              <Info className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-gray-700">
                <strong>滞纳金及信用风险：</strong>
                对于需补税但未按期办理年度汇算的情况，税务机关有权按日加收
                <b>万分之五</b>的滞纳金，并记录在个人纳税信用档案中，可能影响未来大额交易、融资以及出入境审查。
              </div>
            </li>
            {data.userComments && (
              <li className="flex items-start">
                <Info className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-gray-700">
                  <strong>客户特别关注事项：</strong>
                  <span className="ml-1">{data.userComments}</span>
                  <div className="text-[11px] text-gray-500 mt-1">
                    上述为您在访谈/录入中重点提出的关注点，建议在后续线下沟通中进一步细化执行路径与时间表。
                  </div>
                </div>
              </li>
            )}
          </ul>
        </section>

        {/* 8. 附录 */}
        <section className="page-break-inside-avoid">
          <div className="flex items-center mb-3 border-l-4 border-orange-600 pl-3">
            <h3 className="text-sm md:text-md font-bold text-gray-900 uppercase tracking-wider">
              8. 附录 (Appendix)
            </h3>
          </div>

          {/* 建议留存附件清单 */}
          <div className="bg-gray-50 border border-gray-200 rounded p-4 text-xs text-gray-500 font-mono mb-3">
            <p className="font-bold mb-2">建议留存附件清单：</p>
            <ul className="list-decimal list-inside space-y-1">
              <li>2024 年度出入境记录明细 (Entry-Exit Record)</li>
              <li>境内外工资单及劳务合同 (Payslips &amp; Service Agreement)</li>
              <li>境外银行流水及 CRS 声明表 (Bank Statements &amp; CRS Forms)</li>
              <li>境外完税凭证及中文翻译件 (Tax Certificates)</li>
              <li>股权激励/信托/保单等法律文件 (Equity Plan / Trust Deed / Policy)</li>
            </ul>
          </div>

          {/* 小结说明 */}
          <div className="text-[10px] text-gray-500 leading-relaxed">
            本报告基于您在本工具中录入/上传的信息进行自动化测算与合规梳理，仅用于内部讨论与方案设计，不构成任何形式的正式纳税申报或法律意见。实际申报时，应以经您确认的完整数据、适用税收法规及税务机关最终口径为准。
          </div>
        </section>

        {/* 页脚 */}
        <div className="mt-12 pt-6 border-t border-gray-300 text-center">
          <p className="text-[10px] text-gray-400">
            © 2025 PwC AI Empowered Tax Solutions.
            <br className="md:hidden" /> All Rights Reserved. <br />
            Generated by AI for simulation purpose only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step3Report;
