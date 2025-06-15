
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !senha) {
      setErro("Preencha todos os campos.");
      return;
    }
    // Simulação de login JWT (chave fictícia)
    if (email === "demo@e-church.com" && senha === "123456") {
      localStorage.setItem("jwt", "demo-jwt");
      navigate("/");
    } else {
      setErro("Usuário ou senha inválidos.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-echurch-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md flex flex-col gap-4 animate-fade-in"
      >
        <h2 className="text-center font-bold text-2xl text-echurch-700 mb-4">Entrar no e-church</h2>
        {erro && (
          <div className="bg-red-100 text-red-600 px-4 py-2 rounded">{erro}</div>
        )}
        <input
          className="border border-echurch-200 rounded px-4 py-2 outline-none focus:ring-2 focus:ring-echurch-400"
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="border border-echurch-200 rounded px-4 py-2 outline-none focus:ring-2 focus:ring-echurch-400"
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={e => setSenha(e.target.value)}
        />
        <button
          className="bg-echurch-500 text-white py-2 rounded font-semibold shadow hover:bg-echurch-700 transition-colors"
          type="submit"
        >
          Entrar
        </button>
        <Link
          to="/recuperar"
          className="text-echurch-500 hover:underline text-center text-sm mb-2"
        >
          Esqueceu a senha?
        </Link>
        <div className="text-xs text-echurch-400 text-center">
          Acesse com <b>demo@e-church.com</b> / <b>123456</b> para testar
        </div>
      </form>
    </div>
  );
}
