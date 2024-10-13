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

    socket.on('customer-call', (waiterId) => {
        socket.to(waiterId).emit('customer-call')
    })
    
    socket.on('new-service-request-customer', (waiterId, customerInfo) => {
        if(roomExists(waiterId)) {
            socket.to(waiterId).emit('new-service-request-waiter', (customerInfo))
        } else {
            socket.to(customerInfo.socket_id).emit('service-refused-customer')
        }
    });

    socket.on('service-start-waiter', (waiterId, customerSocket) => {
        socket.to(customerSocket).emit('service-start-customer', waiterId)
    });

    socket.on('service-refused-waiter', (customerSocket) => {
        socket.to(customerSocket).emit('service-refused-customer')
    });

    socket.on('service-request-expired-customer', (waiterId) => {
        socket.to(waiterId).emit('service-request-expired-waiter', socket.id)
    })

});

io.of("/").adapter.on("join-room", (room, id) => {
    console.log(`Socket ${id} se juntou à sala ${room}`);
});

io.of("/").adapter.on("leave-room", (room, id) => {
    console.log(`Socket ${id} saiu da sala ${room}`);
});

console.log('Servidor rodando e escutando na porta 5000');