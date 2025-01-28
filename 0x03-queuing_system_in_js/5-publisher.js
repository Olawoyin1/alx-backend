import redis from 'redis';

// Create Redis client
const client = redis.createClient();

client.on('error', (err) => console.log(`Redis client not connected to the server: ${err.message}`));
client.on('connect', () => console.log('Redis client connected to the server'));

const channel = 'ALXchannel';

// Function to publish a message to a channel after a specified delay
function publishMessage(msg, time) {
    setTimeout(() => {
        console.log(`About to send ${msg}`)

        client.publish(channel, msg, (err) => {
            if (err) {
                console.error(`Error publishing message: ${err.message}`);
            }
        });
    }, time);
}

// Publish messages with a delay
publishMessage("ALX Student #1 starts course", 100);
publishMessage("ALX Student #2 starts course", 200);
publishMessage("KILL_SERVER", 300);
publishMessage("ALX Student #3 starts course", 400);

// Clean up Redis connection after the last message
