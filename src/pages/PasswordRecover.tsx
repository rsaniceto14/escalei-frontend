
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService  } from "@/api";

export default function PasswordRecover() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [info, setInfo] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    const res = authService.forgotPassword(email);

    if (res) {
      setInfo("Email enviado! Confira sua caixa de entrada.");
      setSubmitting(false);
      setTimeout(() => navigate("/login"), 1200);
    } else {
      setInfo("Falha ao enviar email de recuperação!");
      setSubmitting(false);
    }
  
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-echurch-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md flex flex-col gap-4 animate-fade-in"
      >
        <h2 className="text-center font-bold text-2xl text-echurch-700 mb-2">Recuperar senha</h2>
        <p className="text-echurch-500 text-center mb-2 text-sm">Informe seu e-mail para receber o código de redefinição.</p>
        <input
          className="border border-echurch-200 rounded px-4 py-2 outline-none focus:ring-2 focus:ring-echurch-400"
          type="email"
          placeholder="E-mail"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-echurch-500 text-white py-2 rounded font-semibold shadow hover:bg-echurch-700 transition-colors"
        >
          {submitting ? "Enviando..." : "Enviar código"}
        </button>
        {info && <div className="text-green-600 text-center">{info}</div>}
      </form>
    </div>
  );
}
