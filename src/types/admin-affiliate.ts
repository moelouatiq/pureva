export const AFFILIATE_COMMISSION_TYPES = ['percentage', 'fixed'] as const
export const AFFILIATE_STATUSES = ['active', 'inactive'] as const

export type AffiliateCommissionType = (typeof AFFILIATE_COMMISSION_TYPES)[number]
export type AffiliateStatus = (typeof AFFILIATE_STATUSES)[number]

export type AdminAffiliate = {
  id: string
  code: string
  name: string
  email: string | null
  phone: string | null
  instagram_handle: string | null
  commission_type: AffiliateCommissionType
  commission_value: number
  status: AffiliateStatus
  notes: string | null
  created_at: string
  updated_at: string
}

export type AdminAffiliateClick = {
  id: string
  affiliate_id: string | null
  affiliate_code: string
  landing_path: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
  utm_term: string | null
  referrer: string | null
  user_agent: string | null
  ip_hash: string | null
  created_at: string
}
