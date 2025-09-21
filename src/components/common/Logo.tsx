
export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img 
        src="/favicon.ico" 
        alt="Escalei Logo" 
        className="w-10 h-10 rounded-lg object-cover" 
      />
      <div className="flex flex-col">
        <h1 className="text-lg font-bold bg-gradient-to-r from-echurch-600 to-echurch-800 bg-clip-text text-transparent tracking-tight">
          Escalei
        </h1>
        <p className="text-xs text-echurch-500 -mt-1">Gestão Inteligente</p>
      </div>
    </div>
  );
}
