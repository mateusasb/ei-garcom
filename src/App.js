import  React from 'react';
import { Routes, Route } from 'react-router-dom';
import WaiterPublicPage from './pages/waiter-public/WaiterPublicPage';
import WaiterPrivatePage from './pages/waiter-private/WaiterPrivatePage';
import Home from './pages/Home.js';
import Header from './layouts/GlobalHeader.js';
import Footer from './layouts/GlobalFooter.js';
import NotFound from './pages/NotFound.js';
import { AppProvider } from './components/AppProvider.js';
import "./styles/global.css";

function App() {
  
  return (
    <AppProvider>
      <div>
        <Header/>
      </div>

      <div className='app-global'>
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<Home />} />

          {/* Páginas privadas do garçom */}
          <Route path="/g" element={<NotFound />} />
          <Route path="/g" >
            <Route path=":waiterSlug" element={<WaiterPrivatePage />} />
          </Route>

          {/* Páginas públicas do garçom */}
          <Route path="/p" element={<NotFound />} />
          <Route path="/p">
            <Route path=":waiterSlug" element={<WaiterPublicPage />} />
          </Route>

          {/* Página 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <div>
        <Footer/>
      </div>
    </AppProvider>
  );
}

export default App;
