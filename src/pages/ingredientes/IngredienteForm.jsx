import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSave, FaArrowLeft } from 'react-icons/fa';

import Input from '../../ui/Input';
import api from '../../../services/api';

const IngredienteForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [ingrediente, setIngrediente] = useState({
    nome: '',
    quantidade: '',
    unidade: '',
    precoUnitario: '',
    fornecedor: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      const loadIngrediente = async () => {
        setIsLoading(true);
        try {
          const response = await api.get(`/ingredientes/${id}`);
          setIngrediente(response.data);
        } catch (error) {
          console.error('Erro ao carregar ingrediente:', error);
          toast.error('Erro ao carregar dados do ingrediente');
        } finally {
          setIsLoading(false);
        }
      };
      loadIngrediente();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIngrediente({ ...ingrediente, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!ingrediente.nome.trim()) {
      newErrors.nome = 'O nome é obrigatório';
    }
    
    if (!ingrediente.quantidade) {
      newErrors.quantidade = 'A quantidade é obrigatória';
    } else if (isNaN(ingrediente.quantidade) || Number(ingrediente.quantidade) <= 0) {
      newErrors.quantidade = 'A quantidade deve ser um número positivo';
    }
    
    if (!ingrediente.unidade.trim()) {
      newErrors.unidade = 'A unidade é obrigatória';
    }
    
    if (!ingrediente.precoUnitario) {
      newErrors.precoUnitario = 'O preço unitário é obrigatório';
    } else if (isNaN(ingrediente.precoUnitario) || Number(ingrediente.precoUnitario) <= 0) {
      newErrors.precoUnitario = 'O preço unitário deve ser um número positivo';
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
    
    // Converte os campos numéricos
    const ingredienteFormatado = {
      ...ingrediente,
      quantidade: Number(ingrediente.quantidade),
      precoUnitario: Number(ingrediente.precoUnitario)
    };
    
    setIsLoading(true);
    try {
      if (id) {
        await api.put(`/ingredientes/${id}`, ingredienteFormatado);
        toast.success('Ingrediente atualizado com sucesso!');
      } else {
        await api.post('/ingredientes', ingredienteFormatado);
        toast.success('Ingrediente cadastrado com sucesso!');
      }
      navigate('/ingredientes');
    } catch (error) {
      console.error('Erro ao salvar ingrediente:', error);
      toast.error(error.response?.data?.message || 'Erro ao salvar ingrediente');
    } finally {
      setIsLoading(false);
    }
  };

  const unidadesDisponiveis = ['kg', 'g', 'ml', 'l', 'unidade', 'pacote'];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {id ? 'Editar Ingrediente' : 'Novo Ingrediente'}
        </h1>
        <button
          onClick={() => navigate('/ingredientes')}
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
            label="Nome do Ingrediente"
            value={ingrediente.nome}
            onChange={handleChange}
            required
            error={errors.nome}
          />

          <div className="mb-4">
            <label 
              htmlFor="unidade" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Unidade <span className="text-red-500">*</span>
            </label>
            <select
              id="unidade"
              name="unidade"
              value={ingrediente.unidade}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 border ${
                errors.unidade ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">Selecione a unidade</option>
              {unidadesDisponiveis.map(unidade => (
                <option key={unidade} value={unidade}>{unidade}</option>
              ))}
            </select>
            {errors.unidade && <p className="text-red-500 text-xs mt-1">{errors.unidade}</p>}
          </div>

          <Input
            id="quantidade"
            name="quantidade"
            label="Quantidade"
            type="number"
            value={ingrediente.quantidade}
            onChange={handleChange}
            required
            error={errors.quantidade}
          />
          <Input
            id="precoUnitario"
            name="precoUnitario"
            label="Preço Unitário (R$)"
            type="number"
            step="0.01"
            value={ingrediente.precoUnitario}
            onChange={handleChange}
            required
            error={errors.precoUnitario}
          />
          <Input
            id="fornecedor"
            name="fornecedor"
            label="Fornecedor"
            value={ingrediente.fornecedor}
            onChange={handleChange}
            className="md:col-span-2"
          />
        </div>

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

export default IngredienteForm;