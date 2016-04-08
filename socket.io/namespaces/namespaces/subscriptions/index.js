const authenticationMiddleware = require('middleware/authentication');

module.exports = function(io) {
    const namespace = io.of('/subscriptions');

    namespace.use(authenticationMiddleware);

    namespace.on('connection', socket => { // можно никого не подключать к глобальному namespace?
        console.log('connected to /subscriptions');

        socket.on('subscribe', data => {
            console.log('subscribe', data);

            // check data.channel

            try {
                const subscription = require('./handlers/' + data.channel)(namespace);
                if (subscription.hasPermissions(socket, data)) { // should be async
                    subscription.enable(socket, data);
                }
            } catch(err) {
                console.log('err', err);

                if (err.code === 'MODULE_NOT_FOUND') {
                    socket.emit('error', {
                        code:    400,
                        message: 'Invalid channel'
                    });
                }
            }
        });

        socket.on('unsubscribe', data => {
            console.log('unsubscribe', data);

            // check data.channel

            try {
                const subscription = require('./handlers/' + data.channel)(namespace);
                subscription.disable(socket, data);
            } catch(err) {
                console.log('err', err);

                if (err.code === 'MODULE_NOT_FOUND') {
                    socket.emit('error', {
                        code:    400,
                        message: 'Invalid channel'
                    });
                }
            }
        });
    });
};