import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSave, FaArrowLeft, FaPlus, FaTimes } from 'react-icons/fa';

import Input from '../components/ui/Input';
import api from '../../services/api';

const ReceitaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [ingredientesDisponiveis, setIngredientesDisponiveis] = useState([]);
  const [receita, setReceita] = useState({
    nome: '',
    descricao: '',
    tempoPreparo: '',
    categoria: '',
    preco: '',
    ingredientes: []
  });
  const [errors, setErrors] = useState({});
  const [ingredienteSelecionado, setIngredienteSelecionado] = useState('');
  const [quantidadeIngrediente, setQuantidadeIngrediente] = useState('');

  useEffect(() => {
    const loadIngredientes = async () => {
      try {
        const response = await api.get('/ingredientes');
        setIngredientesDisponiveis(response.data);
      } catch (error) {
        console.error('Erro ao carregar ingredientes:', error);
        toast.error('Erro ao carregar lista de ingredientes');
      }
    };

    loadIngredientes();

    if (id) {
      const loadReceita = async () => {
        setIsLoading(true);
        try {
          const response = await api.get(`/receitas/${id}`);
          setReceita(response.data);
        } catch (error) {
          console.error('Erro ao carregar receita:', error);
          toast.error('Erro ao carregar dados da receita');
        } finally {
          setIsLoading(false);
        }
      };
      loadReceita();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReceita({ ...receita, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleAddIngrediente = () => {
    if (!ingredienteSelecionado || !quantidadeIngrediente) {
      toast.error('Selecione um ingrediente e informe a quantidade');
      return;
    }

    const ingrediente = ingredientesDisponiveis.find(i => i.id === parseInt(ingredienteSelecionado));
    if (!ingrediente) return;

    // Verificar se o ingrediente já foi adicionado
    if (receita.ingredientes.some(i => i.id === ingrediente.id)) {
      toast.error('Este ingrediente já foi adicionado à receita');
      return;
    }

    const novoIngrediente = {
      id: ingrediente.id,
      nome: ingrediente.nome,
      quantidade: parseFloat(quantidadeIngrediente),
      unidade: ingrediente.unidade
    };

    setReceita({
      ...receita,
      ingredientes: [...receita.ingredientes, novoIngrediente]
    });

    // Limpar campos
    setIngredienteSelecionado('');
    setQuantidadeIngrediente('');
  };

  const handleRemoveIngrediente = (id) => {
    setReceita({
      ...receita,
      ingredientes: receita.ingredientes.filter(i => i.id !== id)
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!receita.nome.trim()) {
      newErrors.nome = 'O nome é obrigatório';
    }
    
    if (!receita.tempoPreparo) {
      newErrors.tempoPreparo = 'O tempo de preparo é obrigatório';
    } else if (isNaN(receita.tempoPreparo) || Number(receita.tempoPreparo) <= 0) {
      newErrors.tempoPreparo = 'Tempo de preparo inválido';
    }
    
    if (!receita.categoria.trim()) {
      newErrors.categoria = 'A categoria é obrigatória';
    }
    
    if (!receita.preco) {
      newErrors.preco = 'O preço é obrigatório';
    } else if (isNaN(receita.preco) || Number(receita.preco) <= 0) {
      newErrors.preco = 'O preço deve ser um número positivo';
    }

    if (receita.ingredientes.length === 0) {
      newErrors.ingredientes = 'Adicione pelo menos um ingrediente à receita';
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
    const receitaFormatada = {
      ...receita,
      tempoPreparo: Number(receita.tempoPreparo),
      preco: Number(receita.preco)
    };
    
    setIsLoading(true);
    try {
      if (id) {
        await api.put(`/receitas/${id}`, receitaFormatada);
        toast.success('Receita atualizada com sucesso!');
      } else {
        await api.post('/receitas', receitaFormatada);
        toast.success('Receita cadastrada com sucesso!');
      }
      navigate('/receitas');
    } catch (error) {
      console.error('Erro ao salvar receita:', error);
      toast.error(error.response?.data?.message || 'Erro ao salvar receita');
    } finally {
      setIsLoading(false);
    }
  };

  const categorias = ['Pães', 'Bolos', 'Doces', 'Salgados', 'Bebidas', 'Outros'];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {id ? 'Editar Receita' : 'Nova Receita'}
        </h1>
        <button
          onClick={() => navigate('/receitas')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft className="mr-2" /> Voltar
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Input
            id="nome"
            name="nome"
            label="Nome da Receita"
            value={receita.nome}
            onChange={handleChange}
            required
            error={errors.nome}
          />

          <div className="mb-4">
            <label 
              htmlFor="categoria" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Categoria <span className="text-red-500">*</span>
            </label>
            <select
              id="categoria"
              name="categoria"
              value={receita.categoria}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 border ${
                errors.categoria ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">Selecione a categoria</option>
              {categorias.map(categoria => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </select>
            {errors.categoria && <p className="text-red-500 text-xs mt-1">{errors.categoria}</p>}
          </div>

          <Input
            id="tempoPreparo"
            name="tempoPreparo"
            label="Tempo de Preparo (minutos)"
            type="number"
            value={receita.tempoPreparo}
            onChange={handleChange}
            required
            error={errors.tempoPreparo}
          />
          <Input
            id="preco"
            name="preco"
            label="Preço (R$)"
            type="number"
            step="0.01"
            value={receita.preco}
            onChange={handleChange}
            required
            error={errors.preco}
          />
        </div>

        <div className="mb-6">
          <label 
            htmlFor="descricao" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Descrição/Modo de Preparo
          </label>
          <textarea
            id="descricao"
            name="descricao"
            rows="4"
            value={receita.descricao}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          ></textarea>
        </div>

        <div className="border-t border-gray-200 pt-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Ingredientes</h2>
          
          <div className="flex flex-wrap items-end gap-4 mb-4">
            <div className="flex-grow min-w-[200px]">
              <label 
                htmlFor="ingrediente" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Ingrediente
              </label>
              <select
                id="ingrediente"
                value={ingredienteSelecionado}
                onChange={(e) => setIngredienteSelecionado(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um ingrediente</option>
                {ingredientesDisponiveis.map(ingrediente => (
                  <option 
                    key={ingrediente.id} 
                    value={ingrediente.id}
                    disabled={receita.ingredientes.some(i => i.id === ingrediente.id)}
                  >
                    {ingrediente.nome} - {ingrediente.quantidade} {ingrediente.unidade} disponíveis
                  </option>
                ))}
              </select>
            </div>
            <div className="w-32">
              <label 
                htmlFor="quantidade" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Quantidade
              </label>
              <input
                id="quantidade"
                type="number"
                step="0.01"
                value={quantidadeIngrediente}
                onChange={(e) => setQuantidadeIngrediente(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={handleAddIngrediente}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <FaPlus className="inline mr-1" /> Adicionar
            </button>
          </div>
          
          {errors.ingredientes && (
            <p className="text-red-500 text-sm mb-4">{errors.ingredientes}</p>
          )}

          {receita.ingredientes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ingrediente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantidade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
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
                        <button
                          type="button"
                          onClick={() => handleRemoveIngrediente(ingrediente.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTimes className="inline" /> Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Nenhum ingrediente adicionado.</p>
          )}
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
                <FaSave className="mr-2" /> Salvar Receita
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReceitaForm;