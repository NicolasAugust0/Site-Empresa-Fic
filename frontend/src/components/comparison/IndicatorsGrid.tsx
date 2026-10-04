import { BadgePercent, Layers, PiggyBank, Tag } from 'lucide-react';
import type { ComparisonResult } from '../../types/api';
import { formatBRL } from '../../utils/format';
import { StatCard } from '../ui/StatCard';

export function IndicatorsGrid({ comparison }: { comparison: ComparisonResult }) {
  const { indicators, bestOffer } = comparison;
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatCard icon={Tag} label="Melhor preço" value={formatBRL(indicators.bestPrice)} hint={bestOffer?.platform.name} />
      <StatCard
        icon={PiggyBank}
        tone="amber"
        label="Maior economia"
        value={formatBRL(indicators.maxSavings)}
        hint={`vs. ${formatBRL(indicators.worstPrice)} (mais cara)`}
      />
      <StatCard
        icon={Layers}
        tone="sky"
        label="Plataformas"
        value={String(indicators.platformsCompared)}
        hint={`Média: ${formatBRL(indicators.averagePrice)}`}
      />
      <StatCard
        icon={BadgePercent}
        tone="orange"
        label="Maior desconto"
        value={formatBRL(indicators.biggestDiscount)}
        hint={indicators.biggestDiscountPlatform ?? 'Nenhum desconto'}
      />
    </div>
  );
}
