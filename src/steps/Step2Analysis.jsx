import React, { useState, useEffect } from 'react';
import { Calculator, User, Globe, CheckCircle } from 'lucide-react';
import { THEME_BG, THEME_BORDER, THEME_TEXT } from '../constants';

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
    <div className="max-w-2xl mx-auto pt-20 text-center px-4 animate-fade-in">
      <div className="mb-8 relative inline-block">
         <div className={`w-24 h-24 border-4 ${THEME_BORDER} border-t-transparent rounded-full animate-spin mx-auto`}></div>
         <div className="absolute inset-0 flex items-center justify-center">
            <Calculator className={`w-8 h-8 ${THEME_TEXT}`} />
         </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">AI 正在全景分析您的税务状况</h2>
      <p className="text-gray-500 mb-8 h-6">{status}</p>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 overflow-hidden">
        <div className={`h-2.5 rounded-full ${THEME_BG} transition-all duration-500 ease-out`} style={{ width: `${progress}%` }}></div>
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

export default Step2Analysis;