import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, Upload, FileText, Calculator, User, 
  Briefcase, Globe, AlertTriangle, CheckCircle, 
  ChevronRight, Printer, FileAudio,
  MessageSquare, Square, Settings, Lock,
  RefreshCw, Edit3, Save, Sparkles, Receipt, Plus, Trash, X,
  Home, Users, Anchor, Zap
} from 'lucide-react';

// --- Constants & Configuration ---
const THEME_COLOR = "#D93900"; 
const THEME_BG = "bg-[#D93900]";
const THEME_TEXT = "text-[#D93900]";
const THEME_BORDER = "border-[#D93900]";
const STORAGE_KEY = "pwc_tax_app_v1_5_data";

// --- Country List ---
const COMMON_COUNTRIES = [
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

const OTHER_COUNTRIES = [
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

// --- Mock Data for Demo ---
const DEMO_DATA_FULL = {
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
    otherIncome: "850000", // High foreign income
    taxPaid: "150000",
    crs_foreignBank: true,
    crs_insurance: true,
    crs_trust: true,
    crs_passiveNFE: true,
    crs_otherResidency: false,
    userComments: "客户持有美国绿卡，但在中国长期居住。境外资产主要通过开曼信托持有，包括美股和BVI壳公司。"
};

// --- Mock Data for AI Context ---
const MOCK_TRANSCRIPT = `
[会议录音转写 2024-03-15]
顾问：请问张先生您今年在中国境内大概住了多久？
客户：哎呀，今年主要是在两边跑，我看了一下护照，大概在中国待了 210 天左右吧。
顾问：好的，那您主要的收入来源是？
客户：主要还是上海这边的工资，年薪大概 120 万人民币。另外我在新加坡有个星展银行的账户，主要用来放美股投资，去年大概有 5 万美元的股息分红。
顾问：了解。除了账户，还有其他资产架构吗？
客户：嗯...为了孩子上学，我在两年前设立了一个家族信托 (Family Trust)，目前的受托人是我的律师。另外还有一个 BVI 公司，不过是个壳公司，主要用来持有房产。
`;

const MOCK_BANK_OCR = `
[DBS Bank Statement - Dec 2024]
Account Name: Zhang San
Currency: USD
Transaction Summary:
- 2024-06-15: Dividend Credit +30,000.00 (AAPL Inc.)
- 2024-12-20: Dividend Credit +20,000.00 (MSFT Corp.)
Total Credits: 50,000.00
Note: Account hold by SPECTRA HOLDINGS (BVI) LTD.
`;

const MOCK_TAX_OCR = `
[完税凭证 / Tax Payment Certificate]
纳税人: 张三 (Zhang San)
纳税年度: 2024
税种: 个人所得税 (境外/其他)
已缴纳金额: 15,000.00 USD
折合人民币: 108,000.00 CNY
凭证号: TX-2024-998877
`;

// --- Gemini API Helper ---
const callGeminiAPI = async (apiKey, prompt) => {
  if (!apiKey) throw new Error("API Key is missing");
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{
      parts: [{ text: prompt }]
    }]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || "Gemini API Error");
    }
    
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("No content returned from Gemini");

    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Call Failed:", error);
    throw error;
  }
};

// --- Components ---

const PwCLogo = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0ZM28.2843 14.1421L21.2132 21.2132L14.1421 28.2843L11.3137 25.4558L18.3848 18.3848L25.4558 11.3137L28.2843 14.1421ZM10 20C10 14.4772 14.4772 10 20 10C25.5228 10 30 14.4772 30 20C30 25.5228 25.5228 30 20 30C14.4772 30 10 25.5228 10 20ZM18.3848 11.3137L11.3137 18.3848L18.3848 25.4558L25.4558 18.3848L18.3848 11.3137Z" fill={THEME_COLOR}/>
    </svg>
);

// --- Helper Functions for Tax Calculation ---
const calculateIIT = (salary, labor, author, royalty, otherIncome, taxPaid = 0) => {
  const s = Number(salary) || 0;
  const l = Number(labor) || 0;
  const a = Number(author) || 0;
  const r = Number(royalty) || 0;
  const o = Number(otherIncome) || 0;
  const paid = Number(taxPaid) || 0;

  const laborTaxable = l * 0.8;
  const authorTaxable = a * 0.8 * 0.7; 
  const royaltyTaxable = r * 0.8;
  
  const totalComprehensiveIncome = s + laborTaxable + authorTaxable + royaltyTaxable;
  const standardDeduction = 60000; 
  const estimatedSpecialDeductions = 30000; 
  
  let taxableIncome = totalComprehensiveIncome - standardDeduction - estimatedSpecialDeductions;
  if (taxableIncome < 0) taxableIncome = 0;

  let taxAmount = 0;
  if (taxableIncome <= 36000) taxAmount = taxableIncome * 0.03;
  else if (taxableIncome <= 144000) taxAmount = taxableIncome * 0.10 - 2520;
  else if (taxableIncome <= 300000) taxAmount = taxableIncome * 0.20 - 16920;
  else if (taxableIncome <= 420000) taxAmount = taxableIncome * 0.25 - 31920;
  else if (taxableIncome <= 660000) taxAmount = taxableIncome * 0.30 - 52920;
  else if (taxableIncome <= 960000) taxAmount = taxableIncome * 0.35 - 85920;
  else taxAmount = taxableIncome * 0.45 - 181920;

  const equityTax = o * 0.20;
  const totalTaxLiability = taxAmount + equityTax;
  const finalTaxDue = Math.max(0, totalTaxLiability - paid);

  return {
    taxableIncome,
    comprehensiveTax: taxAmount,
    equityTax: equityTax,
    totalTaxLiability: totalTaxLiability,
    taxPaid: paid,
    finalTaxDue: finalTaxDue
  };
};

