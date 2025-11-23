import React, { useState } from 'react';
import { MOCK_TRANSCRIPT, MOCK_BANK_OCR, MOCK_TAX_OCR } from '../constants';
import { callGeminiAPI } from '../utils/geminiApi';
import DataReviewModal from '../components/common/DataReviewModal';
// 引入刚刚拆分的两个子组件
import IntakeView from '../components/step1/IntakeView';
import VerifyForm from '../components/step1/VerifyForm';

const Step1DataCollection = ({ data, updateData, onNext, resetData, apiKey }) => {
  // 核心状态：当前在哪个子步骤
  const [subStep, setSubStep] = useState('intake'); // 'intake' | 'verify'

  // IntakeView 需要的状态
  const [recording, setRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [bankFile, setBankFile] = useState(null);
  const [taxFile, setTaxFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // 弹窗状态
  const [reviewData, setReviewData] = useState(null);
  const [reviewOpen, setReviewOpen] = useState(false);

  // --- 逻辑处理 ---
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

  const handleDrop = (e, type) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) {
          if (type === 'bank') setBankFile(file);
          if (type === 'tax') setTaxFile(file);
      }
  };

  const handleGlobalAnalyze = async () => {
    if (!transcription && !bankFile && !taxFile) {
        alert("请先录音或上传文件！");
        return;
    }
    setIsAnalyzing(true);
    let finalResult = {};

    try {
        if (apiKey) {
            let prompt = `You are a tax expert. Extract JSON data from inputs:\n`;
            if (transcription) prompt += `[TRANSCRIPT]: ${transcription}\n`;
            if (bankFile) prompt += `[BANK OCR]: ${MOCK_BANK_OCR}\n`;
            if (taxFile) prompt += `[TAX OCR]: ${MOCK_TAX_OCR}\n`;
            prompt += `Fields: name, daysInChina, salary, labor, interest, dividend, propertyTransferIncome, propertyTransferCost, taxPaid, taxPaidCountry, taxPaidYear, taxDeductible, crs_trust, crs_passiveNFE, crs_foreignBank.`;
            
            finalResult = await callGeminiAPI(apiKey, prompt);
        } else {
            await new Promise(r => setTimeout(r, 1500));
            // Mock Logic
            let tData = transcription ? { name: "张伟", daysInChina: 210, salary: 2000000, labor: 300000, dividend: 120000, propertyTransferIncome: 3000000, propertyTransferCost: 2000000, taxPaid: 450000, taxPaidCountry: "JP", crs_trust: true, crs_passiveNFE: true } : {};
            let fData = {};
            if (bankFile) { fData.interest = 5800.50; fData.crs_foreignBank = true; fData.crs_passiveNFE = true; }
            if (taxFile) { fData.taxPaid = 451200; fData.taxPaidCountry = "Japan (JP)"; fData.taxPaidYear = "2024"; fData.taxDeductible = true; }
            finalResult = { ...tData, ...fData };
            if (Object.keys(finalResult).length === 0) finalResult = { daysInChina: 210, salary: 2000000 };
        }

        if (finalResult.daysInChina) {
            updateData('residencyDays', { ...data.residencyDays, 2024: finalResult.daysInChina });
            delete finalResult.daysInChina;
        }
        setReviewData(finalResult);
        setReviewOpen(true);
    } catch (e) {
        alert("Error: " + e.message);
    } finally {
        setIsAnalyzing(false);
    }
  };

  const handleMerge = (mergedData) => {
      Object.keys(mergedData).forEach(key => updateData(key, mergedData[key]));
      setReviewOpen(false);
      setSubStep('verify'); // 自动跳转
  };

  // 包装一下重置函数，顺便清空本地状态
  const handleResetWrapper = () => {
      resetData();
      setSubStep('intake');
      setTranscription("");
      setBankFile(null);
      setTaxFile(null);
  };

  // --- 辅助函数传递 ---
  const formProps = {
      addForeignStatus: () => updateData('foreignStatuses', [...data.foreignStatuses, { id: Date.now(), country: "US", type: "PR" }]),
      removeForeignStatus: (id) => updateData('foreignStatuses', data.foreignStatuses.filter(s => s.id !== id)),
      updateForeignStatus: (id, field, value) => updateData('foreignStatuses', data.foreignStatuses.map(s => s.id === id ? { ...s, [field]: value } : s)),
      updateResidencyYear: (year, value) => updateData('residencyDays', { ...data.residencyDays, [year]: value }),
      updateTieBreaker: (field, value) => updateData('tieBreaker', { ...data.tieBreaker, [field]: value })
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <DataReviewModal isOpen={reviewOpen} onClose={() => setReviewOpen(false)} aiData={reviewData} onConfirm={handleMerge} />
      
      {/* 顶部进度条 */}
      <div className="flex items-center justify-center mb-8 space-x-4">
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
              recording={recording} setRecording={setRecording} simulateTranscription={simulateTranscription} transcription={transcription}
              bankFile={bankFile} taxFile={taxFile} handleDrop={handleDrop} preventDefault={(e)=>e.preventDefault()}
              isAnalyzing={isAnalyzing} handleGlobalAnalyze={handleGlobalAnalyze}
              onSkip={() => setSubStep('verify')}
          />
      ) : (
          <VerifyForm 
              data={data} updateData={updateData} 
              onNext={onNext} 
              onBack={() => setSubStep('intake')}
              onReset={handleResetWrapper}
              {...formProps}
          />
      )}
    </div>
  );
};

export default Step1DataCollection;