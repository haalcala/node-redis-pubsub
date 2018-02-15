var debug = require("debug")(module.filename.split("/").pop());

debug.enabled = true;

var redis_pubsub = require("../index")({
	createClient: function (host, port) {
		var redis = require("redis");

		return redis.createClient(port, host);
	},
	nodes: [
		{host: "localhost", port: 7000}
	]
});

redis_pubsub.on("message", function(message) {
	debug("message", message);
});

redis_pubsub.subscribe("my_test_channel");

