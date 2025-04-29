import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaArrowLeft, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

import api from '../../services/api';

const ClienteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [compras, setCompras] = useState([]);

  useEffect(() => {
    const loadCliente = async () => {
      try {
        const response = await api.get(`/clientes/${id}`);
        setCliente(response.data);
        
        // Carregar compras do cliente
        const comprasResponse = await api.get(`/compras?clienteId=${id}`);
        setCompras(comprasResponse.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar dados do cliente');
        navigate('/clientes');
      } finally {
        setIsLoading(false);
      }
    };

    loadCliente();
  }, [id, navigate]);

  const handleDelete = async () => {
    try {
      await api.delete(`/clientes/${id}`);
      toast.success('Cliente excluído com sucesso!');
      navigate('/clientes');
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      toast.error(error.response?.data?.message || 'Erro ao excluir cliente');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-center text-gray-500">Cliente não encontrado</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Detalhes do Cliente</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate('/clientes')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <FaArrowLeft className="mr-2" /> Voltar
          </button>
          <button
            onClick={() => navigate(`/clientes/edit/${id}`)}
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
            <p className="font-medium">{cliente.nome}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">CPF</p>
            <p className="font-medium">{cliente.cpf}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">E-mail</p>
            <p className="font-medium">{cliente.email || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Telefone</p>
            <p className="font-medium">{cliente.telefone}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Endereço</p>
            <p className="font-medium">{cliente.endereco || '-'}</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-4">Histórico de Compras</h2>
      
      {compras.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {compras.map((compra) => (
                <tr key={compra.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(compra.data).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    R$ {compra.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      compra.status === 'Concluída' ? 'bg-green-100 text-green-800' : 
                      compra.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {compra.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => navigate(`/compras/${compra.id}`)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">Nenhuma compra registrada para este cliente.</p>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Confirmar exclusão</h3>
            <p className="mb-6">Tem certeza que deseja excluir o cliente <strong>{cliente.nome}</strong>? Esta ação não pode ser desfeita.</p>
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

export default ClienteDetails;