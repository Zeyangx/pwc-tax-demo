import React, { useState } from 'react';
import { 
  Mic, FileText, Square, RefreshCw, Sparkles, Receipt, 
  ChevronRight, User, Anchor, Home, Globe, Users, Briefcase, Plus, Trash, MessageSquare 
} from 'lucide-react';

import { THEME_BG, THEME_TEXT, MOCK_TRANSCRIPT, MOCK_BANK_OCR, MOCK_TAX_OCR, COMMON_COUNTRIES, OTHER_COUNTRIES } from '../constants';
import { callGeminiAPI } from '../utils/geminiApi';
import DataReviewModal from '../components/common/DataReviewModal';

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
            let prompt = PROMPT_TRANSCRIPT;
            if (sourceType === 'doc_bank') prompt = PROMPT_DOC_BANK;
            if (sourceType === 'doc_tax') prompt = PROMPT_DOC_TAX;
            
            result = await callGeminiAPI(apiKey, prompt);
        } else {
            await new Promise(r => setTimeout(r, 1500)); 
            if (sourceType === 'transcript') {
                result = { daysInChina: 210, salary: 1200000, otherIncome: 360000, crs_trust: true, crs_passiveNFE: true, crs_foreignBank: true };
            } else if (sourceType === 'doc_bank') {
                result = { otherIncome: 360000, crs_passiveNFE: true, crs_foreignBank: true };
            } else if (sourceType === 'doc_tax') {
                result = { taxPaid: 108000 };
            }
        }
        if (result.daysInChina) {
            updateData('residencyDays', { ...data.residencyDays, 2024: result.daysInChina });
            delete result.daysInChina;
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

  const addForeignStatus = () => {
      const newStatus = { id: Date.now(), country: "US", type: "PR" };
      updateData('foreignStatuses', [...data.foreignStatuses, newStatus]);
  };

  const removeForeignStatus = (id) => {
      updateData('foreignStatuses', data.foreignStatuses.filter(s => s.id !== id));
  };

  const updateForeignStatus = (id, field, value) => {
      updateData('foreignStatuses', data.foreignStatuses.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const updateResidencyYear = (year, value) => {
      if (value > 366) return;
      updateData('residencyDays', { ...data.residencyDays, [year]: value });
  };

  const updateTieBreaker = (field, value) => {
      updateData('tieBreaker', { ...data.tieBreaker, [field]: value });
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 animate-fade-in">
      <DataReviewModal isOpen={reviewOpen} onClose={() => setReviewOpen(false)} aiData={reviewData} onConfirm={handleMerge} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Input Modules */}
        <div className="lg:col-span-1 space-y-6">
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
                {recording && <button onClick={simulateTranscription} className="px-3 py-2 bg-orange-50 text-orange-600 rounded-lg text-xs hover:bg-orange-100">模拟生成</button>}
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 min-h-[120px] max-h-[200px] overflow-y-auto mb-4">
                {transcription ? <p className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed">{transcription}</p> : <p className="text-xs text-gray-400 text-center mt-8">等待录音或上传音频文件...</p>}
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

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FileText className={`w-5 h-5 mr-2 ${THEME_TEXT}`} /> 凭证智能识别
            </h3>
             <div className="space-y-3">
                <div onClick={() => handleAnalyze('doc_bank')} className="group flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-orange-50 border border-transparent hover:border-orange-200 transition-all">
                    <div className="bg-green-100 p-2 rounded text-green-600 mr-3"><FileText size={18}/></div>
                    <div className="flex-1">
                        <div className="text-sm font-medium group-hover:text-orange-700">银行流水 (Bank Statement)</div>
                        <div className="text-xs text-gray-400 group-hover:text-orange-400">上传银行流水以识别纳税义务</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-orange-400"/>
                </div>
                <div onClick={() => handleAnalyze('doc_tax')} className="group flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-orange-50 border border-transparent hover:border-orange-200 transition-all">
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

        {/* Right: Form Data */}
        <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">个人信息与财务概况</h2>
          
          <div className="mb-8">
            <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center ${THEME_TEXT}`}>
              <User className="w-4 h-4 mr-2" /> 1. 身份与居住 (Residency)
            </h4>
            <div className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">客户姓名</label>
                    <input type="text" className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 outline-none" value={data.name} onChange={(e) => updateData('name', e.target.value)} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">国籍/地区</label>
                    <select className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 outline-none" value={data.nationality} onChange={(e) => updateData('nationality', e.target.value)}>
                        <optgroup label="常见国家/地区">{COMMON_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}</optgroup>
                        <optgroup label="其他">{OTHER_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}</optgroup>
                    </select>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-3">中国境内居住天数 (追踪与预测)</label>
                  <div className="grid grid-cols-4 gap-4">
                      {[2023, 2024, 2025, 2026].map(year => {
                          const val = data.residencyDays[year] || "";
                          return (
                            <div key={year}>
                                <div className="text-xs text-gray-500 mb-1 text-center">{year}年 {year === 2026 && "(预计)"}</div>
                                <input type="number" className="w-full p-2 border border-gray-300 rounded text-center outline-none focus:border-orange-500" placeholder="0" value={val} onChange={(e) => updateResidencyYear(year, e.target.value)} />
                            </div>
                          )
                      })}
                  </div>
              </div>

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

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium text-gray-700">境外身份 (Foreign Status)</label>
                    <button onClick={addForeignStatus} className="text-xs flex items-center text-orange-600 hover:text-orange-700 font-medium">
                        <Plus size={14} className="mr-1"/> 添加身份
                    </button>
                  </div>
                  {data.foreignStatuses.length === 0 && <div className="text-xs text-gray-400 text-center py-2 italic">暂无申报的境外永久居留权或国籍</div>}
                  <div className="space-y-2">
                      {data.foreignStatuses.map((status) => (
                          <div key={status.id} className="flex items-center gap-2">
                              <select className="flex-1 p-2 border border-gray-300 rounded text-sm outline-none" value={status.country} onChange={(e) => updateForeignStatus(status.id, 'country', e.target.value)}>
                                  {COMMON_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                                  {OTHER_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                              </select>
                              <select className="w-1/3 p-2 border border-gray-300 rounded text-sm outline-none" value={status.type} onChange={(e) => updateForeignStatus(status.id, 'type', e.target.value)}>
                                  <option value="PR">绿卡/永久居留</option>
                                  <option value="Passport">护照/国籍</option>
                              </select>
                              <button onClick={() => removeForeignStatus(status.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash size={16} /></button>
                          </div>
                      ))}
                  </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center ${THEME_TEXT}`}>
              <Briefcase className="w-4 h-4 mr-2" /> 2. 年度收入数据 (RMB)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                  { label: "工资薪金 (年)", key: "salary" },
                  { label: "劳务报酬", key: "labor" },
                  { label: "稿酬/特许权", key: "royalty" },
                  { label: "境外股息/红利", key: "otherIncome" }
              ].map(f => (
                <div key={f.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-400">¥</span>
                        <input type="number" className="w-full pl-8 p-2 border border-gray-300 rounded outline-none" placeholder="0" value={data[f.key]} onChange={(e) => updateData(f.key, e.target.value)} />
                    </div>
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">已缴纳税额</label>
                <div className="relative">
                    <span className="absolute left-3 top-2 text-green-600">- ¥</span>
                    <input type="number" className="w-full pl-10 p-2 border border-green-300 rounded outline-none bg-green-50" placeholder="0" value={data.taxPaid} onChange={(e) => updateData('taxPaid', e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
             <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center ${THEME_TEXT}`}>
              <Globe className="w-4 h-4 mr-2" /> 3. 全球资产与 CRS 深度扫描
            </h4>
            <div className="bg-orange-50 p-4 rounded border border-orange-100 text-sm text-gray-600 mb-4">
                请勾选您在<b>中国境外</b>（含港澳台）持有的资产或架构类型，AI 将据此分析交换风险：
            </div>
            <div className="space-y-3">
                {[
                    { k: 'crs_foreignBank', l: '境外金融账户', d: '(存款、证券托管账户等)' },
                    { k: 'crs_insurance', l: '大额保单', d: '(具有现金价值的保险/年金)' },
                    { k: 'crs_trust', l: '海外信托架构', d: '(委托人/受益人)' },
                    { k: 'crs_passiveNFE', l: '消极非金融机构 (Passive NFE)', d: '(BVI/Cayman壳公司)' },
                    { k: 'crs_otherResidency', l: '双重税务居民身份', d: '(拥有其他国家税号)' },
                ].map(item => (
                    <label key={item.k} className="flex items-start p-3 bg-white border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                        <input type="checkbox" className="mt-1 w-4 h-4 text-orange-600 rounded focus:ring-orange-500" checked={data[item.k]} onChange={(e) => updateData(item.k, e.target.checked)} />
                        <span className="ml-3 text-sm text-gray-700"><b>{item.l}</b> {item.d}</span>
                    </label>
                ))}
            </div>
          </div>

          <div className="mb-8">
            <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center ${THEME_TEXT}`}>
              <MessageSquare className="w-4 h-4 mr-2" /> 4. 备注与自我评估
            </h4>
            <div className="relative">
                <textarea className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm text-gray-700 min-h-[100px]" placeholder="请在此处补充您的个人情况..." value={data.userComments} onChange={(e) => updateData('userComments', e.target.value)}></textarea>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button onClick={onNext} className={`flex items-center px-6 py-3 ${THEME_BG} text-white font-bold rounded-lg shadow hover:opacity-90 transition-transform transform hover:scale-105`}>
                开始全景分析 <ChevronRight className="ml-2 w-5 h-5"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1DataCollection;