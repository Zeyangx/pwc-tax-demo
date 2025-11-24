import React, { useState } from 'react';
import Navbar from './components/navigation/Navbar';
import SettingsModal from './components/common/SettingsModal';
import Step1DataCollection from './steps/Step1DataCollection';
import Step2Analysis from './steps/Step2Analysis';
import Step3Report from './steps/Step3Report';
import { DEMO_DATA_FULL } from './constants';

// --- 初始空状态 (这是最关键的结构定义) ---
const INITIAL_USER_DATA = {
  // 1. 基础信息
  baseInfo: {
      name: "", nationality: "CN", idType: "中国居民身份证", idNumber: "", employer: "",
      directorships: [], // {id, company}
      shareholdings: []  // {id, company, ratio}
  },
  // 2. 身份
  taxResidency: {
      2022: { daysInChina: "", over183Country: "", hasPermHome: [], ecoCenter: "", familyLoc: "" },
      2023: { daysInChina: "", over183Country: "", hasPermHome: [], ecoCenter: "", familyLoc: "" },
      2024: { daysInChina: "", over183Country: "", hasPermHome: [], ecoCenter: "", familyLoc: "" }
  },
  familyRelations: [], // {id, relation, location}
  hasHukou: null,
  foreignStatuses: [], // {id, country, type, date}
  
  // 3. 收入
  incomeDomestic: { salary: "", labor: "", author: "", royalty: "", taxPaid: "" },
  incomeForeign: [], // Array of {id, country, type...}

  // 4. 账户
  foreignAccounts: [], // Array of complex objects

  // 5. CRS
  crsScan: {
      cnResidentFlag: { checked: false, remark: "" },
      largeInsurance: { checked: false, remark: "" },
      trust: { checked: false, remark: "" },
      passiveNFE: { checked: false, remark: "" },
      multiResidency: { checked: false, remark: "" },
      otherRisk: { checked: false, remark: "" }
  },

  userComments: ""
};

export default function App() {
  const [step, setStep] = useState(0);
  const [apiKey, setApiKey] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [userData, setUserData] = useState(INITIAL_USER_DATA);

  const updateData = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const fillDemoData = () => {
      setUserData(DEMO_DATA_FULL);
  };

  const resetData = () => {
      if(window.confirm("确定清空？")) {
          setUserData(INITIAL_USER_DATA);
          if (step > 0) setStep(0);
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} apiKey={apiKey} setApiKey={setApiKey} />
      <Navbar activeStep={step} setStep={setStep} openSettings={() => setSettingsOpen(true)} fillDemo={fillDemoData} />
      <main>
        {step === 0 && <Step1DataCollection data={userData} updateData={updateData} onNext={() => setStep(1)} resetData={resetData} apiKey={apiKey} />}
        {/* Step2 和 Step3 暂时可能会报错，因为数据结构变了，我们先把 Step1 搞定，后面再修它们 */}
        {step === 1 && <Step2Analysis data={userData} onNext={() => setStep(2)} />}
        {step === 2 && <Step3Report data={userData} />}
      </main>
    </div>
  );
}