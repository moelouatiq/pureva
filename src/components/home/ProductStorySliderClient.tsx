'use client'

import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductImage from '@/components/product/ProductImage'
import { Link } from '@/i18n/navigation'

export type SlideData = {
  id: string
  image: string
  href: string
  category: string
  name: string
  desc: string
}

type Props = {
  slides: SlideData[]
  headline: string
  subtitle: string
  ctaLabel: string
}

export default function ProductStorySliderClient({ slides, headline, subtitle, ctaLabel }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const scrollTo = (index: number) => {
    const track = trackRef.current
    if (!track) return
    const card = track.children[index] as HTMLElement
    if (!card) return
    track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: 'smooth' })
    setActiveIndex(index)
  }

  const prev = () => scrollTo(Math.max(0, activeIndex - 1))
  const next = () => scrollTo(Math.min(slides.length - 1, activeIndex + 1))

  return (
    <section className="section-padding bg-white">
      <div className="container-pureva">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-1 text-center md:flex-row md:items-end md:justify-between md:text-left">
          <div>
            <h2 className="font-heading text-2xl font-bold text-green-900 md:text-3xl">{headline}</h2>
            <p className="mt-1 text-green-800/60">{subtitle}</p>
          </div>
          <div className="flex items-center justify-center gap-2 md:justify-end">
            <button
              onClick={prev}
              disabled={activeIndex === 0}
              aria-label="Slide précédente"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-cream bg-white text-green-800 shadow-sm transition-all hover:border-green-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              onClick={next}
              disabled={activeIndex === slides.length - 1}
              aria-label="Slide suivante"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-cream bg-white text-green-800 shadow-sm transition-all hover:border-green-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-35"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>

        {/* Scroll track */}
        <div
          ref={trackRef}
          className="flex gap-4 overflow-x-auto pb-4 [scroll-snap-type:x_mandatory] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          role="list"
          aria-label={headline}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              role="listitem"
              className="w-[260px] shrink-0 [scroll-snap-align:start] sm:w-[300px]"
            >
              <Link
                href={slide.href}
                className="group flex flex-col overflow-hidden rounded-2xl border border-cream bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer"
                tabIndex={0}
                aria-label={slide.name}
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-cream p-5">
                  <ProductImage
                    src={slide.image}
                    alt={slide.name}
                    className="h-full w-full"
                  />
                  {/* Category pill */}
                  <span className="absolute left-3 top-3 rounded-full bg-green-900/80 px-2.5 py-0.5 text-xs font-medium text-ivory backdrop-blur-sm">
                    {slide.category}
                  </span>
                </div>

                {/* Text */}
                <div className="flex flex-col gap-1 p-4">
                  <p className="font-semibold text-green-900 leading-snug">{slide.name}</p>
                  <p className="text-sm text-green-800/60">{slide.desc}</p>
                  <p className="mt-2 text-xs font-medium text-gold-500 underline underline-offset-2">
                    {ctaLabel}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        <div className="mt-4 flex justify-center gap-1.5" role="tablist" aria-label="Slides">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Aller au slide ${i + 1}`}
              onClick={() => scrollTo(i)}
              className={`h-1.5 cursor-pointer rounded-full transition-all duration-200 ${
                i === activeIndex
                  ? 'w-6 bg-green-800'
                  : 'w-1.5 bg-green-800/20 hover:bg-green-800/40'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
