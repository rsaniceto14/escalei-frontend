
export default function Profile() {
  // Simulação de dados mockados
  const usuario = {
    nome: "Maria Oliveira",
    email: "demo@e-church.com",
    area: "Louvor",
    permissoes: ["Criar Escala", "Editar Disponibilidade"],
    foto: "https://randomuser.me/api/portraits/women/44.jpg",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-echurch-700 mb-4">Perfil</h1>
      <div className="flex flex-col lg:flex-row gap-8 bg-white rounded-lg p-6 shadow mb-8">
        <img
          src={usuario.foto}
          alt="Foto do usuário"
          className="rounded-full h-32 w-32 object-cover border-4 border-echurch-200"
        />
        <div>
          <div className="mb-3">
            <div className="text-lg font-medium">{usuario.nome}</div>
            <div className="text-echurch-400">{usuario.email}</div>
          </div>
          <div className="mb-2">
            <span className="inline-block px-3 py-1 rounded-full bg-echurch-100 text-echurch-700 font-semibold text-xs mr-2">
              Área: {usuario.area}
            </span>
          </div>
          <div>
            <span className="font-semibold text-echurch-600">Permissões:</span>
            <ul className="list-disc ml-5 mt-1 text-echurch-500 text-sm">
              {usuario.permissoes.map(p => <li key={p}>{p}</li>)}
            </ul>
          </div>
        </div>
      </div>
      <button className="bg-echurch-500 text-white px-6 py-2 rounded hover:bg-echurch-700 transition-colors font-semibold mb-2">Editar perfil</button>
      <button className="ml-4 bg-echurch-100 text-echurch-600 px-6 py-2 rounded hover:bg-echurch-200 transition-colors font-semibold">Mudar senha</button>
    </div>
  );
}
