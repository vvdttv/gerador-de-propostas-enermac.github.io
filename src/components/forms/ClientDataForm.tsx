import { ClientData } from '@/types/proposal';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

interface Props {
  data: ClientData;
  onChange: (data: ClientData) => void;
}

export function ClientDataForm({ data, onChange }: Props) {
  const handleChange = (field: keyof ClientData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Dados do Cliente</h2>
        <p className="text-muted-foreground">Informações básicas do cliente e propriedade</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="clientName">Nome do Cliente *</Label>
          <Input
            id="clientName"
            value={data.clientName}
            onChange={(e) => handleChange('clientName', e.target.value)}
            placeholder="Nome completo"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="propertyName">Nome da Propriedade *</Label>
          <Input
            id="propertyName"
            value={data.propertyName}
            onChange={(e) => handleChange('propertyName', e.target.value)}
            placeholder="Nome da fazenda/propriedade"
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="propertyAddress">Endereço da Propriedade *</Label>
          <Input
            id="propertyAddress"
            value={data.propertyAddress}
            onChange={(e) => handleChange('propertyAddress', e.target.value)}
            placeholder="Rua, número, bairro"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cityState">Cidade/Estado *</Label>
          <Input
            id="cityState"
            value={data.cityState}
            onChange={(e) => handleChange('cityState', e.target.value)}
            placeholder="Cidade - UF"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone *</Label>
          <Input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="(00) 00000-0000"
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="email">E-mail *</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="email@exemplo.com"
            required
          />
        </div>
      </div>

      <Separator className="my-6" />

      <div>
        <h3 className="text-xl font-semibold mb-4">Dados do Consultor</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="consultantName">Nome do Consultor *</Label>
            <Input
              id="consultantName"
              value={data.consultantName}
              onChange={(e) => handleChange('consultantName', e.target.value)}
              placeholder="Nome completo do consultor"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="consultantPhone">Telefone do Consultor *</Label>
            <Input
              id="consultantPhone"
              type="tel"
              value={data.consultantPhone}
              onChange={(e) => handleChange('consultantPhone', e.target.value)}
              placeholder="(00) 00000-0000"
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="consultantEmail">E-mail do Consultor *</Label>
            <Input
              id="consultantEmail"
              type="email"
              value={data.consultantEmail}
              onChange={(e) => handleChange('consultantEmail', e.target.value)}
              placeholder="consultor@enermac.com"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
}
