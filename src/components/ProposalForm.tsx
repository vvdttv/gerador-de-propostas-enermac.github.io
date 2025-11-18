import { useState } from 'react';
import { ClientData, TechnicalData, CurrentCosts, FinancialConfig } from '@/types/proposal';
import { ClientDataForm } from './forms/ClientDataForm';
import { TechnicalDataForm } from './forms/TechnicalDataForm';
import { CurrentCostsForm } from './forms/CurrentCostsForm';
import { FinancialConfigForm } from './forms/FinancialConfigForm';
import { ProposalPreview } from './ProposalPreview';
import { Button } from './ui/button';
import { calculateProposal } from '@/utils/proposalCalculations';
import enermacLogo from '@/assets/enermac-logo.png';

export function ProposalForm() {
  const [step, setStep] = useState(1);
  const [clientData, setClientData] = useState<ClientData>({
    clientName: '',
    propertyName: '',
    propertyAddress: '',
    cityState: '',
    phone: '',
    email: ''
  });
  const [technicalData, setTechnicalData] = useState<TechnicalData>({
    livestockComposition: [],
    otherSubstrates: [],
    hasThreePhaseGrid: true,
    gridDistance: 0,
    state: ''
  });
  const [currentCosts, setCurrentCosts] = useState<CurrentCosts>({
    energyCostKwh: 0.79,
    monthlyEnergyConsumption: 0
  });
  const [financialConfig, setFinancialConfig] = useState<FinancialConfig>({
    paymentMethod: 'financing',
    downPaymentPercentage: 20,
    installments: 120,
    monthlyInterestRate: 1.04,
    interestType: 'compound'
  });

  const calculations = calculateProposal(technicalData, currentCosts, financialConfig);

  const totalSteps = 5;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <img src={enermacLogo} alt="Enermac" className="h-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-primary mb-2">Enermac</h1>
          <p className="text-muted-foreground">Gerador de Propostas - Bioenergia</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8 no-print">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    s <= step
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-muted-foreground border-border'
                  }`}
                >
                  {s}
                </div>
              ))}
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Form Steps */}
          <div className="bg-card rounded-lg shadow-lg p-6 md:p-8 mb-6">
            {step === 1 && (
              <ClientDataForm data={clientData} onChange={setClientData} />
            )}
            {step === 2 && (
              <TechnicalDataForm data={technicalData} onChange={setTechnicalData} />
            )}
            {step === 3 && (
              <CurrentCostsForm data={currentCosts} onChange={setCurrentCosts} />
            )}
            {step === 4 && (
              <FinancialConfigForm data={financialConfig} onChange={setFinancialConfig} />
            )}
            {step === 5 && (
              <ProposalPreview
                client={clientData}
                technical={technicalData}
                currentCosts={currentCosts}
                financial={financialConfig}
                calculations={calculations}
              />
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between no-print">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={step === 1}
            >
              Anterior
            </Button>
            {step < totalSteps ? (
              <Button onClick={handleNext}>
                Próxima Etapa
              </Button>
            ) : (
              <Button onClick={() => window.print()}>
                Imprimir Proposta
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
