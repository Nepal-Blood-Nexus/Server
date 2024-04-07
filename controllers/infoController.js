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

const getUsersByBloodGroup = asyncHandler(async (req, res) => {

    const bloodGroupCounts = await User.aggregate([
        {
            $unwind: "$profile"
        },
        {
            $group: {
                _id: "$profile.blood_group",
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
            $group: {
                _id: "$blood_group",
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

    // Merge the counts for each blood group
    const combinedCounts = {};
    bloodGroupCounts.forEach(({ bloodGroup, count }) => {
        combinedCounts[bloodGroup] = {
            bloodGroup,
            userCount: count,
            requestCount: 0
        };
    });
    bloodRequestCounts.forEach(({ bloodGroup, count }) => {
        if (combinedCounts[bloodGroup]) {
            combinedCounts[bloodGroup].requestCount = count;
        } else {
            combinedCounts[bloodGroup] = {
                bloodGroup,
                userCount: 0,
                requestCount: count
            };
        }
    });

    res.json(Object.values(combinedCounts));
});


const getBloodDonationData = async (req, res) => {
    try {
        // Aggregate blood donation counts for each month
        const donationData = await BloodRequest.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { _id: 1 }, // Sort by month
            },
        ]);

        // Construct labels and data arrays
        const labels = donationData.map((item) => {
            // Convert month number to month name
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return monthNames[item._id - 1];
        });

        const data = donationData.map((item) => item.count);

        // Construct the response object
        const gradientLineChartData = {
            labels: labels,
            datasets: [
                {
                    label: "Donation",
                    color: "info",
                    data: data,
                },
            ],
        };

        res.status(200).json(gradientLineChartData);
    } catch (error) {
        console.error("Error fetching blood donation data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};




module.exports = {
    getAllinfo,
    getUsersByBloodGroup,
    getBloodDonationData
};