import React, { useState } from 'react';

// 组件
import Navbar from './components/navigation/Navbar';
import SettingsModal from './components/common/SettingsModal';
import Step1DataCollection from './steps/Step1DataCollection';
import Step2Analysis from './steps/Step2Analysis';
import Step3Report from './steps/Step3Report';

// 常量
import { DEMO_DATA_FULL } from './constants';

export default function App() {
  const [step, setStep] = useState(0);
  const [apiKey, setApiKey] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const [userData, setUserData] = useState({
    name: "",
    nationality: "CN",
    residencyDays: { 2023: "", 2024: "", 2025: "", 2026: "" },
    tieBreaker: { hasChinaHome: null, hasForeignHome: null, familyLocation: "", economicCenter: "" },
    foreignStatuses: [], 
    salary: "",
    labor: "",
    author: "",
    royalty: "",
    otherIncome: "",
    taxPaid: "",
    crs_foreignBank: false,
    crs_insurance: false,
    crs_trust: false,
    crs_passiveNFE: false,
    crs_otherResidency: false,
    userComments: ""
  });

  const updateData = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const fillDemoData = () => {
      setUserData(DEMO_DATA_FULL);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* 打印样式 Hack */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .no-print { display: none !important; }
          #printable-area, #printable-area * { visibility: visible; }
          #printable-area { position: absolute; left: 0; top: 0; width: 100%; }
        }
        .animate-fade-in { animation: fadeIn 0.5s ease-in; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      
      <SettingsModal 
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        apiKey={apiKey}
        setApiKey={setApiKey}
      />

      <Navbar 
        activeStep={step} 
        setStep={setStep} 
        openSettings={() => setSettingsOpen(true)} 
        fillDemo={fillDemoData} 
      />
      
      <main>
        {step === 0 && (
          <Step1DataCollection 
            data={userData} 
            updateData={updateData} 
            onNext={() => setStep(1)} 
            apiKey={apiKey}
          />
        )}
        {step === 1 && (
            <Step2Analysis 
                data={userData}
                onNext={() => setStep(2)}
            />
        )}
        {step === 2 && (
          <div id="printable-area">
            <Step3Report data={userData} />
          </div>
        )}
      </main>
    </div>
  );
}