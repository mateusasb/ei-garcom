import React, { useEffect, useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase"; 
import { useOutletContext } from "react-router-dom";
import { createNewUser } from "../services/controller/userController";
import '../styles/authentication.css';

const SignUp = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [sentVerify, setSentVerify] = useState(false);
  const { setUserData } = useOutletContext();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if(user && !user.emailVerified) {
        setUserData(user);
      }
    });

    return () => unsubscribe();
  }, [setUserData]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      let signUpInfo = {email: email, name: name, lastName: lastName}
      let actionCodeSettings = {
        url: "http://localhost:3000/login",
        handleCodeInApp: false
      }

      await createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        createNewUser(signUpInfo)
        sendEmailVerification(auth.currentUser, actionCodeSettings)
        setSentVerify(true)
      })
      
    } catch (error) {
      setError(error.message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form className="auth-form-container" onSubmit={handleSignUp}>
        <fieldset>
          <legend>Cadastre-se</legend>
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
            <label htmlFor="email">Nome</label>
            <input
              className="form-field"
              type="text"
              id="email"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="email">Sobrenome</label>
            <input
              className="form-field"
              type="text"
              id="email"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="message-container">
            {error && <p id="error" style={{color: "red"}}>{error}</p>}
          </div>
          
          <div className="message-container">
            {sentVerify && <p id="info" style={{color: "orange"}}>Verifique o seu E-mail para continuar</p>}
          </div>

          <div>
            <button type="submit">Cadastrar</button>
          </div>
        </fieldset>
      </form>
      
      {loading && <div className="loader-container"><div className="loader"/></div>}
    </div>
  );
};

export default SignUp;
