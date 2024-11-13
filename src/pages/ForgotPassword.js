import React, {useLayoutEffect, useState} from "react"
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { sendPasswordResetEmail, confirmPasswordReset } from "firebase/auth";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState();
    const [error, setError] = useState(null);
    const [redirectMode, setRedirectMode] = useState('default');
    const [oobAuthCode, setOobAuthCode] = useState(null);
    const navigate = useNavigate();
    let location = useLocation();

    useLayoutEffect(() => {
        console.log(location)

        if(location.state) {
            setRedirectMode(location.state.mode)
            setOobAuthCode(location.state.oobCode)
        }
        
    }, [location])
    
    async function handleForgotPassword(e) {
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

    async function handlePasswordReset(e) {
        setLoading(true)
        e.preventDefault()

        if(newPassword !== confirmPassword) {
            setError('As senhas não coincidem')
            return;
        }

        try {
            const resEmail = await confirmPasswordReset(auth, oobAuthCode, newPassword)
            if(resEmail !== null) {
                console.log('Senha redefinida com sucesso', resEmail)
                setLoading(false)
                navigate('/login')
            }

        } catch (err) {
            console.error('Erro ao redefinir senha: ', err)
            setError(err)
        } finally {
            setLoading(false)
            setRedirectMode('default')
        }

    }

    
    return (
        <div>
            {redirectMode === 'default' && 
            <form className="auth-form-container" onSubmit={handleForgotPassword}>
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
            }

            {redirectMode === 'resetPassword' && 
            <form className="auth-form-container" onSubmit={handlePasswordReset}>
                <fieldset>
                <legend>Redefina a sua senha</legend>
                <div>
                    <label htmlFor="password">Nova Senha</label>
                    <input
                        className="form-field"
                        type="password"
                        id="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password">Confirme a senha</label>
                    <input
                        className="form-field"
                        type="password"
                        id="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <div>
                    {error && <p>{error}</p>}
                </div>

                <div>
                    <button type="submit">Confirmar</button>
                </div>

                </fieldset>
            </form>
            }
        
            {loading && <div className="loader-container"><div className="loader"/></div>}
        </div>
    )
};

export default ForgotPassword;
