import { CurrentCosts } from '@/types/proposal';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface Props {
  data: CurrentCosts;
  onChange: (data: CurrentCosts) => void;
}

export function CurrentCostsForm({ data, onChange }: Props) {
  const handleChange = (field: keyof CurrentCosts, value: number) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Custos Atuais</h2>
        <p className="text-muted-foreground">Gastos mensais do cliente com energia</p>
      </div>

      <div className="grid gap-6">
        <div className="space-y-4 p-4 bg-secondary/30 rounded-lg border">
          <h3 className="font-semibold text-lg">Energia Elétrica</h3>
          
          <div className="space-y-2">
            <Label htmlFor="energyCostKwh">Custo do kWh (R$) *</Label>
            <Input
              id="energyCostKwh"
              type="number"
              min="0"
              step="0.01"
              value={data.energyCostKwh || ''}
              onChange={(e) => handleChange('energyCostKwh', parseFloat(e.target.value) || 0)}
              placeholder="Ex: 0.79"
              required
            />
            <p className="text-sm text-muted-foreground">
              Valor médio do kWh pago atualmente
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyEnergyConsumption">Consumo Mensal (kWh) *</Label>
            <Input
              id="monthlyEnergyConsumption"
              type="number"
              min="0"
              step="1"
              value={data.monthlyEnergyConsumption || ''}
              onChange={(e) => handleChange('monthlyEnergyConsumption', parseFloat(e.target.value) || 0)}
              placeholder="Ex: 5000"
              required
            />
            <p className="text-sm text-muted-foreground">
              Consumo médio mensal de energia elétrica
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
