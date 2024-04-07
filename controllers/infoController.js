const asyncHandler = require("express-async-handler");
const Places = require("../models/place");
const User = require("../models/user");
const { calculateDistance } = require("../utils/algo");
const { sendNotification } = require("../utils/sendNotification");
const BloodRequest = require("../models/request");

const getAllinfo = asyncHandler(async (req, res) => {

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const lastQuarter = new Date(today);
    lastQuarter.setMonth(lastQuarter.getMonth() - 3);
    
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const todayBloodRequests = await BloodRequest.find({
        createdAt: { $gte: new Date(today.setHours(0, 0, 0, 0)), $lt: new Date(today.setHours(23, 59, 59, 999)) }
    });
    
    const yesterdayBloodRequests = await BloodRequest.find({
        createdAt: { $gte: new Date(yesterday.setHours(0, 0, 0, 0)), $lt: new Date(yesterday.setHours(23, 59, 59, 999)) }
    });
    
    const lastMonthBloodRequests = await BloodRequest.find({
        createdAt: { $gte: new Date(lastMonth.setHours(0, 0, 0, 0)), $lt: new Date(lastMonth.setHours(23, 59, 59, 999)) }
    });
    
    const todayUsers = await User.find({
        createdAt: { $gte: new Date(today.setHours(0, 0, 0, 0)), $lt: new Date(today.setHours(23, 59, 59, 999)) }
    });
    
    const lastWeekUsers = await User.find({
        createdAt: { $gte: new Date(lastWeek.setHours(0, 0, 0, 0)), $lt: new Date(lastWeek.setHours(23, 59, 59, 999)) }
    });
    
    const lastQuarterUsers = await User.find({
        createdAt: { $gte: new Date(lastQuarter.setHours(0, 0, 0, 0)), $lt: new Date(lastQuarter.setHours(23, 59, 59, 999)) }
    });
    
    const newUserCount = await User.countDocuments({
        createdAt: { $gte: new Date(lastQuarter.setHours(0, 0, 0, 0)) }
    });
    
    const newBloodRequestsCount = await BloodRequest.countDocuments({
        status: "completed",
        createdAt: { $gte: new Date(lastMonth.setHours(0, 0, 0, 0)) }
    });
    
    const todayBloodRequestCount = todayBloodRequests.length;
    const yesterdayBloodRequestCount = yesterdayBloodRequests.length;
    const lastMonthBloodRequestCount = lastMonthBloodRequests.length;
    
    const todayUserCount = todayUsers.length;
    const lastWeekUserCount = lastWeekUsers.length;
    const lastQuarterUserCount = lastQuarterUsers.length;
    
    const bloodRequestGrowth = ((todayBloodRequestCount - yesterdayBloodRequestCount) / yesterdayBloodRequestCount) * 100;
    const userGrowth = ((todayUserCount - lastWeekUserCount) / lastWeekUserCount) * 100;
    const newUserGrowth = ((todayUserCount - lastQuarterUserCount) / lastQuarterUserCount) * 100;
    const completedBloodRequestGrowth = ((todayBloodRequestCount - lastMonthBloodRequestCount) / lastMonthBloodRequestCount) * 100;
    
    const result = {
        todayBloodRequests: {
            count: todayBloodRequestCount,
            growth: bloodRequestGrowth
        },
        todayUsers: {
            count: todayUserCount,
            growth: userGrowth
        },
        newUsers: {
            count: newUserCount,
            growth: newUserGrowth
        },
        completedBloodRequests: {
            count: newBloodRequestsCount,
            growth: completedBloodRequestGrowth
        }
    };
    
    res.json(result);

    
});

const getUsersByBloodGroup = asyncHandler(async(req,res)=>{
 
        const bloodGroupCounts = await User.aggregate([
            {
                $group: {
                    _id: "$bloodGroup",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    bloodGroup: "$_id",
                    count: 1,
                    _id: 0
                }
            }
        ]);
    
        const bloodRequestCounts = await BloodRequest.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $group: {
                    _id: "$user.bloodGroup",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    bloodGroup: "$_id",
                    count: 1,
                    _id: 0
                }
            }
        ]);
    
        const result = {
            bloodGroupCounts,
            bloodRequestCounts
        };
    
        res.json(result);
    });

module.exports = {
    getAllinfo,
    getUsersByBloodGroup
};