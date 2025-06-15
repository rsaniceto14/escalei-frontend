
import { Link } from "react-router-dom";

export default function Scales() {
  const escalas = [
    { id: 1, nome: "Culto Domingo Manhã", tipo: "Geral", data: "16/06/2025" },
    { id: 2, nome: "Louvor Sábado", tipo: "Louvor", data: "22/06/2025" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-echurch-700">Escalas</h1>
        <Link
          to="/scales/create"
          className="bg-echurch-500 text-white px-5 py-2 rounded-lg shadow hover:bg-echurch-700 transition-colors font-medium"
        >
          Nova Escala
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <table className="w-full">
          <thead>
            <tr className="text-echurch-700 border-b">
              <th className="text-left py-2">Nome</th>
              <th className="text-left py-2">Tipo</th>
              <th className="text-left py-2">Data</th>
            </tr>
          </thead>
          <tbody>
            {escalas.map(e => (
              <tr key={e.id} className="border-b last:border-b-0 hover:bg-echurch-50 transition">
                <td className="py-3">{e.nome}</td>
                <td className="py-3">{e.tipo}</td>
                <td className="py-3">{e.data}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
