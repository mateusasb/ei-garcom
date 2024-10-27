import React, { useEffect, useLayoutEffect } from "react"
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate, useOutletContext } from "react-router-dom";

const VerifyEmail = () => {
    const { setUserData } = useOutletContext();
    const navigate = useNavigate();

    useLayoutEffect(() => {
        console.log(auth)
    }, [])

    useEffect(() => {
        const checkAuthData = onAuthStateChanged(auth, async (user) => {
            if(user) {
                setUserData(user)
                console.log(user)
                navigate('/login')
            }   
        })

        return () => checkAuthData();

    }, [setUserData, navigate])

        
    return (
        <div>
            <p>Email Verificado! Realize o Login para continuar</p>
        </div>
    )
};

export default VerifyEmail;
