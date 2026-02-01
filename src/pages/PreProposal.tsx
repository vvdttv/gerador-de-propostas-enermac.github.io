import { useState } from 'react';
import { PreProposalForm } from '@/components/PreProposalForm';
import { PreProposalResultView } from '@/components/PreProposalResult';
import { PreProposalResultSimple } from '@/components/PreProposalResultSimple';
import type { PreProposalInput, PreProposalResult } from '@/types/preProposal';
import { calculatePreProposal } from '@/utils/preProposalCalculations';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PreProposalPage = () => {
  const [result, setResult] = useState<PreProposalResult | null>(null);
  const [input, setInput] = useState<PreProposalInput | null>(null);
  const [viewMode, setViewMode] = useState<'simple' | 'detailed'>('simple');

  const handleCalculate = (data: PreProposalInput) => {
    setInput(data);
    const calculationResult = calculatePreProposal(data);
    setResult(calculationResult);
    setViewMode('simple'); // Começa sempre na visão simples
  };

  const handleBack = () => {
    setResult(null);
    setInput(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {/* Navigation */}
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar para Início
            </Button>
          </Link>
        </div>

        {result && input ? (
          viewMode === 'simple' ? (
            <PreProposalResultSimple 
              result={result} 
              input={input} 
              onBack={handleBack}
              onSwitchToDetailed={() => setViewMode('detailed')}
            />
          ) : (
            <PreProposalResultView 
              result={result} 
              input={input} 
              onBack={handleBack}
              onSwitchToSimple={() => setViewMode('simple')}
            />
          )
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
