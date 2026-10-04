import { PrismaClient } from '@prisma/client';
import { calculateFinalPrice } from '../src/services/pricing/PriceCalculator.js';
import { toCents } from '../src/utils/money.js';
import { platforms, restaurants } from './seed-data.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Populando banco com dados de demonstração...');

  await prisma.clickEvent.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.product.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.platform.deleteMany();

  const platformIds = new Map<string, number>();
  for (const p of platforms) {
    const created = await prisma.platform.create({ data: { ...p } });
    platformIds.set(p.slug, created.id);
  }

  let productCount = 0;
  let offerCount = 0;

  for (const { products, ...restaurantData } of restaurants) {
    const restaurant = await prisma.restaurant.create({ data: restaurantData });

    for (const { offers, ...productData } of products) {
      const product = await prisma.product.create({ data: { ...productData, restaurantId: restaurant.id } });
      productCount++;

      for (const [slug, o] of Object.entries(offers)) {
        if (!o) continue;
        const values = {
          productPrice: toCents(o.price),
          deliveryFee: toCents(o.delivery),
          additionalFee: toCents(o.fee ?? 0),
          discount: toCents(o.discount ?? 0),
          couponDiscount: toCents(o.coupon ?? 0),
        };
        await prisma.offer.create({
          data: {
            ...values,
            productId: product.id,
            platformId: platformIds.get(slug)!,
            couponCode: o.couponCode ?? null,
            promoLabel: o.promo ?? null,
            deliveryTimeMin: o.time,
            finalPrice: calculateFinalPrice(values).finalPrice,
            // Link de demonstração (página interna). Troque por um link real/afiliado na área admin.
            redirectUrl: `/pedido-simulado?plataforma=${slug}&produto=${product.id}`,
          },
        });
        offerCount++;
      }
    }
  }

  console.log(
    `✅ ${restaurants.length} restaurantes, ${productCount} produtos, ${platforms.length} plataformas e ${offerCount} ofertas criados.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
