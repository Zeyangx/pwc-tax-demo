// src/utils/taxCalculations.js

export const calculateIIT = (data) => {
    // --- 1. 数据提取 (适配新结构) ---
    
    // A. 境内综合所得
    const domSalary = Number(data.incomeDomestic?.salary) || 0;
    const domLabor = Number(data.incomeDomestic?.labor) || 0;
    const domAuthor = Number(data.incomeDomestic?.author) || 0;
    const domRoyalty = Number(data.incomeDomestic?.royalty) || 0;

    // B. 境外综合所得 (需要遍历 incomeForeign 数组累加)
    let forSalary = 0, forLabor = 0, forAuthor = 0, forRoyalty = 0;
    let forClassified = 0; // 境外分类所得总和 (利息/股息/财产转让等)
    let totalTaxPaidForeign = 0; // 境外已纳税额总和

    if (data.incomeForeign && Array.isArray(data.incomeForeign)) {
        data.incomeForeign.forEach(item => {
            forSalary += Number(item.salary) || 0;
            forLabor += Number(item.labor) || 0;
            forAuthor += Number(item.author) || 0;
            forRoyalty += Number(item.royalty) || 0;
            
            // 累加境外分类所得 (利息+股息+租金+财产转让)
            forClassified += (Number(item.dividend) || 0); 
            forClassified += (Number(item.rental) || 0);
            forClassified += (Number(item.incidental) || 0);
            forClassified += (Number(item.transfer) || 0); // 假设填的是净额
            
            totalTaxPaidForeign += Number(item.taxPaid) || 0;
        });
    }

    // C. 汇总综合所得 (境内 + 境外)
    const totalSalary = domSalary + forSalary;
    const totalLabor = domLabor + forLabor;
    const totalAuthor = domAuthor + forAuthor;
    const totalRoyalty = domRoyalty + forRoyalty;

    // --- 2. 应纳税额计算 ---
    
    // 综合所得应纳税所得额
    const laborTaxable = totalLabor * 0.8;
    const authorTaxable = totalAuthor * 0.8 * 0.7;
    const royaltyTaxable = totalRoyalty * 0.8;
    
    const totalComprehensiveIncome = totalSalary + laborTaxable + authorTaxable + royaltyTaxable;
  
    // 扣除项目
    const standardDeduction = 60000; 
    // 假设社保为境内工资的 15%
    const socialSecurity = Math.min(domSalary * 0.15, 60000); 
    const specialAdditionalDeduction = 36000; // 提高一点 Demo 额度
  
    let taxableComprehensive = totalComprehensiveIncome - standardDeduction - socialSecurity - specialAdditionalDeduction;
    if (taxableComprehensive < 0) taxableComprehensive = 0;
  
    // 税率计算 (7级)
    let compTaxRate = 0;
    let quickDeduction = 0;
    if (taxableComprehensive <= 36000) { compTaxRate = 0.03; quickDeduction = 0; }
    else if (taxableComprehensive <= 144000) { compTaxRate = 0.10; quickDeduction = 2520; }
    else if (taxableComprehensive <= 300000) { compTaxRate = 0.20; quickDeduction = 16920; }
    else if (taxableComprehensive <= 420000) { compTaxRate = 0.25; quickDeduction = 31920; }
    else if (taxableComprehensive <= 660000) { compTaxRate = 0.30; quickDeduction = 52920; }
    else if (taxableComprehensive <= 960000) { compTaxRate = 0.35; quickDeduction = 85920; }
    else { compTaxRate = 0.45; quickDeduction = 181920; }
  
    const compTaxAmount = taxableComprehensive * compTaxRate - quickDeduction;
  
    // --- 3. 分类所得计算 ---
    // 简单处理：境外分类所得按 20% 税率测算
    // 注意：这里没有包含境内的分类所得字段（因为Step 1表单里目前只放了综合所得在境内部分，如果需要可以扩展）
    const classifiedTaxAmount = forClassified * 0.20;
  
    // --- 4. 汇总与抵免 ---
    const totalTaxLiability = compTaxAmount + classifiedTaxAmount;
    
    // 抵免逻辑：取 "境外实际缴纳" 和 "抵免限额" 的较小值
    // 这里简化：假设全部可抵免
    const allowableCredit = totalTaxPaidForeign; 
    
    // 境内已预缴 (Step 1 填的)
    const domesticPrepaid = Number(data.incomeDomestic?.taxPaid) || 0;

    const finalTaxDue = Math.max(0, totalTaxLiability - allowableCredit - domesticPrepaid);
  
    return {
      salary: totalSalary,
      labor: totalLabor,
      author: totalAuthor,
      royalty: totalRoyalty,
      
      salaryTaxable: totalSalary,
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
  
      forClassified, // 境外分类收入总额
      classifiedTaxAmount,
  
      totalTaxLiability,
      allowableCredit, // 境外抵免
      domesticPrepaid, // 境内已缴
      finalTaxDue
    };
};