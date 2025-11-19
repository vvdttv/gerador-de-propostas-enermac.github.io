-- Tabela para armazenar propostas salvas
CREATE TABLE public.proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  proposal_name TEXT NOT NULL,
  client_data JSONB NOT NULL,
  technical_data JSONB NOT NULL,
  current_costs JSONB NOT NULL,
  financial_config JSONB NOT NULL,
  calculations JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índice para buscar propostas mais rapidamente
CREATE INDEX idx_proposals_created_at ON public.proposals(created_at DESC);
CREATE INDEX idx_proposals_user_id ON public.proposals(user_id);

-- Enable RLS
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- Políticas RLS - Permitir acesso público por enquanto (sem autenticação)
CREATE POLICY "Propostas são visíveis para todos" 
ON public.proposals 
FOR SELECT 
USING (true);

CREATE POLICY "Qualquer um pode inserir propostas" 
ON public.proposals 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Qualquer um pode atualizar propostas" 
ON public.proposals 
FOR UPDATE 
USING (true);

CREATE POLICY "Qualquer um pode deletar propostas" 
ON public.proposals 
FOR DELETE 
USING (true);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_proposals_updated_at
BEFORE UPDATE ON public.proposals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();