# Overview

Is a drop-in replacement for node_redis BUT only <b>publish</b> and <b>subscribe</b> are made available.

This library provides a fail-over on a specific order specified.

# Project status

Still in initial development and proof of concept

# Scenario 1

So, you have an existing redis cluster that somewhere in the middle is connected by an expensive (but not so expensive) 
network link (think of it as two redundancy zone in AWS, actually it is).

In order to save cost, you can technically just connect apps on the same zone to the nearest or next nearest redis (most likely on 
the same zone) and then exchange messages (using pub/sub) with other apps on the same zone (and without crossing the zone 
if you don't have to -- well, coz it's a bit costly).

But if for some reason, the redis available on the same zone (nearest) become unavailable, we should still be able to connect to the
next zone (farthest) as the last option so that the apps can somehow still fix itself silently when troubleshooting in progress -- just to buy you some time.
  
Now, using a normal redis client (even ioredis) only supports single host (no list).  You're next solution is using ioredis (using Cluster class).  

But ioredis can learn your cluster setup (discover all nodes), but the pub/sub is kinda messed up because it always connect to the first node in the list.




# Installation:

```bash
npm install redis-pubsub-failover
```

# Usage

```js
var debug = require("debug")(module.filename.split("/").pop());

debug.enabled = true;

var redis_pubsub = require("redis-pubsub-failover")({
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

redis_pubsub.on("message", function(message) { // same like what you would always do for pub/sub may it be 'redis' or 'ioredis'
	debug("message", message);
});

redis_pubsub.subscribe("my_test_channel"); // same like what you would always do for pub/sub may it be 'redis' or 'ioredis'

```
