import React, { useEffect, useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase"; 
import { useNavigate, useOutletContext } from "react-router-dom";

const SignUp = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [polling, setPolling] = useState(false);
  const { setUserData } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if(user && !user.emailVerified) {
        setPolling(true);
        setUserData(user);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const checkEmailVerification = async () => {
      if(auth.currentUser) {
        await auth.currentUser.reload();
        if(auth.currentUser.emailVerified) {
          setPolling(false);
          navigate("/login");
        }
      }
    };

    if(polling) {
      const intervalId = setInterval(() => {
        checkEmailVerification();
      }, 3000);

      return () => clearInterval(intervalId); 
    }
  }, [polling, navigate]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        sendEmailVerification(auth.currentUser)
      })
      //const user = userCredential.user;
    } catch (error) {
      setError(error.message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSignUp}>
        <fieldset>
          <legend>Cadastre-se</legend>
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

export default SignUp;
