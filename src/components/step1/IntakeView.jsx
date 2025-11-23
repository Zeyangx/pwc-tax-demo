import React from 'react';
import { Mic, FileText, Square, RefreshCw, Sparkles, Upload, CheckCircle } from 'lucide-react';
import { THEME_BG, THEME_TEXT } from '../../constants';

const IntakeView = ({ 
    recording, setRecording, simulateTranscription, transcription,
    bankFile, taxFile, handleDrop, preventDefault,
    isAnalyzing, handleGlobalAnalyze, onSkip 
}) => {
  return (
    <div className="max-w-3xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-8 animate-fade-in">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">开始您的税务数据采集</h2>
                <p className="text-gray-500 mt-2">请上传录音或凭证，AI 将自动提取并填报。</p>
            </div>

            {/* 录音区 */}
            <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300 relative">
                <h3 className="text-md font-bold text-gray-700 mb-3 flex items-center"><Mic className="w-4 h-4 mr-2"/> 会议录音</h3>
                <div className="flex gap-3">
                        <button onClick={() => setRecording(!recording)} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${recording ? 'bg-red-50 text-red-600' : 'bg-white border text-gray-700'}`}>
                        {recording ? <><Square className="w-4 h-4 mr-2 animate-pulse"/> 停止</> : <><Mic className="w-4 h-4 mr-2"/> 录音</>}
                        </button>
                        {recording && <button onClick={simulateTranscription} className="px-4 py-2 bg-orange-50 text-orange-600 rounded-lg text-xs">模拟生成</button>}
                </div>
                {transcription && <div className="mt-3 p-3 bg-white rounded text-xs text-gray-600 border max-h-[100px] overflow-y-auto">{transcription}</div>}
            </div>

            {/* 文件区 */}
            <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300">
                <h3 className="text-md font-bold text-gray-700 mb-3 flex items-center"><FileText className="w-4 h-4 mr-2"/> 凭证上传</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div 
                        onDrop={(e) => handleDrop(e, 'bank')} onDragOver={preventDefault}
                        className={`p-4 bg-white rounded-lg border text-center cursor-pointer transition-colors ${bankFile ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-orange-300'}`}
                    >
                        {bankFile ? <div className="text-green-600 text-xs font-bold flex flex-col items-center"><CheckCircle className="mb-1"/>{bankFile.name}</div> : <div className="text-gray-400 text-xs">拖入 <b>银行流水</b></div>}
                    </div>
                    <div 
                        onDrop={(e) => handleDrop(e, 'tax')} onDragOver={preventDefault}
                        className={`p-4 bg-white rounded-lg border text-center cursor-pointer transition-colors ${taxFile ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-orange-300'}`}
                    >
                        {taxFile ? <div className="text-blue-600 text-xs font-bold flex flex-col items-center"><CheckCircle className="mb-1"/>{taxFile.name}</div> : <div className="text-gray-400 text-xs">拖入 <b>完税凭证</b></div>}
                    </div>
                </div>
            </div>

            {/* 按钮组 */}
            <div className="pt-4 space-y-3">
                <button 
                    onClick={handleGlobalAnalyze}
                    disabled={(!transcription && !bankFile && !taxFile) || isAnalyzing}
                    className={`w-full py-2 rounded-lg text-white font-bold text-lg shadow-md transition-transform transform hover:scale-[1.01] ${(!transcription && !bankFile && !taxFile) ? 'bg-gray-300 cursor-not-allowed' : `${THEME_BG}`}`}
                >
                    {isAnalyzing ? <span className="flex items-center justify-center"><RefreshCw className="animate-spin mr-2"/> 分析中...</span> : <span className="flex items-center justify-center"><Sparkles className="mr-2"/> 开始 AI 提取</span>}
                </button>
                
                <button onClick={onSkip} className="w-full py-2 text-gray-500 text-sm hover:text-gray-700 underline">
                    跳过 AI，直接手动填报
                </button>
            </div>
        </div>
    </div>
  );
};

export default IntakeView;