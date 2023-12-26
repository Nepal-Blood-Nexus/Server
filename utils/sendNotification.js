const { default: axios } = require("axios")

module.exports.sendNotification = async (userToken,message) => {
    axios.post("https://fcm.googleapis.com/fcm/send",
        {
            "registration_ids": userToken,
            "collapse_key": "Open",
            "priority": "high",
            "notification": {
                "title": "Blood Request",
                "body": message
            },
            "sound":"alert.wav"
        },{
            headers:{
                Authorization:"key=AAAAsHV4IqU:APA91bFx4b5z3UXuUd9lrsNNqC9YEl5J61FRkbqYbkXEOQmnrnYF25TX-kAbRyHGWa2UjZOg8NNRB0A3mZZF7yjfZeCWMVLhyJ60Wb_VV9aJoyiOLxBo_uiy2f2UmDxCeZfL8uovBIsi",
                "Content-Type":"application/json"
            }
        }
    ).then(res=>{
        console.log(res.data);
    }).catch(er=>console.log(er))
}