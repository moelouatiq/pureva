import { redirect } from 'next/navigation'

// Fallback: middleware handles locale redirect (/ → /fr) when running.
// This page catches any request that reaches the App Router without a locale prefix.
export default function RootPage() {
  redirect('/fr')
}
