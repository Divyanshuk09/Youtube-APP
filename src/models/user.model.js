
import mongoose,{Schema} from "mongoose";
import { jwt } from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username:{
            type:String,
            required: [true, 'Password is required'],
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        email:{
            type:String,
            required: [true, 'Password is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullname:{
            type:String,
            required: [true, 'Password is required'],
            trim: true,
            index: true,
        },
        password:{
            type:String,
            required: [true, 'Password is required'],
        },
        avatar:{
            type: String, //cloudnary url
            required : true,
        },
        coverImage:{
            type: String
        },
        watchHistory:[
            {
            type: Schema.Types.ObjectId,
            ref : "Video"
            }
        ],
        refreshToken:{
            type: String
        }   
    }, {timestamps: true}
)

userSchema.pre("save", async function (next){ 
    if(!this.isModified('password')) return next(); //password change nhi hua fhir next

    this.password = bcrypt.hash(this.password, 10) //password change hua hai toh encrpt karega
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign
    (
//payload        
        {
            _id:this._id, //ye id mongodb mai inbuilt hoti hai
            email:this.email,
            password:this.password,
            username:this.username,
            fullname:this.fullname
            //ye payload se hai : ye database se hai
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.refreshAccessToken = function(){
    return jwt.sign
    (
        {
            _id:this._id, //ye id mongodb mai inbuilt hoti hai
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}



export const User = mongoose.model("User",userSchema) 