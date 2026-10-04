import { cn, isImageUrl } from '../../utils/format';

const sizes = {
  sm: 'h-12 w-12 text-2xl rounded-xl',
  md: 'h-16 w-16 text-4xl rounded-2xl',
  lg: 'h-24 w-24 text-6xl rounded-3xl',
};

/** Exibe a imagem de um produto/restaurante (emoji ou URL). */
export function ItemImage({ image, alt, size = 'md', className }: { image: string; alt: string; size?: keyof typeof sizes; className?: string }) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 to-amber-100',
        sizes[size],
        className,
      )}
    >
      {isImageUrl(image) ? (
        <img src={image} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <span role="img" aria-label={alt}>
          {image}
        </span>
      )}
    </div>
  );
}
