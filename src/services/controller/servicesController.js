export const getCurrentRequests = () => {
    const requestsArray = localStorage.getItem('pendingServiceRequests')
    if(!requestsArray) {
        return []
    }

    return JSON.parse(requestsArray)
};

export function saveServiceRequests(prevRequests, currentRequest) {
    if (!Array.isArray(prevRequests)) {
        prevRequests = [];
    }
    
    const reqAlreadyExists = prevRequests.findIndex((req) => req.visitor_id  === currentRequest.visitor_id)
    if(reqAlreadyExists === -1) {
        return setRequestsItem([...prevRequests, currentRequest]);
      } else {
        prevRequests[reqAlreadyExists].socket_id = currentRequest.socket_id
        return setRequestsItem(prevRequests);
      }
};

export function removeServiceRequests(prevRequests, visitorId, setActive) {
    const updatedRequests = prevRequests.filter((req) => req.visitor_id !== visitorId)
    const pendingRequest = prevRequests.filter((req) => req.visitor_id === visitorId)

    if(setActive) {
        saveActiveServices(pendingRequest[0])
    } else {
        removeActiveServices(visitorId)
    }

    return setRequestsItem(updatedRequests)
};

function setRequestsItem(requests) {
    return localStorage.setItem('pendingServiceRequests', JSON.stringify(requests))
};


// 
export const getActiveServices = () => {
    const servicesArray = localStorage.getItem('currentActiveServices');

    if (!servicesArray) {
        return [];
    }
    
    return JSON.parse(servicesArray);
};

function saveActiveServices(newService) {
    const activeServices = getActiveServices()

    const serviceIndex = activeServices.findIndex(service => service.visitor_id === newService.visitor_id);
    if (serviceIndex !== -1) {
        activeServices[serviceIndex].socket_id = newService.socket_id;
    } else {
        activeServices.push(newService);
    }

    setActiveServices(activeServices);
};

function removeActiveServices(visitorId) {
    const activeServices = getActiveServices()
    const updatedServices = activeServices.filter((serv) => serv.visitor_id !== visitorId)

    setActiveServices(updatedServices);
}

function setActiveServices(newService) {
    return localStorage.setItem('currentActiveServices', JSON.stringify(newService))
};