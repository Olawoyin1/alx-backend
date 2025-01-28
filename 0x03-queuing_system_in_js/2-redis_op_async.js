import redis from 'redis'
import { createClient } from "redis";
import { promisify } from 'util'
import { redis } from 'redis';


const client = createClient()


client.on('error', err => console.error(`Redis client not connected to the server: ${err.message}`))

client.on('connect', ()=> console.log('Redis client connected to the server'))

/** Add two functions:
 * setNewSchool:
 * It accepts two arguments schoolName, and value.
 * It should set in Redis the value for the key schoolName
 * It should display a confirmation message using redis.print
 * displaySchoolValue:
 * It accepts one argument schoolName.
 * It should log to the console the value for the key passed as argument
*/

// Function to set key:pair schoolName to value
const setNewSchool = (schoolName, value) => {
    client.set(schoolName, value, redis.print)
    
}

// Function to get a data based on the key using promise

// promisify get method
const getAsyn = promisify(client.get).bind(client)

async function displaySchoolValue(schoolName) {

    try {
        const response = await getAsyn(schoolName)
        console.log(response)
    } catch (error) {
        console.error(error.message)
    }
  
}


const promise = async ()=> {
    await displaySchoolValue('ALX')
    setNewSchool('ALXSanFrancisco', '100');
    await displaySchoolValue('ALXSanFrancisco');

    // close the client connection
    client.quit()

};
// call the main fucntion
promise();
