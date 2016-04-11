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

                return Promise.resolve(false);
            }

            return Promise.resolve(true);
        },

        getChannelName: function(data) {
            const campaignId = data.campaignId;
            return `campaign:${campaignId}:trends`;
        },

        activate: function(socket, data) {
            const channelName = this.getChannelName(data);

            const loadData = function() {
                return loadCampaignTrends(data.campaignId);
            };

            channel(channelName).subscribe(socket, loadData, { timeout: 500 }).catch(err => {
                socket.emit('error', {
                    code:    500,
                    message: 'Internal error'
                });
            });
        },

        deactivate: function(socket, data) {
            const channelName = this.getChannelName(data);

            channel(channelName).unsubscribe(socket).catch(err => {
                socket.emit('error', {
                    code:    500,
                    message: 'Internal error'
                });
            });
        }
    };
};