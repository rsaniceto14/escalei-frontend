
export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-br from-echurch-400 to-echurch-600 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg">⛪</span>
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
          <span className="text-xs">✨</span>
        </div>
      </div>
      <div className="flex flex-col">
        <h1 className="text-xl font-bold bg-gradient-to-r from-echurch-600 to-echurch-800 bg-clip-text text-transparent">
          e-Church
        </h1>
        <p className="text-xs text-echurch-500 -mt-1">Gestão Inteligente</p>
      </div>
    </div>
  );
}
