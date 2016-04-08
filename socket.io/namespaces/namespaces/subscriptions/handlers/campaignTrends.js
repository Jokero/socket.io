function loadCampaignTrends(campaignId) {
    return Promise.resolve({ sent: 10, delivery: 6, pending: 4, errors: 0, campaignId: campaignId });
}

module.exports = function(namespace) {
    const channel = require('channel')(namespace);

    return {
        hasPermissions: function(socket, data) {
            // const accountId  = socket.account.id;
            // const campaignId = data.campaignId;

            // hasAccountPermissions(accountId, campaignId)
            if (false) {
                socket.emit('error', {
                    code:    403,
                    message: 'Forbidden'
                });

                return false;
            }

            return true;
        },

        getChannelName: function(data) {
            const campaignId = data.campaignId;
            return `campaign:${campaignId}:trends`;
        },

        enable: function(socket, data) {
            const channelName = this.getChannelName(data);

            const rnd = Math.random();
            
            const loadData = function() {
                return loadCampaignTrends(rnd);
            };

            channel(channelName).subscribe(socket, loadData, { timeout: 500 });

            // channel(channelName).subscribe(socket, loadData, { timeout: 500 }).catch(err => {
            //     socket.emit('error', {
            //         code:    500,
            //         message: 'Internal error'
            //     });
            // });
        },

        disable: function(socket, data) {
            const channelName = this.getChannelName(data);

            channel(channelName).unsubscribe(socket);

            // channel(channelName).unsubscribe(socket).catch(err => {
            //     socket.emit('error', {
            //         code:    500,
            //         message: 'Internal error'
            //     });
            // });
        }
    };
};