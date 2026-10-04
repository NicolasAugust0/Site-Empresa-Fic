import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Restaurant } from '../../types/api';
import { CATEGORY_LABELS } from '../../utils/constants';
import { ItemImage } from '../ui/ItemImage';
import { Rating } from '../ui/Rating';

export function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const category = CATEGORY_LABELS[restaurant.category];
  return (
    <Link
      to={`/restaurante/${restaurant.id}`}
      className="group flex min-w-0 items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-lift"
    >
      <ItemImage image={restaurant.image} alt={restaurant.name} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate font-bold text-slate-900 group-hover:text-brand-700">{restaurant.name}</h3>
          <Rating value={restaurant.rating} />
        </div>
        <p className="text-sm text-slate-500">
          {category ? `${category.emoji} ${category.label}` : restaurant.category}
          {restaurant.productsCount !== undefined && ` · ${restaurant.productsCount} produtos`}
        </p>
        <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-400">
          <MapPin className="h-3 w-3 shrink-0" /> {restaurant.address}
        </p>
      </div>
    </Link>
  );
}
