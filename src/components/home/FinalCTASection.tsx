import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { buildWhatsAppUrl } from '@/lib/whatsapp'

export default async function FinalCTASection() {
  const t = await getTranslations('home.final_cta')
  const tWa = await getTranslations('whatsapp')
  const waUrl = buildWhatsAppUrl(tWa('routine'))

  return (
    <section className="section-padding bg-green-900 text-ivory">
      <div className="container-pureva text-center max-w-xl mx-auto flex flex-col items-center gap-6">
        <h2 className="text-2xl md:text-3xl font-heading font-bold">{t('headline')}</h2>
        <p className="text-ivory/80">{t('body')}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/routine-pack" className="btn-primary">
            {t('cta_primary')}
          </Link>
          {waUrl !== '#' && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary border-ivory/40 text-ivory hover:bg-ivory/10"
            >
              {t('cta_secondary')}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
