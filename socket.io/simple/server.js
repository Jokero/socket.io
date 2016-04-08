const io = require('socket.io')(); // почему опции нельзя здесь передать?
const url = require('url');

io.origins('localhost:*'); // в каком формате можно задать? какая ошибка должна быть?

io.use((socket, next) => {
    // это единственный способ авторизоваться?
    const parsedUrl   = url.parse(socket.request.url, true); // можно как-нибудь поизящнее получить токен?
    const accessToken = parsedUrl.query.accessToken;
    
    if (!accessToken || accessToken !== '123') {
        return next(new Error('Not Authorized'));
    }

    next();
});

io.on('connection', socket => {
    console.log('connection!!!');

    socket.emit('news', { hello: 'world' });
    
    socket.on('my other event', data => {
        console.log(data);
    });
});

io.listen(3000, {
    transports: ['websocket'],
    pingTimeout: 100000,
    pingInterval: 100000,
    path: '/channels'
});

console.log('start');