const SettingsModal = ({ isOpen, onClose, apiKey, setApiKey }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-lg p-6 w-96 shadow-xl animate-fade-in">
        <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
            <Settings className="mr-2 w-5 h-5 text-gray-600"/> 设置 AI 引擎
        </h3>
        <p className="text-sm text-gray-600 mb-4">
            请输入您的 <b>Google Gemini API Key</b> 以启用实时 AI 分析。
            <br/>
            <span className="text-xs text-gray-400">(留空则使用系统内置的模拟演示模式)</span>
        </p>
        <input 
            type="password" 
            className="w-full p-3 border border-gray-300 rounded mb-4 focus:border-orange-500 outline-none text-sm"
            placeholder="在此粘贴 API Key (sk-...)"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
        />
        <div className="flex justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded text-sm">关闭</button>
            <button onClick={onClose} className={`px-4 py-2 ${THEME_BG} text-white rounded hover:opacity-90 text-sm font-medium`}>保存配置</button>
        </div>
      </div>
    </div>
  );
};

const DataReviewModal = ({ isOpen, onClose, aiData, onConfirm }) => {
    const [editedData, setEditedData] = useState(aiData);
    useEffect(() => { setEditedData(aiData); }, [aiData]);

    if (!isOpen || !aiData || !editedData) return null;

    const handleChange = (key, val) => {
        setEditedData(prev => ({...prev, [key]: val}));
    };

    const fieldLabels = {
        daysInChina: "境内居住天数 (2024)",
        salary: "工资薪金 (RMB)",
        otherIncome: "境外所得 (RMB)",
        taxPaid: "已缴纳税额 (RMB)",
        crs_trust: "海外信托架构",
        crs_passiveNFE: "消极非金融机构 (BVI)",
        crs_foreignBank: "境外金融账户"
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[90]">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-orange-50">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 flex items-center">
                            <Sparkles className="mr-2 w-5 h-5 text-orange-600"/> Gemini AI 提取结果确认
                        </h3>
                        <p className="text-xs text-gray-500">AI 已从原始数据中提取以下关键信息，请人工复核：</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>
                
                <div className="p-6 grid grid-cols-1 gap-4">
                    {Object.keys(editedData).map(key => {
                        if (!fieldLabels[key]) return null;
                        const isBool = typeof editedData[key] === 'boolean';
                        return (
                            <div key={key} className="flex items-center justify-between border-b border-gray-100 pb-3">
                                <div className="w-1/3">
                                    <span className="text-sm font-medium text-gray-700">{fieldLabels[key]}</span>
                                    <div className="text-xs text-gray-400 mt-1">原始提取: {String(aiData[key])}</div>
                                </div>
                                <div className="w-2/3 pl-4">
                                    {isBool ? (
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="checkbox" 
                                                checked={editedData[key]} 
                                                onChange={(e) => handleChange(key, e.target.checked)}
                                                className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                                            />
                                            <span className="text-sm text-gray-600">{editedData[key] ? "检测到风险 / 存在" : "无"}</span>
                                        </div>
                                    ) : (
                                        <input 
                                            type="text" 
                                            value={editedData[key]} 
                                            onChange={(e) => handleChange(key, e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded focus:border-orange-500 outline-none text-sm font-mono"
                                        />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="p-5 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded">
                        放弃
                    </button>
                    <button 
                        onClick={() => onConfirm(editedData)} 
                        className={`px-6 py-2 ${THEME_BG} text-white text-sm font-bold rounded shadow hover:opacity-90 flex items-center`}
                    >
                        <CheckCircle size={16} className="mr-2"/> 确认并填入表格
                    </button>
                </div>
            </div>
        </div>
    );
};

const Navigation = ({ activeStep, setStep, openSettings, fillDemo }) => (
  <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <PwCLogo />
        <div className="flex flex-col">
            <span className="font-bold text-xl text-gray-800 tracking-tight border-l pl-4 border-gray-300 leading-none">
                AI Empowered CRS & IIT Workflow
            </span>
            <span className="text-[10px] text-green-600 font-medium border-l pl-4 mt-1 flex items-center gap-1">
                <Lock size={10} /> Secure Workflow V1.4
            </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center space-x-1">
            {['数据采集', '智能分析', '生成报告'].map((step, idx) => (
            <button
                key={step}
                onClick={() => setStep(idx)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeStep === idx 
                    ? `${THEME_BG} text-white shadow-md` 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
            >
                {idx + 1}. {step}
            </button>
            ))}
        </div>
        {/* Demo Button */}
        <button 
            onClick={fillDemo}
            className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-full text-xs font-bold flex items-center transition-colors border border-blue-200"
            title="一键填入演示数据"
        >
            <Zap size={14} className="mr-1"/> Demo
        </button>
        <button 
            onClick={openSettings}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            title="设置"
        >
            <Settings size={20}/>
        </button>
      </div>
    </div>
  </div>
);

const Step1DataCollection = ({ data, updateData, onNext, apiKey }) => {
  const [recording, setRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reviewData, setReviewData] = useState(null);
  const [reviewOpen, setReviewOpen] = useState(false);

  const simulateTranscription = () => {
    setRecording(false);
    setTranscription("");
    let i = 0;
    const interval = setInterval(() => {
      setTranscription(MOCK_TRANSCRIPT.slice(0, i));
      i++;
      if (i > MOCK_TRANSCRIPT.length) clearInterval(interval);
    }, 10);
  };

  // AI PROMPTS
  const PROMPT_TRANSCRIPT = `
    You are a tax assistant. Extract data from the following transcript into JSON format.
    Fields required: 
    - daysInChina (number)
    - salary (number, convert "120万" to 1200000)
    - otherIncome (number, convert foreign currency to approx RMB, e.g. 1 USD = 7.2 RMB)
    - crs_trust (boolean)
    - crs_passiveNFE (boolean)
    - crs_foreignBank (boolean)
    
    Transcript:
    ${transcription || MOCK_TRANSCRIPT}
  `;

  const PROMPT_DOC_BANK = `
    You are a tax assistant. Extract data from the following Bank Statement OCR text into JSON format.
    Fields required:
    - otherIncome (sum of all credits, converted to approx RMB if in USD. 1 USD = 7.2 RMB)
    - crs_passiveNFE (boolean, set true if company is BVI/Cayman or similar)
    - crs_foreignBank (boolean, true if DBS/Citi/HSBC etc)
    
    OCR Text:
    ${MOCK_BANK_OCR}
  `;

  const PROMPT_DOC_TAX = `
    You are a tax assistant. Extract data from the following Tax Certificate OCR text into JSON format.
    Fields required:
    - taxPaid (number, converted to RMB. 1 USD = 7.2 RMB)
    
    OCR Text:
    ${MOCK_TAX_OCR}
  `;

  const handleAnalyze = async (sourceType) => {
    setIsAnalyzing(true);
    let result = null;

    try {
        if (apiKey) {
            // Real Call
            let prompt = PROMPT_TRANSCRIPT;
            if (sourceType === 'doc_bank') prompt = PROMPT_DOC_BANK;
            if (sourceType === 'doc_tax') prompt = PROMPT_DOC_TAX;
            
            result = await callGeminiAPI(apiKey, prompt);
        } else {
            // Mock Fallback
            await new Promise(r => setTimeout(r, 1500)); // Fake delay
            if (sourceType === 'transcript') {
                result = {
                    daysInChina: 210,
                    salary: 1200000,
                    otherIncome: 360000, 
                    crs_trust: true,
                    crs_passiveNFE: true,
                    crs_foreignBank: true
                };
            } else if (sourceType === 'doc_bank') {
                result = {
                    otherIncome: 360000, 
                    crs_passiveNFE: true,
                    crs_foreignBank: true
                };
            } else if (sourceType === 'doc_tax') {
                result = {
                    taxPaid: 108000
                };
            }
        }
        // Map simple 'daysInChina' to 2024 for backward compatibility in AI flow
        if (result.daysInChina) {
            updateData('residencyDays', { ...data.residencyDays, 2024: result.daysInChina });
            delete result.daysInChina; // handled manually
        }
        setReviewData(result);
        setReviewOpen(true);
    } catch (e) {
        alert("AI Analysis Failed: " + e.message);
    } finally {
        setIsAnalyzing(false);
    }
  };

  const handleMerge = (mergedData) => {
      Object.keys(mergedData).forEach(key => {
          updateData(key, mergedData[key]);
      });
      setReviewOpen(false);
  };

  // Handlers for new complex fields
  const addForeignStatus = () => {
      const newStatus = { id: Date.now(), country: "US", type: "PR" };
      updateData('foreignStatuses', [...data.foreignStatuses, newStatus]);
  };

  const removeForeignStatus = (id) => {
      updateData('foreignStatuses', data.foreignStatuses.filter(s => s.id !== id));
  };

  const updateForeignStatus = (id, field, value) => {
      updateData('foreignStatuses', data.foreignStatuses.map(s => 
          s.id === id ? { ...s, [field]: value } : s
      ));
  };

  const updateResidencyYear = (year, value) => {
      // Validation
      if (value > 366) return; // Basic prevention, UI will show error if manually typed
      updateData('residencyDays', { ...data.residencyDays, [year]: value });
  };

  // Handlers for Tie-Breaker
  const updateTieBreaker = (field, value) => {
      updateData('tieBreaker', { ...data.tieBreaker, [field]: value });
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 animate-fade-in">
      <DataReviewModal 
        isOpen={reviewOpen}
        onClose={() => setReviewOpen(false)}
        aiData={reviewData}
        onConfirm={handleMerge}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Audio & Files */}
        <div className="lg:col-span-1 space-y-6">
          {/* Recording Module */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-between">
              <div className="flex items-center"><Mic className={`w-5 h-5 mr-2 ${THEME_TEXT}`} /> 智能会议录入</div>
              {apiKey && <span className="text-[10px] px-2 py-1 bg-green-100 text-green-700 rounded-full flex items-center"><Sparkles size={10} className="mr-1"/>Gemini AI Ready</span>}
            </h3>
            
            <div className="flex gap-2 mb-4">
                <button 
                    onClick={() => setRecording(!recording)}
                    className={`flex-1 py-2 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${recording ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
                >
                    {recording ? <><Square className="w-4 h-4 mr-2 animate-pulse"/> 停止录音</> : <><Mic className="w-4 h-4 mr-2"/> 开始录音</>}
                </button>
                {recording && (
                    <button onClick={simulateTranscription} className="px-3 py-2 bg-orange-50 text-orange-600 rounded-lg text-xs hover:bg-orange-100">
                        模拟生成
                    </button>
                )}
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 min-h-[120px] max-h-[200px] overflow-y-auto mb-4">
                {transcription ? (
                    <p className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed">{transcription}</p>
                ) : (
                    <p className="text-xs text-gray-400 text-center mt-8">等待录音或上传音频文件...</p>
                )}
            </div>

            <button 
                onClick={() => handleAnalyze('transcript')}
                disabled={!transcription || isAnalyzing}
                className={`w-full py-2 rounded-lg text-sm font-bold text-white flex items-center justify-center transition-all ${!transcription ? 'bg-gray-300 cursor-not-allowed' : `${THEME_BG} hover:opacity-90 shadow-md`}`}
            >
                {isAnalyzing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin"/> : <Sparkles className="w-4 h-4 mr-2"/>}
                {isAnalyzing ? "Gemini 正在分析..." : "AI 提取关键信息"}
            </button>
          </div>

          {/* File Module */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FileText className={`w-5 h-5 mr-2 ${THEME_TEXT}`} /> 凭证智能识别
            </h3>
             <div className="space-y-3">
                <div 
                    onClick={() => handleAnalyze('doc_bank')}
                    className="group flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-orange-50 border border-transparent hover:border-orange-200 transition-all"
                >
                    <div className="bg-green-100 p-2 rounded text-green-600 mr-3"><FileText size={18}/></div>
                    <div className="flex-1">
                        <div className="text-sm font-medium group-hover:text-orange-700">银行流水 (Bank Statement)</div>
                        <div className="text-xs text-gray-400 group-hover:text-orange-400">上传银行流水以识别纳税义务</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-orange-400"/>
                </div>

                <div 
                    onClick={() => handleAnalyze('doc_tax')}
                    className="group flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-orange-50 border border-transparent hover:border-orange-200 transition-all"
                >
                    <div className="bg-blue-100 p-2 rounded text-blue-600 mr-3"><Receipt size={18}/></div>
                    <div className="flex-1">
                        <div className="text-sm font-medium group-hover:text-orange-700">完税凭证 (Tax Certificate)</div>
                        <div className="text-xs text-gray-400 group-hover:text-orange-400">上传凭证以抵扣应纳税款</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-orange-400"/>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Form Data */}
        <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">个人信息与财务概况</h2>
          
          {/* Section 1: Basic Info */}
          <div className="mb-8">
            <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center ${THEME_TEXT}`}>
              <User className="w-4 h-4 mr-2" /> 1. 身份与居住 (Residency)
            </h4>
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">客户姓名</label>
                    <input 
                    type="text" 
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="例如：张三"
                    value={data.name}
                    onChange={(e) => updateData('name', e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">国籍/地区</label>
                    <select 
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 outline-none"
                        value={data.nationality}
                        onChange={(e) => updateData('nationality', e.target.value)}
                    >
                        <optgroup label="常见国家/地区">
                            {COMMON_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                        </optgroup>
                        <optgroup label="其他">
                            {OTHER_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                        </optgroup>
                    </select>
                </div>
              </div>

              {/* Residency Days - Multi Year */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-3">中国境内居住天数 (追踪与预测)</label>
                  <div className="grid grid-cols-4 gap-4">
                      {[2023, 2024, 2025, 2026].map(year => {
                          const val = data.residencyDays[year] || "";
                          const isError = val > 366;
                          return (
                            <div key={year}>
                                <div className="text-xs text-gray-500 mb-1 text-center">{year}年 {year === 2026 && "(预计)"}</div>
                                <input 
                                    type="number" 
                                    className={`w-full p-2 border rounded text-center outline-none ${isError ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-300 focus:border-orange-500'}`}
                                    placeholder="0"
                                    value={val}
                                    onChange={(e) => updateResidencyYear(year, e.target.value)}
                                />
                                {isError && <div className="text-[10px] text-red-500 text-center mt-1">不能超过366天</div>}
                            </div>
                          )
                      })}
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-center">AI提示：连续数年超过183天将构成一般税务居民</p>
              </div>

              {/* Tie-Breaker Questionnaire (New Feature) */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                <div className="flex items-center mb-3 text-blue-800">
                    <Anchor className="w-4 h-4 mr-2"/>
                    <span className="text-sm font-bold">税收居民身份判定辅助 (Tie-Breaker Rules)</span>
                </div>
                <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center border-b border-blue-100 pb-2">
                        <span className="text-gray-700 flex items-center"><Home className="w-3 h-3 mr-2 text-blue-400"/>在中国是否有永久性住所？(含长租)</span>
                        <div className="flex gap-3">
                            <label className="flex items-center cursor-pointer"><input type="radio" checked={data.tieBreaker.hasChinaHome === true} onChange={()=>updateTieBreaker('hasChinaHome', true)} className="mr-1"/> 是</label>
                            <label className="flex items-center cursor-pointer"><input type="radio" checked={data.tieBreaker.hasChinaHome === false} onChange={()=>updateTieBreaker('hasChinaHome', false)} className="mr-1"/> 否</label>
                        </div>
                    </div>
                    <div className="flex justify-between items-center border-b border-blue-100 pb-2">
                        <span className="text-gray-700 flex items-center"><Globe className="w-3 h-3 mr-2 text-blue-400"/>在境外是否有永久性住所？</span>
                        <div className="flex gap-3">
                            <label className="flex items-center cursor-pointer"><input type="radio" checked={data.tieBreaker.hasForeignHome === true} onChange={()=>updateTieBreaker('hasForeignHome', true)} className="mr-1"/> 是</label>
                            <label className="flex items-center cursor-pointer"><input type="radio" checked={data.tieBreaker.hasForeignHome === false} onChange={()=>updateTieBreaker('hasForeignHome', false)} className="mr-1"/> 否</label>
                        </div>
                    </div>
                    <div className="flex justify-between items-center border-b border-blue-100 pb-2">
                        <span className="text-gray-700 flex items-center"><Users className="w-3 h-3 mr-2 text-blue-400"/>重要利益中心 (配偶/子女/工作) 主要在？</span>
                        <select className="p-1 border rounded text-sm bg-white" value={data.tieBreaker.familyLocation} onChange={(e)=>updateTieBreaker('familyLocation', e.target.value)}>
                            <option value="">请选择...</option>
                            <option value="CN">中国境内 (China)</option>
                            <option value="Overseas">境外 (Overseas)</option>
                            <option value="Both">两者皆有</option>
                        </select>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-700 flex items-center"><Briefcase className="w-3 h-3 mr-2 text-blue-400"/>主要经济利益 (资产/经营) 所在地？</span>
                        <select className="p-1 border rounded text-sm bg-white" value={data.tieBreaker.economicCenter} onChange={(e)=>updateTieBreaker('economicCenter', e.target.value)}>
                            <option value="">请选择...</option>
                            <option value="CN">中国境内 (China)</option>
                            <option value="Overseas">境外 (Overseas)</option>
                            <option value="Both">两者皆有</option>
                        </select>
                    </div>
                </div>
            </div>

              {/* Foreign Status - Dynamic List */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium text-gray-700">境外身份 (Foreign Status)</label>
                    <button onClick={addForeignStatus} className="text-xs flex items-center text-orange-600 hover:text-orange-700 font-medium">
                        <Plus size={14} className="mr-1"/> 添加身份
                    </button>
                  </div>
                  
                  {data.foreignStatuses.length === 0 && (
                      <div className="text-xs text-gray-400 text-center py-2 italic">暂无申报的境外永久居留权或国籍</div>
                  )}

                  <div className="space-y-2">
                      {data.foreignStatuses.map((status, index) => (
                          <div key={status.id} className="flex items-center gap-2">
                              <select 
                                className="flex-1 p-2 border border-gray-300 rounded text-sm outline-none"
                                value={status.country}
                                onChange={(e) => updateForeignStatus(status.id, 'country', e.target.value)}
                              >
                                  {COMMON_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                                  {OTHER_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                              </select>
                              <select 
                                className="w-1/3 p-2 border border-gray-300 rounded text-sm outline-none"
                                value={status.type}
                                onChange={(e) => updateForeignStatus(status.id, 'type', e.target.value)}
                              >
                                  <option value="PR">绿卡/永久居留</option>
                                  <option value="Passport">护照/国籍</option>
                              </select>
                              <button 
                                onClick={() => removeForeignStatus(status.id)}
                                className="p-2 text-gray-400 hover:text-red-500"
                              >
                                  <Trash size={16} />
                              </button>
                          </div>
                      ))}
                  </div>
              </div>
            </div>
          </div>

          {/* Section 2: Income */}
          <div className="mb-8">
            <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center ${THEME_TEXT}`}>
              <Briefcase className="w-4 h-4 mr-2" /> 2. 年度收入数据 (RMB)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">工资薪金 (年)</label>
                <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-400">¥</span>
                    <input 
                    type="number" 
                    className="w-full pl-8 p-2 border border-gray-300 rounded outline-none"
                    placeholder="0"
                    value={data.salary}
                    onChange={(e) => updateData('salary', e.target.value)}
                    />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">劳务报酬</label>
                <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-400">¥</span>
                    <input 
                    type="number" 
                    className="w-full pl-8 p-2 border border-gray-300 rounded outline-none"
                    placeholder="0"
                    value={data.labor}
                    onChange={(e) => updateData('labor', e.target.value)}
                    />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">稿酬/特许权使用费</label>
                <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-400">¥</span>
                    <input 
                    type="number" 
                    className="w-full pl-8 p-2 border border-gray-300 rounded outline-none"
                    placeholder="0"
                    value={data.royalty}
                    onChange={(e) => updateData('royalty', e.target.value)}
                    />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">境外股息/红利/房租</label>
                <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-400">¥</span>
                    <input 
                    type="number" 
                    className="w-full pl-8 p-2 border border-gray-300 rounded outline-none"
                    placeholder="0"
                    value={data.otherIncome}
                    onChange={(e) => updateData('otherIncome', e.target.value)}
                    />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">已缴纳税额 (含境外)</label>
                <div className="relative">
                    <span className="absolute left-3 top-2 text-green-600">- ¥</span>
                    <input 
                    type="number" 
                    className="w-full pl-10 p-2 border border-green-300 rounded outline-none bg-green-50"
                    placeholder="0"
                    value={data.taxPaid}
                    onChange={(e) => updateData('taxPaid', e.target.value)}
                    />
                </div>
                <p className="text-xs text-gray-400 mt-1">可用于抵扣应纳税额</p>
              </div>
            </div>
          </div>

          {/* Section 3: CRS Risk Detail */}
          <div className="mb-8">
             <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center ${THEME_TEXT}`}>
              <Globe className="w-4 h-4 mr-2" /> 3. 全球资产与 CRS 深度扫描
            </h4>
            <div className="bg-orange-50 p-4 rounded border border-orange-100 text-sm text-gray-600 mb-4">
                请勾选您在<b>中国境外</b>（含港澳台）持有的资产或架构类型，AI 将据此分析交换风险：
            </div>
            <div className="space-y-3">
                <label className="flex items-start p-3 bg-white border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                    <input 
                        type="checkbox" 
                        className="mt-1 w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                        checked={data.crs_foreignBank}
                        onChange={(e) => updateData('crs_foreignBank', e.target.checked)}
                    />
                    <span className="ml-3 text-sm text-gray-700">
                        <b>境外金融账户</b> (存款、证券托管账户、理财产品等)
                    </span>
                </label>
                <label className="flex items-start p-3 bg-white border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                    <input 
                        type="checkbox" 
                        className="mt-1 w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                        checked={data.crs_insurance}
                        onChange={(e) => updateData('crs_insurance', e.target.checked)}
                    />
                    <span className="ml-3 text-sm text-gray-700">
                        <b>具有现金价值的保险/年金合同</b> (大额保单、储蓄型保险)
                    </span>
                </label>
                <label className="flex items-start p-3 bg-white border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                    <input 
                        type="checkbox" 
                        className="mt-1 w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                        checked={data.crs_trust}
                        onChange={(e) => updateData('crs_trust', e.target.checked)}
                    />
                    <span className="ml-3 text-sm text-gray-700">
                        <b>海外信托架构</b> (作为委托人、受益人、保护人或受托人)
                    </span>
                </label>
                <label className="flex items-start p-3 bg-white border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                    <input 
                        type="checkbox" 
                        className="mt-1 w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                        checked={data.crs_passiveNFE}
                        onChange={(e) => updateData('crs_passiveNFE', e.target.checked)}
                    />
                    <span className="ml-3 text-sm text-gray-700">
                        <b>消极非金融机构 (Passive NFE)</b> (如BVI/Cayman壳公司，主要收入为投资所得)
                    </span>
                </label>
                <label className="flex items-start p-3 bg-white border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                    <input 
                        type="checkbox" 
                        className="mt-1 w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                        checked={data.crs_otherResidency}
                        onChange={(e) => updateData('crs_otherResidency', e.target.checked)}
                    />
                    <span className="ml-3 text-sm text-gray-700">
                        <b>双重税务居民身份</b> (声明拥有其他国家/地区的税务居民身份)
                    </span>
                </label>
            </div>
          </div>

          {/* Section 4: User Remarks */}
          <div className="mb-8">
            <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center ${THEME_TEXT}`}>
              <MessageSquare className="w-4 h-4 mr-2" /> 4. 备注与自我评估
            </h4>
            <div className="relative">
                <textarea 
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm text-gray-700 min-h-[100px]"
                    placeholder="请在此处补充您的个人情况说明，或对上述数据的自我判断。例如：'我的境外收入已在当地纳税'，或'BVI公司仅用于持有房产，无金融资产'..."
                    value={data.userComments}
                    onChange={(e) => updateData('userComments', e.target.value)}
                ></textarea>
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                    客户自述
                </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
                onClick={onNext}
                className={`flex items-center px-6 py-3 ${THEME_BG} text-white font-bold rounded-lg shadow hover:opacity-90 transition-transform transform hover:scale-105`}
            >
                开始全景分析 <ChevronRight className="ml-2 w-5 h-5"/>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

const Step2Analysis = ({ data, onNext }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("正在初始化AI引擎...");

  useEffect(() => {
    const stages = [
      { pct: 10, msg: "正在连接税务法规数据库 (2024版)..." },
      { pct: 30, msg: "分析居民纳税身份 (基于183天规则)..." },
      { pct: 50, msg: "计算综合所得与适用税率..." },
      { pct: 70, msg: "穿透识别 CRS 架构 (信托/壳公司)..." },
      { pct: 85, msg: "整合用户自述与合规建议..." },
      { pct: 100, msg: "分析完成" }
    ];

    let currentStage = 0;
    const interval = setInterval(() => {
      if (currentStage >= stages.length) {
        clearInterval(interval);
        setTimeout(onNext, 800); 
        return;
      }
      setProgress(stages[currentStage].pct);
      setStatus(stages[currentStage].msg);
      currentStage++;
    }, 800);

    return () => clearInterval(interval);
  }, [onNext]);

  return (
    <div className="max-w-2xl mx-auto pt-20 text-center px-4">
      <div className="mb-8 relative inline-block">
         <div className={`w-24 h-24 border-4 ${THEME_BORDER} border-t-transparent rounded-full animate-spin mx-auto`}></div>
         <div className="absolute inset-0 flex items-center justify-center">
            <Calculator className={`w-8 h-8 ${THEME_TEXT}`} />
         </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">AI 正在全景分析您的税务状况</h2>
      <p className="text-gray-500 mb-8 h-6">{status}</p>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 overflow-hidden">
        <div 
            className={`h-2.5 rounded-full ${THEME_BG} transition-all duration-500 ease-out`} 
            style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-12 text-left">
        {[
            { title: "居民身份", icon: User },
            { title: "税款测算", icon: Calculator },
            { title: "CRS扫描", icon: Globe },
        ].map((item, i) => (
            <div key={i} className={`p-4 border rounded-lg flex items-center space-x-3 transition-opacity duration-500 ${progress > (i + 1) * 30 ? 'opacity-100 border-green-500 bg-green-50' : 'opacity-40 border-gray-200'}`}>
                {progress > (i + 1) * 30 ? <CheckCircle className="w-5 h-5 text-green-600" /> : <item.icon className="w-5 h-5 text-gray-400"/>}
                <span className="font-medium text-sm text-gray-700">{item.title}</span>
            </div>
        ))}
      </div>
    </div>
  );
};

const Step3Report = ({ data }) => {
  const reportRef = useRef();
  // Note: Using 2024 days for main calculation context
  const days2024 = Number(data.residencyDays[2024]) || 0;
  const taxResult = calculateIIT(data.salary, data.labor, data.author, data.royalty, data.otherIncome, data.taxPaid);
  const isResident = days2024 >= 183;
  const formatNum = (val) => (Number(val) || 0).toLocaleString();
  const hasCRSRisk = data.crs_foreignBank || data.crs_insurance || data.crs_trust || data.crs_passiveNFE;
  
  const handlePrint = () => {
    window.print();
  };

  const getCountryName = (code) => {
      const all = [...COMMON_COUNTRIES, ...OTHER_COUNTRIES];
      const found = all.find(c => c.code === code);
      return found ? found.name.split('(')[0].trim() : code;
  };

  // Tie-Breaker Logic for Report
  const tieBreakerAnalysis = () => {
      if (!isResident) return null; 
      // If resident, check for potential dual residency clues
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
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6 no-print">
        <h2 className="text-xl font-bold text-gray-800">分析报告预览</h2>
        <div className="flex gap-3">
            <button onClick={() => window.location.reload()} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">重置</button>
            <button onClick={handlePrint} className={`flex items-center px-4 py-2 ${THEME_BG} text-white rounded hover:opacity-90`}>
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

        {/* 1. Executive Summary */}
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
            
            {/* Foreign Statuses Table in Report */}
            {data.foreignStatuses.length > 0 && (
                <div className="mt-4">
                    <h5 className="text-sm font-bold text-gray-700 mb-2">申报的境外身份</h5>
                    <table className="w-full text-xs border border-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-2 border border-gray-200 text-left">国家/地区</th>
                                <th className="p-2 border border-gray-200 text-left">身份类型</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.foreignStatuses.map(s => (
                                <tr key={s.id}>
                                    <td className="p-2 border border-gray-200">{getCountryName(s.country)}</td>
                                    <td className="p-2 border border-gray-200">{s.type === 'PR' ? "绿卡/永久居留" : "护照/国籍"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>

        {/* 2. Residency Status */}
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
                    {isResident 
                        ? <span>判定为<strong>中国税收居民</strong>。需就全球所得（境内+境外）向中国税务机关申报纳税。</span>
                        : <span>判定为<strong>非居民个人</strong>。仅需就来源于中国境内的所得纳税。</span>
                    }
                </p>
            </div>
            {tieBreakerAnalysis()}
        </section>

        {/* 3. Tax Calculation */}
        <section className="mb-8">
            <h3 className="text-lg font-bold text-orange-700 mb-3 uppercase border-b border-gray-200 pb-1">3. 纳税义务分析 (Tax Analysis)</h3>
            <p className="text-xs text-gray-500 mb-2 italic">*以下测算基于标准扣除6万元及假设的专项附加扣除，仅供参考。</p>
            
            <table className="w-full text-sm border-collapse mb-4">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 border border-gray-300 text-left">所得项目</th>
                        <th className="p-2 border border-gray-300 text-right">收入金额 (RMB)</th>
                        <th className="p-2 border border-gray-300 text-right">预估税额 (RMB)</th>
                    </tr>
                </thead>
                <tbody className="font-serif">
                    <tr>
                        <td className="p-2 border border-gray-300">综合所得 (工资/劳务/稿酬等)</td>
                        <td className="p-2 border border-gray-300 text-right">{(Number(data.salary) + Number(data.labor) + Number(data.royalty) + Number(data.author)).toLocaleString()}</td>
                        <td className="p-2 border border-gray-300 text-right">{formatNum(taxResult.comprehensiveTax)}</td>
                    </tr>
                    <tr>
                        <td className="p-2 border border-gray-300">分类所得 (境外/股息/财产转让)</td>
                        <td className="p-2 border border-gray-300 text-right">{formatNum(data.otherIncome)}</td>
                        <td className="p-2 border border-gray-300 text-right">{formatNum(taxResult.equityTax)}</td>
                    </tr>
                    <tr className="bg-gray-50 font-bold text-gray-600">
                        <td className="p-2 border border-gray-300">应纳税额总计</td>
                        <td className="p-2 border border-gray-300 text-right">-</td>
                        <td className="p-2 border border-gray-300 text-right">{formatNum(taxResult.totalTaxLiability)}</td>
                    </tr>
                    <tr className="text-green-700">
                        <td className="p-2 border border-gray-300">减：已缴纳税额 (抵免)</td>
                        <td className="p-2 border border-gray-300 text-right">-</td>
                        <td className="p-2 border border-gray-300 text-right">- {formatNum(taxResult.taxPaid)}</td>
                    </tr>
                    <tr className="bg-orange-50 font-bold text-lg">
                        <td className="p-2 border border-gray-300 text-orange-800">最终应补/退税额</td>
                        <td className="p-2 border border-gray-300 text-right text-orange-800"></td>
                        <td className="p-2 border border-gray-300 text-right text-orange-800">
                            {formatNum(taxResult.finalTaxDue)}
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>

        {/* 4. CRS Risk */}
        <section className="mb-8">
            <h3 className="text-lg font-bold text-orange-700 mb-3 uppercase border-b border-gray-200 pb-1">4. CRS 风险评估 (CRS Assessment)</h3>
            {hasCRSRisk ? (
                <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                         <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                         <div>
                            <h5 className="font-bold text-gray-800">检视到需关注的跨境架构</h5>
                            <p className="font-serif text-sm text-gray-700 mt-1">基于您申报的信息，AI 识别出以下高风险领域：</p>
                         </div>
                    </div>
                    <ul className="list-disc list-inside text-sm font-serif text-gray-700 ml-10 space-y-2">
                        {data.crs_trust && (
                            <li>
                                <strong className="text-orange-800">海外信托：</strong> 信托的委托人、受益人及其他实际控制人信息极有可能被交换回国。需关注信托资产分配时的税务穿透问题。
                            </li>
                        )}
                        {data.crs_passiveNFE && (
                            <li>
                                <strong className="text-orange-800">消极非金融机构 (Passive NFE)：</strong> 您的离岸公司若主要收入为投资收益（如股息、利息），金融机构需穿透识别其实际控制人（您），并将账户信息报送给税务局。
                            </li>
                        )}
                        {data.crs_insurance && (
                            <li>
                                <strong className="text-orange-800">大额保单：</strong> 具有现金价值的保险合同属于CRS申报范围。
                            </li>
                        )}
                         {data.crs_foreignBank && (
                            <li>
                                <strong className="text-orange-800">境外金融账户：</strong> 账户余额及年度收入总额将被定期交换。
                            </li>
                        )}
                    </ul>
                    <p className="font-serif text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-200 mt-2">
                        <strong>合规建议：</strong> 建议尽快对境外资产的完税情况进行历史梳理，特别是2019年新个税法实施以来的境外所得申报。
                    </p>
                </div>
            ) : (
                <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                        <h5 className="font-bold text-gray-800">标准风险等级</h5>
                        <p className="font-serif text-sm text-gray-700 mt-1">
                            当前申报未显示持有高风险境外金融资产。系统未触发CRS特别预警。
                        </p>
                    </div>
                </div>
            )}
        </section>

        {/* 5. User Remarks */}
        <section className="mb-8">
             <h3 className="text-lg font-bold text-orange-700 mb-3 uppercase border-b border-gray-200 pb-1">5. 客户自述与备注 (User Remarks)</h3>
             <div className="bg-gray-50 p-4 rounded border-l-4 border-gray-400">
                <h6 className="text-xs font-bold text-gray-400 uppercase mb-2">客户留言 / Self-Assessment</h6>
                <p className="font-serif text-sm text-gray-800 whitespace-pre-wrap">
                    {data.userComments || "（客户未填写备注信息）"}
                </p>
             </div>
        </section>

        {/* 6. Guide */}
        <section>
            <h3 className="text-lg font-bold text-orange-700 mb-3 uppercase border-b border-gray-200 pb-1">6. 申报指引 (Filing Guide)</h3>
            <ul className="list-disc list-inside text-sm font-serif space-y-2 text-gray-800">
                <li><strong>年度汇算清缴时间：</strong> 次年3月1日至6月30日。</li>
                <li><strong>境外所得申报：</strong> 若有境外已纳税额，请准备好境外税款缴纳凭证（原件或公证件）以申请抵免。</li>
                <li><strong>个税APP操作：</strong> 建议优先使用“个人所得税”APP进行标准申报，复杂事项可委托专业机构。</li>
            </ul>
        </section>
        
        {/* Footer for Print */}
        <div className="mt-12 pt-4 border-t border-gray-300 text-center text-xs text-gray-400">
            <p>© 2025 AI Empowered Tax Solution. Confidential. Generated for Internal Review.</p>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [step, setStep] = useState(0);
  const [apiKey, setApiKey] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // State to hold all user data
  const [userData, setUserData] = useState({
    name: "",
    nationality: "CN",
    // Changed to object for multi-year tracking
    residencyDays: {
        2023: "",
        2024: "",
        2025: "",
        2026: ""
    },
    hasPermanentResidency: false, // Keep for legacy checks or simple logic if needed
    tieBreaker: {
        hasChinaHome: null,
        hasForeignHome: null,
        familyLocation: "",
        economicCenter: ""
    },
    // New complex structure for foreign status
    foreignStatuses: [], 
    salary: "",
    labor: "",
    author: "",
    royalty: "",
    otherIncome: "",
    taxPaid: "",
    // CRS Fields
    crs_foreignBank: false,
    crs_insurance: false,
    crs_trust: false,
    crs_passiveNFE: false,
    crs_otherResidency: false,
    // Comments
    userComments: ""
  });

  const updateData = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  // Demo Data Auto-Fill
  const fillDemoData = () => {
      setUserData({
        name: "张伟 (Demo Case)",
        nationality: "CN",
        residencyDays: {
            2023: "210",
            2024: "195",
            2025: "180",
            2026: "365"
        },
        hasPermanentResidency: true,
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
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .no-print {
            display: none !important;
          }
          #printable-area, #printable-area * {
            visibility: visible;
          }
          #printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      <SettingsModal 
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        apiKey={apiKey}
        setApiKey={setApiKey}
      />

      <Navigation 
        activeStep={step} 
        setStep={setStep} 
        openSettings={() => setSettingsOpen(true)} 
        fillDemo={fillDemoData} // Pass the demo function
      />
      
      <main>
        {step === 0 && (
          <Step1DataCollection 
            data={userData} 
            updateData={updateData} 
            onNext={() => setStep(1)} 
            apiKey={apiKey}
          />
        )}
        {step === 1 && (
            <Step2Analysis 
                data={userData}
                onNext={() => setStep(2)}
            />
        )}
        {step === 2 && (
          <div id="printable-area">
            <Step3Report data={userData} />
          </div>
        )}
      </main>
    </div>
  );
}