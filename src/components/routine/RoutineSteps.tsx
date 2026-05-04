import { getTranslations } from 'next-intl/server'

const STEPS = [
  { key: 'how_step1', product: 'includes_oil' },
  { key: 'how_step2', product: 'includes_mask' },
  { key: 'how_step3', product: 'includes_lotion' },
  { key: 'how_step4', product: 'includes_serum' },
] as const

export default async function RoutineSteps() {
  const t = await getTranslations('routine_pack')

  return (
    <div className="flex flex-col gap-4">
      {STEPS.map(({ key }, i) => (
        <div key={key} className="flex gap-4 items-start">
          <div className="w-8 h-8 rounded-full bg-green-900 text-ivory flex items-center justify-center text-sm font-bold shrink-0">
            {i + 1}
          </div>
          <p className="text-green-800/80 leading-relaxed pt-1">{t(key)}</p>
        </div>
      ))}
      <p className="text-sm text-green-800/60 italic ml-12">{t('frequency')}</p>
    </div>
  )
}
