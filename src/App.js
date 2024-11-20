import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './layouts/GlobalHeader';
import Footer from './layouts/GlobalFooter';
import { AppProvider } from './components/AppProvider';
import './styles/global.css';

function App() {
  const [userData, setUserData] = useState(null);

  return (
    <AppProvider>
      <div>
        <Header />
      </div>

      <div className="app-global">
        <Outlet context={{userData, setUserData}}/> {/* Renderiza as rotas aninhadas aqui */}
      </div>

      <div>
        <Footer />
      </div>
    </AppProvider>
  );
}

export default App;
