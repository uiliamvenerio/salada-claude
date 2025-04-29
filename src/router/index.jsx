import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import ClientesList from '../pages/clientes/ClientesList';
import ClienteForm from '../pages/clientes/ClienteForm';
import ClienteDetails from '../pages/clientes/ClienteDetails';
import ReceitasList from '../pages/receitas/ReceitasList';
import ReceitaForm from '../pages/receitas/ReceitaForm';
import ReceitaDetails from '../pages/receitas/ReceitaDetails';
import IngredientesList from '../pages/ingredientes/IngredientesList';
import IngredienteForm from '../pages/ingredientes/IngredienteForm';
import IngredienteDetails from '../pages/ingredientes/IngredienteDetails';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      
      <Route path="/clientes" element={<ClientesList />} />
      <Route path="/clientes/novo" element={<ClienteForm />} />
      <Route path="/clientes/editar/:id" element={<ClienteForm />} />
      <Route path="/clientes/:id" element={<ClienteDetails />} />
      
      <Route path="/receitas" element={<ReceitasList />} />
      <Route path="/receitas/novo" element={<ReceitaForm />} />
      <Route path="/receitas/editar/:id" element={<ReceitaForm />} />
      <Route path="/receitas/:id" element={<ReceitaDetails />} />
      
      <Route path="/ingredientes" element={<IngredientesList />} />
      <Route path="/ingredientes/novo" element={<IngredienteForm />} />
      <Route path="/ingredientes/editar/:id" element={<IngredienteForm />} />
      <Route path="/ingredientes/:id" element={<IngredienteDetails />} />
    </Routes>
  );
};

export default AppRouter;