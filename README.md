This project is to achieve similar functionality as SpringFramework for Java

# Scenario 1

So, you have an existing redis cluster setup.  And you have specific use-case in your app that only use pub/sub and you want it connect
to a list of redis and in the specific order you specified.
  
Now, using a normal redis client only supports single host (no list).  You're next solution is using ioredis (using Cluster class).  

But ioredis can learn your cluster setup (discover all nodes), but the pub/sub is kinda messed up because it always connect to the first node in the list.




# Installation:

```bash
npm install node-redis-pubsub
```

# Usage

```js

```
