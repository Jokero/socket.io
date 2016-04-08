const authenticationMiddleware = require('middleware/authentication');

module.exports = function(io) {
    const namespace = io.of('/chat');

    namespace.use(authenticationMiddleware);

    namespace.on('connection', socket => {
        console.log('connected to /chat', namespace.adapter.rooms);

        socket.on('message', message => {
            namespace.emit('message', message);
        });
    });
};