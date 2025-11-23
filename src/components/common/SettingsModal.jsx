import React from 'react';
import { Settings } from 'lucide-react';
import { THEME_BG } from '../../constants';

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

export default SettingsModal;