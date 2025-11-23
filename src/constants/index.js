// src/constants/index.js

export const THEME_COLOR = "#D93900"; 
export const THEME_BG = "bg-[#D93900]";
export const THEME_TEXT = "text-[#D93900]";
export const THEME_BORDER = "border-[#D93900]";
export const STORAGE_KEY = "pwc_tax_app_v1_5_data";

export const COMMON_COUNTRIES = [
  { code: "CN", name: "中国大陆 (China Mainland)" },
  { code: "HK", name: "中国香港 (Hong Kong)" },
  { code: "MO", name: "中国澳门 (Macau)" },
  { code: "US", name: "美国 (USA)" },
  { code: "GB", name: "英国 (UK)" },
  { code: "CA", name: "加拿大 (Canada)" },
  { code: "AU", name: "澳大利亚 (Australia)" },
  { code: "SG", name: "新加坡 (Singapore)" },
  { code: "JP", name: "日本 (Japan)" },
  { code: "NZ", name: "新西兰 (New Zealand)" },
];

export const OTHER_COUNTRIES = [
  { code: "DE", name: "德国 (Germany)" },
  { code: "FR", name: "法国 (France)" },
  { code: "IT", name: "意大利 (Italy)" },
  { code: "CH", name: "瑞士 (Switzerland)" },
  { code: "AE", name: "阿联酋 (UAE)" },
  { code: "KY", name: "开曼群岛 (Cayman Islands)" },
  { code: "VG", name: "英属维尔京群岛 (BVI)" },
  { code: "KR", name: "韩国 (South Korea)" },
  { code: "MY", name: "马来西亚 (Malaysia)" },
  { code: "TH", name: "泰国 (Thailand)" },
];

// --- 升级版 Demo 数据：高净值、高风险、全要素 ---
export const DEMO_DATA_FULL = {
    name: "张伟 (HNWI Demo)",
    nationality: "CN",
    residencyDays: {
        2023: "190",
        2024: "210", // 超过183天，中国居民
        2025: "150",
        2026: "365"
    },
    tieBreaker: {
        hasChinaHome: true,
        hasForeignHome: true, // 风险：两边都有家
        familyLocation: "Overseas", // 风险：家人在国外
        economicCenter: "CN" // 钱在中国赚
    },
    foreignStatuses: [
        { id: 1, country: "US", type: "PR" }, // 持有美国绿卡
        { id: 2, country: "HK", type: "PR" }  // 香港永居
    ],
    
    // 收入结构 (RMB)
    salary: "3500000",        // 350万年薪
    labor: "800000",          // 80万劳务（讲课费）
    author: "0",
    royalty: "200000",        // 特许权
    interest: "150000",       // 海外存款利息
    dividend: "2800000",      // BVI公司分红 (高风险点)
    propertyTransferIncome: "8000000", // 卖了伦敦一套房
    propertyTransferCost: "5000000",   // 成本
    otherIncome: "0",
    
    // 纳税情况
    taxPaid: "1200000",       // 境外已交税 (不足以抵扣国内税率，需补税)
    taxPaidCountry: "UK",
    taxPaidYear: "2024",
    taxDeductible: true,

    // CRS 风险全开
    crs_foreignBank: true,    // 有瑞士银行账户
    crs_insurance: true,      // 香港大额保单
    crs_trust: true,          // 开曼家族信托
    crs_passiveNFE: true,     // BVI 壳公司
    crs_otherResidency: true, // 也是美国税务居民
    
    userComments: "本人持有美国绿卡，配偶及子女均在温哥华居住。境外资产主要通过设立在开曼的家族信托持有，信托底层控制一家BVI公司用于持有美股资产。2024年出售了位于伦敦的一处投资性房产。"
};

// --- 升级版录音剧本：对应上面的高风险数据 ---
export const MOCK_TRANSCRIPT = `
[会议录音转写 2024-03-15 - 高净值客户访谈]
顾问：张总，我们需要核实您2024年的全球资产和纳税情况，这对汇算清缴很重要。
客户：我是张伟。今年比较特殊，我查了记录，2024年我在中国住了210天，肯定是税务居民了。但我老婆孩子都在加拿大，我也拿了美国绿卡，这个身份会不会有冲突？
顾问：这个属于双重税务居民风险，我们后续分析。收入方面呢？
客户：国内工资还是350万。另外我经常去商学院讲课，劳务费大概80万。
顾问：境外资产变动大吗？
客户：比较大。我在伦敦那套房子卖了，卖了800万人民币，买入成本是500万。英国那边扣了税，但不多。
顾问：金融资产呢？
客户：你知道我有那个离岸架构的。我的BVI公司今年分红了，大概折合人民币280万。另外瑞士银行账户里有一些利息，大概15万吧。
顾问：好的。那个开曼信托还在存续期吗？
客户：对，信托还在，里面还有几张香港的大额保单。
顾问：明白了，这涉及到CFC反避税和CRS穿透，我们会详细评估。
`;

export const MOCK_BANK_OCR = `
[CITI BANK (UK) STATEMENT - DEC 2024]
Account Name: Zhang Wei
Currency: GBP / USD
Transaction Summary:
- 2024-06-15: DIVIDEND PAYOUT (SPECTRA BVI LTD) +USD 390,000.00
- 2024-09-20: PROPERTY SALE PROCEED (LONDON APT) +GBP 880,000.00
- 2024-12-31: INTEREST CREDIT +USD 21,000.00
`;

export const MOCK_TAX_OCR = `
[HMRC Tax Certificate 2024]
Taxpayer: Zhang Wei
Tax Year: 2024-2025
Nature: Capital Gains Tax (Property Disposal)
Tax Paid: GBP 130,000.00 (Approx CNY 1,200,000)
Status: PAID
`;