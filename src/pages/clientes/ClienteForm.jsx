import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

import Input from '../../ui/Input';
import api from '../../../services/api';

const ClienteForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [cliente, setCliente] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    endereco: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      const loadCliente = async () => {
        setIsLoading(true);
        try {
          const response = await api.get(`/clientes/${id}`);
          setCliente(response.data);
        } catch (error) {
          console.error('Erro ao carregar cliente:', error);
          toast.error('Erro ao carregar dados do cliente');
        } finally {
          setIsLoading(false);
        }
      };
      loadCliente();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente({ ...cliente, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!cliente.nome.trim()) {
      newErrors.nome = 'O nome é obrigatório';
    }
    
    if (!cliente.cpf.trim()) {
      newErrors.cpf = 'O CPF é obrigatório';
    } else if (!/^\d{11}$/.test(cliente.cpf.replace(/\D/g, ''))) {
      newErrors.cpf = 'CPF inválido';
    }
    
    if (cliente.email && !/\S+@\S+\.\S+/.test(cliente.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!cliente.telefone.trim()) {
      newErrors.telefone = 'O telefone é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }
    
    setIsLoading(true);
    try {
      if (id) {
        await api.put(`/clientes/${id}`, cliente);
        toast.success('Cliente atualizado com sucesso!');
      } else {
        await api.post('/clientes', cliente);
        toast.success('Cliente cadastrado com sucesso!');
      }
      navigate('/clientes');
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      toast.error(error.response?.data?.message || 'Erro ao salvar cliente');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {id ? 'Editar Cliente' : 'Novo Cliente'}
        </h1>
        <button
          onClick={() => navigate('/clientes')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft className="mr-2" /> Voltar
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            id="nome"
            name="nome"
            label="Nome"
            value={cliente.nome}
            onChange={handleChange}
            required
            error={errors.nome}
          />
          <Input
            id="cpf"
            name="cpf"
            label="CPF"
            value={cliente.cpf}
            onChange={handleChange}
            required
            error={errors.cpf}
          />
          <Input
            id="telefone"
            name="telefone"
            label="Telefone"
            value={cliente.telefone}
            onChange={handleChange}
            required
            error={errors.telefone}
          />
          <Input
            id="email"
            name="email"
            label="E-mail"
            type="email"
            value={cliente.email}
            onChange={handleChange}
            error={errors.email}
          />
        </div>
        
        <Input
          id="endereco"
          name="endereco"
          label="Endereço"
          value={cliente.endereco}
          onChange={handleChange}
        />

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="animate-spin inline-block h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                Salvando...
              </>
            ) : (
              <>
                <FaSave className="mr-2" /> Salvar
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClienteForm;