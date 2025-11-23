import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle } from 'lucide-react';
import { THEME_BG } from '../../constants';

const DataReviewModal = ({ isOpen, onClose, aiData, onConfirm }) => {
    const [editedData, setEditedData] = useState(aiData);
    useEffect(() => { setEditedData(aiData); }, [aiData]);

    if (!isOpen || !aiData || !editedData) return null;

    const handleChange = (key, val) => {
        setEditedData(prev => ({...prev, [key]: val}));
    };

    // --- 全量字段映射表 (必须包含 AI 提取的所有 Key) ---
    const fieldLabels = {
        // 1. 身份
        daysInChina: "境内居住天数 (2024)",
        name: "客户姓名",
        nationality: "国籍/地区",

        // 2. 收入详情
        salary: "工资薪金 (RMB)",
        labor: "劳务报酬 (RMB)",
        author: "稿酬所得 (RMB)",
        royalty: "特许权使用费 (RMB)",
        interest: "利息收入 (Interest)",
        dividend: "股息红利 (Dividend)",
        propertyTransferIncome: "财产转让收入 (Sold)",
        propertyTransferCost: "财产转让成本 (Cost)",
        otherIncome: "其他境外所得",

        // 3. 税额详情
        taxPaid: "已缴纳税额 (RMB)",
        taxPaidCountry: "税款缴纳地 (Source)",
        taxPaidYear: "税款所属年度 (Year)",
        taxDeductible: "是否符合抵扣条件",

        // 4. CRS 风险
        crs_trust: "海外信托架构",
        crs_passiveNFE: "消极非金融机构 (BVI/Cayman)",
        crs_foreignBank: "境外金融账户",
        crs_insurance: "大额保单/年金",
        crs_otherResidency: "双重税务居民身份"
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[90]">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-orange-50">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 flex items-center">
                            <Sparkles className="mr-2 w-5 h-5 text-orange-600"/> Gemini AI 智能提取结果
                        </h3>
                        <p className="text-xs text-gray-500">AI 已综合分析录音与凭证，提取以下关键信息：</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>
                
                <div className="p-6 grid grid-cols-1 gap-4">
                    {Object.keys(editedData).map(key => {
                        // 如果 AI 返回了奇怪的字段，这里会过滤掉
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
                                            <span className="text-sm text-gray-600">
                                                {key === 'taxDeductible' 
                                                    ? (editedData[key] ? "是 (可抵扣)" : "否 (不可抵扣)")
                                                    : (editedData[key] ? "检测到风险 / 存在" : "无")
                                                }
                                            </span>
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

export default DataReviewModal;