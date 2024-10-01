import '../../styles/waiter-public.css'
import { useState } from 'react'

function ToggleService() {
    const [serviceStart, setServiceStart] = useState(false)

    function serviceChange() {
        setServiceStart(!serviceStart);
    }

    return (
        <button 
            onClick={serviceChange} 
            className= {`btn-toggle-service ${serviceStart ? '' : 'end'}`}>
            {serviceStart ? 'Iniciar' : 'Encerrar'} Atendimento
        </button>
    )
}

export default ToggleService