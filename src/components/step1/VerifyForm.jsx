import React from 'react';
import { 
  ArrowLeft, Trash2, User, Anchor, Home, Globe, Users, Briefcase, Plus, Trash, Briefcase as BriefcaseIcon, MessageSquare, ChevronRight
} from 'lucide-react';
import { THEME_BG, THEME_TEXT, COMMON_COUNTRIES, OTHER_COUNTRIES } from '../../constants';

const VerifyForm = ({ 
    data, updateData, onNext, onBack, onReset, 
    addForeignStatus, removeForeignStatus, updateForeignStatus, 
    updateResidencyYear, updateTieBreaker 
}) => {
  return (
    <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-4">
            <button onClick={onBack} className="flex items-center text-sm text-gray-500 hover:text-orange-600">
                <ArrowLeft className="w-4 h-4 mr-1"/> 返回继续上传
            </button>
            <button onClick={onReset} className="flex items-center text-sm text-red-500 hover:text-red-700 border border-red-200 px-3 py-1 rounded-full bg-white hover:bg-red-50 transition-colors">
                <Trash2 className="w-4 h-4 mr-1"/> 清空重置
            </button>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">核对个人信息与财务概况</h2>
            
            {/* 1. 身份与居住 */}
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
                        {[2023, 2024, 2025, 2026].map(year => (
                            <div key={year}>
                                <div className="text-xs text-gray-500 mb-1 text-center">{year}年 {year === 2026 && "(预计)"}</div>
                                <input type="number" className="w-full p-2 border border-gray-300 rounded text-center outline-none focus:border-orange-500" placeholder="0" value={data.residencyDays[year] || ""} onChange={(e) => updateResidencyYear(year, e.target.value)} />
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Tie-Breaker */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                    <div className="flex items-center mb-3 text-blue-800"><Anchor className="w-4 h-4 mr-2"/><span className="text-sm font-bold">税收居民身份判定辅助</span></div>
                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between items-center border-b border-blue-100 pb-2"><span className="text-gray-700 flex items-center"><Home className="w-3 h-3 mr-2 text-blue-400"/>在中国是否有永久性住所？</span><div className="flex gap-3"><label className="flex items-center cursor-pointer"><input type="radio" checked={data.tieBreaker.hasChinaHome === true} onChange={()=>updateTieBreaker('hasChinaHome', true)} className="mr-1"/> 是</label><label className="flex items-center cursor-pointer"><input type="radio" checked={data.tieBreaker.hasChinaHome === false} onChange={()=>updateTieBreaker('hasChinaHome', false)} className="mr-1"/> 否</label></div></div>
                        <div className="flex justify-between items-center border-b border-blue-100 pb-2"><span className="text-gray-700 flex items-center"><Globe className="w-3 h-3 mr-2 text-blue-400"/>在境外是否有永久性住所？</span><div className="flex gap-3"><label className="flex items-center cursor-pointer"><input type="radio" checked={data.tieBreaker.hasForeignHome === true} onChange={()=>updateTieBreaker('hasForeignHome', true)} className="mr-1"/> 是</label><label className="flex items-center cursor-pointer"><input type="radio" checked={data.tieBreaker.hasForeignHome === false} onChange={()=>updateTieBreaker('hasForeignHome', false)} className="mr-1"/> 否</label></div></div>
                        <div className="flex justify-between items-center border-b border-blue-100 pb-2"><span className="text-gray-700 flex items-center"><Users className="w-3 h-3 mr-2 text-blue-400"/>重要利益中心主要在？</span><select className="p-1 border rounded text-sm bg-white" value={data.tieBreaker.familyLocation} onChange={(e)=>updateTieBreaker('familyLocation', e.target.value)}><option value="">请选择...</option><option value="CN">中国境内</option><option value="Overseas">境外</option><option value="Both">两者皆有</option></select></div>
                        <div className="flex justify-between items-center"><span className="text-gray-700 flex items-center"><Briefcase className="w-3 h-3 mr-2 text-blue-400"/>主要经济利益所在地？</span><select className="p-1 border rounded text-sm bg-white" value={data.tieBreaker.economicCenter} onChange={(e)=>updateTieBreaker('economicCenter', e.target.value)}><option value="">请选择...</option><option value="CN">中国境内</option><option value="Overseas">境外</option><option value="Both">两者皆有</option></select></div>
                    </div>
                </div>

                {/* Foreign Status */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-3"><label className="block text-sm font-medium text-gray-700">境外身份 (Foreign Status)</label><button onClick={addForeignStatus} className="text-xs flex items-center text-orange-600 hover:text-orange-700 font-medium"><Plus size={14} className="mr-1"/> 添加身份</button></div>
                    {data.foreignStatuses.length === 0 && <div className="text-xs text-gray-400 text-center py-2 italic">暂无申报的境外永久居留权或国籍</div>}
                    <div className="space-y-2">
                        {data.foreignStatuses.map((status) => (
                            <div key={status.id} className="flex items-center gap-2">
                                <select className="flex-1 p-2 border border-gray-300 rounded text-sm outline-none" value={status.country} onChange={(e) => updateForeignStatus(status.id, 'country', e.target.value)}>{COMMON_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}{OTHER_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}</select>
                                <select className="w-1/3 p-2 border border-gray-300 rounded text-sm outline-none" value={status.type} onChange={(e) => updateForeignStatus(status.id, 'type', e.target.value)}><option value="PR">绿卡/永久居留</option><option value="Passport">护照/国籍</option></select>
                                <button onClick={() => removeForeignStatus(status.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash size={16} /></button>
                            </div>
                        ))}
                    </div>
                </div>
                </div>
            </div>

            {/* 2. 收入数据 */}
            <div className="mb-8">
                <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center ${THEME_TEXT}`}>
                <BriefcaseIcon className="w-4 h-4 mr-2" /> 2. 年度收入数据 (RMB)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    { label: "工资薪金 (年)", key: "salary" },
                    { label: "劳务报酬", key: "labor" },
                    { label: "稿酬/特许权", key: "royalty" },
                    { label: "利息/股息/红利", key: "dividend" },
                    { label: "财产转让所得", key: "propertyTransferIncome" }
                ].map(f => (
                    <div key={f.key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                        <div className="relative"><span className="absolute left-3 top-2 text-gray-400">¥</span><input type="number" className="w-full pl-8 p-2 border border-gray-300 rounded outline-none" placeholder="0" value={data[f.key]} onChange={(e) => updateData(f.key, e.target.value)} /></div>
                    </div>
                ))}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">已缴纳税额</label>
                    <div className="relative"><span className="absolute left-3 top-2 text-green-600">- ¥</span><input type="number" className="w-full pl-10 p-2 border border-green-300 rounded outline-none bg-green-50" placeholder="0" value={data.taxPaid} onChange={(e) => updateData('taxPaid', e.target.value)} /></div>
                </div>
                </div>
            </div>

            {/* 3. CRS */}
            <div className="mb-8">
                <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center ${THEME_TEXT}`}>
                <Globe className="w-4 h-4 mr-2" /> 3. 全球资产与 CRS 深度扫描
                </h4>
                <div className="bg-orange-50 p-4 rounded border border-orange-100 text-sm text-gray-600 mb-4">请勾选您在<b>中国境外</b>（含港澳台）持有的资产或架构类型，AI 将据此分析交换风险：</div>
                <div className="space-y-3">
                    {[{ k: 'crs_foreignBank', l: '境外金融账户', d: '(存款、证券等)' }, { k: 'crs_insurance', l: '大额保单', d: '(现金价值)' }, { k: 'crs_trust', l: '海外信托架构', d: '(委托人/受益人)' }, { k: 'crs_passiveNFE', l: '消极非金融机构', d: '(BVI/壳公司)' }, { k: 'crs_otherResidency', l: '双重税务居民身份', d: '' }].map(item => (
                        <label key={item.k} className="flex items-start p-3 bg-white border border-gray-200 rounded hover:bg-gray-50 cursor-pointer"><input type="checkbox" className="mt-1 w-4 h-4 text-orange-600 rounded focus:ring-orange-500" checked={data[item.k]} onChange={(e) => updateData(item.k, e.target.checked)} /><span className="ml-3 text-sm text-gray-700"><b>{item.l}</b> {item.d}</span></label>
                    ))}
                </div>
            </div>

            {/* 4. 备注 */}
            <div className="mb-8">
                <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center ${THEME_TEXT}`}>
                <MessageSquare className="w-4 h-4 mr-2" /> 4. 备注与自我评估
                </h4>
                <div className="relative"><textarea className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm text-gray-700 min-h-[100px]" placeholder="请在此处补充您的个人情况..." value={data.userComments} onChange={(e) => updateData('userComments', e.target.value)}></textarea></div>
            </div>

            <div className="flex justify-end pt-4">
                <button onClick={onNext} className={`flex items-center px-6 py-3 ${THEME_BG} text-white font-bold rounded-lg shadow hover:opacity-90 transition-transform transform hover:scale-105`}>
                    开始全景分析 <ChevronRight className="ml-2 w-5 h-5"/>
                </button>
            </div>
        </div>
    </div>
  );
};

export default VerifyForm;