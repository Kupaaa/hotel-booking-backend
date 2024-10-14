import mongoose from "mongoose"

const userSchema = mongoose.Schema(
    {
        email : {
            type : String,
            required : true,
            unique : true
        },
        emailVerified : {
            type : Boolean,
            required : true,
            default : false
        },
        password : {
            type : String,
            required : true
        },
        firstName : {
            type : String,
            required : true
        },
        lastName : {
            type : String,
            required : true
        },
        image : {
            type : String,
            default : "https://pixabay.com/vectors/blank-profile-picture-mystery-man-973460/"
        },
        phone : {
            type : Number,
            required : true,
        },
        whatsApp : {
            type : String,
            required : true,
        },
        type : {
            type : String,
            required : true,
            default : "customer"
        },
        disabled : {
            type : Boolean,
            required : true,
            default : false
        }
    },
);

const User = mongoose.model("User",userSchema)
export default User;