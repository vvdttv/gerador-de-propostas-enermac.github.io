import { useState } from 'react';
import { MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

interface CommentFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export function CommentField({ value, onChange, placeholder = "Adicione um comentário ou justificativa...", label = "Comentário" }: CommentFieldProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-3 no-print">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
            <MessageSquare className="h-4 w-4" />
            {label}
            {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[80px] text-sm"
          />
        </CollapsibleContent>
      </Collapsible>
      
      {/* Print version - show only if has content */}
      {value && (
        <div className="hidden print:block mt-2 p-3 bg-muted/30 rounded-lg border-l-4 border-primary">
          <p className="text-xs font-semibold text-muted-foreground mb-1">Observação:</p>
          <p className="text-sm">{value}</p>
        </div>
      )}
    </div>
  );
}
