const ws = require('ws');

const webSocketServer = new ws.Server({ port: 8081 });

// // server ping
// setInterval(() => {
//     if (webSocketServer.clients.length) {
//         console.log('send ping');
//         webSocketServer.clients.forEach(client => {
//             client.ping('piiiiing');
//         });
//     }
// }, 2000);

setInterval(() => {
    console.log('clients - ', webSocketServer.clients.length);

    webSocketServer.clients.forEach(client => {
        if (Date.now() - client.lastActiveTime > 10000) {
            console.log('Alert!!!!! Connection maybe is broken!');
        }
    });
}, 10000);

webSocketServer.on('connection', function(client) {
    client.id = Math.random();
    client.lastActiveTime = Date.now();

    console.log('new client:', client.id);

    // client.close(1000, 'ooo'); // 1000 code
    // client.close(4400, '44444'); // 4400 code

    client.on('message', function(message) {
        console.log('message:', message);

        client.lastActiveTime = Date.now();

        if (message !== 'ping') {
            webSocketServer.clients.forEach(client => {
                client.send(message.toUpperCase());
            });
        }
    });

    client.on('close', function(code, reason) {
        console.log('client disconnected:', code, reason);
    });

    // client.on('ping', function() {
    //     console.log('ping');
    // });
    //
    // client.on('pong', function(data) {
    //     console.log('pong:', data.toString('utf8'));
    // });
});

console.log('start');