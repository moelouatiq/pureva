import type { Product } from '@/types/product'
import ProductCard from './ProductCard'

type Props = {
  products: Product[]
  locale: string
}

export default function ProductGrid({ products, locale }: Props) {
  if (products.length === 0) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} locale={locale} />
      ))}
    </div>
  )
}
