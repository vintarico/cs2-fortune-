import { useState } from 'react'
import Button from '../components/atoms/Button'
import Modal from '../components/molecules/Modal'

export default function Home() {
  const [open, setOpen] = useState(false)
  return (
    <main className="min-h-screen bg-surface text-white flex items-center justify-center p-6">
      <div className="max-w-xl w-full">
        <h1 className="text-3xl font-semibold mb-4">CS2 Fortune — Demo</h1>
        <p className="text-muted mb-6">Exemplo de componente premium: Button + Modal</p>
        <Button onClick={() => setOpen(true)}>Abrir Modal Premium</Button>
        <Modal open={open} onClose={() => setOpen(false)} title="Resultado do case">
          <div className="py-4">Parabéns! Você ganhou um item raro.</div>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setOpen(false)}>Fechar</Button>
            <Button>Adicionar ao inventário</Button>
          </div>
        </Modal>
      </div>
    </main>
  )
}
