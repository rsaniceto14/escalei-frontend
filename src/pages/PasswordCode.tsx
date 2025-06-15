
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PasswordCode() {
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (codigo === "1234") {
      navigate("/redefinir");
    } else {
      setErro("Código inválido.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-echurch-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md flex flex-col gap-4 animate-fade-in"
      >
        <h2 className="text-center font-bold text-2xl text-echurch-700 mb-2">Código de recuperação</h2>
        <p className="text-echurch-500 text-center mb-2 text-sm">Digite o código recebido por e-mail.</p>
        <input
          className="border border-echurch-200 rounded px-4 py-2 outline-none focus:ring-2 focus:ring-echurch-400 tracking-widest text-center text-lg"
          type="text"
          maxLength={6}
          placeholder="Código"
          value={codigo}
          onChange={e => setCodigo(e.target.value)}
        />
        <button
          type="submit"
          className="bg-echurch-500 text-white py-2 rounded font-semibold shadow hover:bg-echurch-700 transition-colors"
        >
          Confirmar
        </button>
        {erro && <div className="text-red-600 text-center">{erro}</div>}
      </form>
    </div>
  );
}
