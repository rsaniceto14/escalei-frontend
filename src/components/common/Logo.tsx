
export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-9 h-9 bg-gradient-to-br from-echurch-400 to-echurch-600 rounded-xl flex items-center justify-center shadow-md" />
      <div className="flex flex-col">
        <h1 className="text-lg font-bold bg-gradient-to-r from-echurch-600 to-echurch-800 bg-clip-text text-transparent tracking-tight">
          E-Church
        </h1>
        <p className="text-xs text-echurch-500 -mt-1">Gestão Inteligente</p>
      </div>
    </div>
  );
}
