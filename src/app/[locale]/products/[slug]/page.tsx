import { products } from '@/data/products'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return products.flatMap((product) => [
    { locale: 'fr', slug: product.slug.fr },
    { locale: 'en', slug: product.slug.en },
  ])
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { slug } = await params
  const product = products.find(
    (p) => p.slug.fr === slug || p.slug.en === slug
  )

  if (!product) notFound()

  return (
    <main>
      <h1>{product.name.fr} (Sprint 0 placeholder)</h1>
    </main>
  )
}
