require("dotenv").config();
const asyncRedis = require("async-redis");


const client = asyncRedis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
});

client.on("connect", () => {
    console.log(process.env.REDIS_HOST)
    console.log("Connected to redis instance.");
});

client.on("error", function (err: any) {
    console.log("Redis Conn Error: " + err);
});

export { client };
