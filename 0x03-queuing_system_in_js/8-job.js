// It takes into argument jobs (array of objects), and queue (Kue queue)
// If jobs is not an array, it should throw an Error with message: Jobs is not an array
// For each job in jobs, create a job in the queue push_notification_code_3
// When a job is created, it should log to the console Notification job created: JOB_ID
// When a job is complete, it should log to the console Notification job JOB_ID completed
// When a job is failed, it should log to the console Notification job JOB_ID failed: ERROR
// When a job is making progress, it should log to the console Notification job JOB_ID PERCENT% complete


function createPushNotificationsJobs(jobs, queue) {

    if (!Array.isArray(jobs)) {
        throw new Error("Jobs is not an array")
    }

    jobs.forEach((job)=> {

        const newJob = queue.create("push_notification_code_3", job)
        .save((err)=> {
            if (err) {
                console.log(err);
            }
            console.log(`Notification job created: ${newJob.id}`)
            
        })

        newJob.on('complete', () => console.log(`Notification job ${newJob.id} completed`))
        newJob.on('failed', (err) => console.log(`Notification job ${newJob.id} Failed ${err}`))
        newJob.on('progress', (progress) => console.log(`Notification job ${progress}% complete`))
    })
}

export default createPushNotificationsJobs;