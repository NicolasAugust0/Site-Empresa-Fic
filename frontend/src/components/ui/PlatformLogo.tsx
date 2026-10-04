import type { Platform } from '../../types/api';
import { cn, isImageUrl } from '../../utils/format';

const sizes = {
  sm: 'h-7 w-7 text-[11px] rounded-lg',
  md: 'h-10 w-10 text-sm rounded-xl',
  lg: 'h-14 w-14 text-lg rounded-2xl',
};

type PlatformLike = Pick<Platform, 'name' | 'logo' | 'color' | 'textColor'>;

export function PlatformLogo({ platform, size = 'md' }: { platform: PlatformLike; size?: keyof typeof sizes }) {
  if (isImageUrl(platform.logo)) {
    return <img src={platform.logo} alt={platform.name} className={cn('object-contain', sizes[size])} />;
  }
  return (
    <span
      className={cn('inline-flex shrink-0 items-center justify-center font-extrabold tracking-tight shadow-sm', sizes[size])}
      style={{ backgroundColor: platform.color, color: platform.textColor }}
      aria-label={platform.name}
      title={platform.name}
    >
      {platform.logo}
    </span>
  );
}
