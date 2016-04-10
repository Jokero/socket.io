exports.run = function() {
    const args = require('minimist')(process.argv.slice(2));

    const io = require('socket.io')({
        transports: ['websocket'],
        path:       '/ws'
    });

    io.origins('localhost:*');

    const redisAdapter = require('socket.io-redis');
    io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

    const globalNamespace = io.of('/');
    require('./handlers/chat')(globalNamespace);

    const port = args.port || 3000;
    io.listen(port);

    console.log('Chat server started');

    return io;
};