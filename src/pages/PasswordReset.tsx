
import { authService } from "@/api";
import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

export default function PasswordReset() {
  const [senha, setSenha] = useState("");
  const [confsenha, setConfsenha] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);
  const [msg, setMsg] = useState("");
  const [erro, setErro] = useState("");

  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>(); // pega /:token
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email"); // pega ?email=...

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();

    if (senha.length < 6) {
      setErro("Use ao menos 6 caracteres.");
      return;
    }
    if (senha !== confsenha) {
      setErro("Senhas não coincidem.");
      return;
    }
    setIsRequesting(true)
    try {
      const res = await authService.resetPassword(token, email, senha, confsenha)
      setMsg("Senha redefinida com sucesso!");
      setIsRequesting(false)
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (e) {
      setErro(e.message);
    } finally {
      setIsRequesting(false);
    }

  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-echurch-50">
      <form
        onSubmit={handleReset}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md flex flex-col gap-4 animate-fade-in"
      >
        <h2 className="text-center font-bold text-2xl text-echurch-700 mb-2">Nova senha</h2>
        <input
          className="border border-echurch-200 rounded px-4 py-2 outline-none focus:ring-2 focus:ring-echurch-400"
          type="password"
          placeholder="Nova senha"
          value={senha}
          onChange={e => setSenha(e.target.value)}
        />
        <input
          className="border border-echurch-200 rounded px-4 py-2 outline-none focus:ring-2 focus:ring-echurch-400"
          type="password"
          placeholder="Confirmar senha"
          value={confsenha}
          onChange={e => setConfsenha(e.target.value)}
        />
        <button
          type="submit"
          className="bg-echurch-500 text-white py-2 rounded font-semibold shadow hover:bg-echurch-700 transition-colors"
        >
          { !isRequesting ? "Redefinir senha" : "Redefinindo..."}
        </button>
        {msg && <div className="text-green-600 text-center">{msg}</div>}
        {erro && <div className="text-red-600 text-center">{erro}</div>}
      </form>
    </div>
  );
}
