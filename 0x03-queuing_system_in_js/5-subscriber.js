import redis from 'redis'
import { createClient } from 'redis'


const client = createClient()


client.on('error', (err)=> console.log(`Redis client not connected to the server: ${err.message}`))
client.on('connect', ()=> console.log('Redis client connected to the server'))

// On connect, it should log the message Redis client connected to the server
// On error, it should log the message Redis client not connected to the server: ERROR MESSAGE
// It should subscribe to the channel ALXchannel
// When it receives message on the channel ALX channel, it should log the message to the console
// When the message is KILL_SERVER, it should unsubscribe and quit


const channel = 'ALXchannel'
client.subscribe(channel)

client.on("message", (ch, message)=> {

    if (ch === channel) {
        console.log(message);

        if (message === "KILL_SERVER") {
            client.unsubscribe();
            client.quit();
        }
    }
});
