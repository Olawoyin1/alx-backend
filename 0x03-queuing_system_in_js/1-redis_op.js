import redis from 'redis'
import { createClient } from "redis";

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

// Function to display the data with key = schoolName
const displaySchoolValue = (schoolName)=> {
    const displayKey = client.get(schoolName, (err, reply)=> {
        if (err) {
            console.error(`Error fetching value for ${schoolName}: ${err.message}`);
        }
        console.log(reply)
    })

    console.log(displayKey);
};

displaySchoolValue('ALX');
setNewSchool('ALXSanFrancisco', '100');
displaySchoolValue('ALXSanFrancisco');
