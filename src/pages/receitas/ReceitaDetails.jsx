import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaArrowLeft, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

import api from '../../services/api';

const ReceitasDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [receita, setReceita] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const loadReceita = async () => {
      try {
        const response = await api.get(`/receitas/${id}`);
        setReceita(response.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar dados da receita');
        navigate('/receitas');
      } finally {
        setIsLoading(false);
      }
    };

    loadReceita();
  }, [id, navigate]);

  const handleDelete = async () => {
    try {
      await api.delete(`/receitas/${id}`);
      toast.success('Receita excluída com sucesso!');
      navigate('/receitas');
    } catch (error) {
      console.error('Erro ao excluir receita:', error);
      toast.error(error.response?.data?.message || 'Erro ao excluir receita');
    }
  };

  const calcularCustoTotal = () => {
    if (!receita || !receita.ingredientes.length) return 0;
    
    // Simulando um cálculo de custo baseado nos ingredientes
    // Em um sistema real, isso seria baseado nos preços reais dos ingredientes
    return receita.ingredientes.reduce((total, ingrediente) => {
      return total + (ingrediente.preco || 2) * ingrediente.quantidade;
    }, 0);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!receita) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-center text-gray-500">Receita não encontrada</p>
      </div>
    );
  }

  const custoTotal = calcularCustoTotal();
  const lucroEstimado = receita.preco - custoTotal;
  const margemLucro = (lucroEstimado / receita.preco) * 100;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Detalhes da Receita</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate('/receitas')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <FaArrowLeft className="mr-2" /> Voltar
          </button>
          <button
            onClick={() => navigate(`/receitas/edit/${id}`)}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Nome</p>
            <p className="font-medium">{receita.nome}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Categoria</p>
            <p className="font-medium">{receita.categoria}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tempo de Preparo</p>
            <p className="font-medium">{receita.tempoPreparo} minutos</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Preço de Venda</p>
            <p className="font-medium text-green-600">R$ {receita.preco.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Custo Estimado</p>
            <p className="font-medium text-red-600">R$ {custoTotal.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Lucro Estimado</p>
            <p className="font-medium text-blue-600">
              R$ {lucroEstimado.toFixed(2)} ({margemLucro.toFixed(1)}%)
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Descrição / Modo de Preparo</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          {receita.descricao ? (
            <p className="whitespace-pre-line">{receita.descricao}</p>
          ) : (
            <p className="text-gray-500 italic">Nenhuma descrição cadastrada</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Ingredientes</h2>
        
        {receita.ingredientes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ingrediente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantidade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Custo Estimado</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {receita.ingredientes.map((ingrediente) => (
                  <tr key={ingrediente.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ingrediente.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ingrediente.quantidade} {ingrediente.unidade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      R$ {((ingrediente.preco || 2) * ingrediente.quantidade).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Nenhum ingrediente cadastrado para esta receita.</p>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Confirmar exclusão</h3>
            <p className="mb-6">Tem certeza que deseja excluir a receita <strong>{receita.nome}</strong>? Esta ação não pode ser desfeita.</p>
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

export default ReceitasDetails;