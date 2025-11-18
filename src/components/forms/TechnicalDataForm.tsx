import { TechnicalData, LivestockComposition, OtherSubstrate } from '@/types/proposal';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Props {
  data: TechnicalData;
  onChange: (data: TechnicalData) => void;
}

const LIVESTOCK_TYPES = {
  'Suíno': ['Crechário (Lâmina d\'água)', 'Terminação/Maraã'],
  'Bovino': ['Matriz UPD', 'Terminação Confinamento'],
  'Aves': ['Poedeira', 'Frango de Corte']
};

const OTHER_SUBSTRATES = ['RSO', 'RSU'];

export function TechnicalDataForm({ data, onChange }: Props) {
  const handleChange = (field: keyof TechnicalData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const addLivestock = () => {
    const newLivestock: LivestockComposition = {
      type: '',
      class: '',
      quantity: 0,
      confinementTime: 0
    };
    handleChange('livestockComposition', [...data.livestockComposition, newLivestock]);
  };

  const removeLivestock = (index: number) => {
    const updated = data.livestockComposition.filter((_, i) => i !== index);
    handleChange('livestockComposition', updated);
  };

  const updateLivestock = (index: number, field: keyof LivestockComposition, value: any) => {
    const updated = [...data.livestockComposition];
    if (field === 'type') {
      updated[index] = { ...updated[index], type: value, class: '' };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    handleChange('livestockComposition', updated);
  };

  const addSubstrate = () => {
    const newSubstrate: OtherSubstrate = {
      type: '',
      volume: 0,
      unit: 't/dia'
    };
    handleChange('otherSubstrates', [...data.otherSubstrates, newSubstrate]);
  };

  const removeSubstrate = (index: number) => {
    const updated = data.otherSubstrates.filter((_, i) => i !== index);
    handleChange('otherSubstrates', updated);
  };

  const updateSubstrate = (index: number, field: keyof OtherSubstrate, value: any) => {
    const updated = [...data.otherSubstrates];
    updated[index] = { ...updated[index], [field]: value };
    handleChange('otherSubstrates', updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Análise Técnica</h2>
        <p className="text-muted-foreground">Dados técnicos para dimensionamento do sistema</p>
      </div>

      <div className="grid gap-6">
        <div className="space-y-4 p-4 bg-secondary/10 rounded-lg border">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Composição do Plantel</h3>
            <Button onClick={addLivestock} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
          
          {data.livestockComposition.length === 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Adicione pelo menos uma composição de plantel para dimensionar o sistema.
              </AlertDescription>
            </Alert>
          )}
          
          {data.livestockComposition.map((livestock, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-background rounded border">
              <div className="space-y-2">
                <Label>Tipo *</Label>
                <Select
                  value={livestock.type}
                  onValueChange={(value) => updateLivestock(index, 'type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(LIVESTOCK_TYPES).map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Classe *</Label>
                <Select
                  value={livestock.class}
                  onValueChange={(value) => updateLivestock(index, 'class', value)}
                  disabled={!livestock.type}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Classe" />
                  </SelectTrigger>
                  <SelectContent>
                    {livestock.type && LIVESTOCK_TYPES[livestock.type as keyof typeof LIVESTOCK_TYPES]?.map((cls) => (
                      <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Quantidade *</Label>
                <Input
                  type="number"
                  min="0"
                  value={livestock.quantity || ''}
                  onChange={(e) => updateLivestock(index, 'quantity', parseInt(e.target.value) || 0)}
                  placeholder="Ex: 100"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Tempo Confinamento (h) *</Label>
                <Input
                  type="number"
                  min="0"
                  max="24"
                  step="0.1"
                  value={livestock.confinementTime || ''}
                  onChange={(e) => updateLivestock(index, 'confinementTime', parseFloat(e.target.value) || 0)}
                  placeholder="Ex: 18"
                />
              </div>
              
              <div className="flex items-end">
                <Button
                  onClick={() => removeLivestock(index)}
                  variant="destructive"
                  size="sm"
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4 p-4 bg-secondary/10 rounded-lg border">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Outros Substratos</h3>
            <Button onClick={addSubstrate} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
          
          {data.otherSubstrates.map((substrate, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-background rounded border">
              <div className="space-y-2">
                <Label>Tipo *</Label>
                <Select
                  value={substrate.type}
                  onValueChange={(value) => updateSubstrate(index, 'type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de substrato" />
                  </SelectTrigger>
                  <SelectContent>
                    {OTHER_SUBSTRATES.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Peso Gerado por Dia (t/dia) *</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={substrate.volume || ''}
                  onChange={(e) => updateSubstrate(index, 'volume', parseFloat(e.target.value) || 0)}
                  placeholder="Ex: 2.5"
                />
              </div>
              
              <div className="flex items-end">
                <Button
                  onClick={() => removeSubstrate(index)}
                  variant="destructive"
                  size="sm"
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4 p-4 bg-secondary/10 rounded-lg border">
          <h3 className="font-semibold text-lg">Infraestrutura Elétrica</h3>
          
          <div className="space-y-3">
            <Label>Possui rede elétrica trifásica? *</Label>
            <RadioGroup
              value={data.hasThreePhaseGrid ? 'sim' : 'nao'}
              onValueChange={(value) => handleChange('hasThreePhaseGrid', value === 'sim')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sim" id="sim" />
                <Label htmlFor="sim" className="font-normal cursor-pointer">Sim</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nao" id="nao" />
                <Label htmlFor="nao" className="font-normal cursor-pointer">Não</Label>
              </div>
            </RadioGroup>
            
            {!data.hasThreePhaseGrid && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Será necessário adaptar a rede elétrica. Custo estimado: R$ 20.000,00
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gridDistance">Distância da Entrada de Energia (metros) *</Label>
            <Input
              id="gridDistance"
              type="number"
              min="0"
              step="1"
              value={data.gridDistance || ''}
              onChange={(e) => handleChange('gridDistance', parseFloat(e.target.value) || 0)}
              placeholder="Ex: 50"
              required
            />
            <p className="text-sm text-muted-foreground">
              Distância em metros da propriedade até a entrada de energia (R$ 500,00 por metro)
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">Estado (Local do Projeto) *</Label>
          <Input
            id="state"
            type="text"
            value={data.state || ''}
            onChange={(e) => handleChange('state', e.target.value)}
            placeholder="Ex: São Paulo"
            required
          />
          <p className="text-sm text-muted-foreground">
            Estado onde o projeto será implementado
          </p>
        </div>
      </div>
    </div>
  );
}
