import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

const ReceitasList = () => {
  const [receitas, setReceitas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulação de chamada à API
    setTimeout(() => {
      setReceitas([
        { id: 1, nome: 'Risoto de Funghi', cliente: 'Restaurante Buongiorno', categoria: 'Massas', tempo_preparo: 45, rendimento_porcoes: 4 },
        { id: 2, nome: 'Penne ao Molho Pesto', cliente: 'Restaurante Buongiorno', categoria: 'Massas', tempo_preparo: 30, rendimento_porcoes: 2 },
        { id: 3, nome: 'Lasanha de Berinjela', cliente: 'Confeitaria Dolce Vita', categoria: 'Massas', tempo_preparo: 90, rendimento_porcoes: 8 },
        { id: 4, nome: 'Pão Artesanal', cliente: 'Padaria Sabor e Arte', categoria: 'Pães', tempo_preparo: 180, rendimento_porcoes: 2 },
      ]);
      setLoading(false);
    }, 500);
  }, []);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Receitas</h1>
        <Link to="/receitas/novo">
          <Button>
            <PlusIcon className="h-5 w-5 mr-2" />
            Nova Receita
          </Button>
        </Link>
      </div>
      
      <Card>
        {loading ? (
          <div className="text-center py-8">
            <p>Carregando...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tempo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rendimento</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {receitas.map((receita) => (
                  <tr key={receita.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{receita.nome}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{receita.cliente}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{receita.categoria}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{receita.tempo_preparo} min</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{receita.rendimento_porcoes} porções</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link to={`/receitas/${receita.id}`}>
                          <Button variant="outline" size="sm">
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link to={`/receitas/editar/${receita.id}`}>
                          <Button variant="secondary" size="sm">
                            <PencilIcon className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="danger" size="sm">
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ReceitasList;