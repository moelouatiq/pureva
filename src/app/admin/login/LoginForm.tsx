'use client'

import { useActionState } from 'react'
import { loginAdmin } from '../actions'

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAdmin, {})

  return (
    <form action={action} className="flex max-w-sm flex-col gap-4 rounded-lg border border-green-900/10 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="rounded-lg border border-green-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-800/40"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium">
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="rounded-lg border border-green-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-800/40"
        />
      </div>

      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-green-900 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  )
}
