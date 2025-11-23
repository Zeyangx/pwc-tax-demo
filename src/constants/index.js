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

export const DEMO_DATA_FULL = {
    name: "张伟 (Demo Case)",
    nationality: "CN",
    residencyDays: {
        2023: "210",
        2024: "195",
        2025: "180",
        2026: "365"
    },
    tieBreaker: {
        hasChinaHome: true,
        hasForeignHome: true,
        familyLocation: "CN",
        economicCenter: "Both"
    },
    foreignStatuses: [
        { id: 123456789, country: "US", type: "PR" },
        { id: 987654321, country: "SG", type: "PR" }
    ],
    salary: "2500000",
    labor: "300000",
    author: "50000",
    royalty: "200000",
    interest: "50000",
    dividend: "120000",
    propertyTransferIncome: "3000000",
    propertyTransferCost: "2000000",
    otherIncome: "0",
    taxPaid: "450000",
    taxPaidCountry: "JP",
    taxPaidYear: "2024",
    taxDeductible: true,
    crs_foreignBank: true,
    crs_insurance: true,
    crs_trust: true,
    crs_passiveNFE: true,
    crs_otherResidency: false,
    userComments: "客户持有美国绿卡，但在中国长期居住。境外资产主要通过开曼信托持有，包括美股和BVI壳公司。"
};

// --- 更新后的模拟录音：包含全方位信息，配合全局分析按钮 ---
export const MOCK_TRANSCRIPT = `
[会议录音转写 2025-03-15]
顾问：您好，为了建立档案，请先核对一下您的基本信息。
客户：你好，我是张伟（Zhang Wei）。
顾问：好的，张先生。为了做今年的个税汇算清缴，我们需要核对一下您2024年的具体情况。首先是居住时间？
客户：2024年我比较忙，虽然经常去日本和美国，但我查了出入境记录，在中国境内肯定待满了 210 天。
顾问：好的，那是税务居民了。收入方面，国内工资还是年薪 200 万人民币吗？
客户：对，国内工资没变，还是 200 万。不过今年还有一笔劳务费，大概 30 万。
顾问：境外部分呢？
客户：美股账户今年不错，分红大概折合人民币 12 万吧。另外，我在日本那套房子今年卖掉了，卖了 300 万人民币，当时买入成本大概是 200 万。
顾问：日本那边交税了吗？
客户：交了，日本税务局收了我大概 45 万人民币的税，税单我都有。
顾问：好的。最后确认一下海外架构，之前的家族信托和那个 BVI 公司还在运作吗？
客户：都在，信托是我做委托人，BVI公司是下面持股的，主要就是为了隔离资产。
`;

export const MOCK_BANK_OCR = `
[DBS Bank Statement - Dec 2024]
Account Name: Zhang San
Currency: USD
Transaction Summary:
- 2024-06-15: Dividend Credit +30,000.00 (AAPL Inc.)
- 2024-12-20: Dividend Credit +20,000.00 (MSFT Corp.)
Total Credits: 50,000.00
Note: Account hold by SPECTRA HOLDINGS (BVI) LTD.
`;

export const MOCK_TAX_OCR = `
[完税凭证 / Tax Payment Certificate]
纳税人: 张三 (Zhang San)
纳税年度: 2024
税种: 个人所得税 (境外/其他)
已缴纳金额: 15,000.00 USD
折合人民币: 108,000.00 CNY
凭证号: TX-2024-998877
`;