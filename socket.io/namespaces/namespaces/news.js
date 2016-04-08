const lastNews = [
    {
        id:    1,
        title: 'title1',
        text:  'text1'
    },
    {
        id:    2,
        title: 'title2',
        text:  'text2'
    },
    {
        id:    3,
        title: 'title3',
        text:  'text3'
    }
];

module.exports = function(io) {
    const namespace = io.of('/news');

    namespace.on('connection', socket => {
        console.log('connected to /news');
        socket.emit('news', { data: lastNews });
    });
};