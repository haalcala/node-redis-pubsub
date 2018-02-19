# Scenario 1

So, you have an existing redis cluster setup.  And you have specific use-case in your enterprise that only use pub/sub and you want it connect
to a list of redis and in the specific order you specified primarily for fail-over.
  
Now, using a normal redis client only supports single host (no list).  You're next solution is using ioredis (using Cluster class).  

But ioredis can learn your cluster setup (discover all nodes), but the pub/sub is kinda messed up because it always connect to the first node in the list.




# Installation:

```bash
npm install node-redis-pubsub
```

# Usage

```js
var debug = require("debug")(module.filename.split("/").pop());

debug.enabled = true;

var redis_pubsub = require("../index")({
	createClient: function (host, port) { // specify your preferred redis client
		var redis = require("redis"); // CAUTION: only drop-in replacement kind of clients.  Meaning only those clients with the same method signatures

		return redis.createClient(port, host);
	},
	nodes: [ // the list of hosts in your cluster to use pub/sub ONLY
		{host: "localhost", port: 7000},
		{host: "localhost", port: 7001},
		{host: "localhost", port: 7002}
	]
});

redis_pubsub.on("message", function(message) {
	debug("message", message);
});

redis_pubsub.subscribe("my_test_channel");

```
