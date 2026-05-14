import type { Metadata } from 'next'
import Link from 'next/link'
import { Raleway } from 'next/font/google'
import { logoutAdmin } from './actions'
import '../globals.css'

const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Pureva Admin',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={raleway.variable}>
      <body className="bg-ivory text-green-900">
        <div className="min-h-screen">
          <header className="border-b border-green-900/10 bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
              <Link href="/admin/orders" className="font-heading text-xl font-bold">
                Pureva Admin
              </Link>
              <nav className="flex items-center gap-4 text-sm">
                <Link href="/admin/orders" className="font-medium hover:underline">
                  Commandes
                </Link>
                <form action={logoutAdmin}>
                  <button type="submit" className="text-green-800/70 hover:text-green-900">
                    Deconnexion
                  </button>
                </form>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        </div>
      </body>
    </html>
  )
}
