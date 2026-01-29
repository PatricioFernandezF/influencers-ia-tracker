type ConnectAccountModalProps = {
  isOpen: boolean
  onClose: () => void
}

export default function ConnectAccountModal({ isOpen, onClose }: ConnectAccountModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 text-left shadow-2xl dark:bg-slate-900">
        <header className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Conectar cuenta</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Cerrar modal"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </header>
        <p className="mt-3 text-sm text-slate-500">
          Aquí iremos guiando la conexión con plataformas externas. De momento puedes copiar el enlace
          de invitación y seguir los pasos en la consola.
        </p>
        <div className="mt-5 space-y-3 text-sm">
          <div className="flex items-center justify-between rounded-xl border border-dashed border-blue-500/40 bg-blue-50/60 px-4 py-3 text-blue-600">
            <span>https://connect.posttracker.com</span>
            <button className="text-xs font-semibold uppercase tracking-widest">Copiar</button>
          </div>
          <p className="text-slate-500">
            Recibirás un correo con instrucciones y podrás volver aquí para verificar el estado.
          </p>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-white"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
