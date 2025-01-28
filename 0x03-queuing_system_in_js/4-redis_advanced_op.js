
import redis from 'redis'
import { createClient } from 'redis'


const client = createClient()


client.on('error', (err)=> console.log(`Redis client not connected to the server: ${err.message}`))
client.on('connect', ()=> console.log('Redis client connected to the server'))

/**Using hset, let’s store the following:
 * The key of the hash should be ALX
 * It should have a value for:
 * Portland=50
 * Seattle=80
 * New York=20
 * Bogota=20
 * Cali=40
 * Paris=2
 * Make sure you use redis.print for each hset
 */

client.del('ALX', (err, reply) => {
    if (err) {
        console.error('Error deleting key:', err);
    } else {
        console.log(`Deleted key ALX: ${reply}`);
    }
})

client.hset('ALX', 'Portland', 50,
    'Seattle', 80,
    'New York', 20,
    'Bogota', 20,
    'Cali', 40,
    'Paris', 2, redis.print
);

client.hgetall("ALX", (err, reply)=> {
    if (err) {
        console.error(err)
    }
    else {
        console.log(reply)
    }
})
