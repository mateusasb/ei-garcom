import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import WaiterPublicPage from '../pages/waiter-public/WaiterPublicPage';
import WaiterPrivatePage from '../pages/waiter-private/WaiterPrivatePage';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import PermissionDenied from '../pages/waiter-public/PermissionDenied';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/cadastro',
        element: <SignUp />,
      },
      {
        path: '/p/:waiterSlug',
        element: <WaiterPublicPage />,
      },
      {
        path: '/g/:waiterSlug',
        element: <WaiterPrivatePage />,
      },
      {
        path: '/sem-permissao',
        element: <PermissionDenied />,
      },
      {
        path: '/not-found',
        element: <NotFound />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
