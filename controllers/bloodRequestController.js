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
                const distanceFromuserLocation = calculateDistance(cordinates, req.user.last_location);
                const distanceFromPreferedLocation = calculateDistance(cordinates, obj.last_location);
                // const distanceOfDonorFromPreferedLocation = calculateDistance(req.user.last_location, obj.last_location);
                notification_tokens.push(obj.notification_token);
                return { fullname, age, weight, distanceFromPreferedLocation, distanceFromuserLocation, donorId:_id };
              }).sort((a,b)=>b.distanceFromPreferedLocation - a.distanceFromPreferedLocation);
              
            res.json({donors}).status(201)
            await sendNotification(notification_tokens,`Requested by: ${req.user.fullname}, Emergency: ${emergency}, Location: ${location}`)
        }else{
            res.send("No Donors found at the moment")
        }
    }else{

        const _request = await BloodRequest.create({initiator,gender,cordinates,location,blood_group});
        if(_request){
            console.log(gender);
            const _donors = await User.find({'profile.blood_group':blood_group,'_id': { $ne: initiator },"profile.gender":gender});
            if(_donors.length>0){
                const donors = _donors.map(async(obj) => {
                    const { fullname, profile,_id } = obj;
                    const { age, weight } = profile[0];
                    const distanceFromuserLocation = calculateDistance(cordinates, req.user.last_location);
                    const distanceFromPreferedLocation = calculateDistance(cordinates, obj.last_location);
                    const distanceOfDonorFromPreferedLocation = calculateDistance(req.user.last_location, obj.last_location);
                await sendNotification(obj.notification_token,`Requested by: ${req.user.fullname}, Emergency: ${emergency}, Location: ${location}, Distance: ${distanceOfDonorFromPreferedLocation}`)
                    return { fullname, age, weight, distanceFromPreferedLocation, distanceFromuserLocation, donorId:_id };
                  }).sort((a,b)=>b.distanceFromPreferedLocation - a.distanceFromPreferedLocation);
                  
                res.json({donors}).status(201)
            }else{
                res.send("No DOnors found at the moment")
            }
        }else{
            res.send("Failed to create a blood request")
        }
    }

});

module.exports = {
  saveBloodRequest,
};