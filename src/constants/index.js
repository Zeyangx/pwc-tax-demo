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
    otherIncome: "850000",
    taxPaid: "150000",
    crs_foreignBank: true,
    crs_insurance: true,
    crs_trust: true,
    crs_passiveNFE: true,
    crs_otherResidency: false,
    userComments: "客户持有美国绿卡，但在中国长期居住。境外资产主要通过开曼信托持有，包括美股和BVI壳公司。"
};

export const MOCK_TRANSCRIPT = `
[会议录音转写 2024-03-15]
顾问：请问张先生您今年在中国境内大概住了多久？
客户：哎呀，今年主要是在两边跑，我看了一下护照，大概在中国待了 210 天左右吧。
顾问：好的，那您主要的收入来源是？
客户：主要还是上海这边的工资，年薪大概 120 万人民币。另外我在新加坡有个星展银行的账户，主要用来放美股投资，去年大概有 5 万美元的股息分红。
顾问：了解。除了账户，还有其他资产架构吗？
客户：嗯...为了孩子上学，我在两年前设立了一个家族信托 (Family Trust)，目前的受托人是我的律师。另外还有一个 BVI 公司，不过是个壳公司，主要用来持有房产。
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