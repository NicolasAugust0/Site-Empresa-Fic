import { z } from 'zod';

const cents = z.coerce.number().int('Use valores em centavos (inteiros).').min(0, 'Não pode ser negativo.');
const text = (label: string) => z.string().trim().min(1, `${label} é obrigatório.`);
const optionalText = z
  .string()
  .trim()
  .max(60)
  .nullish()
  .transform((v) => (v ? v : null));

export const restaurantSchema = z.object({
  name: text('Nome'),
  category: text('Categoria'),
  image: text('Imagem'),
  rating: z.coerce.number().min(0).max(5),
  address: text('Endereço'),
});

export const productSchema = z.object({
  restaurantId: z.coerce.number().int().positive(),
  name: text('Nome'),
  description: z.string().trim().default(''),
  category: text('Categoria'),
  image: text('Imagem'),
});

export const platformSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'Use apenas letras minúsculas, números e hífen.'),
  name: text('Nome'),
  logo: text('Logo'),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Cor no formato #RRGGBB.'),
  textColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Cor no formato #RRGGBB.')
    .default('#FFFFFF'),
  websiteUrl: z.string().url('URL inválida.'),
  priority: z.coerce.number().int().default(0),
  active: z.coerce.boolean().default(true),
});

const redirectUrl = z
  .string()
  .trim()
  .refine((v) => v.startsWith('/') || /^https?:\/\//.test(v), 'Informe uma URL http(s) ou um caminho começando com /.');

export const offerSchema = z.object({
  productId: z.coerce.number().int().positive(),
  platformId: z.coerce.number().int().positive(),
  productPrice: cents,
  deliveryFee: cents.default(0),
  additionalFee: cents.default(0),
  discount: cents.default(0),
  couponDiscount: cents.default(0),
  couponCode: optionalText,
  promoLabel: optionalText,
  deliveryTimeMin: z.coerce.number().int().min(1).max(240).default(40),
  redirectUrl,
  available: z.coerce.boolean().default(true),
});

export type OfferInput = z.infer<typeof offerSchema>;
