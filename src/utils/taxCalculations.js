// src/utils/taxCalculations.js

export const calculateIIT = (data) => {
    // 1. 数据清洗与归一化
    const salary = Number(data.salary) || 0;
    const labor = Number(data.labor) || 0;
    const author = Number(data.author) || 0;
    const royalty = Number(data.royalty) || 0;
    
    // 分类所得 (Flat Rate 20%)
    const interest = Number(data.interest) || 0;
    const dividend = Number(data.dividend) || 0;
    const propIncome = Number(data.propertyTransferIncome) || 0;
    const propCost = Number(data.propertyTransferCost) || 0;
    const otherClassified = Number(data.otherIncome) || 0; // 旧字段兼容
  
    const taxPaid = Number(data.taxPaid) || 0; // 境外已纳税额
  
    // 2. 综合所得计算 (Comprehensive Income)
    // 规则：
    // - 工资：全额计入
    // - 劳务：收入 * (1 - 20%)
    // - 稿酬：收入 * (1 - 20%) * 70%
    // - 特许权：收入 * (1 - 20%)
    const salaryTaxable = salary;
    const laborTaxable = labor * 0.8;
    const authorTaxable = author * 0.8 * 0.7;
    const royaltyTaxable = royalty * 0.8;
    
    const totalComprehensiveIncome = salaryTaxable + laborTaxable + authorTaxable + royaltyTaxable;
  
    // 3. 扣除项目 (Deductions)
    const standardDeduction = 60000; // 基本减除费用
    // 模拟专项扣除 (社保公积金) - 假设为工资的 15% (封顶演示)
    const socialSecurity = Math.min(salary * 0.15, 60000); 
    // 模拟专项附加扣除 (子女/老人/房贷) - 假设一个中产家庭的平均值，或者演示用 0
    // 如果想要演示效果好，可以给个默认值 24000 (2个老人 or 1个孩子+房贷)
    const specialAdditionalDeduction = 24000; 
  
    let taxableComprehensive = totalComprehensiveIncome - standardDeduction - socialSecurity - specialAdditionalDeduction;
    if (taxableComprehensive < 0) taxableComprehensive = 0;
  
    // 4. 综合所得税额计算 (7级累进税率)
    let compTaxRate = 0;
    let quickDeduction = 0;
    let compTaxAmount = 0;
  
    if (taxableComprehensive <= 36000) { compTaxRate = 0.03; quickDeduction = 0; }
    else if (taxableComprehensive <= 144000) { compTaxRate = 0.10; quickDeduction = 2520; }
    else if (taxableComprehensive <= 300000) { compTaxRate = 0.20; quickDeduction = 16920; }
    else if (taxableComprehensive <= 420000) { compTaxRate = 0.25; quickDeduction = 31920; }
    else if (taxableComprehensive <= 660000) { compTaxRate = 0.30; quickDeduction = 52920; }
    else if (taxableComprehensive <= 960000) { compTaxRate = 0.35; quickDeduction = 85920; }
    else { compTaxRate = 0.45; quickDeduction = 181920; }
  
    compTaxAmount = taxableComprehensive * compTaxRate - quickDeduction;
  
    // 5. 分类所得计算 (Classified Income) - 税率 20%
    const propTaxable = Math.max(0, propIncome - propCost); // 财产转让要减成本
    const totalClassifiedIncome = interest + dividend + propTaxable + otherClassified;
    const classifiedTaxAmount = totalClassifiedIncome * 0.20;
  
    // 6. 汇总与抵免
    const totalTaxLiability = compTaxAmount + classifiedTaxAmount;
    
    // 境外税收抵免逻辑 (简化版：假设境外税款可以全额抵扣，但不能超过限额)
    // 实际业务中需要按国别计算抵免限额，这里做 Demo 简化：
    // 如果 已纳税额 > 应纳税额，则补税为0，结转下年；否则补差额。
    // 但为了演示效果，通常假设境外税率较低，需要补税；或者境外较高，不用补。
    
    // 我们假设 taxDeductible 为真才抵扣
    const allowableCredit = data.taxDeductible ? taxPaid : 0;
    
    // 最终应补税额 (不能小于0)
    const finalTaxDue = Math.max(0, totalTaxLiability - allowableCredit);
  
    return {
      // 综合所得详情
      salaryTaxable,
      laborTaxable,
      authorTaxable,
      royaltyTaxable,
      totalComprehensiveIncome,
      standardDeduction,
      socialSecurity,
      specialAdditionalDeduction,
      taxableComprehensive,
      compTaxRate: (compTaxRate * 100).toFixed(0),
      quickDeduction,
      compTaxAmount,
  
      // 分类所得详情
      propTaxable,
      totalClassifiedIncome,
      classifiedTaxAmount,
  
      // 总计
      totalTaxLiability,
      allowableCredit,
      finalTaxDue
    };
  };