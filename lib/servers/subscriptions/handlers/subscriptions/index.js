const authenticationMiddleware = require('middleware/authentication');

module.exports = function(namespace) {
    namespace.use(authenticationMiddleware);

    namespace.on('connection', socket => {
        console.log('connected to /subscriptions');

        socket.on('subscribe', data => {
            console.log('subscribe', data);

            var subscription;

            switch (data.channel) {
                case 'campaignTrends':
                    subscription = require('./handlers/campaignTrends')(namespace);
                    break;
                default:
                    return socket.emit('error', {
                        code:    400,
                        message: 'Invalid channel'
                    });
            }

            subscription.hasPermissions(socket, data).then(hasPermissions => {
                if (hasPermissions) {
                    subscription.enable(socket, data);
                }
            });
        });

        socket.on('unsubscribe', data => {
            console.log('unsubscribe', data);

            var subscription;

            switch (data.channel) {
                case 'campaignTrends':
                    subscription = require('./handlers/campaignTrends')(namespace);
                    break;
                default:
                    return socket.emit('error', {
                        code:    400,
                        message: 'Invalid channel'
                    });
            }

            subscription.disable(socket, data);
        });
    });
};