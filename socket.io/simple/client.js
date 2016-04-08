const socket = io('http://localhost:3000?access_token=123', {
    transports: ['websocket'],
    path: '/channels'
});

socket.on('news', data => {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
});