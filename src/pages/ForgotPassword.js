import React, {useState} from "react"
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState();
    const [error, setError] = useState(null);
    
    async function handlePasswordReset(e) {
        setLoading(true)
        e.preventDefault()
        try {
            await sendPasswordResetEmail(auth, email)

        } catch(err) {
            setError(err)

        } finally {
            console.log('Email enviado para: ', email)
            setLoading(false)
        }

    }
    
    return (
        <div>
        <form className="auth-form-container" onSubmit={handlePasswordReset}>
            <fieldset>
            <legend>Redefinir a senha</legend>
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
                {error && <p>{error}</p>}
            </div>

            <div>
                <button type="submit">Enviar</button>
            </div>

            <div>
                <Link to={'/login'}>Login</Link>
            </div>
            
            </fieldset>
        </form>
        
        {loading && <div className="loader-container"><div className="loader"/></div>}
        </div>
    )
};

export default ForgotPassword;
