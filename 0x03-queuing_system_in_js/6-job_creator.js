import kue from "kue";


const jobData = {
    phoneNumber: "08131325356",
    message: "This is the code to verify your account"
}

const push_notification_code = kue.createQueue()

const job = push_notification_code.create('notification', jobData)
.save(()=> {
    console.log(`Notification job created: ${job.id}`)
})


job.on("complete", ()=> {
    console.log(`Notification job completed: ${job.id}`)
});

job.on("failed", ()=> {
    console.log('Notification job failed')
})
