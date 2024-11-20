// REQUESTED SERVICES
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
        return storageServiceRequests([...prevRequests, currentRequest]);
      } else {
        prevRequests[reqAlreadyExists].socket_id = currentRequest.socket_id
        return storageServiceRequests(prevRequests);
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

    return storageServiceRequests(updatedRequests)
};

function storageServiceRequests(requests) {
    return localStorage.setItem('pendingServiceRequests', JSON.stringify(requests))
};

// ACTIVE SERVICES
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

    storageActiveServices(activeServices);
};

export function removeActiveServices(visitorId) {
    const activeServices = getActiveServices();
    const updatedServices = activeServices.filter((serv) => serv.visitor_id !== visitorId);
    
    storageActiveServices(updatedServices);
    return updatedServices; 
}

export function updateActiveService(updatedService) {
    const activeServices = getActiveServices();
    const serviceIndex = activeServices.findIndex((serv) => serv.visitor_id === updatedService.visitor_id)

    if (serviceIndex !== -1) {
        activeServices[serviceIndex] = updatedService
    }

    storageActiveServices(activeServices);
    return activeServices;

}

function storageActiveServices(newService) {
    return localStorage.setItem('currentActiveServices', JSON.stringify(newService))
};