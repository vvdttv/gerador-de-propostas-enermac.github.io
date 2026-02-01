export type LivestockType = 'suino' | 'bovino' | 'aves';

export const LIVESTOCK_CLASSES: Record<LivestockType, Array<{ value: string; label: string }>> = {
  suino: [
    { value: 'Matriz', label: 'Matriz' },
    { value: "Crechário (Lâmina d'água)", label: 'Crechário' },
    { value: 'Terminação/Maraã', label: 'Terminação' },
  ],
  bovino: [
    { value: 'Matriz UPD', label: 'Matriz UPD' },
    { value: 'Terminação Confinamento', label: 'Terminação Confinamento' },
  ],
  aves: [
    { value: 'Poedeira', label: 'Poedeira' },
    { value: 'Frango de Corte', label: 'Frango de Corte' },
  ],
} as const;

export function getLivestockClassValues(type: LivestockType): string[] {
  return LIVESTOCK_CLASSES[type].map((c) => c.value);
}

/**
 * Critério indispensável: se houver tipo válido, sempre devolve uma classe válida (fallback para a 1ª opção).
 */
export function ensureLivestockClass(type: LivestockType, value: string | undefined | null): string {
  const normalized = (value ?? '').trim();
  const valid = getLivestockClassValues(type);
  if (valid.includes(normalized)) return normalized;
  return valid[0] ?? '';
}
