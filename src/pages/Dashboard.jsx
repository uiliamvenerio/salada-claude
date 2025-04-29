import Card from '../components/ui/Card';
import { 
  UserGroupIcon, 
  BookOpenIcon, 
  CakeIcon 
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon, color }) => {
  const Icon = icon;
  
  return (
    <Card className="flex items-center">
      <div className={`p-3 rounded-full bg-${color}-100 mr-4`}>
        <Icon className={`h-6 w-6 text-${color}-600`} />
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-600">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </Card>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    clientes: 0,
    receitas: 0,
    ingredientes: 0
  });
  
  useEffect(() => {
    // Simulando chamada à API
    setTimeout(() => {
      setStats({
        clientes: 24,
        receitas: 156,
        ingredientes: 312
      });
    }, 500);
  }, []);
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Clientes" 
          value={stats.clientes} 
          icon={UserGroupIcon} 
          color="primary" 
        />
        <StatCard 
          title="Receitas" 
          value={stats.receitas} 
          icon={BookOpenIcon} 
          color="secondary" 
        />
        <StatCard 
          title="Ingredientes" 
          value={stats.ingredientes} 
          icon={CakeIcon} 
          color="amber" 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Últimas Receitas">
          <ul className="divide-y">
            <li className="py-3">
              <Link to="/receitas/1" className="text-primary-600 hover:text-primary-800">
                Risoto de Funghi
              </Link>
              <p className="text-sm text-gray-600">Adicionado em 12/10/2023</p>
            </li>
            <li className="py-3">
              <Link to="/receitas/2" className="text-primary-600 hover:text-primary-800">
                Penne ao Molho Pesto
              </Link>
              <p className="text-sm text-gray-600">Adicionado em 11/10/2023</p>
            </li>
            <li className="py-3">
              <Link to="/receitas/3" className="text-primary-600 hover:text-primary-800">
                Lasanha de Berinjela
              </Link>
              <p className="text-sm text-gray-600">Adicionado em 10/10/2023</p>
            </li>
          </ul>
        </Card>
        
        <Card title="Clientes Recentes">
          <ul className="divide-y">
            <li className="py-3">
              <Link to="/clientes/1" className="text-primary-600 hover:text-primary-800">
                Restaurante Buongiorno
              </Link>
              <p className="text-sm text-gray-600">São Paulo, SP</p>
            </li>
            <li className="py-3">
              <Link to="/clientes/2" className="text-primary-600 hover:text-primary-800">
                Padaria Sabor e Arte
              </Link>
              <p className="text-sm text-gray-600">Rio de Janeiro, RJ</p>
            </li>
            <li className="py-3">
              <Link to="/clientes/3" className="text-primary-600 hover:text-primary-800">
                Confeitaria Dolce Vita
              </Link>
              <p className="text-sm text-gray-600">Belo Horizonte, MG</p>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;