import { BarChart3, MousePointerClick, Search } from 'lucide-react';

const STEPS = [
  { icon: Search, title: 'Pesquise', text: 'Digite o produto, restaurante ou categoria que você quer pedir.' },
  { icon: BarChart3, title: 'Compare', text: 'Calculamos o preço final em cada plataforma: produto + entrega + taxas − descontos − cupons.' },
  { icon: MousePointerClick, title: 'Peça', text: 'Veja a melhor oferta destacada e vá direto para a plataforma vencedora.' },
];

export function HowItWorks() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {STEPS.map(({ icon: Icon, title, text }, i) => (
        <div key={title} className="flex gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-600/30">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Passo {i + 1}</p>
            <h3 className="font-bold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">{text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
