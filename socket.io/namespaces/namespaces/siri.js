const authenticationMiddleware = require('middleware/authentication');

module.exports = function(io) {
    const namespace = io.of('/siri');

    namespace.use(authenticationMiddleware);

    namespace.on('connection', socket => {
        console.log('connected to /siri');

        socket.emit('question', { data: 'how are you?' });

        socket.on('answer', data => {
            console.log('answer to siri', data);
        });
    });
};