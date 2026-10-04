import { APP_TAGLINE } from '../../utils/constants';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <Logo />
          <p>{APP_TAGLINE} Você não precisa abrir três aplicativos — nós comparamos para você.</p>
        </div>
        <p className="max-w-sm text-xs leading-relaxed text-slate-400">
          Projeto acadêmico (MVP). Preços, descontos e links são <strong>dados simulados</strong> para demonstração.
          iFood, 99Food e Keeta são marcas de seus respectivos proprietários.
        </p>
      </div>
    </footer>
  );
}
