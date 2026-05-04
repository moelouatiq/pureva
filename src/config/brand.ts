// Brand claims configuration.
// Only claims explicitly set to `true` are rendered publicly.
// Default is false until confirmed by the product owner / formulator.
// Do NOT change values to true without written confirmation from the brand owner.
export const brandClaims = {
  // TODO: confirm "no parabens" with formulator / INCI list verification
  noParabens: false,
  // TODO: confirm "no silicones" with formulator / INCI list verification
  noSilicones: false,
  // TODO: confirm cruelty-free status (requires certification body or owner statement)
  crueltyFree: false,
  // TODO: confirm natural origin percentage claim with formulator
  naturalOrigin: false,
  // TODO: confirm "made in France" with brand owner before enabling
  madeInFrance: false,
  // TODO: confirm organic certification (requires accredited body)
  organicCertified: false,
  // TODO: confirm dermatologically tested (requires clinical test document)
  dermatologicallyTested: false,
}

export type BrandClaimKey = keyof typeof brandClaims
