export const getCurrentRequests = () => {
    const requestsArray = localStorage.getItem('currentServiceRequests')
    if(!requestsArray) {
        return []
    }

    return JSON.parse(requestsArray)
}

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
}

export function removeServiceRequests(prevRequests, visitorId) {
    const updatedRequests = prevRequests.filter((req) => req.visitor_id !== visitorId)
    return setRequestsItem(updatedRequests)
}

function setRequestsItem(requests) {
    return localStorage.setItem('currentServiceRequests', JSON.stringify(requests))
}