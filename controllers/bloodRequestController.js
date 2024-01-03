const asyncHandler = require("express-async-handler");
const BloodRequest = require("../models/request");
const User = require("../models/user");
const { calculateDistance } = require("../utils/algo");
const { sendNotification } = require("../utils/sendNotification");

const saveBloodRequest = asyncHandler(async (req, res) => {
    const {gender,cordinates,location,blood_group,emergency} = req.body;
    const step = req.query.step;
    const initiator = req.user._id;
    const notification_tokens = [];
    if(step==2){
        const _donors = await User.find({'profile.blood_group':blood_group,'_id': { $ne: initiator }});
        if(_donors.length>0){
            const donors = _donors.map((obj) => {
                const { fullname, profile,_id } = obj;
                const { age, weight } = profile[0];
                const distanceFromuserLocation = calculateDistance(obj.last_location, req.user.last_location);
                const distanceFromPreferedLocation = calculateDistance(cordinates, obj.last_location);
                // const distanceOfDonorFromPreferedLocation = calculateDistance(req.user.last_location, obj.last_location);
                notification_tokens.push(obj.notification_token);
                return { fullname, age, weight, distanceFromPreferedLocation, distanceFromuserLocation, donorId:_id, phone:obj.phone};
              }).sort((a,b)=>b.distanceFromPreferedLocation - a.distanceFromPreferedLocation);
              
            res.json({donors: donors}).status(201)
            await sendNotification(notification_tokens,`Requested by: ${req.user.fullname}, Emergency: ${emergency}, Location: ${location}`)
        }else{
            res.status(401).send({msg: "No Donors found at the moment"})
        }
    }else{

        const _request = await BloodRequest.create({initiator,gender,cordinates,location,blood_group});
        if(_request){
            console.log(gender);
            const _donors = await User.find({'profile.blood_group':blood_group,'_id': { $ne: initiator },"profile.gender":gender});
            if(_donors.length>0){
                const donors = _donors.map((obj) => {
                    const { fullname, profile,_id } = obj;
                    const { age, weight } = profile[0];
                    const distanceFromuserLocation = calculateDistance(obj.last_location, req.user.last_location);
                    const distanceFromPreferedLocation = calculateDistance(cordinates, obj.last_location);
                    // const distanceOfDonorFromPreferedLocation = calculateDistance(req.user.last_location, obj.last_location);
                    notification_tokens.push(obj.notification_token);
                    return { fullname, age, weight, distanceFromPreferedLocation, distanceFromuserLocation, donorId:_id, phone:obj.phone};
                  }).sort((a,b)=>b.distanceFromPreferedLocation - a.distanceFromPreferedLocation);

                  
                res.json({donors: donors}).status(201)
            await sendNotification(notification_tokens,`Requested by: ${req.user.fullname}, Emergency: ${emergency}, Location: ${location}`)

            }else{
                res.status(401).send({msg: "No Donors found at the moment"})
            }
        }else{
            res.status(401).send({msg: "Failed"})
        }
    }

});


const getBloodRequests = asyncHandler(async(req,res)=>{

    try {
        const status = req.query.status;
        let allRequests;
        if(status){
            allRequests = await BloodRequest.find({status: status}).populate('initiator').sort({datefield: -1}).exec();
        }else{

            allRequests = await BloodRequest.find({}).populate('initiator').sort({datefield: -1}).exec();
        }
        console.log(allRequests)
        res.json(allRequests);
        
    } catch (error) {
        console.log(error)
    }




})

module.exports = {
  saveBloodRequest,
  getBloodRequests
};