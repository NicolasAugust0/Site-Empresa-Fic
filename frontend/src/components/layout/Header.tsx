import { LayoutDashboard, Search } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '../../utils/format';
import { SearchBar } from '../search/SearchBar';
import { Logo } from './Logo';

export function Header() {
  const { pathname } = useLocation();
  const showSearch = pathname !== '/';

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition',
      isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    );

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:gap-6">
        <Logo />
        {showSearch && (
          <div className="hidden flex-1 md:block">
            <SearchBar size="sm" />
          </div>
        )}
        <nav className="ml-auto flex items-center gap-1">
          <NavLink to="/busca" className={linkClass} end>
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Explorar</span>
          </NavLink>
          <NavLink to="/admin" className={linkClass}>
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Admin</span>
          </NavLink>
        </nav>
      </div>
      {showSearch && (
        <div className="px-4 pb-3 md:hidden">
          <SearchBar size="sm" />
        </div>
      )}
    </header>
  );
}
