const { sendNotification } = require("./sendNotification")


const info = {
  "bp": {
    "medications": ["ACE inhibitors", "Beta-blockers", "Diuretics"],
    "healthTips": ["Maintain a healthy diet", "Exercise regularly", "Reduce sodium intake"]
  },
  "rbc": {
    "medications": ["Iron supplements", "Vitamin B12 supplements"],
    "healthTips": ["Consume iron-rich foods", "Stay hydrated", "Include vitamin B12 sources in your diet"]
  },
  "hct": {
    "medications": ["Erythropoietin-stimulating agents"],
    "healthTips": ["Stay hydrated", "Maintain a balanced diet", "Avoid excessive alcohol consumption"]
  },
  "mcv": {
    "medications": ["Supplements for vitamin B12 or folic acid"],
    "healthTips": ["Include leafy greens", "Consume citrus fruits", "Add whole grains to your diet"]
  },
  "mch": {
    "medications": ["Treatment depends on the underlying cause"],
    "healthTips": ["Maintain a balanced diet", "Stay hydrated", "Follow medical advice for the underlying cause"]
  },
  "mchc": {
    "medications": ["Treatment depends on the underlying cause"],
    "healthTips": ["Maintain a balanced diet", "Stay hydrated", "Follow medical advice for the underlying cause"]
  },
  "glucose": {
    "medications": ["Insulin", "Oral antidiabetic medications"],
    "healthTips": ["Control carbohydrate intake", "Exercise regularly", "Monitor blood sugar levels"]
  },
  "creatinine": {
    "medications": ["Medications to manage underlying kidney issues"],
    "healthTips": ["Stay hydrated", "Maintain a healthy diet", "Avoid excessive protein intake"]
  },
  "bun": {
    "medications": ["Treatment depends on the underlying cause"],
    "healthTips": ["Stay hydrated", "Monitor protein intake", "Follow medical advice"]
  },
  "protein": {
    "medications": ["Treatment depends on the specific protein abnormality"],
    "healthTips": ["Consume a balanced diet", "Include protein-rich foods", "Stay hydrated"]
  }
}

/**
 * @dev
 * normal values of blood attributes
 */
const normal = {
  "bp": { "systolic": "90-120", "diastolic": "60-80" },
  "rbc": {
    "male": "4.5-5.5",
    "female": "4.0-5.0"
  },
  "hct": {
    "male": "38.3-48.6",
    "female": "35.5-44.9"
  },
  "mcv": "80-100",
  "mch": "27-33",
  "mchc": "32-36",
  "glucose": {
    "fasting": "70-99",
    "postprandial": "120-10000"
  },
  "creatinine": {
    "male": "0.6-1.2",
    "female": "0.5-1.1"
  },
  "bun": "7-20",
  "protein": "6.0-8.3",
  "albumin": "3.4-5.4",
  "globulin": "2.0-3.5"
}


const createUserData = (profile) => {
  const insights = {};

  // Function to compare user value with normal range
  const isNormal = (value, normalRange) => {
    if (typeof (value) == "object") {
      let flag = false;
      Object.keys(value).forEach(attr => {
        
        // console.log(value[attr],)
        const [min, max] = String(normalRange[attr]).split('-').map(Number);
       
        flag = value[attr] >= min && value[attr] <= max
      })
      return flag;

    }
    const [min, max] = String(normalRange).split('-').map(Number);
    return value >= min && value <= max;
  };

  // Function to generate insights for each attribute
  const generateInsights = (attribute, value, normal) => {
    const attributeInsights = {};

    // Compare user value with normal values
    if (isNormal(value, normal)) {
      attributeInsights.status = "Normal";
    } else {
      attributeInsights.status = "Not Normal";
      // Add medication and tips logic here based on the specific blood attribute
      // attributeInsights.medication = ...;
      attributeInsights.tips = info[attribute]
    }

    return attributeInsights;
  };

  // Iterate through each blood attribute in the user's profile
  Object.keys(profile).forEach(attribute => {
    const value = profile[attribute];
    const normalValues = normal[attribute];
    if (attribute == "rbc" || attribute == "hct" ||attribute == "creatinine") {
      // console.log(attribute,value, normalValues)
      // TODO: check gender and generate insigths, suppose gender is "male"
      insights[attribute] = generateInsights(attribute, value, normalValues["male"]);
    }else{

      // Generate insights for the current blood attribute
      insights[attribute] = generateInsights(attribute, value, normalValues);
    }
  });

  return insights;
};

// Example usage:
const user = {
  profile: {
    bp: { systolic: 110, diastolic: 70 },
    rbc: 5.0,
    hct: 40.0,
    mcv: 90,
    // mch: 30,
    // mchc: 34,
    // glucose: { fasting: 85, postprandial: 120 },
    // creatinine: 0.8,
    // bun: 15,
    // protein: 7.5,
    // albumin: 4.2,
    // globulin: 2.2,
    // Add other blood attributes as needed
  },
  gender: "male", // Assume you have a gender attribute in the user's profile
};




module.exports.getInsights = async (user)=>{
  const userInsights = createUserData(user.profile);
  sendNotification(user.notification_token,"Your blood insights being prepared",false,"Blood Insights")
}

