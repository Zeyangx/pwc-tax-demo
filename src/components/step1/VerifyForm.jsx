import React from 'react';
import { 
  ArrowLeft, Trash2, User, MapPin, Briefcase, Wallet, ShieldAlert, 
  Plus, Trash, ChevronDown, FileText 
} from 'lucide-react';
// 注意：这里的路径 ../../constants 是对的，因为它在 components/step1 目录下
import { THEME_BG, THEME_TEXT, COMMON_COUNTRIES, OTHER_COUNTRIES, ID_TYPES, FI_TYPES } from '../../constants';

const VerifyForm = ({ 
    data, updateData, onNext, onBack, onReset 
}) => {
  
  // --- 通用更新辅助函数 ---
  const updateBaseInfo = (key, val) => updateData('baseInfo', { ...data.baseInfo, [key]: val });
  
  const updateResidencyYear = (year, key, val) => {
      const newResidency = { ...data.taxResidency };
      newResidency[year] = { ...newResidency[year], [key]: val };
      updateData('taxResidency', newResidency);
  };

  const updateIncomeDomestic = (key, val) => updateData('incomeDomestic', { ...data.incomeDomestic, [key]: val });

  const updateCrsScan = (key, field, val) => {
      const newScan = { ...data.crsScan };
      newScan[key] = { ...newScan[key], [field]: val };
      updateData('crsScan', newScan);
  };

  // --- 数组操作辅助函数 ---
  const addItem = (listKey, initialItem) => {
      updateData(listKey, [...data[listKey], { ...initialItem, id: Date.now() }]);
  };
  
  const removeItem = (listKey, id) => {
      updateData(listKey, data[listKey].filter(item => item.id !== id));
  };

  const updateArrayItem = (listKey, id, field, val) => {
      updateData(listKey, data[listKey].map(item => item.id === id ? { ...item, [field]: val } : item));
  };
  
  const addBaseInfoArray = (subKey, item) => updateBaseInfo(subKey, [...data.baseInfo[subKey], { ...item, id: Date.now() }]);
  const removeBaseInfoArray = (subKey, id) => updateBaseInfo(subKey, data.baseInfo[subKey].filter(x => x.id !== id));
  
  const CountrySelect = ({ value, onChange, className }) => (
      <select className={`border border-gray-300 rounded p-2 text-sm outline-none focus:border-orange-500 ${className}`} value={value} onChange={onChange}>
          <option value="">选择国家/地区...</option>
          <optgroup label="常见">{COMMON_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}</optgroup>
          <optgroup label="其他">{OTHER_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}</optgroup>
      </select>
  );

  return (
    <div className="animate-fade-in pb-10">
        {/* 顶部导航栏 */}
        <div className="flex justify-between items-center mb-6 sticky top-0 z-10 bg-gray-50 py-4 border-b border-gray-200">
            <button onClick={onBack} className="flex items-center text-sm text-gray-500 hover:text-orange-600">
                <ArrowLeft className="w-4 h-4 mr-1"/> 返回采集
            </button>
            <h2 className="text-lg font-bold text-gray-800">信息核对与补充</h2>
            <button onClick={onReset} className="flex items-center text-sm text-red-500 hover:text-red-700 bg-white px-3 py-1 rounded border border-red-200">
                <Trash2 className="w-4 h-4 mr-1"/> 清空
            </button>
        </div>

        <div className="space-y-8">
            {/* 1. 个人基础信息 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className={`text-md font-bold mb-4 flex items-center ${THEME_TEXT}`}>
                    <User className="w-5 h-5 mr-2" /> 1. 个人基础信息
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><label className="block text-xs text-gray-500 mb-1">姓名</label><input type="text" className="w-full border p-2 rounded" value={data.baseInfo.name} onChange={e => updateBaseInfo('name', e.target.value)} /></div>
                    <div><label className="block text-xs text-gray-500 mb-1">国籍/地区</label><CountrySelect className="w-full" value={data.baseInfo.nationality} onChange={e => updateBaseInfo('nationality', e.target.value)} /></div>
                    <div><label className="block text-xs text-gray-500 mb-1">证件类型</label><select className="w-full border p-2 rounded text-sm" value={data.baseInfo.idType} onChange={e => updateBaseInfo('idType', e.target.value)}>{ID_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
                    <div><label className="block text-xs text-gray-500 mb-1">证件号码</label><input type="text" className="w-full border p-2 rounded" value={data.baseInfo.idNumber} onChange={e => updateBaseInfo('idNumber', e.target.value)} /></div>
                    <div className="col-span-2"><label className="block text-xs text-gray-500 mb-1">主要雇主</label><input type="text" className="w-full border p-2 rounded" value={data.baseInfo.employer} onChange={e => updateBaseInfo('employer', e.target.value)} /></div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-3 rounded">
                        <div className="flex justify-between mb-2"><span className="text-xs font-bold">任职董事公司</span><Plus className="w-4 h-4 cursor-pointer text-blue-500" onClick={() => addBaseInfoArray('directorships', {company:''})}/></div>
                        {data.baseInfo.directorships.map(item => (
                            <div key={item.id} className="flex gap-2 mb-2"><input className="flex-1 border p-1 rounded text-xs" placeholder="公司名称" value={item.company} onChange={e => {
                                const newList = data.baseInfo.directorships.map(x => x.id === item.id ? {...x, company: e.target.value} : x);
                                updateBaseInfo('directorships', newList);
                            }} /><Trash className="w-4 h-4 text-gray-400 cursor-pointer mt-1" onClick={() => removeBaseInfoArray('directorships', item.id)}/></div>
                        ))}
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                        <div className="flex justify-between mb-2"><span className="text-xs font-bold">持股公司及比例</span><Plus className="w-4 h-4 cursor-pointer text-blue-500" onClick={() => addBaseInfoArray('shareholdings', {company:'', ratio:''})}/></div>
                        {data.baseInfo.shareholdings.map(item => (
                            <div key={item.id} className="flex gap-2 mb-2">
                                <input className="flex-1 border p-1 rounded text-xs" placeholder="公司名称" value={item.company} onChange={e => {
                                    const newList = data.baseInfo.shareholdings.map(x => x.id === item.id ? {...x, company: e.target.value} : x);
                                    updateBaseInfo('shareholdings', newList);
                                }} />
                                <input className="w-16 border p-1 rounded text-xs text-center" placeholder="%" value={item.ratio} onChange={e => {
                                    const newList = data.baseInfo.shareholdings.map(x => x.id === item.id ? {...x, ratio: e.target.value} : x);
                                    updateBaseInfo('shareholdings', newList);
                                }} />
                                <Trash className="w-4 h-4 text-gray-400 cursor-pointer mt-1" onClick={() => removeBaseInfoArray('shareholdings', item.id)}/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 2. 税收居民身份 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className={`text-md font-bold mb-4 flex items-center ${THEME_TEXT}`}>
                    <MapPin className="w-5 h-5 mr-2" /> 2. 税收居民身份判定
                </h3>
                <div className="grid grid-cols-3 gap-4 mb-6">
                    {['2022', '2023', '2024'].map(year => (
                        <div key={year} className="bg-gray-50 p-3 rounded border border-gray-200">
                            <div className="text-center font-bold text-gray-700 mb-2">{year} 年度</div>
                            <div className="space-y-2">
                                <div><label className="text-xs text-gray-500">中国居住天数</label><input type="number" className="w-full border p-1 rounded text-center" value={data.taxResidency[year]?.daysInChina || ''} onChange={e => updateResidencyYear(year, 'daysInChina', e.target.value)}/></div>
                                <div><label className="text-xs text-gray-500">居住>183天地区</label><CountrySelect className="w-full" value={data.taxResidency[year]?.over183Country || ''} onChange={e => updateResidencyYear(year, 'over183Country', e.target.value)}/></div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-blue-50 p-4 rounded mb-4 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block font-bold text-gray-700 mb-1">永久性住所所在地</label><input type="text" className="w-full border p-2 rounded" placeholder="例如：中国、美国" value={data.taxResidency['2024'].hasPermHome} onChange={e => updateResidencyYear('2024', 'hasPermHome', e.target.value)} /></div>
                        <div><label className="block font-bold text-gray-700 mb-1">重要经济利益中心</label><input type="text" className="w-full border p-2 rounded" placeholder="例如：中国" value={data.taxResidency['2024'].ecoCenter} onChange={e => updateResidencyYear('2024', 'ecoCenter', e.target.value)} /></div>
                    </div>
                    <div className="mt-4">
                        <div className="flex justify-between mb-2"><span className="font-bold text-gray-700">主要家庭成员及居住地</span><Plus className="w-4 h-4 cursor-pointer text-blue-600" onClick={() => addItem('familyRelations', {relation:'', location:''})}/></div>
                        {data.familyRelations.map(item => (
                            <div key={item.id} className="flex gap-2 mb-2">
                                <input className="w-1/3 border p-1 rounded" placeholder="关系" value={item.relation} onChange={e => updateArrayItem('familyRelations', item.id, 'relation', e.target.value)}/>
                                <CountrySelect className="flex-1" value={item.location} onChange={e => updateArrayItem('familyRelations', item.id, 'location', e.target.value)}/>
                                <Trash className="w-4 h-4 text-gray-400 cursor-pointer mt-2" onClick={() => removeItem('familyRelations', item.id)}/>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex gap-4 items-center bg-gray-50 p-3 rounded">
                    <label className="flex items-center text-sm"><input type="checkbox" className="mr-2" checked={data.hasHukou || false} onChange={e => updateData('hasHukou', e.target.checked)}/> 拥有中国户籍</label>
                    <div className="h-4 w-[1px] bg-gray-300"></div>
                    <div className="flex-1 flex items-center gap-2">
                        <span className="text-sm text-gray-600">境外身份:</span>
                        {data.foreignStatuses.map(fs => (
                            <div key={fs.id} className="flex items-center bg-white border rounded px-2 py-1 text-xs">
                                <span className="mr-2">{fs.country} - {fs.type}</span>
                                <Trash className="w-3 h-3 cursor-pointer text-red-400" onClick={() => removeItem('foreignStatuses', fs.id)}/>
                            </div>
                        ))}
                        <Plus className="w-4 h-4 cursor-pointer text-blue-500" onClick={() => addItem('foreignStatuses', {country:'US', type:'PR', date:''})}/>
                    </div>
                </div>
            </div>

            {/* 3. 年度收入数据 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className={`text-md font-bold mb-4 flex items-center ${THEME_TEXT}`}>
                    <Briefcase className="w-5 h-5 mr-2" /> 3. 年度收入数据 (RMB)
                </h3>
                <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-100 px-4 py-2 font-bold text-sm text-gray-700">A. 境内收入 (Domestic Income)</div>
                    <div className="p-4 grid grid-cols-5 gap-4">
                        {['salary|工资薪金', 'labor|劳务报酬', 'author|稿酬', 'royalty|特许权', 'taxPaid|境内已纳税'].map(field => {
                            const [key, label] = field.split('|');
                            return (
                                <div key={key}>
                                    <label className="block text-xs text-gray-500 mb-1">{label}</label>
                                    <input type="number" className="w-full border p-2 rounded bg-gray-50 focus:bg-white" value={data.incomeDomestic[key]} onChange={e => updateIncomeDomestic(key, e.target.value)} />
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <div className="font-bold text-sm text-gray-700">B. 境外收入 (Foreign Income)</div>
                        <button onClick={() => addItem('incomeForeign', {country:'', salary:'', labor:'', dividend:'', taxPaid:''})} className="text-xs flex items-center text-blue-600 font-bold"><Plus className="w-4 h-4 mr-1"/> 添加国家/地区</button>
                    </div>
                    {data.incomeForeign.map((item, idx) => (
                        <div key={item.id} className="border border-orange-200 rounded-lg p-4 mb-3 relative bg-orange-50/30">
                            <div className="flex justify-between mb-3 border-b border-orange-100 pb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold bg-orange-100 text-orange-800 px-2 py-1 rounded">#{idx+1}</span>
                                    <CountrySelect value={item.country} onChange={e => updateArrayItem('incomeForeign', item.id, 'country', e.target.value)} className="border-none bg-transparent font-bold text-gray-700"/>
                                </div>
                                <Trash className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-500" onClick={() => removeItem('incomeForeign', item.id)}/>
                            </div>
                            <div className="grid grid-cols-4 gap-3">
                                {['salary|工资', 'labor|劳务', 'dividend|利息股息', 'transfer|财产转让(净)', 'rental|租金', 'taxPaid|已纳税额'].map(f => {
                                    const [k, l] = f.split('|');
                                    return (
                                        <div key={k}>
                                            <label className="block text-[10px] text-gray-500 mb-1">{l}</label>
                                            <input type="number" className="w-full border border-gray-300 p-1.5 rounded text-sm" value={item[k] || ''} onChange={e => updateArrayItem('incomeForeign', item.id, k, e.target.value)} />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. 境外账户 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-md font-bold flex items-center ${THEME_TEXT}`}>
                        <Wallet className="w-5 h-5 mr-2" /> 4. 境外金融账户信息
                    </h3>
                    <button onClick={() => addItem('foreignAccounts', {balance: {2022:'',2023:'',2024:''}, regInfo:{}})} className="text-xs flex items-center text-blue-600 font-bold"><Plus className="w-4 h-4 mr-1"/> 添加账户</button>
                </div>
                {data.foreignAccounts.map((acc, idx) => (
                    <div key={acc.id} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                            <div className="grid grid-cols-3 gap-3 w-full mr-4">
                                <div><label className="text-[10px] text-gray-500 block">机构类型</label><select className="w-full border p-1 rounded text-xs" value={acc.type} onChange={e=>updateArrayItem('foreignAccounts', acc.id, 'type', e.target.value)}>{FI_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
                                <div><label className="text-[10px] text-gray-500 block">机构名称</label><input className="w-full border p-1 rounded text-xs" value={acc.name} onChange={e=>updateArrayItem('foreignAccounts', acc.id, 'name', e.target.value)}/></div>
                                <div><label className="text-[10px] text-gray-500 block">账号</label><input className="w-full border p-1 rounded text-xs" value={acc.accountNo} onChange={e=>updateArrayItem('foreignAccounts', acc.id, 'accountNo', e.target.value)}/></div>
                            </div>
                            <Trash className="w-4 h-4 text-gray-400 cursor-pointer flex-shrink-0 mt-4" onClick={() => removeItem('foreignAccounts', acc.id)}/>
                        </div>
                        <div className="bg-white p-3 rounded border border-gray-200 mb-3 text-xs">
                            <div className="font-bold mb-2 text-gray-600">登记信息 (CRS Profile)</div>
                            <div className="grid grid-cols-4 gap-2">
                                <input placeholder="登记姓名" className="border p-1 rounded" value={acc.regInfo?.name || ''} onChange={e => {
                                    const newAcc = { ...acc, regInfo: { ...acc.regInfo, name: e.target.value } };
                                    updateArrayItem('foreignAccounts', acc.id, 'regInfo', newAcc.regInfo);
                                }}/>
                                <input placeholder="登记税务国" className="border p-1 rounded" value={acc.regInfo?.taxCountry || ''} onChange={e => {
                                    const newAcc = { ...acc, regInfo: { ...acc.regInfo, taxCountry: e.target.value } };
                                    updateArrayItem('foreignAccounts', acc.id, 'regInfo', newAcc.regInfo);
                                }}/>
                                <label className="flex items-center col-span-2 text-gray-600">
                                    <input type="checkbox" className="mr-2" checked={acc.isPassiveNFE || false} onChange={e => updateArrayItem('foreignAccounts', acc.id, 'isPassiveNFE', e.target.checked)}/>
                                    属于消极非金融机构 (Passive NFE)
                                </label>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {['2022', '2023', '2024'].map(y => (
                                <div key={y}>
                                    <label className="text-[10px] text-gray-400 block">{y} 年底余额</label>
                                    <input type="number" className="w-full border p-1 rounded text-xs" placeholder="0.00" value={acc.balance?.[y] || ''} onChange={e => {
                                        const newBalance = { ...acc.balance, [y]: e.target.value };
                                        updateArrayItem('foreignAccounts', acc.id, 'balance', newBalance);
                                    }}/>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* 5. CRS 深度扫描 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className={`text-md font-bold mb-4 flex items-center ${THEME_TEXT}`}>
                    <ShieldAlert className="w-5 h-5 mr-2" /> 5. 全球资产与 CRS 深度扫描
                </h3>
                <div className="space-y-3">
                    {[
                        {k: 'cnResidentFlag', label: '境外金融账户以中国税务居民身份登记'},
                        {k: 'largeInsurance', label: '境外购买大额保单 (具有现金价值)'},
                        {k: 'trust', label: '存在海外信托架构 (委托人/受益人)'},
                        {k: 'passiveNFE', label: '存在消极非金融机构 (如BVI壳公司)'},
                        {k: 'multiResidency', label: '在多处管辖区均被识别为税务居民'},
                        {k: 'otherRisk', label: '其他高风险事项'}
                    ].map(item => (
                        <div key={item.k} className="flex items-start p-3 border border-gray-100 rounded hover:bg-gray-50">
                            <input type="checkbox" className="mt-1 mr-3 w-4 h-4 text-orange-600 rounded" checked={data.crsScan[item.k].checked} onChange={e => updateCrsScan(item.k, 'checked', e.target.checked)} />
                            <div className="flex-1">
                                <div className="text-sm font-bold text-gray-700 mb-1">{item.label}</div>
                                {data.crsScan[item.k].checked && (
                                    <input 
                                        type="text" 
                                        className="w-full border-b border-gray-300 bg-transparent text-xs p-1 outline-none focus:border-orange-500" 
                                        placeholder="请补充备注说明..."
                                        value={data.crsScan[item.k].remark}
                                        onChange={e => updateCrsScan(item.k, 'remark', e.target.value)}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 6. 备注 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className={`text-md font-bold mb-4 flex items-center ${THEME_TEXT}`}>
                    <FileText className="w-5 h-5 mr-2" /> 6. 备注与自我评估
                </h3>
                <textarea 
                    className="w-full p-4 border border-gray-300 rounded-lg focus:border-orange-500 outline-none text-sm min-h-[100px]" 
                    placeholder="请在此处补充您的个人情况..." 
                    value={data.userComments} 
                    onChange={(e) => updateData('userComments', e.target.value)}
                ></textarea>
            </div>

            {/* 底部按钮 */}
            <div className="flex justify-end pt-4">
                <button onClick={onNext} className={`flex items-center px-8 py-3 ${THEME_BG} text-white font-bold rounded-lg shadow-lg hover:opacity-90 transform hover:scale-105 transition-all`}>
                    开始全景分析 <ChevronDown className="ml-2 w-5 h-5 rotate-[-90deg]"/>
                </button>
            </div>
        </div>
    </div>
  );
};

export default VerifyForm;