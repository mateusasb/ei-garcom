import React, { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // Certifique-se de ajustar o caminho
import { useNavigate } from "react-router-dom";
import { getUserByEmail } from "../services/controller/userController";
import '../styles/login.css'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState();
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null)
  const navigate = useNavigate();

  async function redirectOnAuthSuccess() {
    setLoading(true);
    try {
      const userData = await getUserByEmail(email);
      if (!userData) {
        setUserInfo(null)
        return null

      } else {
        setUserInfo(userData);
        setLoading(false);
        navigate(`/g/${userData.slug}`)
      }

    } catch(err) {
      console.error('Erro ao carregar os dados do garçom.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        //const user = userCredential.user;
        //console.log("Usuário logado:", user);
        await redirectOnAuthSuccess()
      })
      
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <fieldset>
          <legend>Login</legend>
          <div>
            <label htmlFor="email">E-mail</label>
            <input
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
        </fieldset>
      </form>
      
      {loading && <div className="loader-container"><div className="loader"/></div>}
    </div>
  );
};

export default Login;
