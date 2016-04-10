const authenticationMiddleware = require('middleware/authentication');

module.exports = function(namespace) {
    namespace.use(authenticationMiddleware);

    namespace.on('connection', socket => {
        console.log('connected to /chat');

        socket.join('ololo', function() {
            console.log('ololo', namespace.adapter.rooms);
        });
        
        socket.on('message', message => {
            namespace.emit('message', message);
        });
    });
};