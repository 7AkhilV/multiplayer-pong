let readyPlayerCount = 0;

function listen(io) {
   // Use a namespace for better organization
  const pongNamespace = io.of('/pong');
  pongNamespace.on('connection', (socket) => {
    let room;

    console.log('a user connected', socket.id);

    socket.on('ready', () => {
      room = 'room' + Math.floor(readyPlayerCount / 2);
      socket.join(room);

      console.log('Player ready', socket.id, room);

      readyPlayerCount++;

      if (readyPlayerCount % 2 === 0) {
         // Use the namespace to emit to all clients in the room
        pongNamespace.in(room).emit('startGame', socket.id);
      }
    });

    socket.on('paddleMove', (paddleData) => {
        // Emit to all clients in the room except the sender
      socket.to(room).emit('paddleMove', paddleData);
    });

    socket.on('ballMove', (ballData) => {
       // Emit to all clients in the room except the sender
      socket.to(room).emit('ballMove', ballData);
    });

    socket.on('disconnect', (reason) => {
      console.log(`Client ${socket.id} disconnected: ${reason}`);
      socket.leave(room);
    });
  });
}

module.exports = {
  listen,
};
