import '../../styles/waiter-public.css'
import { useEffect, useState } from 'react'
import { socket } from '../../socket'

function ToggleCallWaiter() {
    const [sessionStart, setSessionStart] = useState()

    useEffect(() => {
        socket.on('connect', () => {
            setSessionStart(true)
            //console.log(socket)
        })

        socket.on('disconnect', () => {
            setSessionStart(false)
            //console.log(socket)
        })

    }, [])

    
    function callWaiter() {
        console.log('Chamando Garçom')
    }

    return (
        <button className="btn-call-waiter" onClick={callWaiter} disabled={!sessionStart}>Chamar Garçom</button>
    )
}

export default ToggleCallWaiter