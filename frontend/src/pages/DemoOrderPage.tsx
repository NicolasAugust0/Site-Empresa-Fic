import { ArrowLeft, CheckCircle2, ExternalLink, Info } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { PriceBreakdown } from '../components/comparison/PriceBreakdown';
import { buttonClass, ExternalLinkButton } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState, ErrorState, Skeleton } from '../components/ui/Feedback';
import { ItemImage } from '../components/ui/ItemImage';
import { PlatformLogo } from '../components/ui/PlatformLogo';
import { useAsync } from '../hooks/useAsync';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { catalogService } from '../services/catalogService';

/**
 * Página de destino dos links de DEMONSTRAÇÃO.
 * Em produção, o botão "Pedir agora" apontaria para o link oficial/afiliado da plataforma.
 */
export function DemoOrderPage() {
  const [params] = useSearchParams();
  const slug = params.get('plataforma') ?? '';
  const productId = Number(params.get('produto'));

  const { data, error, reload } = useAsync(() => catalogService.compare(productId), [productId]);
  const offer = data?.offers.find((o) => o.platform.slug === slug);
  useDocumentTitle(offer ? `Pedido no ${offer.platform.name}` : 'Redirecionamento');

  if (error) return <div className="mx-auto max-w-xl px-4 py-10"><ErrorState error={error} onRetry={reload} /></div>;
  if (!data) return <div className="mx-auto max-w-xl px-4 py-10"><Skeleton className="h-96" /></div>;
  if (!offer) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10">
        <EmptyState title="Oferta não encontrada" description="O link de demonstração não corresponde a uma oferta ativa." />
      </div>
    );
  }

  const { platform } = offer;

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-5 px-4 py-8">
      <Card className="animate-pop-in overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4" style={{ backgroundColor: platform.color, color: platform.textColor }}>
          <span className="rounded-xl bg-white/20 p-1">
            <PlatformLogo platform={platform} />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Redirecionamento simulado</p>
            <p className="text-lg font-extrabold">Você está no {platform.name}</p>
          </div>
        </div>

        <div className="flex flex-col gap-5 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-brand-700">
            <CheckCircle2 className="h-5 w-5" /> Item adicionado ao carrinho (demonstração)
          </div>

          <div className="flex items-center gap-3">
            <ItemImage image={data.product.image} alt={data.product.name} size="sm" />
            <div>
              <p className="font-bold text-slate-900">{data.product.name}</p>
              <p className="text-sm text-slate-500">{data.product.restaurant.name} · entrega em {offer.deliveryTimeMin} min</p>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <PriceBreakdown breakdown={offer.breakdown} couponCode={offer.couponCode} />
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Este é um MVP acadêmico com dados simulados. Em produção, o ComparaFood abriria o {platform.name} (app ou site) com
              este produto — o link é configurável na área administrativa.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Link to={`/produto/${data.product.id}`} className={buttonClass('secondary', 'md', 'flex-1')}>
              <ArrowLeft className="h-4 w-4" /> Voltar à comparação
            </Link>
            <ExternalLinkButton href={platform.websiteUrl} className="flex-1">
              Site oficial do {platform.name} <ExternalLink className="h-4 w-4" />
            </ExternalLinkButton>
          </div>
        </div>
      </Card>
    </div>
  );
}
