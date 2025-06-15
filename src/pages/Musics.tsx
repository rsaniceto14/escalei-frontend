
export default function Musics() {
  const musicas = [
    { id: 1, nome: "A Ele a Glória", link: "https://www.cifras.com.br", spotify: "", arquivos: ["Soprano.mp3", "Tenor.mp3"] },
    { id: 2, nome: "Tu És Soberano", link: "", spotify: "https://open.spotify.com/track/example", arquivos: [] },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-echurch-700 mb-4">Músicas</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <table className="w-full">
          <thead>
            <tr className="text-echurch-700 border-b">
              <th className="py-2 text-left">Nome</th>
              <th className="py-2 text-left">Cifra</th>
              <th className="py-2 text-left">Spotify</th>
              <th className="py-2 text-left">Arquivos</th>
            </tr>
          </thead>
          <tbody>
            {musicas.map(m => (
              <tr key={m.id} className="border-b last:border-0">
                <td className="py-2">{m.nome}</td>
                <td className="py-2">
                  {m.link ? (
                    <a href={m.link} className="text-echurch-500 underline" target="_blank" rel="noopener noreferrer">Cifra</a>
                  ) : "--"}
                </td>
                <td className="py-2">
                  {m.spotify ? (
                    <a href={m.spotify} className="text-green-600 underline" target="_blank" rel="noopener noreferrer">Spotify</a>
                  ) : "--"}
                </td>
                <td className="py-2">
                  {m.arquivos.length
                    ? m.arquivos.map(arq => <span key={arq} className="inline-block bg-echurch-100 text-echurch-700 rounded px-2 py-1 mr-1 text-xs">{arq}</span>)
                    : "--"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
