export const THEME_COLOR = "#D93900"; 
export const THEME_BG = "bg-[#D93900]";
export const THEME_TEXT = "text-[#D93900]";
export const THEME_BORDER = "border-[#D93900]";
export const STORAGE_KEY = "pwc_tax_app_v2_data";

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
];

export const OTHER_COUNTRIES = [
  { code: "DE", name: "德国 (Germany)" },
  { code: "FR", name: "法国 (France)" },
  { code: "KY", name: "开曼群岛 (Cayman Islands)" },
  { code: "VG", name: "英属维尔京群岛 (BVI)" },
];

export const ID_TYPES = [
    "中国居民身份证",
    "港澳居民来往内地通行证",
    "台湾居民来往大陆通行证",
    "外国护照",
    "外国人永久居留身份证"
];

export const FI_TYPES = [
    "商业银行 (Bank)",
    "证券公司/券商 (Brokerage)",
    "信托公司 (Trust Company)",
    "保险公司 (Insurance Company)",
    "投资基金 (Investment Fund)",
    "其他 (Other)"
];

// --- 完整的高风险 Demo 数据 ---
export const DEMO_DATA_FULL = {
    baseInfo: {
        name: "张伟",
        nationality: "CN",
        idType: "中国居民身份证",
        idNumber: "11010519800101XXXX",
        employer: "某跨国科技集团 (中国总部)",
        directorships: [{ id: 1, company: "Tech Global HK Ltd" }],
        shareholdings: [{ id: 1, company: "Spectra Holdings BVI", ratio: "100%" }]
    },
    taxResidency: {
        2022: { daysInChina: "365", over183Country: "CN", hasPermHome: "CN", ecoCenter: "CN", familyLoc: "CN" },
        2023: { daysInChina: "120", over183Country: "US", hasPermHome: "CN, US", ecoCenter: "CN", familyLoc: "US" },
        2024: { daysInChina: "210", over183Country: "CN", hasPermHome: "CN, US", ecoCenter: "Both", familyLoc: "Both" }
    },
    familyRelations: [{ id: 1, relation: "配偶", location: "US" }, { id: 2, relation: "子女", location: "US" }],
    hasHukou: true,
    foreignStatuses: [{ id: 1, country: "US", type: "Green Card" }],
    incomeDomestic: {
        salary: "3500000", labor: "200000", author: "0", royalty: "0", taxPaid: "980000"
    },
    incomeForeign: [
        {
            id: 1, country: "US", 
            salary: "0", labor: "50000", dividend: "120000", rental: "300000", taxPaid: "15000"
        },
        {
            id: 2, country: "GB",
            transfer: "8000000", taxPaid: "1200000"
        }
    ],
    foreignAccounts: [
        {
            id: 1, type: "商业银行 (Bank)", name: "DBS Singapore", accountNo: "SG-888-999",
            regIdInfo: "Passport", openDate: "2019-01",
            regInfo: { name: "Wei Zhang", taxCountry: "CN" },
            isPassiveNFE: false,
            balance: { 2022: "500000", 2023: "520000", 2024: "150000" }
        }
    ],
    crsScan: {
        cnResidentFlag: { checked: true, remark: "开户时使用中国护照登记" },
        largeInsurance: { checked: true, remark: "香港保诚，年缴5万美元" },
        trust: { checked: true, remark: "作为委托人设立开曼信托" },
        passiveNFE: { checked: true, remark: "BVI公司持有美股" },
        multiResidency: { checked: true, remark: "同时持有美国绿卡" },
        otherRisk: { checked: false, remark: "" }
    },
    userComments: "需重点关注美国绿卡身份与中国税务居民身份的冲突，以及BVI公司分红的税务合规性。"
};

// --- 必须要有这段长录音，转写功能才有内容显示 ---
export const MOCK_TRANSCRIPT = `
[会议录音转写 2024-03-15 - 高净值客户访谈]
顾问：张总，我们需要核实您2024年的全球资产和纳税情况，这对汇算清缴很重要。
客户：我是张伟。今年比较特殊，我查了记录，2024年我在中国住了210天，肯定是税务居民了。但我老婆孩子都在加拿大，我也拿了美国绿卡，这个身份会不会有冲突？
顾问：这个属于双重税务居民风险，我们后续分析。收入方面呢？
客户：国内工资还是350万。另外我经常去商学院讲课，劳务费大概80万。
顾问：境外资产变动大吗？
客户：比较大。我在伦敦那套房子卖了，卖了800万人民币，买入成本是500万。英国那边扣了税，但不多，大概120万人民币。
顾问：金融资产呢？
客户：你知道我有那个离岸架构的。我的BVI公司今年分红了，大概折合人民币280万。另外瑞士银行账户里有一些利息，大概15万吧。
顾问：好的。那个开曼信托还在存续期吗？
客户：对，信托还在，里面还有几张香港的大额保单，年缴大概5万美金。
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