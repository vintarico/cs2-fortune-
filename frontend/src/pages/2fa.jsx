import { useState } from 'react'
import Button from '../components/atoms/Button'

export default function TwoFA() {
  const [code, setCode] = useState('')
  const [message, setMessage] = useState(null)

  async function onVerify(e) {
    e.preventDefault()
  const res = await fetch('http://localhost:4000/api/auth/2fa/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) })
    const data = await res.json()
    setMessage(data.message)
    if (data.success) window.location.href = '/'
  }

  return (
    <main className="min-h-screen bg-surface text-white flex items-center justify-center p-6">
      <form onSubmit={onVerify} className="max-w-md w-full bg-surface p-6 rounded-md card-shadow">
        <h2 className="text-2xl font-semibold mb-4">Verificação 2FA</h2>
        <label className="block mb-4">Código TOTP
          <input value={code} onChange={e => setCode(e.target.value)} className="w-full mt-1 p-2 rounded bg-[#0B1220]" />
        </label>
        <div className="flex gap-2 justify-end">
          <Button type="submit">Verificar</Button>
        </div>
        {message && <p className="mt-4 text-sm text-muted">{message}</p>}
      </form>
    </main>
  )
}
