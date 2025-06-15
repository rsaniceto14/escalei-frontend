
import { Link } from "react-router-dom";

export default function Index() {
  // Simulação de dados mockados do usuário
  const escalasParticipa = [
    { nome: "Culto Domingo Manhã", data: "16/06/2025", local: "Igreja Central" },
    { nome: "Reunião de Oração", data: "20/06/2025", local: "On-line" },
  ];
  const escalasPendentes = [
    { nome: "Louvor Sábado", data: "22/06/2025", local: "Igreja Central" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-echurch-700 mb-1">Bem-vindo ao e-church!</h1>
      <p className="mb-8 text-echurch-700/80 text-lg">Gerencie suas escalas e participe ativamente da igreja.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <section className="bg-white rounded-lg shadow p-6 flex flex-col animate-fade-in">
          <h2 className="font-semibold text-echurch-600 text-lg mb-2">Suas escalas</h2>
          <ul>
            {escalasParticipa.map((esc, i) => (
              <li
                key={i}
                className="flex justify-between items-center border-b border-echurch-100 py-2 last:border-0"
              >
                <span>{esc.nome} – <span className="font-light">{esc.data}</span></span>
                <span className="text-echurch-400 text-sm">{esc.local}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="bg-white rounded-lg shadow p-6 flex flex-col animate-fade-in">
          <h2 className="font-semibold text-echurch-600 text-lg mb-2">Pendências de confirmação</h2>
          {escalasPendentes.length > 0 ? (
            <ul>
              {escalasPendentes.map((esc, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center border-b border-echurch-100 py-2 last:border-0"
                >
                  <span>{esc.nome} – <span className="font-light">{esc.data}</span></span>
                  <button className="bg-echurch-500 px-3 py-1 rounded-md text-white shadow hover:bg-echurch-700 transition-colors text-sm font-medium">Confirmar</button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-echurch-400">Nenhuma pendência!</div>
          )}
        </section>
      </div>

      <div className="mb-8 flex gap-4">
        <Link
          to="/scales"
          className="bg-echurch-500 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-echurch-700 transition-colors"
        >
          Visualizar Escalas
        </Link>
        <Link
          to="/profile"
          className="bg-white border border-echurch-200 px-6 py-3 rounded-lg font-semibold text-echurch-700 shadow hover:bg-echurch-100 transition-colors"
        >
          Configurações de Privacidade
        </Link>
      </div>
    </div>
  );
}
