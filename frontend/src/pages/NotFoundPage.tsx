import { Link } from 'react-router-dom';
import { buttonClass } from '../components/ui/Button';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function NotFoundPage() {
  useDocumentTitle('Página não encontrada');
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-20 text-center">
      <span className="text-6xl">🍽️</span>
      <h1 className="text-2xl font-extrabold text-slate-900">Página não encontrada</h1>
      <p className="text-slate-500">O prato que você procura não está no cardápio.</p>
      <Link to="/" className={buttonClass()}>
        Voltar ao início
      </Link>
    </div>
  );
}
