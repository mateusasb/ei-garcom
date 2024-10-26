import React, { useEffect } from "react"
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate, useOutletContext } from "react-router-dom";

const VerifyEmail = () => {
    const { setUserData } = useOutletContext();
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if(user) {
                setUserData(user)
                navigate('/login')
            }   
        })

        return () => unsubscribe();

    }, [setUserData, navigate])

        
    return (
        <div>
            <p>Email Verificado! Realize o Login para continuar</p>
        </div>
    )
};

export default VerifyEmail;
