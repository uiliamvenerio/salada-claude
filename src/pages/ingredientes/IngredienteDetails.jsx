import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaArrowLeft, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

import api from '../../../services/api';

const IngredienteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ingrediente, setIngrediente] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [receitas, setReceitas] = useState([]);

  useEffect(() => {
    const loadIngrediente = async () => {
      try {
        const response = await api.get(`/ingredientes/${id}`);
        setIngrediente(response.data);
        
        // Carregar receitas que usam este ingrediente
        const receitasResponse = await api.get('/receitas');
        const receitasRelacionadas = receitasResponse.data.filter(receita =>
          receita.ingredientes.some(ing => ing.id === parseInt(id))
        );
        setReceitas(receitasRelacionadas);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar dados do ingrediente');
        navigate('/ingredientes');
      } finally {
        setIsLoading(false);
      }
    };

    loadIngrediente();
  }, [id, navigate]);

  const handleDelete = async () => {
    try {
      await api.delete(`/ingredientes/${id}`);
      toast.success('Ingrediente excluído com sucesso!');
      navigate('/ingredientes');
    } catch (error) {
      console.error('Erro ao excluir ingrediente:', error);
      toast.error(error.response?.data?.message || 'Erro ao excluir ingrediente');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!ingrediente) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-center text-gray-500">Ingrediente não encontrado</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Detalhes do Ingrediente</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate('/ingredientes')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <FaArrowLeft className="mr-2" /> Voltar
          </button>
          <button
            onClick={() => navigate(`/ingredientes/edit/${id}`)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaEdit className="mr-2" /> Editar
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center text-red-600 hover:text-red-800"
          >
            <FaTrash className="mr-2" /> Excluir
          </button>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Nome</p>
            <p className="font-medium">{ingrediente.nome}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Quantidade</p>
            <p className="font-medium">{ingrediente.quantidade} {ingrediente.unidade}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Preço Unitário</p>
            <p className="font-medium">R$ {ingrediente.precoUnitario.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Fornecedor</p>
            <p className="font-medium">{ingrediente.fornecedor || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Valor Total em Estoque</p>
            <p className="font-medium">R$ {(ingrediente.quantidade * ingrediente.precoUnitario).toFixed(2)}</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-4">Receitas que utilizam este ingrediente</h2>
      
      {receitas.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome da Receita</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantidade Usada</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {receitas.map((receita) => {
                const ingredienteNaReceita = receita.ingredientes.find(ing => ing.id === parseInt(id));
                return (
                  <tr key={receita.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {receita.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ingredienteNaReceita ? `${ingredienteNaReceita.quantidade} ${ingrediente.unidade}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {receita.categoria}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => navigate(`/receitas/${receita.id}`)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Detalhes
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">Este ingrediente não é utilizado em nenhuma receita.</p>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Confirmar exclusão</h3>
            <p className="mb-6">Tem certeza que deseja excluir o ingrediente <strong>{ingrediente.nome}</strong>? Esta ação não pode ser desfeita.</p>
            {receitas.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md mb-4">
                <p className="text-yellow-800 text-sm">
                  <strong>Atenção:</strong> Este ingrediente está sendo usado em {receitas.length} receita(s). A exclusão pode afetar estas receitas.
                </p>
              </div>
            )}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredienteDetails;