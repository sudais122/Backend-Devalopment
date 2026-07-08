import mongoose ,{Schema} from "mongoose";

const Userschema = new Schema(
    {
        usename:{
            type:String,
            require:true,
            unique: true,
            lowercase:true,
            trim:true,
            index: true
        },
        email:{
            type:String,
            require:true,
            unique: true,
            lowercase:true,
            trim:true
        },
        fullname:{
            type:String,
            require:true,
            lowercase:true,
            trim:true,
            index:true
        },
        avatar:{
            type:String,
            require:true,
        },
        coverimage:{
            type:String,
        },
        watchhistory:[
            {
            type: Schema.Types.ObjectID,
            ref: 'Video'
            }
        ],
        password:{
            type:String,
            require:true
        },
        refreshtoken:{
            type:String
        }
    },{
        timestamps:true
    }
)

export const User = mongoose.model('User',Userschema);