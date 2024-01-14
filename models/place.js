const mongoose = require( 'mongoose' );
const bcrypt = require( 'bcryptjs');

// "cordinates": widget.values["cordinates"],
// "blood_group": widget.values["blood_group"],
// "location": widget.values["location"],
// "gender": widget.values["gender"],


const donationPlacesSchema = mongoose.Schema({
   
    location: {
      type: String,
      required: true,
    },
    cordinates: {
        type: String,
        required: false,
      },
    name: {
      type: String,
      required: true,
    },
    image: {
        type: String,
        required: true,
      },
   
    
  },
  {
    timestamps: true,
  }
)



const donationPlaces = mongoose.model('places', donationPlacesSchema)

module.exports=donationPlaces