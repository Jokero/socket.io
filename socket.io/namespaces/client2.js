const port = 3001;
const accessToken = '123'; // or use cookie for the same domain

const namespaceConfig = {
    transports: ['websocket'],
    path:       '/infobip'
};

//

const socket = io(`http://localhost:${port}?accessToken=${accessToken}`, namespaceConfig);
socket.on('connect', () => {
    console.log('connected to /');
});

//

const subscriptionsNamespace = io(`http://localhost:${port}/subscriptions`);

function subscribe() {
    subscriptionsNamespace.emit('subscribe', {
        channel:    'campaignTrends',
        campaignId: 123456
    });

    // what if we have multiple channels?
    subscriptionsNamespace.on('update', response => {
        console.log('trends data', response.data);
    });
}

function unsubscribe() {
    subscriptionsNamespace.emit('unsubscribe', {
        channel:    'campaignTrends',
        campaignId: 123456
    });
}

//

const chatNamespace = io(`http://localhost:${port}/chat`);

chatNamespace.on('message', message => {
    console.log('new message', message);
});

function message(text) {
    chatNamespace.emit('message', text);
}

//

const siriNamespace = io(`http://localhost:${port}/siri`);

siriNamespace.on('question', response => {
    console.log('siri question', response.data);
    siriNamespace.emit('answer', { data: "I'm fine!" });
});

//

const newsNamespace = io(`http://localhost:${port}/news`);

newsNamespace.on('news', response => {
    console.log('last news', response.data);
});