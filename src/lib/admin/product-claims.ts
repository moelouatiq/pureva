export type ClaimWarning = {
  field: string
  term: string
}

const FORBIDDEN_TERMS = [
  'stops hair loss',
  'prevents hair loss',
  'anti-hair-loss',
  'treats alopecia',
  'guaranteed regrowth',
  'clinically proven',
  'medical treatment',
  'certified organic',
  'cruelty-free',
  'made in france',
  'stoppe la chute',
  'previent la chute',
  'prévient la chute',
  'traite l’alopecie',
  'traite l’alopécie',
  'traite alopecie',
  'traite alopécie',
  'repousse garantie',
  'cliniquement prouve',
  'cliniquement prouvé',
  'traitement medical',
  'traitement médical',
  'certifie bio',
  'certifié bio',
  'non teste sur les animaux',
  'non testé sur les animaux',
  'fabrique en france',
  'fabriqué en france',
] as const

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’']/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

export function detectForbiddenClaims(fields: Record<string, string | string[]>): ClaimWarning[] {
  const warnings: ClaimWarning[] = []
  const normalizedTerms = FORBIDDEN_TERMS.map((term) => ({
    original: term,
    normalized: normalizeText(term),
  }))

  for (const [field, value] of Object.entries(fields)) {
    const joined = Array.isArray(value) ? value.join(' ') : value
    const normalized = normalizeText(joined)
    if (!normalized) continue

    for (const term of normalizedTerms) {
      if (normalized.includes(term.normalized)) {
        warnings.push({ field, term: term.original })
      }
    }
  }

  return warnings
}
