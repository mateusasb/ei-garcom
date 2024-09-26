import  React from 'react';
import { Link, useSearchParams, Routes, Route } from 'react-router-dom';
import WaiterPublicPage from './pages/waiter-public/WaiterPublicPage';
import WaiterPrivatePage from './pages/waiter-private/WaiterPrivatePage';
import Home from './pages/Home.js'
import MainLayout from './layouts/MainLayout.js';
import NotFound from './pages/NotFound.js'
import "./styles/global.css"

function App() {
  const [searchParams, setSearchParams] = useSearchParams({ n: 3 })
  const number = searchParams.get('n')
  
  return (
    <>
      <MainLayout>
        <nav>
          <input
            type='number'
            value={number}
            onChange={e => setSearchParams({ n: e.target.value })}
          />
          <ul>
            <li><Link to={`/p/${number}`}>Garçom {number}</Link></li>
            <li><Link to="/" state="XPTO">Home</Link></li>
            <li><Link to="/p/jose">Waiter Public</Link></li>
            <li><Link to="/g/jose">Waiter Private</Link></li>
          </ul>
        </nav>
      </MainLayout>

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
    </>
  );
}

export default App;
