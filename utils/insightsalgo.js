const { sendNotification } = require("./sendNotification")

module.exports.generateInsights = async(user)=>{

    const profile = createUserData(user.profile);

    sendNotification(user.notification_token,"Preparing blood report")    

}


const normal = {
    "bp": {
      "normal": {"systolic": "90-120", "diastolic": "60-80"}
    },
    "rbc": {
      "male": {"range": "4.5-5.5"},
      "female": {"range": "4.0-5.0"}
    },
    "hct": {
      "male": {"range": "38.3-48.6"},
      "female": {"range": "35.5-44.9"}
    },
    "mcv": {"range": "80-100"},
    "mch": {"range": "27-33"},
    "mchc": {"range": "32-36"},
    "glucose": {
      "fasting": {"range": "70-99"},
      "postprandial": {"range": "Less than 140 (2 hours after meals)"}
    },
    "creatinine": {
      "male": {"range": "0.6-1.2"},
      "female": {"range": "0.5-1.1"}
    },
    "bun": {"range": "7-20 (Blood Urea Nitrogen, BUN)"},
    "protein": {"range": "6.0-8.3"},
    "albumin": {"range": "3.4-5.4"},
    "globulin": {"range": "2.0-3.5"}
  }
  

const createUserData = (profile) => {


    profile.forEach(element => {
        
    });
}
