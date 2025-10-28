import { useState } from 'react'
import Button from '../components/atoms/Button'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)

  async function onSubmit(e) {
    e.preventDefault()
    // call backend stub
  const res = await fetch('http://localhost:4000/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
    const data = await res.json()
    setMessage(data.message || 'OK')
    if (data.next === '2fa') {
      window.location.href = '/2fa'
    }
  }

  return (
    <main className="min-h-screen bg-surface text-white flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="max-w-md w-full bg-surface p-6 rounded-md card-shadow">
        <h2 className="text-2xl font-semibold mb-4">Entrar</h2>
        <label className="block mb-2">Email
          <input value={email} onChange={e => setEmail(e.target.value)} className="w-full mt-1 p-2 rounded bg-[#0B1220]" />
        </label>
        <label className="block mb-4">Senha
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full mt-1 p-2 rounded bg-[#0B1220]" />
        </label>
        <div className="flex gap-2 justify-end">
          <Button type="submit">Entrar</Button>
        </div>
        {message && <p className="mt-4 text-sm text-muted">{message}</p>}
      </form>
    </main>
  )
}
