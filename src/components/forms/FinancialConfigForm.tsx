import { FinancialConfig } from '@/types/proposal';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  data: FinancialConfig;
  onChange: (data: FinancialConfig) => void;
}

export function FinancialConfigForm({ data, onChange }: Props) {
  const handleChange = (field: keyof FinancialConfig, value: string | number) => {
    onChange({ ...data, [field]: value });
  };

  const handlePaymentMethodChange = (value: 'financing' | 'direct') => {
    if (value === 'financing') {
      onChange({
        ...data,
        paymentMethod: value,
        monthlyInterestRate: 1.04,
        installments: 120,
        interestType: 'compound'
      });
    } else {
      onChange({
        ...data,
        paymentMethod: value,
        monthlyInterestRate: 0.49,
        installments: 60,
        interestType: 'simple'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Configuração Financeira</h2>
        <p className="text-muted-foreground">Defina as condições de pagamento</p>
      </div>

      <div className="grid gap-6">
        <div className="space-y-3">
          <Label>Forma de Pagamento *</Label>
          <RadioGroup
            value={data.paymentMethod}
            onValueChange={handlePaymentMethodChange}
          >
            <div className="flex flex-col space-y-3">
              <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                <RadioGroupItem value="financing" id="financing" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="financing" className="font-semibold cursor-pointer">
                    Financiamento Bancário
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Financiamento tradicional com juros compostos - Prazo de até 120 meses
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                <RadioGroupItem value="direct" id="direct" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="direct" className="font-semibold cursor-pointer">
                    Direto com Enermac
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Condições especiais da Enermac com taxa reduzida - Prazo de até 60 meses
                  </p>
                </div>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="downPaymentPercentage">Percentual de Entrada (%) *</Label>
          <Input
            id="downPaymentPercentage"
            type="number"
            min="0"
            max="100"
            step="1"
            value={data.downPaymentPercentage || ''}
            onChange={(e) => handleChange('downPaymentPercentage', parseFloat(e.target.value) || 0)}
            placeholder="Ex: 20"
            required
          />
          <p className="text-sm text-muted-foreground">
            Percentual do investimento total pago como entrada
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="installments">Número de Parcelas *</Label>
          <Input
            id="installments"
            type="number"
            min="1"
            max={data.paymentMethod === 'financing' ? 120 : 60}
            step="1"
            value={data.installments || ''}
            onChange={(e) => handleChange('installments', parseInt(e.target.value) || 0)}
            placeholder={data.paymentMethod === 'financing' ? 'Ex: 120' : 'Ex: 60'}
            required
          />
          <p className="text-sm text-muted-foreground">
            {data.paymentMethod === 'financing' 
              ? 'Máximo de 120 parcelas para financiamento bancário' 
              : 'Máximo de 60 parcelas para pagamento direto com Enermac'}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="monthlyInterestRate">Taxa de Juros Mensal (%) *</Label>
          <Input
            id="monthlyInterestRate"
            type="number"
            min="0"
            step="0.01"
            value={data.monthlyInterestRate || ''}
            onChange={(e) => handleChange('monthlyInterestRate', parseFloat(e.target.value) || 0)}
            placeholder="Ex: 1.04"
            required
          />
          <p className="text-sm text-muted-foreground">
            Taxa de juros mensal aplicada ao financiamento
          </p>
        </div>

        {data.paymentMethod === 'direct' && (
          <div className="space-y-2">
            <Label htmlFor="interestType">Tipo de Juros *</Label>
            <Select
              value={data.interestType}
              onValueChange={(value: 'simple' | 'compound') => handleChange('interestType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de juros" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simple">Juros Simples</SelectItem>
                <SelectItem value="compound">Juros Compostos</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Para pagamento direto, escolha entre juros simples ou compostos
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
