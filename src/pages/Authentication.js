import React, { useEffect, useLayoutEffect, useState } from "react"
import { auth } from "../firebase";
import { onAuthStateChanged, verifyPasswordResetCode } from "firebase/auth";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";

const VerifyEmail = () => {
    const [error, setError] = useState(null);
    const [redirectMode, setRedirectMode] = useState('default');
    const [oobAuthCode, setOobAuthCode] = useState(null);
    const { setUserData } = useOutletContext();
    const navigate = useNavigate();
    const location = useLocation();

    useLayoutEffect(() => {
        console.log(auth)
        
        const verifyActionCode = async () => {
            const query = new URLSearchParams(location.search)
            let authMode = query.get("mode")
            let oobCode = query.get("oobCode")
            
            if(!oobCode) {
                console.log('oobCode não encontrado ')
                setRedirectMode('default')
                return
            }

            if(authMode === 'resetPassword') {
                console.log(1)
                setRedirectMode(authMode)
                setOobAuthCode(oobCode)
                try {
                    console.log(2)
                    await verifyPasswordResetCode(auth, oobAuthCode)
                        .then(console.log('Código verificado com sucesso'))
                } catch(err) {
                    setError('Link inválido ou expirado', err)
                }
            }

            setRedirectMode(authMode)
        };

        verifyActionCode();

    }, [location, oobAuthCode])

    useEffect(() => {
        console.log(4)
        if(redirectMode === 'verifyEmail') {
            onAuthStateChanged(auth, async (user) => {
                if(user) {
                    await setUserData(user)
                    console.log(user)
                    setTimeout(() => {
                        navigate('/login', { state: {mode: redirectMode, oobCode: oobAuthCode} })
                    }, 3000)

                } else {
                    console.log('Usuário não autenticado', auth)
                    setTimeout(() => {
                        navigate('/', { state: {mode: redirectMode, oobCode: oobAuthCode} })
                    }, 3000)
                }
            })
            
        } else {
            setTimeout(() => {
                navigate('/esqueci-minha-senha', { state: {mode: redirectMode, oobCode: oobAuthCode} })
            }, 3000)
        }

    }, [redirectMode, oobAuthCode, setUserData, navigate])
 
    return (
        <div>
            {redirectMode === 'verifyEmail' && <p>Email Verificado! Realize o Login para continuar</p>}

            {redirectMode === 'resetPassword' && <p>Email Verificado! Você será direcionado para a redefinição de senha</p>}

            {redirectMode === 'default' && <p>Ação não permitida</p>}
        </div>
    )
};

export default VerifyEmail;
