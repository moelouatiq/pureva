import type { LocalizedString } from './locale'

export type Ingredient = {
  id: string
  name: LocalizedString
  description: LocalizedString
  benefit: LocalizedString
  image: string
}
