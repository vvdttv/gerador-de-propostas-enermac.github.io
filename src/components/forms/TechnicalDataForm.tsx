import { TechnicalData, LivestockComposition, OtherSubstrate } from '@/types/proposal';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  data: TechnicalData;
  onChange: (data: TechnicalData) => void;
}

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
    updated[index] = { ...updated[index], [field]: value };
    handleChange('livestockComposition', updated);
  };

  const addSubstrate = () => {
    const newSubstrate: OtherSubstrate = {
      type: '',
      volume: 0,
      unit: 'm³'
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
        <div className="space-y-2">
          <Label htmlFor="substrate">Tipo de Substrato Principal *</Label>
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
        </div>

        {/* Composição do Plantel */}
        <div className="space-y-4 p-4 bg-secondary/10 rounded-lg border">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Composição do Plantel</h3>
            <Button onClick={addLivestock} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
          
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
                    <SelectItem value="suino">Suíno</SelectItem>
                    <SelectItem value="bovino">Bovino</SelectItem>
                    <SelectItem value="aves">Aves</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Classe *</Label>
                <Input
                  value={livestock.class}
                  onChange={(e) => updateLivestock(index, 'class', e.target.value)}
                  placeholder="Ex: Terminação"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Quantidade *</Label>
                <Input
                  type="number"
                  min="0"
                  value={livestock.quantity || ''}
                  onChange={(e) => updateLivestock(index, 'quantity', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Tempo Confinamento (dias) *</Label>
                <Input
                  type="number"
                  min="0"
                  value={livestock.confinementTime || ''}
                  onChange={(e) => updateLivestock(index, 'confinementTime', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              
              <div className="flex items-end">
                <Button
                  onClick={() => removeLivestock(index)}
                  size="sm"
                  variant="destructive"
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Outros Substratos */}
        <div className="space-y-4 p-4 bg-secondary/10 rounded-lg border">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Outros Substratos</h3>
            <Button onClick={addSubstrate} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
          
          {data.otherSubstrates.map((substrate, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-background rounded border">
              <div className="space-y-2">
                <Label>Tipo *</Label>
                <Input
                  value={substrate.type}
                  onChange={(e) => updateSubstrate(index, 'type', e.target.value)}
                  placeholder="Ex: Silagem de milho"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Volume *</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  value={substrate.volume || ''}
                  onChange={(e) => updateSubstrate(index, 'volume', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Unidade *</Label>
                <Select
                  value={substrate.unit}
                  onValueChange={(value) => updateSubstrate(index, 'unit', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="m³">m³</SelectItem>
                    <SelectItem value="ton">Toneladas</SelectItem>
                    <SelectItem value="kg">Kg</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button
                  onClick={() => removeSubstrate(index)}
                  size="sm"
                  variant="destructive"
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Consumo de Energia */}
        <div className="space-y-2">
          <Label htmlFor="monthlyEnergyConsumption">Consumo Mensal de Energia (kWh) *</Label>
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
            Consumo médio mensal atual de energia elétrica
          </p>
        </div>

        {/* Rede Elétrica Trifásica */}
        <div className="space-y-2">
          <Label>Possui Rede Elétrica Trifásica? *</Label>
          <Select
            value={data.hasThreePhaseGrid ? 'sim' : 'nao'}
            onValueChange={(value) => handleChange('hasThreePhaseGrid', value === 'sim')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sim">Sim</SelectItem>
              <SelectItem value="nao">Não</SelectItem>
            </SelectContent>
          </Select>
          {!data.hasThreePhaseGrid && (
            <p className="text-sm text-amber-600">
              ⚠️ Será necessário incluir custo de adaptação da rede elétrica para trifásica
            </p>
          )}
        </div>

        {/* Distância da Entrada de Energia */}
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
            Distância em metros até o ponto de entrada de energia
          </p>
        </div>

        {/* Estado do Projeto */}
        <div className="space-y-2">
          <Label htmlFor="state">Estado (Local do Projeto) *</Label>
          <Select
            value={data.state}
            onValueChange={(value) => handleChange('state', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AC">Acre</SelectItem>
              <SelectItem value="AL">Alagoas</SelectItem>
              <SelectItem value="AP">Amapá</SelectItem>
              <SelectItem value="AM">Amazonas</SelectItem>
              <SelectItem value="BA">Bahia</SelectItem>
              <SelectItem value="CE">Ceará</SelectItem>
              <SelectItem value="DF">Distrito Federal</SelectItem>
              <SelectItem value="ES">Espírito Santo</SelectItem>
              <SelectItem value="GO">Goiás</SelectItem>
              <SelectItem value="MA">Maranhão</SelectItem>
              <SelectItem value="MT">Mato Grosso</SelectItem>
              <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
              <SelectItem value="MG">Minas Gerais</SelectItem>
              <SelectItem value="PA">Pará</SelectItem>
              <SelectItem value="PB">Paraíba</SelectItem>
              <SelectItem value="PR">Paraná</SelectItem>
              <SelectItem value="PE">Pernambuco</SelectItem>
              <SelectItem value="PI">Piauí</SelectItem>
              <SelectItem value="RJ">Rio de Janeiro</SelectItem>
              <SelectItem value="RN">Rio Grande do Norte</SelectItem>
              <SelectItem value="RS">Rio Grande do Sul</SelectItem>
              <SelectItem value="RO">Rondônia</SelectItem>
              <SelectItem value="RR">Roraima</SelectItem>
              <SelectItem value="SC">Santa Catarina</SelectItem>
              <SelectItem value="SP">São Paulo</SelectItem>
              <SelectItem value="SE">Sergipe</SelectItem>
              <SelectItem value="TO">Tocantins</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <h3 className="font-semibold mb-2 text-primary">Informação Importante</h3>
          <p className="text-sm text-muted-foreground">
            O sistema calculará automaticamente a produção de biogás, energia gerada e o dimensionamento 
            ideal do biodigestor baseado nos dados fornecidos.
          </p>
        </div>
      </div>
    </div>
  );
}
