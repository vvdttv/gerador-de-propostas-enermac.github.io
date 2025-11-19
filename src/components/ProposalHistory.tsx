import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Clock, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { ProposalData } from '@/types/proposal';

interface ProposalHistoryProps {
  onLoadProposal: (proposal: ProposalData) => void;
}

export function ProposalHistory({ onLoadProposal }: ProposalHistoryProps) {
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {
    try {
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProposals(data || []);
    } catch (error) {
      console.error('Erro ao carregar propostas:', error);
      toast.error('Erro ao carregar histórico de propostas');
    } finally {
      setLoading(false);
    }
  };

  const deleteProposal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('proposals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Proposta excluída com sucesso');
      loadProposals();
    } catch (error) {
      console.error('Erro ao excluir proposta:', error);
      toast.error('Erro ao excluir proposta');
    }
  };

  const handleLoadProposal = (proposal: any) => {
    const proposalData: ProposalData = {
      client: proposal.client_data,
      technical: proposal.technical_data,
      currentCosts: proposal.current_costs,
      financial: proposal.financial_config,
      calculations: proposal.calculations
    };
    onLoadProposal(proposalData);
    toast.success('Proposta carregada com sucesso');
  };

  if (loading) {
    return <div className="text-center py-8">Carregando histórico...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Histórico de Propostas
        </CardTitle>
      </CardHeader>
      <CardContent>
        {proposals.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Nenhuma proposta salva ainda.
          </p>
        ) : (
          <div className="space-y-3">
            {proposals.map((proposal) => (
              <div
                key={proposal.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-semibold">{proposal.proposal_name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Cliente: {proposal.client_data.clientName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(proposal.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLoadProposal(proposal)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Carregar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteProposal(proposal.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
