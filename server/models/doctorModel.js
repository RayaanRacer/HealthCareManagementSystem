import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required']
    },
    email:{
        type:String,
        required:[true,'email is required']
    },
    phone:{
        type:Number,
        required:[true,'phone is required']
    },
    specialization:{
        type:String,
        required:[true,'specialization is required']
    },
    experience:{
        type:String,
        required:[true,'experience is required']
    },
    fees:{
        type:String,
        required:[true,'minimum fees is required']
    },
    availableTimings:{
        day1:{
            type:String,
            required:true
        },
        time1:{
            type:String,
            required:true
        },
        day2:{
            type:String,
            required:true
        },
        time2:{
            type:String,
            required:true
        },
    },
    password:{
        type:String,
        required:[true, 'password is required']
    }
})

const doctorModel = mongoose.model('doctor',doctorSchema);
export default doctorModel;