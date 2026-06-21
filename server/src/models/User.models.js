const mongoose=require("mongoose");
const userSchema= new mongoose.Schema({
username:{type:String, required:true,unique:true,minlength:[3,"Username must be atleast 3 characters long"]},
email:{
    type:String,
    required:true,
    unique:true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
},
password:{
    type:String,
    required:[true,"Password is required"],
    minlength:[6,"Password must be atleast 6 characters long"],
},
favorites:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Component"
}],
},{timestamps:true});

module.exports=mongoose.model("User",userSchema);