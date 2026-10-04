import { Link } from 'react-router-dom';
import { cn } from '../../utils/format';

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cn('h-9 w-9', className)} aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="#059669" />
      <rect x="14" y="30" width="9" height="20" rx="3" fill="#fff" opacity=".55" />
      <rect x="27.5" y="20" width="9" height="30" rx="3" fill="#fff" opacity=".8" />
      <rect x="41" y="38" width="9" height="12" rx="3" fill="#FDBA74" />
      <path d="M39 17l6 6 9-11" stroke="#FDBA74" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="ComparaFood — página inicial">
      <LogoMark />
      <span className={cn('text-xl font-extrabold tracking-tight', light ? 'text-white' : 'text-slate-900')}>
        Compara<span className={light ? 'text-brand-300' : 'text-brand-600'}>Food</span>
      </span>
    </Link>
  );
}
