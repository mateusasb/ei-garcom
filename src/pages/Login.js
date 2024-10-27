import React, { useLayoutEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, useOutletContext, useLocation, Link } from "react-router-dom";
import { getUserByEmail } from "../services/controller/userController";
import '../styles/authentication.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [redirectMode, setRedirectMode] = useState(null);
  const { userData, setUserData } = useOutletContext();
  const navigate = useNavigate();
  let location = useLocation();

  useLayoutEffect(() => {
    console.log(location)

    if(location.state.mode) {
      setRedirectMode(location.state.mode)
    }

    if(userData && userData.auth) {
      console.log(userData)
      setLoading(true);
      redirectOnAuthSuccess()
    }

  }, [userData]) // eslint-disable-line

  async function redirectOnAuthSuccess() {
    try {
      const payload = await getUserByEmail(email || userData.email);
      if (!payload) {
        return null

      } else {
        setUserData(payload);
        setLoading(false);
        navigate(`/g/${payload.slug}`);
      }

    } catch(err) {
      console.error('Erro ao carregar os dados do garçom.', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password)
      .then(async () => {
        setLoading(true);
        await redirectOnAuthSuccess()
      })
      
    } catch (err) {
      console.error(err)
      setError(err)
    } finally {
      setLoading(false)
    }
  };

  return (
    <div>
      <form className="auth-form-container" onSubmit={handleLogin}>
        <fieldset>
          <legend>Login</legend>
          <div>
            <label htmlFor="email">E-mail</label>
            <input
              className="form-field"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="email">Senha</label>
            <input
              className="form-field"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            {error && <p>{error}</p>}
          </div>

          <div>
            <button type="submit">Entrar</button>
          </div>

          <div>
            <Link to={'/esqueci-minha-senha'}>Esqueci a senha</Link>
          </div>
          
        </fieldset>
      </form>
      
      {loading && <div className="loader-container"><div className="loader"/></div>}
    </div>
  );
};

export default Login;
