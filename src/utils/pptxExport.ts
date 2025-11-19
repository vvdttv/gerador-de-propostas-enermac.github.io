import pptxgen from 'pptxgenjs';
import { ProposalData } from '@/types/proposal';

export async function exportToPowerPoint(data: ProposalData) {
  const pptx = new pptxgen();
  
  // Configurações de estilo
  const titleStyle = { fontSize: 24, bold: true, color: '1a472a' };
  const subtitleStyle = { fontSize: 16, bold: true, color: '2d5a3d' };
  const textStyle = { fontSize: 12, color: '000000' };
  const highlightStyle = { fontSize: 14, bold: true, color: '1a472a' };

  // Slide 1 - Capa
  const slide1 = pptx.addSlide();
  slide1.background = { color: 'f0f4f1' };
  slide1.addText('PROPOSTA COMERCIAL', { 
    x: 0.5, y: 2, w: 9, h: 1, 
    ...titleStyle, 
    fontSize: 32, 
    align: 'center' 
  });
  slide1.addText('Sistema de Geração de Energia a partir de Biogás', { 
    x: 0.5, y: 3, w: 9, h: 0.5, 
    ...subtitleStyle, 
    align: 'center' 
  });
  slide1.addText(data.client.propertyName, { 
    x: 0.5, y: 4, w: 9, h: 0.5, 
    ...textStyle, 
    fontSize: 14, 
    align: 'center' 
  });
  slide1.addText(`Data: ${data.calculations.proposalDate}`, { 
    x: 0.5, y: 5, w: 9, h: 0.5, 
    ...textStyle, 
    align: 'center' 
  });

  // Slide 2 - Dados do Cliente
  const slide2 = pptx.addSlide();
  slide2.addText('Dados do Cliente e Propriedade', { x: 0.5, y: 0.5, w: 9, h: 0.5, ...titleStyle });
  
  const clientInfo = [
    [{ text: 'Cliente:' }, { text: data.client.clientName }],
    [{ text: 'Propriedade:' }, { text: data.client.propertyName }],
    [{ text: 'Endereço:' }, { text: data.client.propertyAddress }],
    [{ text: 'Cidade/Estado:' }, { text: data.client.cityState }],
    [{ text: 'Telefone:' }, { text: data.client.phone }],
    [{ text: 'E-mail:' }, { text: data.client.email }],
  ];
  
  slide2.addTable(clientInfo, {
    x: 0.5,
    y: 1.5,
    w: 9,
    colW: [2, 7],
    border: { pt: 1, color: 'd0d0d0' },
    fill: { color: 'ffffff' },
    fontSize: 12,
  });

  // Slide 3 - Consultor Responsável
  const slide3 = pptx.addSlide();
  slide3.addText('Consultor Responsável', { x: 0.5, y: 0.5, w: 9, h: 0.5, ...titleStyle });
  
  const consultantInfo = [
    [{ text: 'Consultor:' }, { text: data.client.consultantName }],
    [{ text: 'Telefone:' }, { text: data.client.consultantPhone }],
    [{ text: 'E-mail:' }, { text: data.client.consultantEmail }],
  ];
  
  slide3.addTable(consultantInfo, {
    x: 0.5,
    y: 1.5,
    w: 9,
    colW: [2, 7],
    border: { pt: 1, color: 'd0d0d0' },
    fill: { color: 'ffffff' },
    fontSize: 12,
  });

  // Slide 4 - Rota Tecnológica
  const slide4 = pptx.addSlide();
  slide4.addText('Rota Tecnológica Escolhida', { x: 0.5, y: 0.5, w: 9, h: 0.5, ...titleStyle });
  slide4.addText(data.calculations.technologicalRoute, { 
    x: 0.5, y: 1.5, w: 9, h: 2, 
    ...textStyle, 
    valign: 'top' 
  });
  
  slide4.addText('Equipamentos:', { x: 0.5, y: 3.8, w: 9, h: 0.3, ...subtitleStyle });
  slide4.addText(`• ${data.calculations.equipmentDetails.biodigestor}`, { 
    x: 0.5, y: 4.2, w: 9, h: 0.3, 
    ...textStyle 
  });
  slide4.addText(`• ${data.calculations.equipmentDetails.generator}`, { 
    x: 0.5, y: 4.6, w: 9, h: 0.3, 
    ...textStyle 
  });

  // Slide 5 - Indicadores Técnicos
  const slide5 = pptx.addSlide();
  slide5.addText('Indicadores Técnicos', { x: 0.5, y: 0.5, w: 9, h: 0.5, ...titleStyle });
  
  const technicalData = [
    [{ text: 'Produção de Biogás:' }, { text: `${data.calculations.dailyBiogasProduction.toFixed(2)} m³/dia` }],
    [{ text: 'Produção de Energia:' }, { text: `${data.calculations.dailyEnergyProduction.toFixed(2)} kWh/dia` }],
    [{ text: 'Potência Instalada:' }, { text: `${data.calculations.installedPowerKw.toFixed(2)} kW` }],
    [{ text: 'Consumo Mensal:' }, { text: `${data.currentCosts.monthlyEnergyConsumption.toFixed(2)} kWh` }],
  ];
  
  slide5.addTable(technicalData, {
    x: 0.5,
    y: 1.5,
    w: 9,
    colW: [4, 5],
    border: { pt: 1, color: 'd0d0d0' },
    fill: { color: 'f8faf9' },
    fontSize: 14,
  });

  // Slide 6 - Investimento
  const slide6 = pptx.addSlide();
  slide6.addText('Estrutura de Investimento', { x: 0.5, y: 0.5, w: 9, h: 0.5, ...titleStyle });
  
  const investmentData = [
    [{ text: 'Investimento Base:' }, { text: `R$ ${data.calculations.investmentBreakdown.baseInvestment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` }],
    [{ text: 'Rede Trifásica:' }, { text: `R$ ${data.calculations.investmentBreakdown.threePhaseGridCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` }],
    [{ text: 'Distância da Rede:' }, { text: `R$ ${data.calculations.investmentBreakdown.gridDistanceCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` }],
    [{ text: 'INVESTIMENTO TOTAL:', bold: true }, { text: `R$ ${data.calculations.totalInvestment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, bold: true }],
  ];
  
  slide6.addTable(investmentData, {
    x: 0.5,
    y: 1.5,
    w: 9,
    colW: [4, 5],
    border: { pt: 1, color: 'd0d0d0' },
    fill: { color: 'f8faf9' },
    fontSize: 14,
  });

  // Slide 7 - Condições de Pagamento
  const slide7 = pptx.addSlide();
  slide7.addText('Condições de Pagamento', { x: 0.5, y: 0.5, w: 9, h: 0.5, ...titleStyle });
  
  const paymentData = [
    [{ text: 'Valor do Sinal:' }, { text: `R$ ${data.calculations.downPayment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` }],
    [{ text: 'Parcela Mensal:' }, { text: `R$ ${data.calculations.monthlyInstallment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` }],
    [{ text: 'Número de Parcelas:' }, { text: `${data.financial.installments}x` }],
    [{ text: 'Taxa de Juros:' }, { text: `${data.financial.monthlyInterestRate}% a.m.` }],
  ];
  
  slide7.addTable(paymentData, {
    x: 0.5,
    y: 1.5,
    w: 9,
    colW: [4, 5],
    border: { pt: 1, color: 'd0d0d0' },
    fill: { color: 'f8faf9' },
    fontSize: 14,
  });

  // Slide 8 - Viabilidade Econômica
  const slide8 = pptx.addSlide();
  slide8.addText('Viabilidade Econômica', { x: 0.5, y: 0.5, w: 9, h: 0.5, ...titleStyle });
  
  const viabilityData = [
    [{ text: 'Economia Mensal:' }, { text: `R$ ${data.calculations.monthlySavings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` }],
    [{ text: 'Receita Líquida Mensal:' }, { text: `R$ ${data.calculations.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` }],
    [{ text: 'Economia Anual:' }, { text: `R$ ${data.calculations.annualSavings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` }],
    [{ text: 'Payback:' }, { text: `${data.calculations.paybackYears.toFixed(1)} anos` }],
    [{ text: 'ROI (20 anos):' }, { text: `${data.calculations.roi20Years.toFixed(2)}%` }],
  ];
  
  slide8.addTable(viabilityData, {
    x: 0.5,
    y: 1.5,
    w: 9,
    colW: [4, 5],
    border: { pt: 1, color: 'd0d0d0' },
    fill: { color: 'f8faf9' },
    fontSize: 14,
  });

  // Slide 9 - Tributação
  const slide9 = pptx.addSlide();
  slide9.addText('Tributação', { x: 0.5, y: 0.5, w: 9, h: 0.5, ...titleStyle });
  
  const taxData = [
    [{ text: 'Taxa de Tributação:' }, { text: `${(data.calculations.taxation.energyTaxRate * 100).toFixed(0)}%` }],
    [{ text: 'Tributo Mensal:' }, { text: `R$ ${data.calculations.taxation.monthlyTax.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` }],
    [{ text: 'Tributo Anual:' }, { text: `R$ ${data.calculations.taxation.annualTax.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` }],
    [{ text: 'Estado:' }, { text: data.technical.state }],
  ];
  
  slide9.addTable(taxData, {
    x: 0.5,
    y: 1.5,
    w: 9,
    colW: [4, 5],
    border: { pt: 1, color: 'd0d0d0' },
    fill: { color: 'f8faf9' },
    fontSize: 14,
  });

  // Slide 10 - Status de Viabilidade
  const slide10 = pptx.addSlide();
  slide10.addText('Status do Projeto', { x: 0.5, y: 0.5, w: 9, h: 0.5, ...titleStyle });
  
  if (data.calculations.isViable) {
    slide10.addText('✓ PROJETO VIÁVEL', { 
      x: 0.5, y: 2, w: 9, h: 1, 
      fontSize: 28, 
      bold: true, 
      color: '22c55e', 
      align: 'center' 
    });
    slide10.addText('O projeto atende todos os critérios de viabilidade técnica e econômica.', { 
      x: 0.5, y: 3.5, w: 9, h: 1, 
      ...textStyle, 
      align: 'center' 
    });
  } else {
    slide10.addText('⚠ PROJETO INVIÁVEL NAS CONDIÇÕES ATUAIS', { 
      x: 0.5, y: 1.5, w: 9, h: 0.8, 
      fontSize: 24, 
      bold: true, 
      color: 'ef4444', 
      align: 'center' 
    });
    slide10.addText('Problemas Identificados:', { 
      x: 0.5, y: 2.8, w: 9, h: 0.4, 
      ...subtitleStyle 
    });
    
    const issuesText = data.calculations.viabilityIssues.map((issue, i) => `${i + 1}. ${issue}`).join('\n');
    slide10.addText(issuesText, { 
      x: 0.5, y: 3.3, w: 9, h: 2, 
      ...textStyle, 
      valign: 'top' 
    });
  }

  // Slide 11 - Validade
  const slide11 = pptx.addSlide();
  slide11.background = { color: 'f0f4f1' };
  slide11.addText('Validade da Proposta', { 
    x: 0.5, y: 2.5, w: 9, h: 0.5, 
    ...titleStyle, 
    align: 'center' 
  });
  slide11.addText(`Data de Emissão: ${data.calculations.proposalDate}`, { 
    x: 0.5, y: 3.5, w: 9, h: 0.4, 
    ...textStyle, 
    align: 'center' 
  });
  slide11.addText(`Validade até: ${data.calculations.validityDate}`, { 
    x: 0.5, y: 4, w: 9, h: 0.4, 
    ...textStyle, 
    align: 'center' 
  });

  // Salvar arquivo
  await pptx.writeFile({ fileName: `Proposta_${data.client.clientName.replace(/\s+/g, '_')}_${Date.now()}.pptx` });
}
