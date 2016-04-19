There are several popular and mantainable modules for nodejs:
* https://github.com/websockets/ws
* https://github.com/faye/faye-websocket-node
* https://github.com/sockjs/sockjs-node
* https://github.com/socketio/socket.io

First three are just implementation of WebSocket protocol (sockjs additionally supports other transports as fallback), while socket.io is a library for building realtime applications. It enables event-based communication, offers multiple transports for reliability, works on multiple application instances and has concept of namespaces and rooms for grouping of sockets.

Namespaces is a useful feature to minimize the number of TCP connections and at the same time separate concerns within your application by introducing separation between communication channels. When a namespace emits an event, all sockets connected to the namespace receive it. When you create socket it joins to specified namespace. All sockets are connected also to global namespace "/". Namespaces should be predefined in server code.

After that socket.io has rooms. Rooms are essentially grouping of sockets and let you send messages to a subgroup of a namespace. Unlike with namespaces sockets can join as many rooms as they want, but you need to build your own events to call join() and leave().

![Namespaces and rooms](https://divillysausages.com/files/socketio_intro/socket-io-nsp-room.png)

We can use middleware with namespaces:

```js
const io = require('socket.io')({
    transports: ['websocket']
});

const myNamespace = io.of('/my-namespace');

myNamespace.use((socket, next) => {
    // first middleware
    next();
});

myNamespace.use((socket, next) => {
    // second middleware
    next();
});

namespace.on('connection', socket => {
    // we are here when all middleware are executed
    console.log('connection to /my-namespace');
});

```

Middleware are useful for authentication and authorization.

We can use namespaces for different channels (subscriptions, chats). Unfortunately socket.io does not support parameterized paths (like in express/restify). So we can't do that:

```js
const campaignTrendsNamespace = io.of('/campaigns/:id/trends'); // all connected users will receive campaign trends

// authentication middleware
campaignTrendsNamespace.use((socket, next) => {
    // check user credentials and load user...
    socket.user = loadedUser;
    next();
});

// authorization middleware
campaignTrendsNamespace.use((socket, next) => {
    // check user permissions to <socket.params.id> campaign
    hasUserPermissionsToCampaign(socket.user.id, socket.params.id)
        .then(hasPermissions => {
            if (!hasPermissions) {
                return next(new errors.Forbidden());
            }

            next();
        })
        .catch(next);
});

campaignTrendsNamespace.on('connection', socket => {
    // here we should send campaign trends to connected user and begin (if it was not done yet) to periodically request data from backend service and notify all connected users

    // additionally we should handle socket "disconnect" event and stop periodically request data if namespace already does not have connected users
});

```

If we want to use parameterized/dynamic channels we should use rooms.

Generally we should implement two commands (we can call them as "subscribe" and "unsubscribe") and send channel name in message:

```js
// we still can use namespace middleware for authentication
globalNamespace.use(authenticationMiddleware);

globalNamespace.on('connection', socket => {
    socket.on('subscribe', data => {
        // data contain channel name and maybe some needed params (for example, campaign id)
        const channel = data.channelName; // for example "campaignTrends"

        hasUserPermissionsToSubscribeToChannel(socket.user.id, channelName, data)
            .then(hasPermissions => {
                // subscribe if hasPermissions is true (join to room, periodically request data from backend service and notify all connected to room users)
            })
            .catch(errorHandler);
    });

    socket.on('unsubscribe', data => {
        // unsubscribe (leave the room and stop data polling)
    });
});
```

Socket.io has a lot of problems:
* Has only one maintainer (https://github.com/socketio/socket.io/graphs/contributors). Development is very slow, there are many not resolved issues and PRs
* There is no support of parameterized namespaces. We can't get all clients from room/namespace when use multiple instances with official redis adapter (although PR was created two years ago https://github.com/socketio/socket.io/pull/1630)
* Sometimes has breaking changes in minor versions (https://github.com/socketio/socket.io/pull/2509 for fix). I think this was done accidentally.
* Documentation is really bad. Not all things documented and there are mistakes.
http://socket.io/docs/server-api/#socket#rooms:array. But it's object...

See demo for subscriptions and chat https://github.com/Jokero/websockets

References:
http://socket.io/docs/
https://github.com/socketio/socket.io/issues
https://divillysausages.com/2015/07/12/an-intro-to-socket-io
