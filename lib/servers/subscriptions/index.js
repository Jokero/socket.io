exports.run = function() {
    const io = require('socket.io')({
        transports: ['websocket'],
        path:       '/ws'
    });

    io.origins('localhost:*');
    
    const globalNamespace = io.of('/');
    require('./handlers/subscriptions')(globalNamespace);

    io.listen(4000);

    console.log('Subscriptions server started');
    
    return io;
};