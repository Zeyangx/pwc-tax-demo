import React, { useEffect, useRef } from 'react';
import { Mic, FileText, Square, RefreshCw, Sparkles, Upload, CheckCircle, FileAudio, Clock } from 'lucide-react';
import { THEME_BG } from '../../constants';

const IntakeView = ({ 
    recording, setRecording, timerStr,
    audioFile, simulateTranscription, transcription,
    bankFile, taxFile, handleDrop, preventDefault,
    isAnalyzing, handleGlobalAnalyze, onSkip 
}) => {
  const transcriptRef = useRef(null);

  useEffect(() => {
    if (transcriptRef.current) {
        transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcription]);

  return (
    <div className="max-w-3xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-8 animate-fade-in">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">开始您的税务数据采集</h2>
                <p className="text-gray-500 mt-2 text-sm">支持会议录音实时转写、音频文件导入及凭证智能识别。</p>
            </div>

            {/* === 录音与音频模块 === */}
            <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300 relative">
                <div className={`absolute top-0 left-0 w-1 h-full ${transcription ? 'bg-green-400' : 'bg-orange-200'}`}></div>
                <h3 className="text-md font-bold text-gray-700 mb-4 flex items-center">
                    <Mic className="w-4 h-4 mr-2 text-orange-600"/> 智能会议录入 (Audio Intelligence)
                </h3>
                
                <div className="flex gap-4">
                    {/* 拖拽区 */}
                    <div 
                        onDrop={(e) => handleDrop(e, 'audio')} onDragOver={preventDefault}
                        className={`flex-1 border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[120px] ${audioFile ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-orange-300 bg-white'}`}
                    >
                        {audioFile ? (
                            <div className="text-center text-green-700">
                                <FileAudio className="w-8 h-8 mx-auto mb-2"/>
                                <div className="text-xs font-bold truncate max-w-[120px]">{audioFile.name}</div>
                                <div className="text-[10px]">已就绪</div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-400">
                                <Upload className="w-6 h-6 mx-auto mb-2"/>
                                <span className="text-xs">拖拽 <b>会议录音</b> 文件</span>
                                <span className="text-[10px] block mt-1 text-gray-300">支持 MP3, M4A, WAV</span>
                            </div>
                        )}
                    </div>

                    {/* 按钮区 */}
                    <div className="flex-1 flex flex-col justify-between">
                        <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between mb-2">
                            <div className="flex items-center text-gray-600">
                                <Clock className={`w-4 h-4 mr-2 ${recording ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}/>
                                <span className={`font-mono font-bold ${recording ? 'text-red-500' : 'text-gray-500'}`}>
                                    {timerStr}
                                </span>
                            </div>
                            {recording && <span className="text-[10px] text-red-500 flex items-center"><span className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-ping"></span>REC</span>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <button 
                                onClick={() => setRecording(!recording)} 
                                className={`w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-colors ${recording ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200'}`}
                            >
                                {recording ? <><Square className="w-4 h-4 mr-2"/> 停止录音</> : <><Mic className="w-4 h-4 mr-2"/> 开始录音</>}
                            </button>

                            {(!recording && (timerStr !== "00:00" || audioFile)) && (
                                <button 
                                    onClick={simulateTranscription}
                                    className="w-full py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:opacity-90 shadow-sm flex items-center justify-center"
                                >
                                    <Sparkles className="w-4 h-4 mr-2"/> 
                                    {audioFile ? "开始转写音频" : "转写录音内容"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* 转写结果预览 */}
                {transcription && (
                    <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-gray-500 uppercase">Transcript Preview</span>
                            <span className="text-[10px] text-green-600 bg-green-100 px-2 py-0.5 rounded-full">完成</span>
                        </div>
                        <div 
                            ref={transcriptRef}
                            className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap max-h-[120px] overflow-y-auto scroll-smooth"
                        >
                            {transcription}
                        </div>
                    </div>
                )}
            </div>

            {/* 文件模块 */}
            <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300 relative">
                <div className={`absolute top-0 left-0 w-1 h-full ${bankFile || taxFile ? 'bg-blue-400' : 'bg-gray-200'}`}></div>
                <h3 className="text-md font-bold text-gray-700 mb-4 flex items-center"><FileText className="w-4 h-4 mr-2"/> 凭证智能识别 (Document OCR)</h3>
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

            {/* 底部按钮 */}
            <div className="pt-4 space-y-3">
                <button 
                    onClick={handleGlobalAnalyze}
                    disabled={(!transcription && !bankFile && !taxFile) || isAnalyzing}
                    className={`w-full py-3 rounded-lg text-white font-bold text-lg shadow-md transition-transform transform hover:scale-[1.01] ${(!transcription && !bankFile && !taxFile) ? 'bg-gray-300 cursor-not-allowed' : `${THEME_BG}`}`}
                >
                    {isAnalyzing ? <span className="flex items-center justify-center"><RefreshCw className="animate-spin mr-2"/> AI 全案分析中...</span> : <span className="flex items-center justify-center"><Sparkles className="mr-2"/> 开始 AI 提取 & 分析</span>}
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