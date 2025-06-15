
export default function Chats() {
  const chats = [
    { id: 1, nome: "Louvor", ultima: "Vamos ensaiar sábado!" },
    { id: 2, nome: "Diáconos", ultima: "Fiquem atentos ao cronograma!" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-echurch-700 mb-4">Chats</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <ul>
          {chats.map(chat => (
            <li key={chat.id} className="border-b last:border-0 py-4">
              <div className="font-semibold text-echurch-600">{chat.nome}</div>
              <div className="text-echurch-400 text-sm">{chat.ultima}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
