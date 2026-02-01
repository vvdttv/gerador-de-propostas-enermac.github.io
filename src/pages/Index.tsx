import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, FileText, Zap, Clock } from 'lucide-react';
import enermacLogo from '@/assets/enermac-logo.png';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <img src={enermacLogo} alt="Enermac" className="h-20 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-primary mb-2">Enermac</h1>
          <p className="text-lg text-muted-foreground">
            Sistema de Geração de Propostas para Biodigestores
          </p>
        </div>

        {/* Options Grid */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Pré-Proposta Card */}
          <Link to="/pre-proposta" className="block">
            <Card className="h-full hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer group">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Calculator className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Pré-Proposta</CardTitle>
                <CardDescription className="text-base">
                  Simulador rápido de investimento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    Estimativa rápida de investimento
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Preenchimento em poucos minutos
                  </li>
                  <li className="flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-primary" />
                    Projeção de TIR, VPL e ROI
                  </li>
                </ul>
                <Button className="w-full mt-4" variant="outline">
                  Iniciar Simulação
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Proposta Técnica Card */}
          <Link to="/proposta" className="block">
            <Card className="h-full hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer group">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Proposta Técnica</CardTitle>
                <CardDescription className="text-base">
                  Proposta completa e detalhada
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Dimensionamento técnico completo
                  </li>
                  <li className="flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-primary" />
                    Análise financeira detalhada
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    Exportação PDF e PowerPoint
                  </li>
                </ul>
                <Button className="w-full mt-4">
                  Criar Proposta
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
