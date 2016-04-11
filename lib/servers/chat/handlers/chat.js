const authenticationMiddleware = require('middleware/authentication');

module.exports = function(namespace) {
    namespace.use(authenticationMiddleware);

    namespace.on('connection', socket => {
        console.log('connected to /chat');

        socket.on('message', message => {
            namespace.emit('message', message);
        });
    });
};