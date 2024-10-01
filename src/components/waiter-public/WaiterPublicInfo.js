import '../../styles/waiter-public.css'
import { useState, useEffect } from 'react'

function WaiterPublicInfo(waiterData) {
    const [waiterInfo, setWaiterInfo] = useState(null)
    useEffect(() => {
        if(waiterData) {
            setWaiterInfo(waiterData.waiterData);
        };

        return () => {
            //console.log(waiterInfo)
        }
        
    }, [waiterData])

    return(
        <div className="waiter-info">
            <img 
                alt='profile-picture' 
                className="waiter-avatar"
                src= {waiterInfo ? waiterInfo.waiter_pic_url : 'https://via.placeholder.com/150'}
            />

            <h3 className="waiter-name">
                Seu Garçom: <stro className="waiter-name__name">{waiterInfo ? waiterInfo.waiter_first_name + ' ' + waiterInfo.waiter_last_name : ''}</stro>
            </h3>

            <p className="waiter-location">
                Estabelecimento: {waiterInfo ? waiterInfo.waiter_location : ''}
            </p>
        </div>
    )
}

export default WaiterPublicInfo