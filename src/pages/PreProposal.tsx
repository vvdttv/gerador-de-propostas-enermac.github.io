import { useState } from 'react';
import { PreProposalForm } from '@/components/PreProposalForm';
import { PreProposalResultView } from '@/components/PreProposalResult';
import type { PreProposalInput, PreProposalResult } from '@/types/preProposal';
import { calculatePreProposal } from '@/utils/preProposalCalculations';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PreProposalPage = () => {
  const [result, setResult] = useState<PreProposalResult | null>(null);
  const [input, setInput] = useState<PreProposalInput | null>(null);

  const handleCalculate = (data: PreProposalInput) => {
    setInput(data);
    const calculationResult = calculatePreProposal(data);
    setResult(calculationResult);
  };

  const handleBack = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {/* Navigation */}
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar para Proposta Completa
            </Button>
          </Link>
        </div>

        {result && input ? (
          <PreProposalResultView result={result} input={input} onBack={handleBack} />
        ) : (
          <div className="max-w-3xl mx-auto">
            <PreProposalForm onCalculate={handleCalculate} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PreProposalPage;
