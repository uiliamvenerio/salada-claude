import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

const IngredientesList = () => {
  const [ingredientes, setIngredientes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulação de chamada à API
    setTimeout(() => {
      setIngredientes([
        { id: 1, descricao_alimento: 'Arroz arbóreo', categoria: 'Cereais', energia_kcal: 356, proteina_g: 7.2 },
        { id: 2, descricao_alimento: 'Cogumelos funghi secchi', categoria: 'Vegetais', energia_kcal: 31, proteina_g: 2.6 },
        { id: 3, descricao_alimento: 'Creme de leite fresco', categoria: 'Laticínios', energia_kcal: 292, proteina_g: 2.3 },
        { id: 4, descricao_alimento: 'Queijo parmesão', categoria: 'Laticínios', energia_kcal: 431, proteina_g: 38.5 },
      ]);
      setLoading(false);
    }, 500);
  }, []);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Ingredientes</h1>
        <Link to="/ingredientes/novo">
          <Button>
            <PlusIcon className="h-5 w-5 mr-2" />
            Novo Ingrediente
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Energia (kcal)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proteína (g)</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ingredientes.map((ingrediente) => (
                  <tr key={ingrediente.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{ingrediente.descricao_alimento}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{ingrediente.categoria}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{ingrediente.energia_kcal}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{ingrediente.proteina_g}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link to={`/ingredientes/${ingrediente.id}`}>
                          <Button variant="outline" size="sm">
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link to={`/ingredientes/editar/${ingrediente.id}`}>
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

export default IngredientesList;