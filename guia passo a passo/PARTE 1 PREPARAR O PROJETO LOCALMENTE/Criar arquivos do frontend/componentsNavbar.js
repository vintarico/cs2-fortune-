import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-primary p-4 flex justify-between items-center shadow-lg">
      <Link href="/">
        <a className="text-2xl font-bold text-secondary hover:text-cyan-400 transition">
          CS 2 Fortune
        </a>
      </Link>
      <div className="space-x-6">
        <Link href="/cases"><a className="hover:text-secondary transition">Abrir Caixas</a></Link>
        <Link href="/trade"><a className="hover:text-secondary transition">Trocar Skins</a></Link>
        <Link href="/deposit"><a className="hover:text-secondary transition">Depositar</a></Link>
        <Link href="/withdraw"><a className="hover:text-secondary transition">Retirar</a></Link>
        <Link href="/saldo"><a className="hover:text-secondary transition">Saldo</a></Link>
        <Link href="/login"><a className="bg-secondary text-primary px-4 py-2 rounded-lg hover:bg-cyan-400 transition">Login Steam</a></Link>
      </div>
    </nav>
  )
}
