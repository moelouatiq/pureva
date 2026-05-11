import { getVisibleProducts } from '@/data/products'
import { formatPrice } from '@/lib/format-price'
import type { Locale } from '@/types/locale'
import type { ProductOption } from '@/components/order/OrderForm'

export function buildProductOptions(
  locale: Locale,
  pricePlaceholderLabel: string
): ProductOption[] {
  return getVisibleProducts()
    .sort((a, b) => {
      // Routine pack first, then routine products, then others
      if (a.category === 'pack') return -1
      if (b.category === 'pack') return 1
      if (a.isRoutineProduct && !b.isRoutineProduct) return -1
      if (!a.isRoutineProduct && b.isRoutineProduct) return 1
      return 0
    })
    .map((p) => ({
      id: p.id,
      name: p.name[locale] ?? p.name.fr,
      priceLabel:
        p.priceStatus === 'confirmed' && p.price > 0
          ? formatPrice(p.price, locale)
          : pricePlaceholderLabel,
    }))
}
