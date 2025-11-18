import { FinancialConfig } from '@/types/proposal';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface Props {
  data: FinancialConfig;
  onChange: (data: FinancialConfig) => void;
}

export function FinancialConfigForm({ data, onChange }: Props) {
  const handleChange = (field: keyof FinancialConfig, value: string | number) => {
    onChange({ ...data, [field]: value });
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
            onValueChange={(value: 'financing' | 'direct') => {
              handleChange('paymentMethod', value);
              // Ajustar taxa de juros automaticamente
              if (value === 'financing') {
                handleChange('interestRate', 13.1);
                handleChange('installments', 120);
              } else {
                handleChange('interestRate', 6.0);
                handleChange('installments', 60);
              }
            }}
          >
            <div className="flex flex-col space-y-3">
              <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                <RadioGroupItem value="financing" id="financing" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="financing" className="font-semibold cursor-pointer">
                    Financiamento Bancário
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Financiamento tradicional com taxa de 13.1% a.a. - Prazo de até 120 meses
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
                    Condições especiais da Enermac com taxa reduzida de 6.0% a.a. - Prazo de até 60 meses
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
              ? 'Máximo de 120 parcelas (10 anos)' 
              : 'Máximo de 60 parcelas (5 anos)'}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="interestRate">Taxa de Juros Anual (%) *</Label>
          <Input
            id="interestRate"
            type="number"
            min="0"
            step="0.1"
            value={data.interestRate || ''}
            onChange={(e) => handleChange('interestRate', parseFloat(e.target.value) || 0)}
            placeholder="Ex: 13.1"
            required
          />
          <p className="text-sm text-muted-foreground">
            Taxa de juros anual aplicada ao financiamento
          </p>
        </div>
      </div>
    </div>
  );
}
