import mongoose ,{Schema} from "mongoose";
import { PaginationParameters } from "mongoose-paginate-v2";

const VideoSchema = new Schema(
    {
        video:{
            type:String,
            require:true
        },
        thumnail:{
            type:String,
            require:true
        },
        owner:{
            type: Schema.Types.ObjectId,
            require:true
        },
        tittle:{
            type:String,
            required:true
        },
        Descriptoin:{
            type:String,
            required:true
        },
        Duration:{
            type:Number,
            required:true
        },
        Views:{
            type:Number,
            default:0
        },
        ispublished:{
            type:Boolean,
            default: true
        }
    },{timestamps:true})

VideoSchema.plugin(PaginationParameters)
export const Video = Schema.model('Video',VideoSchema);