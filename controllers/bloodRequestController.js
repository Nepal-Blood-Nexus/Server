const asyncHandler = require("express-async-handler");
const BloodRequest = require("../models/request");
const User = require("../models/user");
const { calculateDistance } = require("../utils/algo");

const saveBloodRequest = asyncHandler(async (req, res) => {
    const {gender,cordinates,location,blood_group} = req.body;
    const step = req.query.step;
    const initiator = req.user._id;
    if(step==2){
        const _donors = await User.find({'profile.blood_group':blood_group,'_id': { $ne: initiator }});
        if(_donors.length>0){
            const donors = _donors.map((obj) => {
                const { fullname, profile,_id } = obj;
                const { age, weight } = profile[0];
                const distanceFromuserLocation = calculateDistance(cordinates, req.user.last_location);
                const distanceFromPreferedLocation = calculateDistance(cordinates, obj.last_location);
                return { fullname, age, weight, distanceFromPreferedLocation, distanceFromuserLocation, donorId:_id };
              });
              
            res.json({donors}).status(201)
        }else{
            res.send("No Donors found at the moment")
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
                    const distanceFromuserLocation = calculateDistance(cordinates, req.user.last_location);
                    const distanceFromPreferedLocation = calculateDistance(cordinates, obj.last_location);
                    return { fullname, age, weight, distanceFromPreferedLocation, distanceFromuserLocation, donorId:_id };
                  });
                  
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