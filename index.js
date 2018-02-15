var EventEmitter =  require("events").EventEmitter;

/**
 * @param options.createClient Required.
 * @param options.nodes Required.
 * @constructor
 */
function RedisWrapper(options) {

	if (typeof(options.createClient) != "function") {
		throw new Error("options.createClient is required");
	}

	if (!options) {
		throw new Error("options is required");
	}

	var $ = this;

	var nodes = options.nodes;

	var redis_clients = [];

	var emitter = new EventEmitter();

	var first_available, redisPub;

	nodes.forEach(function(node) {
		var redisClient = options.createClient(node.host, node.port);

		redis_clients.push(redisClient);

		redisClient.on("ready", function() {
			console.log("Ready!!!");

			redisClient.__ready__ = true;

			if (!first_available) {
				first_available = redisClient;
			}
		});
	});

	$.subscribe = function (channel) {
		var redisClient = getFirstAvailableRedisClient();

		setImmediate(function () {
			redisClient.subscribe(channel);

			redisClient.on("message", function(message) {
				emitter.emit("message", message);
			});
		});
	};

	$.publish = function (channel, message) {
		if (!redisPub) {
			redisPub = getFirstAvailableRedisClient();
		}

		redisPub.publish(channel, message);
	};

	$.on = function(event, callback) {
		if (event === "message") {
			emitter.on(event, callback);
		}
		else {
			throw new Error("Only 'message' is supported")
		}
	};

	function subscribeRedisClient() {

	}
	
	function getFirstAvailableRedisClient() {
		console.log("redis_clients", redis_clients);

		for (var i = 0; i < redis_clients.length; i++) {
			// if (redis_clients[i].__ready__) {
				return redis_clients[i];
			// }
		}
	}
}

module.exports = function(options) {
	return new RedisWrapper(options);
};