import { TechnicalData } from '@/types/proposal';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  data: TechnicalData;
  onChange: (data: TechnicalData) => void;
}

export function TechnicalDataForm({ data, onChange }: Props) {
  const handleChange = (field: keyof TechnicalData, value: string | number) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Análise Técnica</h2>
        <p className="text-muted-foreground">Dados técnicos para dimensionamento do sistema</p>
      </div>

      <div className="grid gap-6">
        <div className="space-y-2">
          <Label htmlFor="substrate">Tipo de Substrato *</Label>
          <Select
            value={data.substrate}
            onValueChange={(value) => handleChange('substrate', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de substrato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="suino">Suíno (Dejetos)</SelectItem>
              <SelectItem value="bovino">Bovino (Matriz UPD)</SelectItem>
              <SelectItem value="rso">RSO (Resíduos Sólidos Orgânicos)</SelectItem>
              <SelectItem value="aves">Aves (Cama de Frango)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Selecione o principal tipo de resíduo orgânico disponível
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="volume">Volume Diário (m³/dia ou unidades) *</Label>
          <Input
            id="volume"
            type="number"
            min="0"
            step="0.1"
            value={data.volume || ''}
            onChange={(e) => handleChange('volume', parseFloat(e.target.value) || 0)}
            placeholder="Ex: 1000"
            required
          />
          <p className="text-sm text-muted-foreground">
            Para suínos: número de cabeças | Para RSO: toneladas/dia | Para bovinos: m³/dia
          </p>
        </div>

        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <h3 className="font-semibold mb-2 text-primary">Informação Importante</h3>
          <p className="text-sm text-muted-foreground">
            O sistema calculará automaticamente a produção de biogás, energia gerada e o dimensionamento 
            ideal do biodigestor baseado no tipo de substrato selecionado.
          </p>
        </div>
      </div>
    </div>
  );
}
