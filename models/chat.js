const mongoose = require( 'mongoose' );


const chatSchema = mongoose.Schema({
    requestid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BloodRequest",
      },
      usera:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      userb:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

    message:[
        {
            content: {
                type: String,
                required: true,
              },
              author: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "User",
                },
                type:{
                  type: String,
                  enum: ["text", "info"],
                  default: "text",
                },
                status: {
                  type: String,
                  enum: ["sent", "seen"],
                  default: "sent",
                },

        }
    ]
   
   
   
   
    
  },
  {
    timestamps: true,
  }
)



const Chat = mongoose.model('chat', chatSchema)

module.exports=Chat