import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router';
import AppSidebar from './components/layout/AppSidebar';
import AppHeader from './components/layout/AppHeader';
import PageContainer from './components/layout/PageContainer';
import { useState } from 'react';
import './styles/index.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-50">
        <AppSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <AppHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          <PageContainer>
            <AppRouter />
          </PageContainer>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;