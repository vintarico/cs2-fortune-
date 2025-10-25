import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-primary p-4 flex justify-between items-center">
      <Link href="/"><a className="text-2xl font-bold text-secondary">CS 2 Fortune</a></Link>
      <div className="space-x-4">
        <Link href="/cases"><a>Abrir Caixas</a></Link>
        <Link href="/trade"><a>Trocar Skins</a></Link>
        <Link href="/deposit"><a>Depositar</a></Link>
        <Link href="/withdraw"><a>Retirar</a></Link>
        <Link href="/login"><a>Login Steam</a></Link>
      </div>
    </nav>
  )
}
