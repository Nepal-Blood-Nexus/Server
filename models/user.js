const mongoose = require( 'mongoose' );
const bcrypt = require( 'bcryptjs');

const userSchema = mongoose.Schema({
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
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
            group: {
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
            accupunture:{
                type:Boolean,
            },
            wellness:{
                type: Boolean,
            },
            antiboitics:{
                type:Boolean,
            },
            bp:{
                type:String,
            },
            diabetes:{
                type:Boolean,
            },
            hepatitis_jaundice:{
                type:Boolean
            },
            pregnant:{
                type:Boolean,
            },
            tatto:{
                type:Boolean,
            }

        }
    ],
    last_location:{
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