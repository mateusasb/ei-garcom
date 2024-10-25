import React, { useEffect, useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase"; 
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await user.reload();
        if (user.auth && user.emailVerified) {
          //setIsVerified(true);
          navigate("/login");
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

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
      console.log("Usuário registrado:", auth.currentUser);
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
