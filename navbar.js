const hasMeeting = false;

const meeting = new Promise((resolve, reject) => {
    if(!hasMeeting){
        const meetingDetails = {
            name : 'IT Dept.',
            location: 'Asembo Piny Maber',
            time: '4:20 pm'
        };
        resolve(meetingDetails);
    }else{
        reject(new Error("Meeting already scheduled"));
    }
})
/*
const addToCalender = meetingDetails => {
    return new Promisse((resolve, reject)=>{
        const calendar = '${meetingDetails.name} is scheduled at ${meetingDetails.time} on ${meetingDetails.location}';
        resolve(calendar);
    })
}
// Or 
*/
const addToCalender = meetingDetails => {
    const calendar = '${meetingDetails.name} is scheduled at ${meetingDetails.time} on ${meetingDetails.location}';
    return Promise.resolve(calendar);
}

meeting
    .then(addToCalender)
    .then( res => {
        console.log('Meeting Scheduled');
        console.log(res);
    })
    .catch( err => {
        console.log( err.message);
    })
    
