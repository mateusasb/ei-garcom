const io = require('socket.io')(5000, {
    cors: {
        origin: ["http://localhost:3000"]
    }
})

io.on("connection", (socket) => {
    console.log(socket.id)
})

console.log('Servidor rodando e escutando na porta 5000');