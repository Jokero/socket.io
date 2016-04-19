# websockets

[Socket.io overview](docs/socket.io.md)

```sh
npm start
```

Now you have three app servers:  
1) One for subscription demonstration (port 4000)  
2) Two others for chat (ports 3000 and 3001). Instances are connected using socket.io redis adapter (pub/sub)

Subscription test:  
1) Open `http://localhost:9999`  
2) Type `subscribe()` in console. You will connect to "campaignTrends" channel with campaignId=123456
3) To unsubscribe execute `unsubscribe()`

Chat test:  
1) Open `http://localhost:9999` to connect to first app server and `http://localhost:9999?chatPort=3001` to connect to second chat server.  
2) Type `message('some text')`, each client will receive your message although they are connected to different servers
