import React, { useState, useEffect } from 'react';
// 注意：这里的路径 ../constants 是对的，因为它在 steps 目录下
import { MOCK_TRANSCRIPT, MOCK_BANK_OCR, MOCK_TAX_OCR } from '../constants';
import { callGeminiAPI } from '../utils/geminiApi';
import IntakeView from '../components/step1/IntakeView';
import VerifyForm from '../components/step1/VerifyForm';

const Step1DataCollection = ({ data, updateData, onNext, resetData, apiKey }) => {
  const [subStep, setSubStep] = useState('intake');

  const [recording, setRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [audioFile, setAudioFile] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [bankFile, setBankFile] = useState(null);
  const [taxFile, setTaxFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    let interval;
    if (recording) {
      interval = setInterval(() => setTimer((p) => p + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [recording]);

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const handleRecordingToggle = (val) => {
      if (val) { setTimer(0); setTranscription(""); setAudioFile(null); }
      setRecording(val);
  };

  const simulateTranscription = () => {
    setRecording(false);
    setTranscription("");
    let i = 0;
    const interval = setInterval(() => {
      setTranscription(MOCK_TRANSCRIPT.slice(0, i));
      i++;
      if (i > MOCK_TRANSCRIPT.length) clearInterval(interval);
    }, 5);
  };

  const handleDrop = (e, type) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) {
          if (type === 'bank') setBankFile(file);
          if (type === 'tax') setTaxFile(file);
          if (type === 'audio') { setAudioFile(file); setTimer(0); setRecording(false); setTranscription(""); }
      }
  };

  const handleGlobalAnalyze = async () => {
    if (!transcription && !bankFile && !taxFile) {
        alert("请先提供录音或凭证！");
        return;
    }
    setIsAnalyzing(true);

    try {
        if (apiKey) {
            // 真实 API 调用逻辑 (简化)
            await new Promise(r => setTimeout(r, 2000));
            // ... 真实逻辑 ...
        } else {
            // Mock Logic (Demo)
            await new Promise(r => setTimeout(r, 2000));

            // 1. 填充基础信息
            updateData('baseInfo', {
                ...data.baseInfo,
                name: "张伟",
                nationality: "CN",
                idType: "中国居民身份证",
                employer: "某跨国科技集团 (CN Headquarter)"
            });

            // 2. 填充 2024 居住信息
            const newResidency = { ...data.taxResidency };
            newResidency['2024'] = { 
                daysInChina: "210", 
                over183Country: "CN", 
                hasPermHome: "CN, US", 
                ecoCenter: "CN", 
                familyLoc: "US" 
            };
            updateData('taxResidency', newResidency);

            // 3. 填充收入
            updateData('incomeDomestic', {
                salary: "3500000",
                labor: "800000",
                author: "0",
                royalty: "200000",
                taxPaid: "980000"
            });

            // 4. 填充境外收入
            const newForeignIncome = [
                { 
                    id: Date.now(), country: "GB", 
                    salary: "0", transfer: "8000000", 
                    taxPaid: "1200000" 
                },
                {
                    id: Date.now() + 1, country: "VG", 
                    dividend: "2800000",
                    taxPaid: "0"
                }
            ];
            updateData('incomeForeign', newForeignIncome);

            // 5. 填充 CRS 风险
            const newCrs = { ...data.crsScan };
            newCrs.trust.checked = true; newCrs.trust.remark = "开曼家族信托";
            newCrs.passiveNFE.checked = true; newCrs.passiveNFE.remark = "BVI Holding Co";
            newCrs.multiResidency.checked = true; newCrs.multiResidency.remark = "US Green Card";
            updateData('crsScan', newCrs);
        }

        setSubStep('verify');

    } catch (e) {
        alert("分析失败: " + e.message);
    } finally {
        setIsAnalyzing(false);
    }
  };

  const handleResetWrapper = () => {
      resetData();
      setSubStep('intake');
      setTranscription("");
      setBankFile(null);
      setTaxFile(null);
      setAudioFile(null);
      setRecording(false);
      setTimer(0);
  };

  return (
    <div className="max-w-6xl mx-auto py-4 px-4">
      <div className="flex items-center justify-center mb-4 space-x-4">
          <div className={`flex items-center space-x-2 ${subStep === 'intake' ? 'text-orange-600 font-bold' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${subStep === 'intake' ? 'bg-orange-100' : 'bg-gray-100'}`}>1</div><span>智能采集</span>
          </div>
          <div className="w-8 h-[1px] bg-gray-300"></div>
          <div className={`flex items-center space-x-2 ${subStep === 'verify' ? 'text-orange-600 font-bold' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${subStep === 'verify' ? 'bg-orange-100' : 'bg-gray-100'}`}>2</div><span>信息核对</span>
          </div>
      </div>

      {subStep === 'intake' ? (
          <IntakeView 
              recording={recording} setRecording={handleRecordingToggle} timerStr={formatTime(timer)}
              audioFile={audioFile} simulateTranscription={simulateTranscription} transcription={transcription}
              bankFile={bankFile} taxFile={taxFile} handleDrop={handleDrop} preventDefault={(e)=>e.preventDefault()}
              isAnalyzing={isAnalyzing} handleGlobalAnalyze={handleGlobalAnalyze}
              onSkip={() => setSubStep('verify')}
          />
      ) : (
          <VerifyForm 
              data={data} updateData={updateData} 
              onNext={onNext} onBack={() => setSubStep('intake')} onReset={handleResetWrapper}
          />
      )}
    </div>
  );
};

export default Step1DataCollection;