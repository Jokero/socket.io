exports.run = function() {
    const args = require('minimist')(process.argv.slice(2), {
        alias: {
            port: 'p'
        }
    });
    
    const io = require('socket.io')({
        transports: ['websocket'],
        path:       '/ws'
    });

    io.origins('localhost:*');
    
    const globalNamespace = io.of('/');
    require('./handlers/subscriptions')(globalNamespace);

    const port = args.port || 4000;
    io.listen(port);

    console.log(`Subscriptions server started on port ${port}`);
    
    return io;
};