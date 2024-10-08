export const getVisitorId = () => {
    return localStorage.getItem('visitorId')
}

export function saveVisitorId() {
    if(!localStorage.getItem('visitorId')) {
        localStorage.setItem('visitorId', generateVisitorId())
    }
}

function generateVisitorId() {
    return `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}