import dotenv from 'dotenv';
dotenv.config();
import redis from "redis";

const client = redis.createClient({
    host: process.env.redisHost,
    port: parseInt(process.env.redisPort || "0"),
    password: process.env.redisPassword,
});

client.on("connect", () => {
    console.log("Connected to redis instance.");
});

export { client };
