const io = require('socket.io')(5000, {
    cors: {
        origin: ["http://localhost:3000"]
    }
});

io.on("connection", (socket) => {
    const roomExists = (roomName) => {
        const room = io.sockets.adapter.rooms.get(roomName)
        return room ? room.size > 0 : false
    }
    
    socket.on('waiter-initiate-session', (waiterId) => {
        socket.join(waiterId)
    });

    socket.on('customer-initiate-session', (waiterId) => {
        socket.join(waiterId)
    });
    
    socket.on('new-service-request-customer', (waiterId, customerInfo) => {
        if(roomExists(waiterId)) {
            socket.to(waiterId).emit('new-service-request-waiter', (customerInfo))
        }
    });

    socket.on('service-start-waiter', (waiterId, customerSocket) => {
        socket.to(customerSocket).emit('service-start-customer', waiterId)
    });

});

io.of("/").adapter.on("join-room", (room, id) => {
    console.log(`Socket ${id} se juntou à sala ${room}`);
});

console.log('Servidor rodando e escutando na porta 5000');