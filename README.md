# websockets

```sh
node subscriptions
node chat
```

To run `chat` on multiple instances:

```sh
node chat # default port is 3000
node chat --port=3001
```

You can use following commands in browser console

for subscriptions:

```js
subscribe()
unsubscribe()
```

and for chat:

```js
message('text string')
```