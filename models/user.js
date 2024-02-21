const mongoose = require( 'mongoose' );
const bcrypt = require( 'bcryptjs');

const userSchema = mongoose.Schema({
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    phone: {
        type: String,
        required: false,
        unique: true,
      },
    password: {
      type: String,
      required: true,
    },
    profile:[
        {
            blood_group: {
                type:String,
            },
            gender: {
              type:String,
          },
            age: {
                type:String,
            },
            last_donated:{
                type:Date,
            },
            weight:{
                type:String,
            },
            rbc:{
              type:String,
            },
            hct:{
              type:String,
            },
            rbc:{
              type:String,
            },
            mcv:{
              type:String
            },
            mch:{
              type: String,
            },
            mchc:{
              type:String
            },
            glucose:{
              type:String,
            },
            creatinine:{
              type: String
            },
            bun:{
              type:String
            },
            protien:{
              type:String
            },
            albumin:{
              type:String
            },
            blobulin:{
              type: String
            },
            bp:{
                type:String,
            },
           

        }
    ],
    last_location:{
        type:String
    },
    notification_token:{
      type:String
    }
  },
  {
    timestamps: true,
  }
)

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userSchema)

module.exports=User