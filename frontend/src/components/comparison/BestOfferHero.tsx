import { ArrowUpRight, Clock, Trophy } from 'lucide-react';
import type { ComparisonResult } from '../../types/api';
import { formatBRL } from '../../utils/format';
import { ExternalLinkButton } from '../ui/Button';
import { BadgeList } from '../ui/OfferBadge';
import { PlatformLogo } from '../ui/PlatformLogo';

export function BestOfferHero({ comparison }: { comparison: ComparisonResult }) {
  const { bestOffer, savings, offers, isTie, tiedPlatforms } = comparison;
  if (!bestOffer) return null;

  const single = offers.length === 1;
  const unresolvedTie = isTie && offers.filter((o) => o.position === 1).length > 1;
  const title = single ? 'Oferta encontrada' : unresolvedTie ? 'Empate no melhor preço' : 'Melhor oferta encontrada';

  return (
    <section className="animate-pop-in relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-600 to-emerald-800 p-5 text-white shadow-lift sm:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-amber-300/20 blur-3xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider ring-1 ring-white/25">
            <Trophy className="h-4 w-4 text-amber-300" /> {title}
          </span>

          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-white p-1.5 shadow-lg">
              <PlatformLogo platform={bestOffer.platform} size="lg" />
            </div>
            <div>
              <p className="text-sm font-medium text-brand-100">
                {unresolvedTie ? tiedPlatforms.join(' e ') : bestOffer.platform.name}
              </p>
              <p className="text-4xl font-extrabold tracking-tight sm:text-5xl">{formatBRL(bestOffer.finalPrice)}</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-brand-100">
                <Clock className="h-3.5 w-3.5" /> Entrega estimada em {bestOffer.deliveryTimeMin} min
              </p>
            </div>
          </div>

          {savings > 0 && !unresolvedTie && (
            <p className="text-base text-white sm:text-lg">
              Você economiza <strong className="rounded-md bg-amber-300 px-1.5 py-0.5 text-emerald-950">{formatBRL(savings)}</strong> em relação à
              opção mais cara.
            </p>
          )}
          {single && <p className="text-brand-100">Apenas uma oferta foi encontrada para este produto.</p>}
          {unresolvedTie && <p className="text-brand-100">{comparison.message}</p>}

          <div className="[&_span]:bg-white/90">
            <BadgeList badges={bestOffer.badges} exclude={['best', 'savings', 'tie']} />
          </div>
        </div>

        <div className="flex flex-col gap-2 lg:min-w-64">
          <ExternalLinkButton
            href={bestOffer.redirectPath}
            size="lg"
            variant="light"
          >
            Pedir no {bestOffer.platform.name} <ArrowUpRight className="h-5 w-5" />
          </ExternalLinkButton>
          <p className="text-center text-xs text-brand-100">Você será redirecionado para a plataforma</p>
        </div>
      </div>
    </section>
  );
}
