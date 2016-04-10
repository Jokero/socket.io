const url = new URL(document.URL);
const params = new URLSearchParams(url.search.slice(1));

const chatPort = params.get('chatPort') || 3000;
const accessToken = '123'; // or use cookie for the same domain

const ioConfig = {
    transports: ['websocket'],
    path:       '/ws'
};

const chat = io(`http://localhost:${chatPort}?accessToken=${accessToken}`, ioConfig);

chat.on('message', message => {
    console.log('new message', message);
});

function message(text) {
    chat.emit('message', text);
}

//

const subscriptions = io(`http://localhost:4000?accessToken=${accessToken}`, ioConfig);

function subscribe() {
    subscriptions.emit('subscribe', {
        channel:    'campaignTrends',
        campaignId: 123456
    });

    // what if we have multiple channels?
    subscriptions.on('update', response => {
        console.log('trends data', response.data);
    });
}

function unsubscribe() {
    subscriptions.emit('unsubscribe', {
        channel:    'campaignTrends',
        campaignId: 123456
    });
}