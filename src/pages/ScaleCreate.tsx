
import { useState } from "react";

export default function ScaleCreate() {
  const [tipo, setTipo] = useState("Geral");
  const [musicas, setMusicas] = useState<string[]>([]);
  const [nomeMusica, setNomeMusica] = useState("");

  function addMusica(e: React.FormEvent) {
    e.preventDefault();
    if (nomeMusica && !musicas.includes(nomeMusica)) {
      setMusicas([...musicas, nomeMusica]);
      setNomeMusica("");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-echurch-700 mb-6">Criar nova escala</h1>
      <form className="bg-white rounded-lg shadow p-6 flex flex-col gap-4 max-w-xl">
        <label>
          Tipo de escala:
          <select
            className="ml-2 border border-echurch-200 rounded px-3 py-1"
            value={tipo}
            onChange={e => setTipo(e.target.value)}
          >
            <option>Geral</option>
            <option>Louvor</option>
          </select>
        </label>
        <label>
          Data e hora:
          <input className="ml-2 border rounded px-3 py-1" type="datetime-local" />
        </label>
        <label>
          Local:
          <input className="ml-2 border rounded px-3 py-1" type="text" placeholder="Ex: Igreja Central" />
        </label>
        <label>
          Tipo:
          <select className="ml-2 border rounded px-3 py-1">
            <option>Presencial</option>
            <option>Online</option>
          </select>
        </label>
        <label>
          Grupo / Área envolvida:
          <input className="ml-2 border rounded px-3 py-1" type="text" placeholder="Ex: Louvor, Diáconos..." />
        </label>
        {tipo === "Louvor" && (
          <div className="pt-2">
            <h2 className="font-semibold mb-2 text-echurch-700">Músicas</h2>
            <form onSubmit={addMusica} className="flex gap-2 mb-2">
              <input
                className="border rounded px-3 py-1 flex-1"
                type="text"
                placeholder="Nome da música"
                value={nomeMusica}
                onChange={e => setNomeMusica(e.target.value)}
              />
              <button type="submit" className="bg-echurch-500 text-white px-4 rounded hover:bg-echurch-700 transition">
                Adicionar
              </button>
            </form>
            <ul>
              {musicas.map(m => (
                <li key={m} className="py-1 px-2 text-echurch-800 bg-echurch-100 rounded mb-1 inline-block">{m}</li>
              ))}
            </ul>
          </div>
        )}
        <button className="mt-4 bg-echurch-500 text-white py-2 rounded font-semibold shadow hover:bg-echurch-700 transition-colors w-1/2" type="button">
          Salvar escala
        </button>
      </form>
    </div>
  );
}
