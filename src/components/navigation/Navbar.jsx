import React, { useState } from 'react';
import { Lock, Zap, Settings, X, ChevronRight } from 'lucide-react';
import { THEME_BG } from '../../constants';
import PwCLogo from '../common/PwCLogo';

const Navbar = ({ activeStep, setStep, openSettings, fillDemo }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const steps = ['数据采集', '智能分析', '生成报告'];

  return (
    <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <PwCLogo />
          <div className="flex flex-col">
            <span className="font-bold text-xl text-gray-800 tracking-tight pl-4 leading-none">
              PwC CRS AI Workflow
            </span>
            <span className="text-[10px] text-green-600 font-medium pl-4 mt-1 flex items-center gap-1 hidden md:flex">
              <Lock size={10} /> Secure Workflow V1.4
            </span>
          </div>
        </div>

        {/* Desktop controls */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center space-x-1">
            {steps.map((step, idx) => (
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

          <button
            onClick={fillDemo}
            className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-full text-xs font-bold flex items-center transition-colors border border-blue-200"
            title="一键填入演示数据"
          >
            <Zap size={14} className="mr-1" /> Demo
          </button>

          <button
            onClick={openSettings}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            title="设置"
          >
            <Settings size={20} />
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-md border border-gray-200 bg-white"
            aria-label="Open menu"
          >
            {menuOpen ? <X size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile sliding menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-2">
            {steps.map((step, idx) => (
              <button
                key={step}
                onClick={() => { setStep(idx); setMenuOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeStep === idx ? `${THEME_BG} text-white` : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {idx + 1}. {step}
              </button>
            ))}

            <div className="flex gap-2">
              <button
                onClick={() => { fillDemo(); setMenuOpen(false); }}
                className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-md text-sm font-medium"
              >
                Demo
              </button>
              <button
                onClick={() => { openSettings(); setMenuOpen(false); }}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-700"
              >
                设置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;