import { z } from 'zod';

export const clientDataSchema = z.object({
  clientName: z.string().trim().min(1, 'Nome do cliente é obrigatório').max(200, 'Nome muito longo'),
  propertyName: z.string().trim().min(1, 'Nome da propriedade é obrigatório').max(200, 'Nome muito longo'),
  propertyAddress: z.string().trim().min(1, 'Endereço é obrigatório').max(300, 'Endereço muito longo'),
  cityState: z.string().trim().min(1, 'Cidade/Estado é obrigatório').max(150, 'Cidade/Estado muito longo'),
  phone: z.string().trim().min(1, 'Telefone é obrigatório').max(20, 'Telefone muito longo'),
  email: z.string().trim().email('Email inválido').max(255, 'Email muito longo'),
  consultantName: z.string().trim().min(1, 'Nome do consultor é obrigatório').max(200, 'Nome muito longo'),
  consultantPhone: z.string().trim().min(1, 'Telefone do consultor é obrigatório').max(20, 'Telefone muito longo'),
  consultantEmail: z.string().trim().email('Email do consultor inválido').max(255, 'Email muito longo')
});

export const livestockCompositionSchema = z.object({
  type: z.string().min(1, 'Tipo é obrigatório'),
  class: z.string().min(1, 'Classe é obrigatória'),
  quantity: z.number().int().min(1, 'Quantidade deve ser pelo menos 1').max(1000000, 'Quantidade muito alta'),
  confinementTime: z.number().int().min(0, 'Tempo de confinamento não pode ser negativo').max(365, 'Tempo de confinamento muito alto')
});

export const otherSubstrateSchema = z.object({
  type: z.string().min(1, 'Tipo é obrigatório'),
  volume: z.number().min(0, 'Volume não pode ser negativo').max(1000000, 'Volume muito alto'),
  unit: z.string().min(1, 'Unidade é obrigatória')
});

export const technicalDataSchema = z.object({
  livestockComposition: z.array(livestockCompositionSchema).max(50, 'Muitos itens na composição'),
  otherSubstrates: z.array(otherSubstrateSchema).max(50, 'Muitos substratos'),
  hasThreePhaseGrid: z.boolean(),
  gridDistance: z.number().min(0, 'Distância não pode ser negativa').max(10000, 'Distância muito alta'),
  state: z.string().min(2, 'Estado é obrigatório').max(2, 'Estado deve ter 2 caracteres')
});

export const currentCostsSchema = z.object({
  energyCostKwh: z.number().min(0, 'Custo não pode ser negativo').max(10, 'Custo muito alto'),
  monthlyEnergyConsumption: z.number().min(0, 'Consumo não pode ser negativo').max(1000000, 'Consumo muito alto')
});

export const financialConfigSchema = z.object({
  paymentMethod: z.enum(['financing', 'direct'], { errorMap: () => ({ message: 'Método de pagamento inválido' }) }),
  downPaymentPercentage: z.number().min(0, 'Porcentagem não pode ser negativa').max(100, 'Porcentagem não pode exceder 100'),
  installments: z.number().int().min(1, 'Deve ter pelo menos 1 parcela').max(360, 'Muitas parcelas'),
  monthlyInterestRate: z.number().min(0, 'Taxa não pode ser negativa').max(100, 'Taxa muito alta'),
  interestType: z.enum(['simple', 'compound'], { errorMap: () => ({ message: 'Tipo de juros inválido' }) })
});

export const proposalNameSchema = z.string()
  .trim()
  .min(1, 'Nome da proposta é obrigatório')
  .max(200, 'Nome da proposta muito longo');
