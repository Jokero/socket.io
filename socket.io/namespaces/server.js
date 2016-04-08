const args = require('minimist')(process.argv.slice(2));
const io = require('socket.io')(); // почему опции нельзя здесь передать?

var redis = require('socket.io-redis');
io.adapter(redis({ host: 'localhost', port: 6379 }));

io.origins('localhost:*'); // в каком формате можно задать? какая ошибка должна быть?

require('./namespaces/subscriptions')(io);
require('./namespaces/chat')(io);
require('./namespaces/siri')(io);
require('./namespaces/news')(io);

const port = args.port || 3000;

io.listen(port, {
    transports: ['websocket'],
    pingTimeout: 100000,
    pingInterval: 100000,
    path: '/infobip'
});

console.log('start');