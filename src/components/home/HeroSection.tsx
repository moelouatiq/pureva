import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export default async function HeroSection() {
  const t = await getTranslations('home.hero')

  return (
    <section className="relative bg-green-900 text-ivory section-padding overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold-400 via-transparent to-transparent pointer-events-none" />
      <div className="container-pureva relative z-10 flex flex-col items-start gap-6 py-16 md:py-24 max-w-2xl">
        <p className="text-sm font-medium text-gold-400 uppercase tracking-widest">Pureva</p>
        <h1 className="text-4xl md:text-5xl font-heading font-bold leading-tight">
          {t('headline')}
        </h1>
        <p className="text-lg text-ivory/80">{t('claim')}</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/routine-pack" className="btn-primary">
            {t('cta_primary')}
          </Link>
          <Link href="/shop" className="btn-secondary border-ivory/40 text-ivory hover:bg-ivory/10">
            {t('cta_secondary')}
          </Link>
        </div>
      </div>
    </section>
  )
}
