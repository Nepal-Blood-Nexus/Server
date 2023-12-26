const mongoose = require( 'mongoose' );
const bcrypt = require( 'bcryptjs');

// "cordinates": widget.values["cordinates"],
// "blood_group": widget.values["blood_group"],
// "location": widget.values["location"],
// "gender": widget.values["gender"],


const bloodRequestSchema = mongoose.Schema({
    initiator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    blood_group: {
      type: String,
      required: true,
    },
    location: {
        type: String,
        required: false,
      },
    gender: {
      type: String,
      required: true,
    },
   
    cordinates:{
        type:String,
        required:true
    },
    status: {
        type: String,
        enum: ["open", "fulfilled"],
        default: "open",
      },
  },
  {
    timestamps: true,
  }
)



const BloodRequest = mongoose.model('BloodRequest', bloodRequestSchema)

module.exports=BloodRequest